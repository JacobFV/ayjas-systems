import { Link } from 'react-router-dom'
import { PageMast, Part, Reveal, Value } from '../components/primitives'
import { planes } from '../content/site'
import { useMeta } from '../lib/useMeta'
import { iso, pts, plate } from '../lib/iso'

export default function Implementation() {
  useMeta({
    title: 'Implementation — Ayjas Systems',
    description:
      'Five deployment planes — discovery, workflow and permission model, configuration, controlled rollout, and monitoring — each with declared inputs, outputs, responsible parties, and an acceptance condition.',
    path: '/implementation',
  })

  return (
    <>
      <PageMast
        eyebrow="Implementation"
        title="Five planes, each with a condition to clear"
        lede="A phase name on its own says nothing. Each plane below declares what goes in, what comes out as an artefact you can hold, who is responsible on each side, and the acceptance condition that has to be met before the next plane begins."
        rail={[
          { label: 'Planes', value: String(planes.length) },
          { label: 'Artefacts produced', value: String(planes.reduce((n, p) => n + p.outputs.length, 0)) },
          { label: 'Total duration', value: <Value v={planes[0].duration} /> },
          { label: 'Exit condition', value: 'You can export everything yourself' },
        ]}
      >
        <div style={{ marginTop: 'clamp(2rem,4vw,3rem)', maxWidth: '30rem' }}>
          <PlaneStack />
        </div>
      </PageMast>

      <section className="section surface-document">
        <div className="wrap">
          <Part
            index="Deployment planes"
            aside="inputs · outputs · owners · acceptance"
            title="The assembly, plane by plane"
          />

          {planes.map((p) => (
            <Reveal as="section" className="plane" key={p.n}>
              <div className="plane__head">
                <span className="plane__n">{p.n}</span>
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

                <div className="plane__cols" style={{ marginTop: '1.5rem' }}>
                  <div className="plane__col">
                    <h4>Ayjas Systems is responsible for</h4>
                    <p style={{ fontSize: 'var(--step--1)', color: 'var(--ink-600)', lineHeight: 1.55 }}>
                      {p.responsible.ayjas}
                    </p>
                  </div>
                  <div className="plane__col">
                    <h4>The institution is responsible for</h4>
                    <p style={{ fontSize: 'var(--step--1)', color: 'var(--ink-600)', lineHeight: 1.55 }}>
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

      <section className="section surface-command">
        <div className="wrap">
          <Part
            index="Exit"
            aside="stated up front"
            title="How a deployment ends"
            lede="A vendor that cannot describe its own exit path is a risk to the institution. Ours is written into the terms, not discovered later."
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
                <h3 className="display display--sm" style={{ marginBottom: '0.6rem' }}>
                  {h}
                </h3>
                <p className="dim" style={{ fontSize: 'var(--step--1)', lineHeight: 1.55 }}>
                  {b}
                </p>
              </div>
            ))}
          </div>
          <div className="btn-row" style={{ marginTop: '2rem' }}>
            <Link to="/contact" className="btn btn--primary">
              Request an implementation brief
            </Link>
            <Link to="/procurement" className="btn">
              Document drawer ↗
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

/**
 * Five stacked planes, numbered bottom-up, with a vermilion thread running
 * through them: the same visual grammar as the homepage assembly, reduced to a
 * schematic of the deployment sequence itself.
 */
function PlaneStack() {
  const S = 150
  const GAP = 46
  const levels = [...planes].reverse() // draw top plane first

  return (
    <svg className="diagram" viewBox="-150 -40 400 300" role="img" aria-label="Schematic of five stacked deployment planes, numbered one at the bottom through five at the top.">
      <g stroke="#1d4642" strokeWidth="1" strokeDasharray="2 5">
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

      {levels.map((p, i) => {
        const z = GAP * (levels.length - 1 - i)
        const corners = plate(S, z)
        const right = iso(S, S / 2, z)
        return (
          <g key={p.n}>
            <polygon
              points={pts(corners)}
              fill="#0b2724"
              fillOpacity="0.9"
              stroke="#6c8992"
              strokeOpacity="0.6"
            />
            <line x1={right[0]} y1={right[1]} x2={right[0] + 22} y2={right[1]} stroke="#1d4642" />
            <text x={right[0] + 28} y={right[1] + 3} fontSize="9" fill="#9fb3ae">
              {p.n} · {p.name.toUpperCase()}
            </text>
          </g>
        )
      })}

      <path
        d={planes
          .map((_, i) => {
            const z = GAP * i
            const [x, y] = iso(52 + i * 12, 96 - i * 10, z)
            return `${i === 0 ? 'M' : 'L'}${x} ${y}`
          })
          .join(' ')}
        fill="none"
        stroke="#d64221"
        strokeWidth="1.8"
        strokeLinejoin="round"
        className="route-draw"
      />
    </svg>
  )
}
