import { useState } from 'react'
import { Link } from 'react-router-dom'
import ControlMap from '../components/ControlMap'
import SystemAxon from '../components/SystemAxon'
import { AssuranceChip, DocChip, Part, Reveal, Value } from '../components/primitives'
import {
  assurance,
  controls,
  evidenceRail,
  planes,
  positioning,
  procurementDocs,
  recordRegister,
  specimenRecord,
} from '../content/site'
import { useMeta } from '../lib/useMeta'

export default function Home() {
  useMeta({
    title: 'Ayjas Systems — operational software for institutions',
    description:
      'Ayjas Systems builds one configurable system for service requests, approvals, vendor coordination, and reporting, deployed for a single institution at a time. Every assurance claim on this site carries an explicit state.',
    path: '/',
  })

  const [active, setActive] = useState<string | null>(null)

  // The homepage shows the areas a reviewer checks first, in their real states.
  const ledgerPreview = assurance.filter((r) =>
    ['AIS-A-01', 'AIS-A-02', 'AIS-A-05', 'AIS-A-08', 'AIS-A-09'].includes(r.id),
  )

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="hero surface-command-deep">
        <div className="wrap hero__grid">
          <div className="hero__copy stack" style={{ '--gap': '1.5rem' } as React.CSSProperties}>
            <p className="eyebrow">{positioning.eyebrow}</p>
            <h1 className="display display--xl">{positioning.headline}</h1>
            <p className="lede">{positioning.subhead}</p>
            <div className="btn-row">
              <Link to="/capabilities" className="btn btn--primary">
                Review capabilities
              </Link>
              <Link to="/procurement" className="btn">
                Procurement documents ↗
              </Link>
            </div>
            <p className="uid" style={{ maxWidth: '38ch', lineHeight: 1.6 }}>
              No engagement records are published yet. The register and the reason
              are on the{' '}
              <Link className="tlink" to="/records">
                records page
              </Link>
              .
            </p>
          </div>

          <div>
            <SystemAxon />
          </div>
        </div>

        <div className="wrap">
          <div className="rail">
            {evidenceRail.map((item) => (
              <div className="rail__item" key={item.label}>
                <p className="rail__k">{item.label}</p>
                <p className="rail__v">
                  <Value v={item.value} label={item.label} />
                </p>
                {item.note ? <p className="rail__n">{item.note}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- what this is */}
      <section className="section--tight surface-command">
        <div className="wrap">
          <div className="grid-2">
            <div>
              <p className="eyebrow" style={{ marginBottom: '0.85rem' }}>
                The deliverable
              </p>
              <p style={{ fontSize: 'var(--step-1)', lineHeight: 1.55, maxWidth: '46ch' }}>
                {positioning.deliverable}
              </p>
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: '0.85rem' }}>
                Scope boundaries
              </p>
              <ul className="stack" style={{ '--gap': '0.5rem' } as React.CSSProperties}>
                {positioning.notWeDo.map((s) => (
                  <li key={s} className="dim" style={{ fontSize: 'var(--step--1)' }}>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <hr className="boundary" style={{ marginTop: 'clamp(2rem,4vw,3.25rem)' }} />
      </section>

      {/* ------------------------------------------ what the system controls */}
      <section className="section surface-document" id="controls">
        <div className="wrap">
          <Part
            index="Part 01 · Control surface"
            aside="six areas"
            title="What the system controls"
            lede="Each area below is configuration, not a code change. Hover a control to trace it through the map."
          />

          <div className="cmap">
            <div className="cmap__list" onMouseLeave={() => setActive(null)}>
              {controls.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="cmap__btn"
                  data-active={active === c.node}
                  onMouseEnter={() => setActive(c.node)}
                  onFocus={() => setActive(c.node)}
                  onBlur={() => setActive(null)}
                  aria-describedby={`${c.id}-beh`}
                >
                  <span className="cmap__n">{c.n}</span>
                  <span className="cmap__name">{c.name}</span>
                  <span className="cmap__beh" id={`${c.id}-beh`}>
                    {c.behaviour}
                  </span>
                </button>
              ))}
            </div>

            <div className="cmap__stage">
              <ControlMap active={active} />
            </div>
          </div>

          <div className="btn-row" style={{ marginTop: '2rem' }}>
            <Link to="/capabilities" className="btn btn--ink">
              Full control specification
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ assurance ledger */}
      <section className="section surface-document-pale">
        <div className="wrap">
          <Part
            index="Part 02 · Assurance"
            aside={`${assurance.length} control areas`}
            title="Assurance register"
            lede="Every area carries a state. Where nothing is held, the row says so — including the two claims the previous version of this site should not have made."
          />

          <div className="scroll-x">
            <table className="reg">
              <caption>Extract — five of {assurance.length} areas</caption>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Control area</th>
                  <th scope="col">Implemented behaviour</th>
                  <th scope="col">State</th>
                </tr>
              </thead>
              <tbody>
                {ledgerPreview.map((r) => (
                  <tr key={r.id}>
                    <td className="uid">{r.id}</td>
                    <td style={{ fontWeight: 500 }}>{r.area}</td>
                    <td style={{ color: 'var(--ink-600)' }}>
                      {r.implemented}
                      <span style={{ display: 'block', marginTop: '0.35rem', color: 'var(--ink-400)', fontSize: 'var(--step--2)' }}>
                        {r.qualifier}
                      </span>
                    </td>
                    <td>
                      <AssuranceChip state={r.state} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Reveal className="correction" delay={60}>
            <p className="correction__k">Correction on the record</p>
            <p style={{ fontSize: 'var(--step--1)', lineHeight: 1.6, color: 'var(--ink-800)', maxWidth: '72ch' }}>
              Earlier versions of this site described Ayjas Systems as
              “SOC&nbsp;2 aligned”, “FERPA aligned”, and “trusted by agencies”.
              None of those were substantiated. They have been withdrawn and
              replaced with the register above, which states the actual position
              for each area — including the areas where the position is that
              nothing is held.
            </p>
          </Reveal>

          <div className="btn-row" style={{ marginTop: '1.75rem' }}>
            <Link to="/assurance" className="btn btn--ink">
              Full assurance register
            </Link>
          </div>
        </div>
      </section>

      {/* -------------------------------------------- engagement register */}
      <section className="section surface-document">
        <div className="wrap">
          <Part
            index="Part 03 · Records"
            aside={`${recordRegister.publishedCount} published`}
            title="Engagement register"
            lede={recordRegister.statement}
          />

          <div className="grid-2">
            <div className="empty-reg">
              <span className="stamp">No published records</span>
              <p className="prose" style={{ fontSize: 'var(--step--1)' }}>
                This register is empty on purpose. When a client clears a record,
                it appears here in the format shown alongside — named institution
                type, stated dates, and a measured result we can produce the
                report for.
              </p>
              <ul className="tick" style={{ marginTop: '0.25rem' }}>
                {recordRegister.policy.slice(0, 3).map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="card">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: '1rem',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <span className="uid">{specimenRecord.id}</span>
                <span className="stamp">Specimen · not an engagement</span>
              </div>
              <dl className="kv">
                {[
                  ['Institution type', specimenRecord.institutionType],
                  ['Initial state', specimenRecord.initialState],
                  ['Intervention', specimenRecord.intervention],
                  ['Measured result', specimenRecord.measuredResult],
                  ['Deployment period', specimenRecord.deploymentPeriod],
                  ['Reference status', specimenRecord.referenceStatus],
                ].map(([k, v]) => (
                  <div className="kv__row" key={k as string}>
                    <dt className="kv__k">{k}</dt>
                    <dd className="kv__v" style={{ fontSize: 'var(--step--1)' }}>
                      <Value v={v as string} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="btn-row" style={{ marginTop: '1.75rem' }}>
            <Link to="/records" className="btn btn--ink">
              Record format and reference policy
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- implementation */}
      <section className="section surface-document-pale">
        <div className="wrap">
          <Part
            index="Part 04 · Implementation"
            aside="five planes"
            title="Deployment as an exposed assembly"
            lede="Each plane names its inputs, its outputs, who is responsible on both sides, and the condition that has to be met before the next plane starts."
          />

          <div>
            {planes.map((p) => (
              <Reveal as="section" className="plane" key={p.n}>
                <div className="plane__head">
                  <span className="plane__n">{p.n}</span>
                  <h3 className="display display--sm">{p.name}</h3>
                  <p className="uid">
                    Duration <Value v={p.duration} label="Duration" />
                  </p>
                </div>
                <div>
                  <div className="plane__cols">
                    <div className="plane__col">
                      <h4>Inputs</h4>
                      <ul className="tick">
                        {p.inputs.map((i) => (
                          <li key={i}>{i}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="plane__col">
                      <h4>Outputs</h4>
                      <ul className="tick tick--out">
                        {p.outputs.map((o) => (
                          <li key={o}>{o}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="accept">
                    <strong>Acceptance</strong>
                    {p.acceptance}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="btn-row" style={{ marginTop: '2rem' }}>
            <Link to="/implementation" className="btn btn--ink">
              Responsibilities per plane
            </Link>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- procurement */}
      <section className="section surface-command" id="procurement">
        <div className="wrap">
          <Part
            index="Part 05 · Procurement"
            aside="document drawer"
            title="What we can put in front of a reviewer"
            lede="Each document has an owner, a revision, and an availability state. Where a document is still being drafted, the state says drafting rather than pretending a link exists."
          />

          <div className="cells cells--3">
            {procurementDocs.map((d) => (
              <div className="cell" key={d.id}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: '0.75rem',
                    marginBottom: '0.85rem',
                  }}
                >
                  <span className="uid">{d.id}</span>
                  <DocChip state={d.state} />
                </div>
                <h3 className="display display--sm" style={{ marginBottom: '0.5rem' }}>
                  {d.title}
                </h3>
                <p className="dim" style={{ fontSize: 'var(--step--1)', lineHeight: 1.55 }}>
                  {d.summary}
                </p>
                <p className="uid" style={{ marginTop: '0.9rem' }}>
                  Rev <Value v={d.revision} label="Revision" /> · Owner{' '}
                  <Value v={d.owner} label="Owner" />
                </p>
              </div>
            ))}
          </div>

          <div
            className="card"
            style={{ marginTop: '2.25rem', display: 'grid', gap: '1rem' }}
          >
            <h3 className="display display--md">Request the brief</h3>
            <p className="lede" style={{ maxWidth: '54ch' }}>
              Tell us the institution, the request types you are trying to get
              under control, and who has to sign off. We reply with an
              implementation brief scoped to that, or we tell you it is not a fit.
            </p>
            <div className="btn-row">
              <Link to="/contact" className="btn btn--primary">
                Request procurement brief
              </Link>
              <Link to="/procurement" className="btn">
                Vendor identifiers ↗
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
