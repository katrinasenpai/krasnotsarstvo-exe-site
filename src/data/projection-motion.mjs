// Canvas coordinates include the transparent margin around the game's 380 × 570 illustration.
export const poses = ['reading', 'closing', 'stowed', 'reach', 'approach', 'touch'];
export const cycle = [[0,0],[2.85,0],[3.43,1],[3.82,1],[4.37,2],[4.67,2],[5.18,3],[5.48,4],[5.74,5],
  [6.80,5],[7.08,4],[7.39,3],[7.94,2],[8.24,2],[8.75,1],[9.02,1],[9.62,0],[10.2,0]];
export const duration = cycle.at(-1)[0];
export const turns = [[.25,1.30],[1.58,2.63]];
export const leafColumns = 6;
const ease = t => t*t*(3-2*t);

export function poseMix(time) {
  const end = cycle.findIndex(([t]) => t > time);
  if (end < 1) return [0,0,0];
  const [start,a] = cycle[end-1], [stop,b] = cycle[end];
  return [a,b,ease((time-start)/(stop-start))];
}

// The spine stays fixed. The outer edge travels over it and settles on the opposite cover.
export function leafAt(time, u) {
  const turn = turns.find(([start,end]) => time >= start && time <= end);
  const t = turn ? (time-turn[0])/(turn[1]-turn[0]) : 0;
  const reveal = ease(Math.min(1, t*10, (1-t)*10));
  const angle = Math.PI * ease(t);
  const curl = Math.sin(angle);
  return {
    x: 274 + reveal * u * (65*Math.cos(angle) + 9*(1-u)*curl),
    y: 312 - reveal * u * (30 + (55-12*u)*curl),
    depth: 2 + reveal * u * curl * 25,
    height: reveal * (17 + u*6),
  };
}
