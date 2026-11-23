import { meshes, names, keys } from './projection-rig.mjs';
const pad=(b,fill=0)=>Buffer.concat([b,Buffer.alloc((4-b.length%4)%4,fill)]);
export function createGlb(textures) {
  const buffers=[],bufferViews=[],accessors=[];
  let size=0;
  function view(bytes) {
    bufferViews.push({buffer:0,byteOffset:size,byteLength:bytes.length});
    const block=pad(bytes); size+=block.length; buffers.push(block); return bufferViews.length-1;
  }
  function accessor(values,type,componentType=5126,bounds=false) {
    const Typed=componentType===5126?Float32Array:Uint16Array;
    const flat=values.flat(), data=new Typed(flat), bufferView=view(Buffer.from(data.buffer));
    const entry={bufferView,type,componentType,count:values.length};
    if(bounds) {
      const n=flat.length/values.length;
      for(const [key,fn] of [['min',Math.min],['max',Math.max]])
        entry[key]=Array.from({length:n},(_,i)=>fn(...data.filter((_,j)=>j%n===i)));
    }
    accessors.push(entry); return accessors.length-1;
  }
  const primitives=meshes.map((m,i)=>({name:m.name,primitives:[{
    attributes:{POSITION:accessor(m.points,'VEC3',5126,true),TEXCOORD_0:accessor(m.uv,'VEC2'),JOINTS_0:accessor(m.joints,'VEC4',5123),WEIGHTS_0:accessor(m.weights,'VEC4')},
    indices:accessor(m.indices,'SCALAR',5123),material:i,
  }]}));
  const images=textures.map(({name,png})=>({name,mimeType:'image/png',bufferView:view(png)}));
  const input=accessor(keys.map(k=>k.time),'SCALAR',5126,true), samplers=[],channels=[];
  for(const [i] of names.entries()) for(const path of ['translation','scale']) {
    const values=keys.map(k=>k.bones[i][path]);
    if(values.every(v=>v.every((x,j)=>x===values[0][j]))) continue;
    channels.push({sampler:samplers.length,target:{node:i+1,path}});
    samplers.push({input,output:accessor(values,'VEC3'),interpolation:'LINEAR'});
  }
  const nodeIndices=names.map((_,i)=>i+1);
  const meshNodes=meshes.map((m,i)=>({name:m.name,mesh:i,skin:0}));
  const doc={asset:{version:'2.0',generator:'КрасноЦарство'},extensionsUsed:['KHR_materials_unlit'],
    scene:0,scenes:[{nodes:[0,...meshes.map((_,i)=>1+names.length+i)]}],
    nodes:[{name:'Projection rig',children:nodeIndices},...names.map((name,i)=>({name,...keys[0].bones[i]})),...meshNodes],
    skins:[{skeleton:0,joints:nodeIndices}],meshes:primitives,images,
    materials:textures.map(({name},i)=>({name,doubleSided:true,alphaMode:'BLEND',extensions:{KHR_materials_unlit:{}},
      pbrMetallicRoughness:{baseColorTexture:{index:i},metallicFactor:0,roughnessFactor:1}})),
    samplers:[{magFilter:9729,minFilter:9729,wrapS:33071,wrapT:33071}],
    textures:images.map((_,source)=>({source,sampler:0})),animations:[{name:'Reading the virtual book',samplers,channels}],
    accessors,bufferViews,buffers:[{byteLength:size}]};
  const json=pad(Buffer.from(JSON.stringify(doc)),32), bin=Buffer.concat(buffers);
  const header=Buffer.alloc(20), binHeader=Buffer.alloc(8);
  header.write('glTF');header.writeUInt32LE(2,4);header.writeUInt32LE(28+json.length+bin.length,8);
  header.writeUInt32LE(json.length,12);header.write('JSON',16);
  binHeader.writeUInt32LE(bin.length);binHeader.write('BIN',4);
  return Buffer.concat([header,json,binHeader,bin]);
}
