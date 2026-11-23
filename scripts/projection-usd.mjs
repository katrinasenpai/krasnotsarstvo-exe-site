import { keys, meshes, names } from './projection-rig.mjs';
const number = value => Number(value.toFixed(7)).toString();
const tuple = values => '(' + values.map(number).join(',') + ')';
const array = values => '[' + values.join(',') + ']';
const identity = '((1,0,0,0),(0,1,0,0),(0,0,1,0),(0,0,0,1))';

export function createUsda() {
  const joints = array(names.map(name => '"' + name + '"'));
  const matrices = array(names.map(() => identity));
  const rest = array(keys[0].bones.map(({scale,translation}) =>
    '((1,0,0,0),(0,'+number(scale[1])+',0,0),(0,0,1,0),('+translation.map(number).join(',')+',1))'));
  const samples = key => keys.map(({time,bones}) =>
    number(time*24) + ': ' + array(bones.map(bone => tuple(bone[key])))).join(',\n');
  const geometry = meshes.map(mesh => `
    def Mesh "${mesh.name}" (prepend apiSchemas = ["SkelBindingAPI", "MaterialBindingAPI"]) {
      rel skel:skeleton = </Projection/Rig>
      matrix4d primvars:skel:geomBindTransform = ${identity}
      point3f[] points = ${array(mesh.points.map(tuple))}
      int[] faceVertexCounts = ${array(Array(mesh.indices.length/3).fill(3))}
      int[] faceVertexIndices = ${array(mesh.indices)}
      texCoord2f[] primvars:st = ${array(mesh.uv.map(([u,v])=>tuple([u,1-v])))} (interpolation = "vertex")
      int[] primvars:skel:jointIndices = ${array(mesh.joints.flatMap(v=>v.slice(0,2)))} (
        interpolation = "vertex"
        elementSize = 2
      )
      float[] primvars:skel:jointWeights = ${array(mesh.weights.flatMap(v=>v.slice(0,2)).map(number))} (
        interpolation = "vertex"
        elementSize = 2
      )
      uniform bool doubleSided = true
      uniform token subdivisionScheme = "none"
      rel material:binding = </Projection/Materials/${mesh.name}>
    }`).join('\n');
  const materials = meshes.map(({name}) => {
    const path = '/Projection/Materials/'+name;
    return `def Material "${name}" {
      token outputs:surface.connect = <${path}/Surface.outputs:surface>
      def Shader "UV" {
        uniform token info:id = "UsdPrimvarReader_float2"
        string inputs:varname = "st"
        float2 outputs:result
      }
      def Shader "Texture" {
        uniform token info:id = "UsdUVTexture"
        asset inputs:file = @textures/${name}.png@
        float2 inputs:st.connect = <${path}/UV.outputs:result>
        token inputs:sourceColorSpace = "sRGB"
        token inputs:wrapS = "clamp"
        token inputs:wrapT = "clamp"
        float3 outputs:rgb
        float outputs:a
      }
      def Shader "Surface" {
        uniform token info:id = "UsdPreviewSurface"
        color3f inputs:diffuseColor.connect = <${path}/Texture.outputs:rgb>
        float inputs:opacity.connect = <${path}/Texture.outputs:a>
        float inputs:opacityThreshold = 0.08
        float inputs:metallic = 0
        float inputs:roughness = 1
        token outputs:surface
      }
    }`;
  }).join('\n');
  return `#usda 1.0
(
  defaultPrim = "Projection"
  metersPerUnit = 1
  upAxis = "Y"
  startTimeCode = 0
  endTimeCode = ${keys.at(-1).time*24}
  timeCodesPerSecond = 24
  framesPerSecond = 24
)
def SkelRoot "Projection" (prepend apiSchemas = ["SkelBindingAPI"]) {
  token preliminary:anchoring:type = "plane"
  token preliminary:planeAnchoring:alignment = "horizontal"
  float3[] extent = [(-0.41,0,-0.01),(0.41,1.15,0.08)]
  def Skeleton "Rig" (prepend apiSchemas = ["SkelBindingAPI"]) {
    uniform token[] joints = ${joints}
    uniform matrix4d[] bindTransforms = ${matrices}
    uniform matrix4d[] restTransforms = ${rest}
    rel skel:animationSource = </Projection/Motion>
  }
  def SkelAnimation "Motion" {
    uniform token[] joints = ${joints}
    quatf[] rotations = ${array(names.map(()=>'(1,0,0,0)'))}
    float3[] translations.timeSamples = {${samples('translation')}}
    half3[] scales.timeSamples = {${samples('scale')}}
  }
  ${geometry}
  def Scope "Materials" {
    ${materials}
  }
}`;
}
