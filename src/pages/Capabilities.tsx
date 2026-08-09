import { useState } from 'react'
import { Link } from 'react-router-dom'
import ControlMap from '../components/ControlMap'
import { PageMast, Part, Reveal } from '../components/primitives'
import { controls, reports } from '../content/site'
import { useMeta } from '../lib/useMeta'

export default function Capabilities() {
  useMeta({
    title: 'Capabilities — Ayjas Systems',
    description:
      'The six control areas of the Ayjas operations system — intake, approval routing, role-based access, vendor assignment, service-level tracking, and audit — specified as observable behaviour, plus the standard report set.',
    path: '/capabilities',
  })

  const [active, setActive] = useState<string | null>(null)

  return (
    <>
      <PageMast
        eyebrow="Control specification"
        title="Six control areas, specified as behaviour"
        lede="This page describes what the system does, in the present tense, at the level of detail an operations lead can check against their own process. It contains no benefit claims, because a benefit claim cannot be verified in a demo."
        rail={[
          { label: 'Control areas', value: String(controls.length) },
          { label: 'Standard reports', value: String(reports.length) },
          { label: 'Configuration method', value: 'Records, not code changes' },
          { label: 'Tenancy', value: 'One institution per deployment' },
        ]}
      />

      <section className="section--tight surface-command">
        <div className="wrap">
          <div
            className="cmap__stage cmap__stage--wide"
            style={{ borderColor: 'var(--cmd-line)' }}
          >
            <ControlMap active={active} />
          </div>
          <p className="uid" style={{ marginTop: '1rem', textAlign: 'center' }}>
            Solid arrows: the path a request travels. Dashed indigo: a permission
            or domain boundary. Hover a control below to trace it.
          </p>
        </div>
      </section>

      <section className="section surface-document">
        <div className="wrap">
          <Part
            index="Control register"
            aside={`${controls.length} areas`}
            title="What each area does"
          />

          <div onMouseLeave={() => setActive(null)}>
            {controls.map((c) => (
              <Reveal
                as="section"
                className="plane"
                key={c.id}
                // Hovering a specification block lights its node in the map above.
              >
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
                      maxWidth: '60ch',
                    }}
                  >
                    {c.behaviour}
                  </p>
                  <ul className="tick" style={{ marginTop: '1.25rem' }}>
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

      <section className="section surface-document-pale" id="reports">
        <div className="wrap">
          <Part
            index="Reporting"
            aside="derived from the audit record"
            title="Standard report set"
            lede="Reports are not a separate data store. Each one is a query over the append-only record, which is why an export can carry the query, the run time, and the actor who ran it."
          />

          <div className="scroll-x">
            <table className="reg">
              <caption>Report definitions</caption>
              <thead>
                <tr>
                  <th scope="col">ID</th>
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

          <div className="notice" style={{ marginTop: '1.75rem', maxWidth: '72ch' }}>
            No product screenshots appear on this site. The interface is
            demonstrated live, against a configured staging deployment, in a
            session you schedule — not as a marketing image that may not match
            what ships.
          </div>

          <div className="btn-row" style={{ marginTop: '1.75rem' }}>
            <Link to="/contact" className="btn btn--solid-ink">
              Schedule a working session
            </Link>
            <Link to="/assurance" className="btn btn--ink">
              Assurance register
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
