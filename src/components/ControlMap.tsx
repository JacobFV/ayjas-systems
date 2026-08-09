/**
 * Interactive control map. Hovering or focusing a control in the adjacent list
 * illuminates the corresponding node and every edge incident to it.
 *
 * Two edge kinds carry different meaning and therefore different colour:
 *   flow      the path a request travels — blue-gray, vermilion when active
 *   boundary  a permission or domain interface — indigo, dashed
 */

type NodeDef = {
  id: string
  label: string
  x: number
  y: number
  w?: number
}

const W = 132
const H = 46

const NODES: NodeDef[] = [
  { id: 'intake', label: 'INTAKE', x: 44, y: 52 },
  { id: 'approval', label: 'APPROVAL', x: 262, y: 52 },
  { id: 'vendor', label: 'VENDOR', x: 480, y: 52 },
  { id: 'sla', label: 'SERVICE LEVEL', x: 480, y: 236 },
  { id: 'audit', label: 'AUDIT RECORD', x: 262, y: 236 },
  { id: 'access', label: 'ACCESS CONTROL', x: 44, y: 236 },
]

type Edge = { from: string; to: string; kind: 'flow' | 'boundary'; bend?: number }

const EDGES: Edge[] = [
  { from: 'intake', to: 'approval', kind: 'flow' },
  { from: 'approval', to: 'vendor', kind: 'flow' },
  { from: 'vendor', to: 'sla', kind: 'flow' },
  { from: 'sla', to: 'audit', kind: 'flow' },
  { from: 'access', to: 'intake', kind: 'boundary' },
  { from: 'access', to: 'audit', kind: 'flow' },
  { from: 'audit', to: 'approval', kind: 'boundary' },
  { from: 'intake', to: 'sla', kind: 'boundary', bend: -66 },
  { from: 'approval', to: 'audit', kind: 'boundary' },
]

const node = (id: string) => NODES.find((n) => n.id === id)!

function center(n: NodeDef): [number, number] {
  return [n.x + (n.w ?? W) / 2, n.y + H / 2]
}

/** Anchor on the rectangle edge facing the other node, so lines never overlap boxes. */
function anchor(a: NodeDef, b: NodeDef): [number, number] {
  const [ax, ay] = center(a)
  const [bx, by] = center(b)
  const aw = (a.w ?? W) / 2
  const dx = bx - ax
  const dy = by - ay
  if (Math.abs(dx) * (H / 2) > Math.abs(dy) * aw) {
    return [ax + Math.sign(dx) * aw, ay + (dy / Math.abs(dx)) * aw]
  }
  return [ax + (dx / Math.abs(dy)) * (H / 2), ay + Math.sign(dy) * (H / 2)]
}

function edgePath(e: Edge): string {
  const a = node(e.from)
  const b = node(e.to)
  const [x1, y1] = anchor(a, b)
  const [x2, y2] = anchor(b, a)
  if (e.bend) {
    const mx = (x1 + x2) / 2
    const my = (y1 + y2) / 2 + e.bend
    return `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`
  }
  return `M${x1} ${y1} L${x2} ${y2}`
}

export default function ControlMap({ active }: { active: string | null }) {
  return (
    <svg
      className="diagram"
      viewBox="0 0 660 340"
      role="img"
      aria-label="Control map: intake feeds approval, which feeds vendor assignment and service-level tracking; access control gates intake and the audit record; every stage writes to the audit record."
    >
      <defs>
        <marker
          id="cm-arrow"
          viewBox="0 0 8 8"
          refX="6.5"
          refY="4"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0 0 L8 4 L0 8 z" fill="#6c8992" />
        </marker>
        <marker
          id="cm-arrow-hot"
          viewBox="0 0 8 8"
          refX="6.5"
          refY="4"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0 0 L8 4 L0 8 z" fill="#d64221" />
        </marker>
      </defs>

      {/* edges, drawn under the nodes */}
      {EDGES.map((e, i) => {
        const hot = active === e.from || active === e.to
        return (
          <path
            key={i}
            d={edgePath(e)}
            fill="none"
            stroke={hot ? '#d64221' : e.kind === 'boundary' ? '#6274e4' : '#6c8992'}
            strokeOpacity={hot ? 1 : e.kind === 'boundary' ? 0.5 : 0.65}
            strokeWidth={hot ? 2 : 1}
            strokeDasharray={e.kind === 'boundary' ? '3 4' : undefined}
            markerEnd={
              e.kind === 'flow' ? `url(#${hot ? 'cm-arrow-hot' : 'cm-arrow'})` : undefined
            }
            style={{ transition: 'stroke 200ms, stroke-width 200ms, stroke-opacity 200ms' }}
          />
        )
      })}

      {NODES.map((n) => {
        const hot = active === n.id
        return (
          <g key={n.id} style={{ transition: 'opacity 200ms' }} opacity={active && !hot ? 0.5 : 1}>
            <rect
              x={n.x}
              y={n.y}
              width={n.w ?? W}
              height={H}
              rx="4"
              fill={hot ? '#1a1210' : '#0a221f'}
              stroke={hot ? '#d64221' : '#6c8992'}
              strokeOpacity={hot ? 1 : 0.65}
              strokeWidth={hot ? 1.6 : 1}
              style={{
                transition: 'stroke 200ms, fill 200ms, stroke-width 200ms',
                filter: hot ? 'drop-shadow(0 0 10px rgba(214,66,33,0.45))' : 'none',
              }}
            />
            <text
              x={n.x + (n.w ?? W) / 2}
              y={n.y + H / 2 + 3.5}
              textAnchor="middle"
              fontSize="10"
              letterSpacing="0.1em"
              fill={hot ? '#f2c8bd' : '#9fb3ae'}
              style={{ transition: 'fill 200ms' }}
            >
              {n.label}
            </text>
          </g>
        )
      })}

      {/* legend */}
      <g fontSize="8.5" fill="#6d8480" letterSpacing="0.08em">
        <line x1="44" y1="316" x2="72" y2="316" stroke="#6c8992" strokeWidth="1" />
        <text x="80" y="319">
          REQUEST FLOW
        </text>
        <line
          x1="196"
          y1="316"
          x2="224"
          y2="316"
          stroke="#6274e4"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <text x="232" y="319">
          PERMISSION / DOMAIN BOUNDARY
        </text>
      </g>
    </svg>
  )
}
