function crc32(data) {
  let crc = 0xffffffff;

  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

/** USDZ — ZIP без сжатия; данные каждого файла выравниваются на 64 байта для Quick Look. */
export function createUsdz(files) {
  const records = [];
  const localParts = [];
  let offset = 0;

  for (const [filename, data] of files) {
    const name = Buffer.from(filename);
    const content = Buffer.from(data);
    const dataOffsetWithoutExtra = offset + 30 + name.length;
    let extraLength = (64 - (dataOffsetWithoutExtra % 64)) % 64;

    if (extraLength > 0 && extraLength < 4) extraLength += 64;

    const extra = Buffer.alloc(extraLength);
    if (extraLength >= 4) {
      extra.writeUInt16LE(0xcafe, 0);
      extra.writeUInt16LE(extraLength - 4, 2);
    }

    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt32LE(crc32(content), 14);
    header.writeUInt32LE(content.length, 18);
    header.writeUInt32LE(content.length, 22);
    header.writeUInt16LE(name.length, 26);
    header.writeUInt16LE(extra.length, 28);

    localParts.push(header, name, extra, content);
    records.push({ filename: name, content, crc: crc32(content), offset });
    offset += header.length + name.length + extra.length + content.length;
  }

  const centralDirectoryOffset = offset;
  const centralParts = records.map((record) => {
    const header = Buffer.alloc(46);
    header.writeUInt32LE(0x02014b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(20, 6);
    header.writeUInt32LE(record.crc, 16);
    header.writeUInt32LE(record.content.length, 20);
    header.writeUInt32LE(record.content.length, 24);
    header.writeUInt16LE(record.filename.length, 28);
    header.writeUInt32LE(record.offset, 42);
    return Buffer.concat([header, record.filename]);
  });
  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(records.length, 8);
  end.writeUInt16LE(records.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(centralDirectoryOffset, 16);

  return Buffer.concat([...localParts, centralDirectory, end]);
}
