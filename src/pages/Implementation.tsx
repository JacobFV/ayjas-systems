import { Link } from 'react-router-dom'
import {
  Figure,
  PageMast,
  RevisionFoot,
  Reveal,
  SectionHead,
  Value,
} from '../components/primitives'
import { partByPath, planes } from '../content/site'
import { routeMeta, useMeta } from '../lib/useMeta'
import { iso, path, pts, plate } from '../lib/iso'

const PART = partByPath('/implementation')

export default function Implementation() {
  useMeta(routeMeta('/implementation'))

  return (
    <>
      <PageMast
        part={PART}
        title="Five planes, each with a condition to clear"
        lede="A phase name on its own says nothing. Each plane below declares what goes in, what comes out as an artefact you can hold, who is responsible on each side, and the acceptance condition that has to be met before the next plane begins."
        rail={[
          { label: 'Planes', value: String(planes.length) },
          {
            label: 'Artefacts produced',
            value: String(planes.reduce((n, p) => n + p.outputs.length, 0)),
          },
          { label: 'Total duration', value: <Value v={planes[0].duration} /> },
          { label: 'Exit condition', value: 'You can export everything yourself' },
        ]}
      />

      <section className="sheet section" id="sequence">
        <div className="wrap">
          <SectionHead no="4.1" aside="figure 4.1" title="Deployment sequence" />
          <div style={{ maxWidth: '34rem' }}>
            <Figure
              no="4.1"
              caption="The five deployment planes, plane 01 at the base. The stamp-red thread is the sequence itself: work descends one plane at a time, and no plane starts before the one above it has cleared its acceptance condition."
            >
              <PlaneStack />
            </Figure>
          </div>
        </div>
      </section>

      <section className="sheet sheet--raised section" id="planes">
        <div className="wrap">
          <SectionHead
            no="4.2"
            aside="inputs · artefacts · owners · acceptance"
            title="The assembly, plane by plane"
          />

          {planes.map((p) => (
            <Reveal as="section" className="plane" key={p.n}>
              <div className="plane__head">
                <span className="plane__n">Plane {p.n}</span>
                <h2 className="display display--sm">{p.name}</h2>
                <p className="uid">
                  Duration <Value v={p.duration} label="Duration" />
                </p>
              </div>
              <div>
                <div className="plane__cols">
                  <div className="plane__col">
                    <h4>Inputs required</h4>
                    <ul className="tick">
                      {p.inputs.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="plane__col">
                    <h4>Artefacts produced</h4>
                    <ul className="tick tick--out">
                      {p.outputs.map((o) => (
                        <li key={o}>{o}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="plane__cols" style={{ marginTop: '1.35rem' }}>
                  <div className="plane__col">
                    <h4>Ayjas Systems is responsible for</h4>
                    <p
                      style={{
                        fontSize: 'var(--step--1)',
                        color: 'var(--ink-600)',
                        lineHeight: 1.5,
                      }}
                    >
                      {p.responsible.ayjas}
                    </p>
                  </div>
                  <div className="plane__col">
                    <h4>The institution is responsible for</h4>
                    <p
                      style={{
                        fontSize: 'var(--step--1)',
                        color: 'var(--ink-600)',
                        lineHeight: 1.5,
                      }}
                    >
                      {p.responsible.institution}
                    </p>
                  </div>
                </div>

                <div className="accept">
                  <strong>Acceptance condition</strong>
                  {p.acceptance}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sheet section" id="exit">
        <div className="wrap">
          <SectionHead
            no="4.3"
            aside="stated up front"
            title="How a deployment ends"
            lede="A supplier that cannot describe its own exit path is a risk to the institution. Ours is written into the terms, not discovered later."
          />
          <div className="cells cells--3">
            {[
              [
                'Your data',
                'Full export of records, attachments, and the audit log in CSV plus original file formats, available at any time from inside the product — not on request.',
              ],
              [
                'Your configuration',
                'The workflow map, role-to-permission table, and service-level targets are exported as documents you keep, whether or not you continue with us.',
              ],
              [
                'Deletion',
                'On termination, deletion of the deployment and its backups within the period fixed in the data-processing terms, with written confirmation of completion.',
              ],
            ].map(([h, b]) => (
              <div className="cell" key={h}>
                <h3 className="display display--sm" style={{ marginBottom: '0.5rem' }}>
                  {h}
                </h3>
                <p className="dim" style={{ fontSize: 'var(--step--1)', lineHeight: 1.5 }}>
                  {b}
                </p>
              </div>
            ))}
          </div>
          <div className="btn-row" style={{ marginTop: '1.75rem' }}>
            <Link to="/contact" className="btn btn--primary">
              § 7 — Request an implementation brief
            </Link>
            <Link to="/procurement" className="btn">
              § 6 — Document drawer
            </Link>
          </div>
        </div>
      </section>

      <RevisionFoot part={PART} />
    </>
  )
}

/**
 * Five stacked planes, numbered bottom-up, with a stamp-red thread running
 * through them: the same drawing grammar as Figure 1.1, reduced to the sequence.
 */
function PlaneStack() {
  const S = 150
  const GAP = 62
  const LABEL_X = 150 // shared label column, clear of every plate silhouette
  const top = GAP * (planes.length - 1)
  const order = [...planes].reverse() // top plane painted first

  // Descends plane by plane: a lateral move inside each plane, then a drop to
  // the next.
  const thread: [number, number, number][] = [
    [100, 45, top],
    [100, 45, GAP * 3],
    [72, 68, GAP * 3],
    [72, 68, GAP * 2],
    [98, 100, GAP * 2],
    [98, 100, GAP],
    [58, 92, GAP],
    [58, 92, 0],
  ]

  return (
    <svg
      className="diagram"
      viewBox="-150 -272 520 462"
      role="img"
      aria-label="Schematic of five stacked deployment planes, numbered one at the bottom through five at the top, with a single thread descending through all five."
    >
      <g stroke="#333b45" strokeWidth="1" strokeDasharray="2 5">
        {[
          [0, 0],
          [S, 0],
          [S, S],
          [0, S],
        ].map(([u, v], i) => {
          const a = iso(u, v, 0)
          const b = iso(u, v, top)
          return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
        })}
      </g>

      {/* Plates first, top-down, so each lower plane overlaps the one above. */}
      {order.map((p, i) => (
        <polygon
          key={p.n}
          points={pts(plate(S, GAP * (planes.length - 1 - i)))}
          fill="#1e252e"
          fillOpacity="0.92"
          stroke="#6a7480"
          strokeOpacity="0.6"
        />
      ))}

      {/* Labels in a second pass — drawn inside the plate loop, a lower plate
          would paint over the label belonging to the plane above it. */}
      {order.map((p, i) => {
        const right = iso(S, S / 2, GAP * (planes.length - 1 - i))
        return (
          <g key={p.n}>
            <line
              x1={right[0]}
              y1={right[1]}
              x2={LABEL_X - 8}
              y2={right[1]}
              stroke="#333b45"
              strokeDasharray="2 3"
            />
            <circle cx={right[0]} cy={right[1]} r="1.8" fill="#6a7480" />
            <text x={LABEL_X} y={right[1] - 1} fontSize="9" fill="#e7e5df">
              {p.n}
            </text>
            <text x={LABEL_X} y={right[1] + 11} fontSize="8" fill="#858c94">
              {p.name.toLowerCase()}
            </text>
          </g>
        )
      })}

      <path
        d={path(thread.map(([u, v, z]) => iso(u, v, z)))}
        fill="none"
        stroke="#c0492a"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="route-draw"
      />
    </svg>
  )
}
