import { iso, pts, path, plate, box, diamond } from '../lib/iso'

/**
 * Exploded axonometric of an institutional operations deployment.
 *
 * Five separated planes, bottom to top:
 *   record → vendors → approval → intake/roles → institution
 *
 * Everything is steel linework except one stamp-red route, which traces a single
 * service request descending from the location that raised it, through approval
 * and vendor assignment, into the audit record. That route is the only saturated
 * element in the drawing, so the eye reads it as the subject rather than as
 * decoration. Active nodes are marked in archival blue — a fill, never a glow.
 */

const S = 200 // plane side, in projection units
const GAP = 78 // vertical separation between planes

type Level = {
  z: number
  id: string
  label: string
  sub: string
  live?: boolean
}

const LEVELS: Level[] = [
  { z: 0, id: 'record', label: 'RECORD · REPORTING', sub: 'append-only audit' },
  { z: GAP, id: 'vendor', label: 'VENDOR COORDINATION', sub: 'assignment · evidence' },
  { z: GAP * 2, id: 'approval', label: 'APPROVAL ROUTING', sub: 'thresholds · escalation' },
  { z: GAP * 3, id: 'access', label: 'INTAKE · ROLES', sub: 'scoped permissions' },
  { z: GAP * 4, id: 'estate', label: 'INSTITUTION', sub: 'sites · departments', live: true },
]

/** Buildings on the top plane: u, v, w, d, h. */
const BUILDINGS: [number, number, number, number, number][] = [
  [26, 24, 40, 34, 30],
  [90, 18, 30, 26, 46],
  [142, 34, 34, 30, 22],
  [30, 92, 32, 40, 20],
  [92, 82, 44, 36, 34],
  [150, 108, 26, 26, 16],
  [40, 152, 46, 28, 14],
  [116, 148, 32, 34, 26],
]

/** Nodes per plane: [u, v, live]. */
const NODES: Record<string, [number, number, boolean][]> = {
  access: [
    [150, 60, true],
    [86, 44, false],
    [54, 128, false],
    [128, 150, true],
  ],
  approval: [
    [120, 78, true],
    [64, 62, false],
    [90, 138, true],
    [152, 132, false],
  ],
  vendor: [
    [62, 72, true],
    [126, 58, false],
    [148, 130, false],
    [78, 148, false],
  ],
  record: [
    [100, 100, true],
    [46, 58, false],
    [156, 84, false],
    [62, 156, false],
    [146, 152, false],
  ],
}

/**
 * The tracked request, top plane down. Each entry is a point on a plane; the
 * segments between planes are the vertical drops.
 */
const ROUTE: [number, number, number][] = [
  [150, 60, GAP * 4], // raised at a site
  [150, 60, GAP * 3], // enters intake
  [120, 78, GAP * 3], // triaged to a queue
  [120, 78, GAP * 2], // enters approval
  [90, 138, GAP * 2], // second approval step
  [62, 72, GAP], // assigned to a vendor
  [100, 100, 0], // written to the record
]

export default function SystemAxon({ id = 'axon' }: { id?: string }) {
  const routePts = ROUTE.map(([u, v, z]) => iso(u, v, z))

  return (
    <svg
      className="diagram"
      viewBox="-215 -350 590 590"
      role="img"
      aria-labelledby={`${id}-t ${id}-d`}
    >
      <title id={`${id}-t`}>
        Exploded axonometric diagram of an Ayjas Systems deployment
      </title>
      <desc id={`${id}-d`}>
        Five separated horizontal planes. From the top: the institution and its
        sites; intake and scoped roles; approval routing; vendor coordination;
        and the append-only record with reporting. A single highlighted route
        follows one service request from the site that raised it, down through
        intake, two approval steps, vendor assignment, and finally into the
        record.
      </desc>

      <defs>
        <linearGradient id={`${id}-plate`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#1e252e" stopOpacity="0.9" />
          <stop offset="1" stopColor="#14171b" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={`${id}-plate-live`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#252d38" stopOpacity="0.95" />
          <stop offset="1" stopColor="#171b21" stopOpacity="0.6" />
        </linearGradient>
        {/* Boundary tint: where one domain hands off to the next. */}
        <linearGradient id={`${id}-bound`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5e75a8" stopOpacity="0.55" />
          <stop offset="0.55" stopColor="#8aa6ce" stopOpacity="0.4" />
          <stop offset="1" stopColor="#5e75a8" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Corner struts: make the explosion legible as one assembly. */}
      <g stroke="#333b45" strokeWidth="1" strokeDasharray="2 5">
        {[
          [0, 0],
          [S, 0],
          [S, S],
          [0, S],
        ].map(([u, v], i) => {
          const a = iso(u, v, 0)
          const b = iso(u, v, GAP * 4)
          return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
        })}
      </g>

      {LEVELS.map((lv) => {
        const corners = plate(S, lv.z)
        const right = iso(S, S / 2, lv.z)
        const nodes = NODES[lv.id] ?? []

        return (
          <g key={lv.id}>
            {/* plane */}
            <polygon
              points={pts(corners)}
              fill={`url(#${id}-${lv.live ? 'plate-live' : 'plate'})`}
              stroke="#6a7480"
              strokeOpacity={lv.live ? 0.85 : 0.55}
              strokeWidth="1"
            />

            {/* internal hairline grid on the plane */}
            <g stroke="#6a7480" strokeOpacity="0.16" strokeWidth="0.75">
              {[50, 100, 150].map((t) => (
                <g key={t}>
                  <line {...seg(iso(t, 0, lv.z), iso(t, S, lv.z))} />
                  <line {...seg(iso(0, t, lv.z), iso(S, t, lv.z))} />
                </g>
              ))}
            </g>

            {/* prismatic edge marking the interface to the plane below */}
            {lv.z > 0 && (
              <line
                {...seg(iso(S, 0, lv.z), iso(S, S, lv.z))}
                stroke={`url(#${id}-bound)`}
                strokeWidth="2"
              />
            )}

            {/* buildings, top plane only */}
            {lv.id === 'estate' &&
              BUILDINGS.map((b, i) => {
                const f = box(b[0], b[1], b[2], b[3], b[4], lv.z)
                return (
                  <g key={i} stroke="#939ca6" strokeWidth="0.9" strokeOpacity="0.8">
                    <polygon points={pts(f.right)} fill="#1a1f26" />
                    <polygon points={pts(f.left)} fill="#141920" />
                    <polygon points={pts(f.top)} fill="#222a33" />
                  </g>
                )
              })}

            {/* nodes */}
            {nodes.map(([u, v, live], i) => (
              <polygon
                key={i}
                points={pts(diamond(u, v, lv.z, 7))}
                fill={live ? '#8aa6ce' : '#1a1f26'}
                stroke={live ? '#8aa6ce' : '#6a7480'}
                strokeWidth="1"
                fillOpacity={live ? 0.9 : 1}
              />
            ))}

            {/* leader line + label */}
            <line
              x1={right[0]}
              y1={right[1]}
              x2={right[0] + 34}
              y2={right[1]}
              stroke="#333b45"
              strokeWidth="1"
            />
            <circle cx={right[0]} cy={right[1]} r="2" fill="#6a7480" />
            <text x={right[0] + 42} y={right[1] - 2} fontSize="9.5" fill="#e7e5df">
              {lv.label}
            </text>
            <text x={right[0] + 42} y={right[1] + 11} fontSize="8.5" fill="#858c94">
              {lv.sub}
            </text>
          </g>
        )
      })}

      {/* the tracked request — the only saturated line in the drawing */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path
          d={path(routePts)}
          stroke="#c0492a"
          strokeOpacity="0.28"
          strokeWidth="5"
        />
        <path className="route-draw" d={path(routePts)} stroke="#c0492a" strokeWidth="1.8" />
      </g>
      <circle cx={routePts[0][0]} cy={routePts[0][1]} r="3.4" fill="#c0492a" />
      <circle
        cx={routePts[routePts.length - 1][0]}
        cy={routePts[routePts.length - 1][1]}
        r="3.4"
        fill="none"
        stroke="#c0492a"
        strokeWidth="1.6"
      />

      {/* Route key, placed in the clear space beside the record plane where the
          route terminates — a leader line back to the origin would have to cross
          the whole assembly. */}
      <g>
        <line x1="-205" y1="207" x2="-183" y2="207" stroke="#c0492a" strokeWidth="1.8" />
        <text x="-176" y="210" fontSize="9" fill="#c0492a">
          REQ-2418
        </text>
        <text x="-205" y="226" fontSize="8" fill="#858c94">
          one request, traced end to end
        </text>
      </g>
    </svg>
  )
}

function seg(a: readonly [number, number], b: readonly [number, number]) {
  return { x1: a[0], y1: a[1], x2: b[0], y2: b[1] }
}
