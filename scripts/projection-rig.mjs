import { cycle, duration, poses, poseMix, leafColumns, leafAt, turns } from '../src/data/projection-motion.mjs';

export const height = 1.15;
const unit = height / 618;
const width = 428 * unit;
const bands = 192;
const point = (x,y,z=0) => [(x-214)*unit, (618-y)*unit, z*unit];
export const names = [...poses.flatMap(name => [name+'Low',name+'High']), ...Array.from({length:leafColumns+1}, (_,i) => 'Page'+i)];

// Two bones per pose reveal fine bands of one illustration inside the other.
// Each band stays at its own height. The outer silhouette never shrinks to the floor.
function poseGeometry(index) {
  const mesh = {name:poses[index], points:[], uv:[], joints:[], weights:[], indices:[]};
  for (let band=0; band<bands; band++) {
    const low=band/bands, high=(band+1)/bands;
    const start=mesh.points.length;
    for (const [x,y] of [[0,low],[1,low],[1,high],[0,high]]) {
      mesh.points.push([(x-.5)*width, y*height, 0]);
      mesh.uv.push([x,1-y]);
      mesh.joints.push([index*2,index*2+1,0,0]);
      mesh.weights.push([1-low,low,0,0]);
    }
    mesh.indices.push(start,start+1,start+2,start,start+2,start+3);
  }
  return mesh;
}

function leafGeometry() {
  const mesh={name:'Leaf', points:[], uv:[], joints:[], weights:[], indices:[]};
  for(let col=0;col<=leafColumns;col++) {
    const u=col/leafColumns;
    // Give importers a non-degenerate leaf in bind space; the bones bend
    // each column around the book spine in the animated pose.
    for(const v of [0,1]) {
      mesh.points.push([u*65*unit,-v*17*unit,0]);
      mesh.uv.push([u,v]);
      mesh.joints.push([poses.length*2+col,0,0,0]);
      mesh.weights.push([1,0,0,0]);
    }
    if(col<leafColumns) { const i=2*col; mesh.indices.push(i,i+1,i+2,i+2,i+1,i+3); }
  }
  return mesh;
}
export const meshes=[...poses.map((_,i)=>poseGeometry(i)),leafGeometry()];
export function bones(time) {
  const [a,b,t]=poseMix(time);
  let occupied=0;
  const joints=[];
  for(const [i] of poses.entries()) {
    const share=(a===i?1-t:0)+(b===i?t:0);
    const offset=occupied*height/bands;
    for(const y of [offset,offset+(1-share)*height])
      joints.push({translation:[0,y,0],scale:[1,Math.max(.000001,share),1]});
    occupied+=share;
  }
  for(let i=0;i<=leafColumns;i++) {
    const page=leafAt(time,i/leafColumns);
    const origin=point(page.x-i/leafColumns*65,page.y,page.depth);
    joints.push({translation:origin,scale:[1,Math.max(.000001,page.height/17),1]});
  }
  return joints;
}
const times=new Set([0,duration]);
for(let i=1;i<cycle.length;i++) {
  const [start,from]=cycle[i-1], [end,to]=cycle[i];
  times.add(start); times.add(end);
  if(from!==to) for(let k=1;k<8;k++) times.add(start+(end-start)*k/8);
}
for(const [start,end] of turns) for(let k=0;k<=30;k++) times.add(start+(end-start)*k/30);
export const keys=[...times].sort((a,b)=>a-b).filter((t,i,a)=>!i||t-a[i-1]>.00001).map(time=>({time,bones:bones(time)}));
