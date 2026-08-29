import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const projectRoot = process.cwd();
const poseDirectory = path.join(projectRoot, 'src/assets/images/iskin-ar-sequence');
const outputDirectory = path.join(projectRoot, 'public/ar');
const glbOutputPath = path.join(outputDirectory, 'iskin-projection-billboard.glb');
const usdzOutputPath = path.join(outputDirectory, 'iskin-projection-billboard.usdz');

const modelHeightMetres = 1.72;
const animationName = 'Holographic pose sequence loop';
const animationDurationSeconds = 9.6;
const hiddenScale = 0.001;

const poses = [
  { id: 'idle', nodeName: 'Искин · поза ожидания', fileName: 'iskin-ar-idle.png', materialName: 'IdleMaterial' },
  { id: 'thinking', nodeName: 'Искин · задумался', fileName: 'iskin-ar-thinking.png', materialName: 'ThinkingMaterial' },
  { id: 'adjust-monocle', nodeName: 'Искин · поправляет монокль', fileName: 'iskin-ar-adjust-monocle.png', materialName: 'AdjustMonocleMaterial' },
  { id: 'resting', nodeName: 'Искин · короткая пауза', fileName: 'iskin-ar-resting.png', materialName: 'RestingMaterial' },
];

// Между позами оставлены короткие интервалы: это не слайд-шоу, а спокойный цикл жестов.
const poseTimeline = [
  { time: 0, pose: 'idle' },
  { time: 1.8, pose: 'idle' },
  { time: 1.82, pose: 'thinking' },
  { time: 3.35, pose: 'thinking' },
  { time: 3.37, pose: 'idle' },
  { time: 4.85, pose: 'idle' },
  { time: 4.87, pose: 'adjust-monocle' },
  { time: 6.35, pose: 'adjust-monocle' },
  { time: 6.37, pose: 'idle' },
  { time: 7.45, pose: 'idle' },
  { time: 7.47, pose: 'resting' },
  { time: 8.05, pose: 'resting' },
  { time: 8.07, pose: 'idle' },
  { time: animationDurationSeconds, pose: 'idle' },
];

const parentTimeline = [
  { time: 0, translation: [0, 0, 0], rotation: [0, 0, 0, 1], scale: [1, 1, 1] },
  { time: 1.6, translation: [0, 0.016, 0], rotation: [0, 0.004, 0, 0.999992], scale: [1.006, 1.006, 1.006] },
  { time: 3.2, translation: [0, 0.032, 0], rotation: [0, -0.003, 0, 0.999996], scale: [1.012, 1.012, 1.012] },
  { time: 4.8, translation: [0, 0.018, 0], rotation: [0, 0.003, 0, 0.999996], scale: [1.004, 1.004, 1.004] },
  { time: 6.4, translation: [0, 0.037, 0], rotation: [0, -0.004, 0, 0.999992], scale: [1.011, 1.011, 1.011] },
  { time: 8, translation: [0, 0.019, 0], rotation: [0, 0.002, 0, 0.999998], scale: [1.005, 1.005, 1.005] },
  { time: animationDurationSeconds, translation: [0, 0, 0], rotation: [0, 0, 0, 1], scale: [1, 1, 1] },
];

function align(buffer, byte = 0x00) {
  const padding = (4 - (buffer.length % 4)) % 4;
  return padding === 0 ? buffer : Buffer.concat([buffer, Buffer.alloc(padding, byte)]);
}

function appendBuffer(chunks, buffer) {
  const byteOffset = chunks.reduce((total, chunk) => total + chunk.length, 0);
  chunks.push(buffer, Buffer.alloc((4 - (buffer.length % 4)) % 4));
  return { byteOffset, byteLength: buffer.length };
}

function floatBuffer(values) {
  return Buffer.from(new Float32Array(values).buffer);
}

function vec3Values(entries, property) {
  return entries.flatMap((entry) => entry[property]);
}

function poseScaleValues(poseId) {
  return poseTimeline.flatMap(({ pose }) => {
    const scale = pose === poseId ? 1 : hiddenScale;
    return [scale, scale, scale];
  });
}

function createGlb(poseSources, width, height) {
  const modelWidthMetres = Number((modelHeightMetres * width / height).toFixed(6));
  const halfWidth = modelWidthMetres / 2;
  const positions = floatBuffer([
    -halfWidth, 0, 0,
    halfWidth, 0, 0,
    halfWidth, modelHeightMetres, 0,
    -halfWidth, modelHeightMetres, 0,
  ]);
  const normals = floatBuffer([
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
  ]);
  const uvs = floatBuffer([
    0, 1,
    1, 1,
    1, 0,
    0, 0,
  ]);
  const indices = Buffer.from(new Uint16Array([0, 1, 2, 0, 2, 3]).buffer);
  const parentTimes = floatBuffer(parentTimeline.map(({ time }) => time));
  const parentTranslations = floatBuffer(vec3Values(parentTimeline, 'translation'));
  const parentRotations = floatBuffer(parentTimeline.flatMap(({ rotation }) => rotation));
  const parentScales = floatBuffer(vec3Values(parentTimeline, 'scale'));
  const poseTimes = floatBuffer(poseTimeline.map(({ time }) => time));
  const poseScales = poses.map(({ id }) => floatBuffer(poseScaleValues(id)));

  const binaryChunks = [];
  const positionView = appendBuffer(binaryChunks, positions);
  const normalView = appendBuffer(binaryChunks, normals);
  const uvView = appendBuffer(binaryChunks, uvs);
  const indexView = appendBuffer(binaryChunks, indices);
  const parentTimeView = appendBuffer(binaryChunks, parentTimes);
  const parentTranslationView = appendBuffer(binaryChunks, parentTranslations);
  const parentRotationView = appendBuffer(binaryChunks, parentRotations);
  const parentScaleView = appendBuffer(binaryChunks, parentScales);
  const poseTimeView = appendBuffer(binaryChunks, poseTimes);
  const poseScaleViews = poseScales.map((scaleBuffer) => appendBuffer(binaryChunks, scaleBuffer));
  const textureViews = poseSources.map(({ texture }) => appendBuffer(binaryChunks, texture));
  const binary = Buffer.concat(binaryChunks);

  const accessors = [
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
    { bufferView: 4, componentType: 5126, count: parentTimeline.length, type: 'SCALAR', min: [0], max: [animationDurationSeconds] },
    { bufferView: 5, componentType: 5126, count: parentTimeline.length, type: 'VEC3' },
    { bufferView: 6, componentType: 5126, count: parentTimeline.length, type: 'VEC4' },
    { bufferView: 7, componentType: 5126, count: parentTimeline.length, type: 'VEC3' },
    { bufferView: 8, componentType: 5126, count: poseTimeline.length, type: 'SCALAR', min: [0], max: [animationDurationSeconds] },
    ...poses.map((_, index) => ({ bufferView: 9 + index, componentType: 5126, count: poseTimeline.length, type: 'VEC3' })),
  ];

  const bufferViews = [
    { buffer: 0, ...positionView, target: 34962 },
    { buffer: 0, ...normalView, target: 34962 },
    { buffer: 0, ...uvView, target: 34962 },
    { buffer: 0, ...indexView, target: 34963 },
    { buffer: 0, ...parentTimeView },
    { buffer: 0, ...parentTranslationView },
    { buffer: 0, ...parentRotationView },
    { buffer: 0, ...parentScaleView },
    { buffer: 0, ...poseTimeView },
    ...poseScaleViews.map((view) => ({ buffer: 0, ...view })),
    ...textureViews.map((view) => ({ buffer: 0, ...view })),
  ];

  const document = {
    asset: {
      version: '2.0',
      generator: 'Красноцарство · генератор 2D AR-проекции Искина',
    },
    extensionsUsed: ['KHR_materials_unlit'],
    scene: 0,
    scenes: [{ name: 'Искин — голографическая проекция', nodes: [0] }],
    nodes: [
      {
        name: 'Искин · анимированная вертикальная 2D-проекция',
        children: poses.map((_, index) => index + 1),
        extras: {
          verticalBillboard: true,
          heightMetres: modelHeightMetres,
          animation: animationName,
          poseSequence: poses.map(({ id }) => id),
        },
      },
      ...poses.map((pose, index) => ({
        name: pose.nodeName,
        mesh: index,
        scale: pose.id === 'idle' ? [1, 1, 1] : [hiddenScale, hiddenScale, hiddenScale],
        extras: { transparentBillboardPose: pose.id },
      })),
    ],
    meshes: poses.map((pose, index) => ({
      name: pose.nodeName,
      primitives: [{
        attributes: { POSITION: 0, NORMAL: 1, TEXCOORD_0: 2 },
        indices: 3,
        material: index,
      }],
    })),
    materials: poses.map((pose, index) => ({
      name: `Голографическое свечение Искина · ${pose.id}`,
      doubleSided: true,
      alphaMode: 'BLEND',
      pbrMetallicRoughness: {
        baseColorFactor: [1, 1, 1, 1],
        baseColorTexture: { index },
        metallicFactor: 0,
        roughnessFactor: 1,
      },
      emissiveFactor: [1, 1, 1],
      emissiveTexture: { index },
      extensions: { KHR_materials_unlit: {} },
    })),
    textures: poses.map((_, index) => ({ sampler: 0, source: index })),
    samplers: [{ magFilter: 9729, minFilter: 9729, wrapS: 33071, wrapT: 33071 }],
    images: poseSources.map(({ fileName }, index) => ({
      bufferView: 13 + index,
      mimeType: 'image/png',
      name: fileName,
    })),
    accessors,
    bufferViews,
    buffers: [{ byteLength: binary.length }],
    animations: [{
      name: animationName,
      extras: { loop: true, durationSeconds: animationDurationSeconds, poseSwitching: 'STEP scale' },
      samplers: [
        { input: 4, output: 5, interpolation: 'LINEAR' },
        { input: 4, output: 6, interpolation: 'LINEAR' },
        { input: 4, output: 7, interpolation: 'LINEAR' },
        ...poses.map((_, index) => ({ input: 8, output: 9 + index, interpolation: 'STEP' })),
      ],
      channels: [
        { sampler: 0, target: { node: 0, path: 'translation' } },
        { sampler: 1, target: { node: 0, path: 'rotation' } },
        { sampler: 2, target: { node: 0, path: 'scale' } },
        ...poses.map((_, index) => ({ sampler: 3 + index, target: { node: 1 + index, path: 'scale' } })),
      ],
    }],
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

/** USDZ — ZIP без сжатия; данные каждого файла выравниваются на 64 байта для Quick Look. */
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

function timeCode(time) {
  return Number((time * 24).toFixed(3));
}

function usdaVec3(values) {
  return `(${values.map((value) => Number(value.toFixed(6))).join(', ')})`;
}

function usdaTimeSamples(entries, property, indent = '            ') {
  return entries.map((entry) => `${indent}${timeCode(entry.time)}: ${usdaVec3(entry[property])}`).join(',\n');
}

function usdaPoseScaleSamples(poseId) {
  return poseTimeline.map(({ time, pose }) => {
    const scale = pose === poseId ? 1 : hiddenScale;
    return `                ${timeCode(time)}: (${scale}, ${scale}, ${scale})`;
  }).join(',\n');
}

function createUsda(width, height) {
  const modelWidthMetres = Number((modelHeightMetres * width / height).toFixed(6));
  const halfWidth = Number((modelWidthMetres / 2).toFixed(6));
  const pointList = `[(${-halfWidth}, 0, 0), (${halfWidth}, 0, 0), (${halfWidth}, ${modelHeightMetres}, 0), (${-halfWidth}, ${modelHeightMetres}, 0)]`;
  const poseNodes = poses.map((pose) => `
        def Xform "Pose_${pose.id.replaceAll('-', '_')}"
        {
            float3 xformOp:scale.timeSamples = {
${usdaPoseScaleSamples(pose.id)}
            }
            uniform token[] xformOpOrder = ["xformOp:scale"]

            def Mesh "Billboard" (
                prepend apiSchemas = ["MaterialBindingAPI"]
            )
            {
                int[] faceVertexCounts = [4]
                int[] faceVertexIndices = [0, 1, 2, 3]
                point3f[] points = ${pointList}
                normal3f[] normals = [(0, 0, 1), (0, 0, 1), (0, 0, 1), (0, 0, 1)] (
                    interpolation = "vertex"
                )
                texCoord2f[] primvars:st = [(0, 1), (1, 1), (1, 0), (0, 0)] (
                    interpolation = "vertex"
                )
                uniform bool doubleSided = true
                uniform token subdivisionScheme = "none"
                rel material:binding = </Materials/${pose.materialName}>
            }
        }`).join('\n');
  const materials = poses.map((pose) => `
    def Material "${pose.materialName}"
    {
        token outputs:surface.connect = </Materials/${pose.materialName}/PreviewSurface.outputs:surface>

        def Shader "PrimvarReader_st"
        {
            uniform token info:id = "UsdPrimvarReader_float2"
            token inputs:varname = "st"
            float2 outputs:result
        }

        def Shader "Texture"
        {
            uniform token info:id = "UsdUVTexture"
            asset inputs:file = @textures/${pose.fileName}@
            float2 inputs:st.connect = </Materials/${pose.materialName}/PrimvarReader_st.outputs:result>
            token inputs:sourceColorSpace = "sRGB"
            float3 outputs:rgb
            float outputs:a
        }

        def Shader "PreviewSurface"
        {
            uniform token info:id = "UsdPreviewSurface"
            color3f inputs:diffuseColor.connect = </Materials/${pose.materialName}/Texture.outputs:rgb>
            float inputs:opacity.connect = </Materials/${pose.materialName}/Texture.outputs:a>
            float inputs:metallic = 0
            float inputs:roughness = 1
            token outputs:surface
        }
    }`).join('\n');

  return `#usda 1.0
(
    defaultPrim = "Root"
    metersPerUnit = 1
    upAxis = "Y"
    startTimeCode = 0
    endTimeCode = ${timeCode(animationDurationSeconds)}
    timeCodesPerSecond = 24
    framesPerSecond = 24
)

def Xform "Root"
{
    token preliminary:anchoring:type = "plane"
    token preliminary:planeAnchoring:alignment = "horizontal"

    def Xform "AnimatedProjection"
    {
        float3 xformOp:translate.timeSamples = {
${usdaTimeSamples(parentTimeline, 'translation')}
        }
        quatf xformOp:orient.timeSamples = {
${parentTimeline.map(({ time, rotation }) => `            ${timeCode(time)}: (${rotation[3]}, ${rotation[0]}, ${rotation[1]}, ${rotation[2]})`).join(',\n')}
        }
        float3 xformOp:scale.timeSamples = {
${usdaTimeSamples(parentTimeline, 'scale')}
        }
        uniform token[] xformOpOrder = ["xformOp:translate", "xformOp:orient", "xformOp:scale"]
${poseNodes}
    }
}

def Scope "Materials"
{
${materials}
}
`;
}

async function readPoseSource(pose) {
  const sourcePath = path.join(poseDirectory, pose.fileName);
  const texture = await readFile(sourcePath);
  const info = await sharp(texture).metadata();

  if (!info.hasAlpha || !info.width || !info.height) {
    throw new Error(`${pose.fileName} must be a transparent PNG with a valid canvas.`);
  }

  return { ...pose, texture, width: info.width, height: info.height };
}

async function main() {
  const poseSources = await Promise.all(poses.map(readPoseSource));
  const { width, height } = poseSources[0];
  const unequalCanvas = poseSources.some((pose) => pose.width !== width || pose.height !== height);

  if (unequalCanvas) {
    throw new Error('All AR pose PNGs must use the same canvas dimensions.');
  }

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(glbOutputPath, createGlb(poseSources, width, height));
  await writeFile(usdzOutputPath, createUsdz([
    ['model.usda', Buffer.from(createUsda(width, height))],
    ...poseSources.map(({ fileName, texture }) => [`textures/${fileName}`, texture]),
  ]));

  console.log(`Generated ${path.relative(projectRoot, glbOutputPath)} and ${path.relative(projectRoot, usdzOutputPath)} with ${poseSources.length} transparent poses.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
