import { useState } from 'react'
import { Link } from 'react-router-dom'
import ControlMap from '../components/ControlMap'
import {
  Figure,
  PageMast,
  RevisionFoot,
  Reveal,
  SectionHead,
  TableHead,
} from '../components/primitives'
import { controls, partByPath, reports } from '../content/site'
import { routeMeta, useMeta } from '../lib/useMeta'

const PART = partByPath('/capabilities')

export default function Capabilities() {
  useMeta(routeMeta('/capabilities'))

  const [active, setActive] = useState<string | null>(null)

  return (
    <>
      <PageMast
        part={PART}
        title="Six control areas, specified as behaviour"
        lede="This part records what the system does, in the present tense, at the level of detail an operations lead can check against their own process. It contains no benefit claims, because a benefit claim cannot be verified in a demonstration."
        rail={[
          { label: 'Control areas', value: String(controls.length) },
          { label: 'Standard reports', value: String(reports.length) },
          { label: 'Configuration method', value: 'Records, not code changes' },
          { label: 'Tenancy', value: 'One institution per deployment' },
        ]}
      />

      <section className="sheet section" id="map">
        <div className="wrap">
          <SectionHead
            no="2.1"
            aside="figure 2.1"
            title="Control map"
            lede="How the six areas connect. Hover a control in § 2.2 to trace it."
          />
          <div style={{ maxWidth: '56rem' }}>
            <Figure
              no="2.1"
              caption="Control map. Solid arrows: the path a request travels. Dashed: a permission or domain boundary. Every stage writes to the audit record; nothing writes over it."
            >
              <ControlMap active={active} />
            </Figure>
          </div>
        </div>
      </section>

      <section className="sheet sheet--raised section" id="register">
        <div className="wrap">
          <SectionHead
            no="2.2"
            aside={`${controls.length} areas`}
            title="Control register"
          />

          <div onMouseLeave={() => setActive(null)}>
            {controls.map((c) => (
              <Reveal as="section" className="plane" key={c.id}>
                <div
                  className="plane__head"
                  onMouseEnter={() => setActive(c.node)}
                  onFocus={() => setActive(c.node)}
                >
                  <span className="plane__n">{c.n}</span>
                  <h2 className="display display--sm" id={c.node}>
                    {c.name}
                  </h2>
                  <span className="uid">{c.id}</span>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 'var(--step-1)',
                      lineHeight: 1.55,
                      color: 'var(--ink-800)',
                      maxWidth: '58ch',
                    }}
                  >
                    {c.behaviour}
                  </p>
                  <ul className="tick" style={{ marginTop: '1.1rem' }}>
                    {c.detail.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sheet section" id="reports">
        <div className="wrap">
          <SectionHead
            no="2.3"
            aside="table 2.1"
            title="Standard reports"
            lede="Reports are not a separate data store. Each is a query over the append-only record, which is why an export can carry the query, the run time, and the actor who ran it."
          />

          <TableHead no="2.1" title="Report definitions" note={`${reports.length} reports`} />
          <div className="scroll-x">
            <table className="reg">
              <thead>
                <tr>
                  <th scope="col">Ref</th>
                  <th scope="col">Report</th>
                  <th scope="col">Grain</th>
                  <th scope="col">Fields</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td className="uid">{r.id}</td>
                    <td style={{ fontWeight: 500 }}>{r.name}</td>
                    <td style={{ color: 'var(--ink-600)' }}>{r.grain}</td>
                    <td className="mono" style={{ color: 'var(--ink-500)' }}>
                      {r.fields}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="notice" style={{ marginTop: '1.75rem', maxWidth: '78ch' }}>
            <strong>Note on product imagery.</strong> No screenshots appear
            anywhere in this document. The interface is demonstrated live against a
            configured staging deployment, in a session you schedule, rather than
            as a marketing image that may not match what ships.
          </div>

          <div className="btn-row" style={{ marginTop: '1.5rem' }}>
            <Link to="/contact" className="btn btn--primary">
              § 7 — Schedule a working session
            </Link>
            <Link to="/assurance" className="btn">
              § 3 — Assurance register
            </Link>
          </div>
        </div>
      </section>

      <RevisionFoot part={PART} />
    </>
  )
}
