import { Link } from 'react-router-dom'
import {
  PageMast,
  RevisionFoot,
  SectionHead,
  TableHead,
  Value,
} from '../components/primitives'
import { partByPath, recordRegister, specimenRecord } from '../content/site'
import { routeMeta, useMeta } from '../lib/useMeta'

const PART = partByPath('/records')

const SCHEMA: { field: string; rule: string }[] = [
  { field: 'Engagement ID', rule: 'Assigned at contract signature. Never reused.' },
  {
    field: 'Institution',
    rule: 'The named institution, with written clearance to name it. If clearance is withheld, the record is withheld — not anonymised.',
  },
  { field: 'Institution type', rule: 'Sector and scale, e.g. multi-campus education organisation.' },
  {
    field: 'Initial state',
    rule: 'What the operation looked like before, described concretely enough to be recognisable or disputed.',
  },
  { field: 'Intervention', rule: 'Which controls were configured, and how — not a list of features.' },
  {
    field: 'Measured result',
    rule: 'A figure, its unit, its measurement window, and the report it came from. Published only when that report can be produced on request.',
  },
  { field: 'Baseline', rule: 'What the figure is measured against, and how the baseline was taken.' },
  {
    field: 'Deployment period',
    rule: 'Actual start and end dates. No “recently” or “over several months”.',
  },
  {
    field: 'Reference status',
    rule: 'Public, under NDA, or unavailable — stated explicitly, with the reason when unavailable.',
  },
]

export default function Records() {
  useMeta(routeMeta('/records'))

  return (
    <>
      <PageMast
        part={PART}
        title="An empty register, and the reason it is empty"
        lede="Anonymous testimonials and unnamed logos are the cheapest things on any supplier website, which is exactly why they carry no weight with a reviewer who has seen a hundred of them. This part publishes the format instead, so you can see what evidence will look like when it exists."
        rail={[
          { label: 'Published records', value: String(recordRegister.publishedCount) },
          { label: 'Anonymous case studies', value: 'None, by policy' },
          { label: 'Unnamed client logos', value: 'None, by policy' },
          { label: 'Contactable references', value: 'None yet' },
        ]}
      />

      <section className="sheet section" id="register">
        <div className="wrap">
          <SectionHead no="5.1" aside="0 rows" title="Engagement register" />

          <div className="empty-reg" style={{ maxWidth: '74ch' }}>
            <span className="stamp">No published records</span>
            <p className="prose">{recordRegister.statement}</p>
          </div>

          <div style={{ marginTop: 'clamp(2rem,4vw,3rem)' }}>
            <p className="eyebrow" style={{ marginBottom: '0.85rem' }}>
              Publication policy
            </p>
            <ul className="tick" style={{ maxWidth: '74ch' }}>
              {recordRegister.policy.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="sheet sheet--raised section" id="format">
        <div className="wrap">
          <SectionHead
            no="5.2"
            aside="table 5.1 · specimen"
            title="What a record will contain"
            lede="Below: the field-by-field rule, then a worked specimen showing the shape. The specimen is not an engagement and is stamped as such wherever it appears."
          />

          <div className="grid-2" style={{ alignItems: 'start' }}>
            <div>
              <TableHead no="5.1" title="Record schema" note={`${SCHEMA.length} fields`} />
              <div className="scroll-x scroll-x--fluid">
                <table className="reg">
                  <thead>
                    <tr>
                      <th scope="col">Field</th>
                      <th scope="col">Rule</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SCHEMA.map((s) => (
                      <tr key={s.field}>
                        <td style={{ fontWeight: 500, minWidth: '9rem' }}>{s.field}</td>
                        <td style={{ color: 'var(--ink-600)' }}>{s.rule}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  marginBottom: '0.9rem',
                }}
              >
                <span className="uid">{specimenRecord.id}</span>
                <span className="stamp">Specimen · not an engagement</span>
              </div>
              <dl className="kv">
                {(
                  [
                    ['Institution', '— withheld in a specimen'],
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
              <p className="uid" style={{ marginTop: '1.1rem', lineHeight: 1.55 }}>
                The wording under “measured result” and “deployment period”
                describes what will be stated. It is not a result and not a date
                range.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="sheet section" id="first">
        <div className="wrap">
          <SectionHead no="5.3" aside="stated plainly" title="If you would be the first" />
          <p className="lede" style={{ maxWidth: '68ch' }}>
            Then that is the negotiation. A first deployment gets direct access to
            the people building it, a scope small enough to prove or disprove
            within a term, and pricing that reflects the risk you are taking on an
            unproven supplier. What it does not get is a claim that you are not the
            first.
          </p>
          <div className="btn-row" style={{ marginTop: '1.75rem' }}>
            <Link to="/contact" className="btn btn--primary">
              § 7 — Discuss a first deployment
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
