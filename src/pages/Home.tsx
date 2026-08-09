import { useState } from 'react'
import { Link } from 'react-router-dom'
import ControlMap from '../components/ControlMap'
import SystemAxon from '../components/SystemAxon'
import {
  AssuranceChip,
  DocChip,
  DocControl,
  Figure,
  RevisionFoot,
  SectionHead,
  StatusOfDocument,
  TableHead,
  Value,
} from '../components/primitives'
import {
  assurance,
  controls,
  evidenceRail,
  partByPath,
  parts,
  planes,
  positioning,
  procurementDocs,
  recordRegister,
  specimenRecord,
} from '../content/site'
import { routeMeta, useMeta } from '../lib/useMeta'

const PART = partByPath('/')

export default function Home() {
  useMeta(routeMeta('/'))

  const [active, setActive] = useState<string | null>(null)

  // The rows a reviewer checks first, in their real states. Full set in § 3.2.
  const ledgerPreview = assurance.filter((r) =>
    ['AIS-A-01', 'AIS-A-02', 'AIS-A-05', 'AIS-A-08', 'AIS-A-09'].includes(r.id),
  )

  return (
    <>
      {/* ----------------------------------------------------- cover block */}
      <section className="sheet sheet--raised">
        <div className="wrap section--tight">
          <div className="mast">
            <div>
              <p className="eyebrow" style={{ marginBottom: '0.9rem' }}>
                Part {PART.n} of {parts.length} · {PART.title}
              </p>
              <h1 className="display display--xl" style={{ maxWidth: '26ch' }}>
                {positioning.headline}
              </h1>
              <p className="lede" style={{ marginTop: '1.1rem' }}>
                {positioning.subhead}
              </p>
              <div className="btn-row" style={{ marginTop: '1.5rem' }}>
                <Link to="/capabilities" className="btn btn--primary">
                  § 2 — Control specification
                </Link>
                <Link to="/assurance" className="btn">
                  § 3 — Assurance register
                </Link>
                <Link to="/procurement" className="btn">
                  § 6 — Procurement
                </Link>
              </div>
            </div>
            <div>
              <DocControl part={PART} />
            </div>
          </div>
        </div>

        <div className="wrap" style={{ paddingBottom: 'clamp(1.75rem,3vw,2.5rem)' }}>
          <StatusOfDocument />
        </div>

        <div className="wrap" style={{ paddingBottom: 'clamp(1.75rem,3vw,2.5rem)' }}>
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

      {/* ------------------------------------------------- 1.1 the system */}
      <section className="sheet section" id="system">
        <div className="wrap">
          <SectionHead
            no="1.1"
            aside="figure 1.1"
            title="The system as deployed"
            lede="One institution per deployment. The drawing below separates a deployment into the five planes it is actually made of, and traces a single service request through all five."
          />

          <Figure
            className="figure--plate"
            no="1.1"
            caption={
              <>
                Exploded axonometric of a configured deployment. Planes, top to
                bottom: institution and sites; intake and scoped roles; approval
                routing; vendor coordination; append-only record and reporting.
                The single stamp-red line is one service request, REQ-2418, traced
                from the site that raised it to the record that retains it.
                Control areas are specified in <Link className="xref" to="/capabilities">§ 2</Link>.
              </>
            }
          >
            <SystemAxon />
          </Figure>
        </div>
      </section>

      {/* --------------------------------------------------------- 1.2 scope */}
      <section className="sheet sheet--raised section" id="scope">
        <div className="wrap">
          <SectionHead no="1.2" aside="deliverable and limits" title="Scope of supply" />

          <div className="grid-2">
            <div>
              <p className="eyebrow" style={{ marginBottom: '0.7rem' }}>
                What is supplied
              </p>
              <p style={{ fontSize: 'var(--step-1)', lineHeight: 1.55, maxWidth: '44ch' }}>
                {positioning.deliverable}
              </p>
              <p className="uid" style={{ marginTop: '1rem', lineHeight: 1.6 }}>
                Deployment sequence, artefacts, and acceptance conditions:{' '}
                <Link className="xref" to="/implementation">
                  § 4
                </Link>
              </p>
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: '0.7rem' }}>
                What is not supplied
              </p>
              <ul className="tick">
                {positioning.notWeDo.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ 1.3 contents */}
      <section className="sheet section" id="contents">
        <div className="wrap">
          <SectionHead
            no="1.3"
            aside={`${parts.length} parts`}
            title="Contents of this document"
          />

          <div className="toc">
            {parts.map((p) => (
              <Link className="toc__item" to={p.to} key={p.to}>
                <span className="toc__no">§ {p.n}</span>
                <span className="toc__title">{p.title}</span>
                <span className="toc__desc">{p.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ 1.4 control surface */}
      <section className="sheet sheet--raised section" id="controls">
        <div className="wrap">
          <SectionHead
            no="1.4"
            aside="six areas · figure 1.2"
            title="What the system controls"
            lede="Each area is configuration, not a code change. Hover a control to trace it through the map."
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

            <div className="cmap__figure">
              <Figure
                no="1.2"
                caption={
                  <>
                    Control map. Solid arrows: the path a request travels. Dashed:
                    a permission or domain boundary. Specified in full at{' '}
                    <Link className="xref" to="/capabilities">
                      § 2
                    </Link>
                    .
                  </>
                }
              >
                <ControlMap active={active} />
              </Figure>
            </div>
          </div>

          <div className="btn-row" style={{ marginTop: '1.75rem' }}>
            <Link to="/capabilities" className="btn">
              § 2 — Full control specification
            </Link>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- 1.5 assurance */}
      <section className="sheet section" id="assurance">
        <div className="wrap">
          <SectionHead
            no="1.5"
            aside={`${assurance.length} control areas`}
            title="Assurance position"
            lede="Every area carries a state. Where nothing is held, the row says so — including the two claims earlier published material should not have made."
          />

          <TableHead
            no="1.1"
            title="Assurance register, extract"
            note={<>5 of {assurance.length} rows · full register at § 3.2</>}
          />
          <div className="scroll-x">
            <table className="reg">
              <thead>
                <tr>
                  <th scope="col">Ref</th>
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
                      <span
                        style={{
                          display: 'block',
                          marginTop: '0.35rem',
                          color: 'var(--ink-400)',
                          fontSize: 'var(--step--2)',
                        }}
                      >
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

          <div className="correction" style={{ marginTop: '1.75rem', maxWidth: '80ch' }}>
            <p className="correction__k">Withdrawn — recorded at revision 1.0</p>
            <p style={{ fontSize: 'var(--step--1)', lineHeight: 1.6, color: 'var(--ink-800)' }}>
              Earlier published material described Ayjas Systems as “SOC&nbsp;2
              aligned”, “FERPA aligned”, and “trusted by agencies”. None of those
              were substantiated. They are withdrawn and replaced by the register
              at{' '}
              <Link className="xref" to="/assurance">
                § 3.2
              </Link>
              , which states the actual position for each area — including the
              areas where the position is that nothing is held.
            </p>
          </div>

          <div className="btn-row" style={{ marginTop: '1.5rem' }}>
            <Link to="/assurance" className="btn">
              § 3 — Full assurance register
            </Link>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- 1.6 records */}
      <section className="sheet sheet--raised section" id="records">
        <div className="wrap">
          <SectionHead
            no="1.6"
            aside={`${recordRegister.publishedCount} records published`}
            title="Engagement position"
            lede={recordRegister.statement}
          />

          <div className="grid-2" style={{ alignItems: 'start' }}>
            <div className="empty-reg">
              <span className="stamp">No published records</span>
              <p className="prose" style={{ fontSize: 'var(--step--1)' }}>
                This register is empty on purpose. When a client clears a record,
                it appears in the format shown alongside — named institution type,
                stated dates, and a measured result we can produce the report for.
              </p>
              <ul className="tick">
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
                  marginBottom: '0.9rem',
                  flexWrap: 'wrap',
                }}
              >
                <span className="uid">{specimenRecord.id}</span>
                <span className="stamp">Specimen · not an engagement</span>
              </div>
              <dl className="kv">
                {(
                  [
                    ['Institution type', specimenRecord.institutionType],
                    ['Initial state', specimenRecord.initialState],
                    ['Intervention', specimenRecord.intervention],
                    ['Measured result', specimenRecord.measuredResult],
                    ['Deployment period', specimenRecord.deploymentPeriod],
                    ['Reference status', specimenRecord.referenceStatus],
                  ] as [string, string][]
                ).map(([k, v]) => (
                  <div className="kv__row" key={k}>
                    <dt className="kv__k">{k}</dt>
                    <dd className="kv__v" style={{ fontSize: 'var(--step--1)' }}>
                      <Value v={v} label={k} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="btn-row" style={{ marginTop: '1.5rem' }}>
            <Link to="/records" className="btn">
              § 5 — Record format and reference policy
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------- 1.7 implementation */}
      <section className="sheet section" id="implementation">
        <div className="wrap">
          <SectionHead
            no="1.7"
            aside={`${planes.length} planes`}
            title="Deployment as an exposed assembly"
            lede="Each plane names its inputs, its artefacts, and the condition that has to be met before the next plane starts. Responsibilities per plane are recorded at § 4."
          />

          <div>
            {planes.map((p) => (
              <section className="plane" key={p.n}>
                <div className="plane__head">
                  <span className="plane__n">Plane {p.n}</span>
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
                      <h4>Artefacts produced</h4>
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
              </section>
            ))}
          </div>

          <div className="btn-row" style={{ marginTop: '1.75rem' }}>
            <Link to="/implementation" className="btn">
              § 4 — Responsibilities per plane
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- 1.8 procurement */}
      <section className="sheet sheet--raised section" id="procurement">
        <div className="wrap">
          <SectionHead
            no="1.8"
            aside="document drawer"
            title="What we can put in front of a reviewer"
            lede="Each document carries an owner, a revision, and an availability state. Where a document is still being drafted the state says drafting, rather than a link pretending otherwise."
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
                    marginBottom: '0.75rem',
                  }}
                >
                  <span className="uid">{d.id}</span>
                  <DocChip state={d.state} />
                </div>
                <h3 className="display display--sm" style={{ marginBottom: '0.45rem' }}>
                  {d.title}
                </h3>
                <p className="dim" style={{ fontSize: 'var(--step--1)', lineHeight: 1.5 }}>
                  {d.summary}
                </p>
                <div
                  className="uid"
                  style={{ marginTop: '0.85rem', display: 'grid', gap: '0.25rem' }}
                >
                  <span style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                    Rev <Value v={d.revision} label="Revision" compact />
                  </span>
                  <span style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                    Owner <Value v={d.owner} label="Owner" compact />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- 1.9 enquiry */}
      <section className="sheet panel-ink section--tight" id="enquiry">
        <div className="wrap">
          <SectionHead no="1.9" aside="continues at § 7" title="Requesting a brief" />
          <div className="closer">
            <div>
              <p className="lede" style={{ maxWidth: '46ch' }}>
                Name the institution, the two or three request types that are
                currently ungoverned, and who has to sign off. That is enough to
                write a brief against — or to tell you it is not a fit, which is a
                faster answer than a discovery call.
              </p>
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: '0.7rem' }}>
                What comes back
              </p>
              <ul className="tick" style={{ marginBottom: '1.35rem' }}>
                <li>A reply from a person within two working days.</li>
                <li>Scope, acceptance criteria, and what we would need from you.</li>
                <li>Or a straight no, with the reason.</li>
              </ul>
              <div className="btn-row">
                <Link to="/contact" className="btn btn--primary">
                  § 7 — Request a brief
                </Link>
                <Link to="/procurement" className="btn">
                  § 6.2 — Entity identifiers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RevisionFoot part={PART} />
    </>
  )
}
