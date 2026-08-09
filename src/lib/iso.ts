/**
 * Axonometric projection helpers.
 *
 * A 30° isometric-style projection: `u` runs right-and-down, `v` runs
 * left-and-down, `z` lifts a plane up the screen. Exploding the assembly is
 * just spacing planes along `z`, which is why this is only three lines of maths
 * and no 3D library.
 */

const KX = 0.866 // cos 30°
const KY = 0.5 // sin 30°

export type Pt = readonly [number, number]

export function iso(u: number, v: number, z = 0): Pt {
  return [(u - v) * KX, (u + v) * KY - z]
}

export function pts(list: Pt[]): string {
  return list.map(([x, y]) => `${round(x)},${round(y)}`).join(' ')
}

export function path(list: Pt[]): string {
  return list.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${round(x)} ${round(y)}`).join(' ')
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}

/** The four corners of a square plane of side `s` at elevation `z`. */
export function plate(s: number, z: number): Pt[] {
  return [iso(0, 0, z), iso(s, 0, z), iso(s, s, z), iso(0, s, z)]
}

/**
 * The three visible faces of an extruded box, ordered back-to-front so a plain
 * paint order gives correct occlusion without depth sorting.
 */
export function box(
  u: number,
  v: number,
  w: number,
  d: number,
  h: number,
  z = 0,
): { top: Pt[]; left: Pt[]; right: Pt[] } {
  const zt = z + h
  return {
    right: [iso(u + w, v, z), iso(u + w, v + d, z), iso(u + w, v + d, zt), iso(u + w, v, zt)],
    left: [iso(u, v + d, z), iso(u + w, v + d, z), iso(u + w, v + d, zt), iso(u, v + d, zt)],
    top: [iso(u, v, zt), iso(u + w, v, zt), iso(u + w, v + d, zt), iso(u, v + d, zt)],
  }
}

/** A diamond marker sitting flat on a plane — used for nodes. */
export function diamond(u: number, v: number, z: number, r = 6): Pt[] {
  return [iso(u, v - r, z), iso(u + r, v, z), iso(u, v + r, z), iso(u - r, v, z)]
}
