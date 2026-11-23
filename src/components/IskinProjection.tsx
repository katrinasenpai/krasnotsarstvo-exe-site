import { useEffect, useRef } from 'react';
import { duration, leafAt, leafColumns, poseMix, poses } from '../data/projection-motion.mjs';
import './IskinProjection.css';

function drawLeaf(ctx: CanvasRenderingContext2D, time: number) {
  const spine = leafAt(time, 0);
  if (spine.height < .1) return;
  const edges = Array.from({length: leafColumns + 1}, (_, i) => leafAt(time, i / leafColumns));
  ctx.beginPath();
  edges.forEach((p,i) => i ? ctx.lineTo(p.x,p.y) : ctx.moveTo(p.x,p.y));
  for (const p of [...edges].reverse()) ctx.lineTo(p.x, p.y + p.height);
  ctx.closePath();
  const paper = ctx.createLinearGradient(spine.x, spine.y, edges[leafColumns].x, edges[leafColumns].y);
  paper.addColorStop(0,'#548ecc'); paper.addColorStop(1,'#cef9ff');
  ctx.fillStyle = paper; ctx.fill();
  ctx.lineWidth = 1.3; ctx.strokeStyle = '#ecffff'; ctx.stroke();
  ctx.strokeStyle = '#528aba'; ctx.lineWidth = 1;
  for (const fraction of [.25,.44,.63,.8]) {
    ctx.beginPath();
    edges.slice(1,-1).forEach((p,i) => i ? ctx.lineTo(p.x,p.y+p.height*fraction) : ctx.moveTo(p.x,p.y+p.height*fraction));
    ctx.stroke();
  }
}

export function IskinProjection({eager=false}: {eager?: boolean}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx || !('IntersectionObserver' in window)) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible=false, disposed=false, request=0, elapsed=0, last=0;
    const poster=el.parentElement?.querySelector('img');
    if (!poster) return;
    let frames=[poster], started=false;
    const allowed = () => visible && !disposed && !motion.matches && !document.hidden;
    const draw = (now: number) => {
      request=0;
      if (!allowed()) return;
      if (last) elapsed += Math.min(now-last,100);
      last=now;
      const time=elapsed/1000 % (frames.length===1 ? 2.85 : duration);
      const [from,to,mix]=poseMix(time);
      ctx.clearRect(0,0,428,618);
      ctx.globalAlpha=from===to ? 1 : 1-mix;
      ctx.drawImage(frames[from],0,0,428,618);
      if (from!==to) {
        ctx.globalCompositeOperation='lighter'; ctx.globalAlpha=mix;
        ctx.drawImage(frames[to],0,0,428,618);
      }
      ctx.globalCompositeOperation='source-over'; ctx.globalAlpha=1;
      drawLeaf(ctx,time);
      el.style.visibility='visible';
      el.parentElement?.classList.add('has-motion');
      request=requestAnimationFrame(draw);
    };
    const sync = () => {
      if (!allowed()) {
        cancelAnimationFrame(request); request=0; last=0;
        if (motion.matches) { el.style.visibility='hidden'; el.parentElement?.classList.remove('has-motion'); }
        return;
      }
      if (poster.complete && poster.naturalWidth && !request) request=requestAnimationFrame(draw);
      if (started) return;
      started=true;
      void Promise.all(poses.slice(1).map(async pose => {
        const img=new Image();
        img.src='/ar/reading/'+pose+'.webp';
        await img.decode();
        return img;
      })).then(images=>{
        if (disposed) return;
        elapsed %= 2850;
        frames=[poster,...images];
      }).catch(()=>{started=false;});
    };
    const observer=new IntersectionObserver(entries=>{visible=entries.some(entry=>entry.isIntersecting); sync();});
    observer.observe(el); motion.addEventListener('change',sync); document.addEventListener('visibilitychange',sync);
    poster.addEventListener('load',sync);
    return () => {
      disposed=true; observer.disconnect(); cancelAnimationFrame(request);
      motion.removeEventListener('change',sync); document.removeEventListener('visibilitychange',sync);
      poster.removeEventListener('load',sync);
    };
  }, []);
  return <div className="iskin-projection">
    <img src="/characters/iskin-projection-reading.webp" alt="Искин с виртуальной книгой, в нитях голубого света" width="428" height="618" loading={eager?'eager':'lazy'} decoding="async" />
    <canvas ref={canvas} width={428} height={618} aria-hidden="true" />
  </div>;
}
