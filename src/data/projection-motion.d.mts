export const poses: string[];
export const duration: number;
export const leafColumns: number;
export function poseMix(time: number): [number, number, number];
export function leafAt(time: number, u: number): { x: number; y: number; depth: number; height: number };
