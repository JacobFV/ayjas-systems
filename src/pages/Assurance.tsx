import { Link } from 'react-router-dom'
import {
  AssuranceChip,
  PageMast,
  RevisionFoot,
  SectionHead,
  TableHead,
  Value,
} from '../components/primitives'
import {
  assurance,
  org,
  partByPath,
  subprocessors,
  type AssuranceState,
} from '../content/site'
import { routeMeta, useMeta } from '../lib/useMeta'

const PART = partByPath('/assurance')

const LEGEND: { state: AssuranceState; meaning: string }[] = [
  { state: 'verified', meaning: 'Confirmed by a party other than Ayjas Systems.' },
  { state: 'available', meaning: 'Implemented and demonstrable in the product today.' },
  { state: 'in-progress', meaning: 'Active and incomplete. Do not rely on it yet.' },
  { state: 'scoped', meaning: 'Determined per deployment or per contract, in writing.' },
  {
    state: 'designed-around',
    meaning: 'Controls built with the regime in mind. Not an attestation.',
  },
  { state: 'none', meaning: 'Nothing is held and no claim is made.' },
]

export default function Assurance() {
  useMeta(routeMeta('/assurance'))

  const verified = assurance.filter((r) => r.state === 'verified').length
  const none = assurance.filter((r) => r.state === 'none').length

  return (
    <>
      <PageMast
        part={PART}
        title="What is held, what is not, and who says so"
        lede="A procurement reviewer’s job is to find the gap between a claim and its evidence. This part hands over the gaps directly, so the review is about whether the position is acceptable rather than whether it is honest."
        rail={[
          { label: 'Control areas', value: String(assurance.length) },
          { label: 'Independently verified', value: `${verified} — none yet` },
          { label: 'Areas with nothing held', value: `${none}, recorded in § 3.2` },
          { label: 'Register owner', value: <Value v={org.contractingEmail} /> },
        ]}
      />

      <section className="sheet section" id="definitions">
        <div className="wrap">
          <SectionHead
            no="3.1"
            aside="six states"
            title="State definitions"
            lede="Only verified and available carry the doubled rule in this document. A state cannot be made to look stronger than it is by setting it differently."
          />
          <div className="cells cells--3">
            {LEGEND.map((l) => (
              <div className="cell" key={l.state}>
                <AssuranceChip state={l.state} />
                <p
                  className="dim"
                  style={{ marginTop: '0.65rem', fontSize: 'var(--step--1)', lineHeight: 1.5 }}
                >
                  {l.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sheet sheet--raised section" id="register">
        <div className="wrap">
          <SectionHead no="3.2" aside="table 3.1" title="Assurance register" />

          <TableHead
            no="3.1"
            title="Assurance register"
            note={`${assurance.length} rows · complete`}
          />
          <div className="scroll-x">
            <table className="reg">
              <thead>
                <tr>
                  <th scope="col">Ref</th>
                  <th scope="col">Control area</th>
                  <th scope="col">Implemented behaviour &amp; qualifier</th>
                  <th scope="col">State</th>
                  <th scope="col">Owner / reviewed</th>
                </tr>
              </thead>
              <tbody>
                {assurance.map((r) => (
                  <tr key={r.id}>
                    <td className="uid">{r.id}</td>
                    <td style={{ fontWeight: 500, minWidth: '9rem' }}>{r.area}</td>
                    <td style={{ color: 'var(--ink-600)', minWidth: '20rem' }}>
                      {r.implemented}
                      <span
                        style={{
                          display: 'block',
                          marginTop: '0.35rem',
                          paddingLeft: '0.6rem',
                          borderLeft: '2px solid var(--rule-mid)',
                          color: 'var(--ink-500)',
                          fontSize: 'var(--step--2)',
                          lineHeight: 1.5,
                        }}
                      >
                        {r.qualifier}
                      </span>
                    </td>
                    <td>
                      <AssuranceChip state={r.state} />
                    </td>
                    <td className="uid" style={{ whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        Owner <Value v={r.owner} label="Owner" compact />
                      </span>
                      <span
                        style={{
                          display: 'flex',
                          gap: '0.4rem',
                          alignItems: 'center',
                          marginTop: '0.2rem',
                        }}
                      >
                        Reviewed <Value v={r.reviewed} label="Last reviewed" compact />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="sheet section" id="subprocessors">
        <div className="wrap">
          <SectionHead
            no="3.3"
            aside="table 3.2"
            title="Data handling and subprocessors"
            lede="A deployment runs on infrastructure Ayjas Systems does not own. The register below forms part of the data-processing terms and is versioned with them; a change to it is a notifiable change under contract."
          />

          <TableHead no="3.2" title="Subprocessor register" note="Completed per deployment" />
          <div className="scroll-x scroll-x--fluid">
            <table className="reg">
              <thead>
                <tr>
                  <th scope="col">Purpose</th>
                  <th scope="col">Provider</th>
                  <th scope="col">Processing region</th>
                </tr>
              </thead>
              <tbody>
                {subprocessors.map((s) => (
                  <tr key={s.purpose}>
                    <td style={{ fontWeight: 500 }}>{s.purpose}</td>
                    <td>
                      <Value v={s.name} label="Provider" />
                    </td>
                    <td>
                      <Value v={s.region} label="Region" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="correction" style={{ marginTop: '1.75rem', maxWidth: '80ch' }}>
            <p className="correction__k">Note on the unfilled rows above</p>
            <p style={{ fontSize: 'var(--step--1)', lineHeight: 1.6, color: 'var(--ink-800)' }}>
              Providers and regions are fixed at provisioning and recorded in the
              deployment record for a specific contract. Publishing a
              general-purpose list before the deployment exists would be a guess,
              and a subprocessor register that turns out to be wrong is worse than
              one that is openly unfilled. The completed register is supplied with
              the data-processing terms —{' '}
              <Link className="xref" to="/procurement">
                § 6.1
              </Link>
              , AIS–DOC–03.
            </p>
          </div>

          <div className="btn-row" style={{ marginTop: '1.5rem' }}>
            <Link to="/procurement" className="btn btn--primary">
              § 6 — Document drawer
            </Link>
            <Link to="/contact" className="btn">
              § 7 — Ask about a specific control
            </Link>
          </div>
        </div>
      </section>

      <RevisionFoot part={PART} />
    </>
  )
}
