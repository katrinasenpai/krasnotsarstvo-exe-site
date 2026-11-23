import { useEffect, useRef, useState } from 'react';
import './IskinProjection.css';
export function IskinProjection({eager=false}: {eager?:boolean}) {
  const ref=useRef<HTMLDivElement>(null);
  const [moving,setMoving]=useState(false);
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible=false;
    const update=()=>setMoving(visible&&!document.hidden&&!media.matches);
    const observer=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);update();});
    if(ref.current)observer.observe(ref.current);
    media.addEventListener('change',update);document.addEventListener('visibilitychange',update);
    return()=>{observer.disconnect();media.removeEventListener('change',update);document.removeEventListener('visibilitychange',update);};
  },[]);
  return <div ref={ref} className={`iskin-projection${moving?' is-moving':''}`}>
    <img src="/characters/iskin-projection-reading.webp" alt="Искин читает виртуальную книгу, его силуэт растворяется в нитях голубого света" width="428" height="618" loading={eager?'eager':'lazy'} decoding="async" />
    {moving&&<svg viewBox="0 0 428 618" aria-hidden="true"><path fill="#6deaff" fillOpacity=".3" stroke="#c7fcff" strokeWidth=".6"><animate attributeName="d" dur="3s" repeatCount="indefinite" keyTimes="0;.06;.14;.22;.30;.38;1" values="M278 308 L333 289 L333 278 L278 299Z;M278 308 L333 289 L333 278 L278 299Z;M278 308 L317 268 L317 257 L278 299Z;M278 308 L279 254 L279 243 L278 299Z;M278 308 L239 268 L239 257 L278 299Z;M278 308 L223 289 L223 278 L278 299Z;M278 308 L223 289 L223 278 L278 299Z" /><animate attributeName="opacity" dur="3s" repeatCount="indefinite" values="0;0;1;1;1;0;0" keyTimes="0;.06;.14;.22;.30;.38;1" /></path></svg>}
  </div>;
}
