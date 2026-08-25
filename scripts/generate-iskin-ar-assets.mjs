import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const projectRoot = process.cwd();
const sourceImagePath = path.join(projectRoot, 'src/assets/images/iskin-states/iskin-projection.webp');
const outputDirectory = path.join(projectRoot, 'public/ar');
const glbOutputPath = path.join(outputDirectory, 'iskin-projection-billboard.glb');
const usdzOutputPath = path.join(outputDirectory, 'iskin-projection-billboard.usdz');

const modelHeightMetres = 1.72;

function align(buffer, byte = 0x00) {
  const padding = (4 - (buffer.length % 4)) % 4;
  return padding === 0 ? buffer : Buffer.concat([buffer, Buffer.alloc(padding, byte)]);
}

function appendBuffer(chunks, buffer) {
  const byteOffset = chunks.reduce((total, chunk) => total + chunk.length, 0);
  chunks.push(buffer, Buffer.alloc((4 - (buffer.length % 4)) % 4));
  return { byteOffset, byteLength: buffer.length };
}

function createGlb(texture, width, height) {
  const modelWidthMetres = Number((modelHeightMetres * width / height).toFixed(6));
  const halfWidth = modelWidthMetres / 2;
  const positions = Buffer.from(new Float32Array([
    -halfWidth, 0, 0,
    halfWidth, 0, 0,
    halfWidth, modelHeightMetres, 0,
    -halfWidth, modelHeightMetres, 0,
  ]).buffer);
  const normals = Buffer.from(new Float32Array([
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
  ]).buffer);
  const uvs = Buffer.from(new Float32Array([
    0, 1,
    1, 1,
    1, 0,
    0, 0,
  ]).buffer);
  const indices = Buffer.from(new Uint16Array([0, 1, 2, 0, 2, 3]).buffer);
  const binaryChunks = [];
  const positionView = appendBuffer(binaryChunks, positions);
  const normalView = appendBuffer(binaryChunks, normals);
  const uvView = appendBuffer(binaryChunks, uvs);
  const indexView = appendBuffer(binaryChunks, indices);
  const textureView = appendBuffer(binaryChunks, texture);
  const binary = Buffer.concat(binaryChunks);

  const document = {
    asset: {
      version: '2.0',
      generator: 'Красноцарство · генератор 2D AR-проекции Искина',
    },
    extensionsUsed: ['KHR_materials_unlit'],
    scene: 0,
    scenes: [{ name: 'Искин — голографическая проекция', nodes: [0] }],
    nodes: [{
      name: 'Искин · вертикальная 2D-проекция',
      mesh: 0,
      extras: { verticalBillboard: true, heightMetres: modelHeightMetres },
    }],
    meshes: [{
      name: 'Искин · 2D-билборд',
      primitives: [{
        attributes: { POSITION: 0, NORMAL: 1, TEXCOORD_0: 2 },
        indices: 3,
        material: 0,
      }],
    }],
    materials: [{
      name: 'Голографическое свечение Искина',
      doubleSided: true,
      alphaMode: 'BLEND',
      pbrMetallicRoughness: {
        baseColorFactor: [1, 1, 1, 1],
        baseColorTexture: { index: 0 },
        metallicFactor: 0,
        roughnessFactor: 1,
      },
      emissiveFactor: [1, 1, 1],
      emissiveTexture: { index: 0 },
      extensions: { KHR_materials_unlit: {} },
    }],
    textures: [{ sampler: 0, source: 0 }],
    samplers: [{ magFilter: 9729, minFilter: 9729, wrapS: 33071, wrapT: 33071 }],
    images: [{ bufferView: 4, mimeType: 'image/png', name: 'iskin-projection.png' }],
    accessors: [
      {
        bufferView: 0,
        componentType: 5126,
        count: 4,
        type: 'VEC3',
        min: [-halfWidth, 0, 0],
        max: [halfWidth, modelHeightMetres, 0],
      },
      { bufferView: 1, componentType: 5126, count: 4, type: 'VEC3' },
      { bufferView: 2, componentType: 5126, count: 4, type: 'VEC2' },
      { bufferView: 3, componentType: 5123, count: 6, type: 'SCALAR' },
    ],
    bufferViews: [
      { buffer: 0, ...positionView, target: 34962 },
      { buffer: 0, ...normalView, target: 34962 },
      { buffer: 0, ...uvView, target: 34962 },
      { buffer: 0, ...indexView, target: 34963 },
      { buffer: 0, ...textureView },
    ],
    buffers: [{ byteLength: binary.length }],
  };

  const json = align(Buffer.from(JSON.stringify(document)), 0x20);
  const totalLength = 12 + 8 + json.length + 8 + binary.length;
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(totalLength, 8);
  const jsonChunkHeader = Buffer.alloc(8);
  jsonChunkHeader.writeUInt32LE(json.length, 0);
  jsonChunkHeader.writeUInt32LE(0x4e4f534a, 4);
  const binaryChunkHeader = Buffer.alloc(8);
  binaryChunkHeader.writeUInt32LE(binary.length, 0);
  binaryChunkHeader.writeUInt32LE(0x004e4942, 4);

  return Buffer.concat([header, jsonChunkHeader, json, binaryChunkHeader, binary]);
}

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

/**
 * USDZ — ZIP без сжатия. Данные каждого файла выравниваются на 64 байта,
 * что требуется Quick Look на iOS. Реализация небольшая и не зависит от ОС.
 */
function createUsdz(files) {
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

function createUsda(width, height) {
  const modelWidthMetres = Number((modelHeightMetres * width / height).toFixed(6));
  const halfWidth = Number((modelWidthMetres / 2).toFixed(6));

  return `#usda 1.0
(
    defaultPrim = "Root"
    metersPerUnit = 1
    upAxis = "Y"
)

def Xform "Root"
{
    token preliminary:anchoring:type = "plane"
    token preliminary:planeAnchoring:alignment = "horizontal"

    def Mesh "IskinProjection" (
        prepend apiSchemas = ["MaterialBindingAPI"]
    )
    {
        int[] faceVertexCounts = [4]
        int[] faceVertexIndices = [0, 1, 2, 3]
        point3f[] points = [(${ -halfWidth }, 0, 0), (${ halfWidth }, 0, 0), (${ halfWidth }, ${ modelHeightMetres }, 0), (${ -halfWidth }, ${ modelHeightMetres }, 0)]
        normal3f[] normals = [(0, 0, 1), (0, 0, 1), (0, 0, 1), (0, 0, 1)] (
            interpolation = "vertex"
        )
        texCoord2f[] primvars:st = [(0, 1), (1, 1), (1, 0), (0, 0)] (
            interpolation = "vertex"
        )
        uniform bool doubleSided = true
        uniform token subdivisionScheme = "none"
        rel material:binding = </Materials/IskinProjectionMaterial>
    }
}

def Scope "Materials"
{
    def Material "IskinProjectionMaterial"
    {
        token outputs:surface.connect = </Materials/IskinProjectionMaterial/PreviewSurface.outputs:surface>

        def Shader "PrimvarReader_st"
        {
            uniform token info:id = "UsdPrimvarReader_float2"
            token inputs:varname = "st"
            float2 outputs:result
        }

        def Shader "Texture"
        {
            uniform token info:id = "UsdUVTexture"
            asset inputs:file = @textures/iskin-projection.png@
            float2 inputs:st.connect = </Materials/IskinProjectionMaterial/PrimvarReader_st.outputs:result>
            token inputs:sourceColorSpace = "sRGB"
            float3 outputs:rgb
            float outputs:a
        }

        def Shader "PreviewSurface"
        {
            uniform token info:id = "UsdPreviewSurface"
            color3f inputs:diffuseColor.connect = </Materials/IskinProjectionMaterial/Texture.outputs:rgb>
            float inputs:opacity.connect = </Materials/IskinProjectionMaterial/Texture.outputs:a>
            float inputs:metallic = 0
            float inputs:roughness = 1
            token outputs:surface
        }
    }
}
`;
}

async function main() {
  const source = await readFile(sourceImagePath);
  const { data: texture, info } = await sharp(source)
    .resize({ width: 768, withoutEnlargement: true })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer({ resolveWithObject: true });

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(glbOutputPath, createGlb(texture, info.width, info.height));
  await writeFile(usdzOutputPath, createUsdz([
    ['model.usda', Buffer.from(createUsda(info.width, info.height))],
    ['textures/iskin-projection.png', texture],
  ]));

  console.log(`Generated ${path.relative(projectRoot, glbOutputPath)} and ${path.relative(projectRoot, usdzOutputPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
