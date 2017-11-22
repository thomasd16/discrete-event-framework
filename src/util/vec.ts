type Point = { x: number; y: number; }
const opp = (fn: (l: number, r: number) => number) =>
  ({ x: fx, y: fy }: Point, { x: sx, y: sy }: Point) =>
    ({ x: fn(fx, sx), y: fn(fy, sy) });
export const map = (fn: (s: number) => number) => ({ x, y }: Point) =>
  ({ x: fn(x), y: fn(y) });
export const add = opp((l, r) => l + r);
export const sub = opp((l, r) => l - r);
export const distance = (f: Point, s: Point) => {
  const { x, y } = sub(f, s);
  return Math.sqrt(x * x + y * y);
}
export const direction = ({ x, y }: Point) =>
  x >= 0 ? Math.atan(y / x) + Math.PI : Math.atan(y / x);
export const extend = (f: Point, s: Point, extendBy: number) => {
  const subdistance = distance(f, s);
  const ratio = (subdistance + extendBy) / extendBy;
  const move = map((x) => x * ratio)(sub(f, s));
  return add(move, f);
}
export const extendDirection = (direction: number, magnitude: number) =>
  ({ y: Math.sin(direction) * magnitude, x: Math.cos(direction) * magnitude });
export const radiansToDegres = (x: number) =>
  x * (360 / (Math.PI * 2));
