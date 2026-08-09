import { Link } from 'react-router-dom'
import { AssuranceChip, PageMast, Part, Value } from '../components/primitives'
import {
  assurance,
  org,
  subprocessors,
  type AssuranceState,
} from '../content/site'
import { useMeta } from '../lib/useMeta'

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
  useMeta({
    title: 'Assurance register — Ayjas Systems',
    description:
      'Twelve control areas with an explicit assurance state each, including the areas where Ayjas Systems holds nothing: no SOC 2 audit, no ISO 27001 certification, and no third-party penetration test.',
    path: '/assurance',
  })

  const verified = assurance.filter((r) => r.state === 'verified').length
  const none = assurance.filter((r) => r.state === 'none').length

  return (
    <>
      <PageMast
        eyebrow="Assurance"
        title="What is held, what is not, and who says so"
        lede="A procurement reviewer's job is to find the gap between a claim and its evidence. This page hands over the gaps directly, so the review is about whether the position is acceptable rather than whether it is honest."
        rail={[
          { label: 'Control areas', value: String(assurance.length) },
          { label: 'Independently verified', value: `${verified} — none yet` },
          { label: 'Areas with nothing held', value: `${none}, stated below` },
          { label: 'Register owner', value: <Value v={org.contractingEmail} /> },
        ]}
      />

      <section className="section--tight surface-command">
        <div className="wrap">
          <p className="eyebrow" style={{ marginBottom: '1rem' }}>
            State definitions
          </p>
          <div className="cells cells--3">
            {LEGEND.map((l) => (
              <div className="cell" key={l.state}>
                <AssuranceChip state={l.state} />
                <p
                  className="dim"
                  style={{ marginTop: '0.7rem', fontSize: 'var(--step--1)', lineHeight: 1.55 }}
                >
                  {l.meaning}
                </p>
              </div>
            ))}
          </div>
          <p className="uid" style={{ marginTop: '1.25rem' }}>
            Only <em>verified</em> and <em>available</em> carry a halo in this design
            system. A state cannot be made to look stronger than it is by styling
            it differently.
          </p>
        </div>
      </section>

      <section className="section surface-document">
        <div className="wrap">
          <Part index="Register" aside={`${assurance.length} rows`} title="Control areas" />

          <div className="scroll-x">
            <table className="reg">
              <caption>Assurance register — complete</caption>
              <thead>
                <tr>
                  <th scope="col">ID</th>
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
                          marginTop: '0.4rem',
                          paddingLeft: '0.6rem',
                          borderLeft: '2px solid var(--rule)',
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
                    <td className="uid">
                      <Value v={r.owner} label="Owner" />
                      <br />
                      <Value v={r.reviewed} label="Last reviewed" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section surface-document-pale" id="subprocessors">
        <div className="wrap">
          <Part
            index="Data handling"
            aside="subprocessors"
            title="Who else touches the data"
            lede="A deployment runs on infrastructure Ayjas Systems does not own. The list below is part of the data-processing terms and is versioned with them; a change to it is a notifiable change under contract."
          />

          <div className="scroll-x">
            <table className="reg">
              <caption>Subprocessor register</caption>
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

          <div className="correction" style={{ marginTop: '2rem', maxWidth: '76ch' }}>
            <p className="correction__k">Why these rows are empty</p>
            <p style={{ fontSize: 'var(--step--1)', lineHeight: 1.6, color: 'var(--ink-800)' }}>
              Providers and regions are fixed at provisioning and recorded in the
              deployment record for a specific contract. Publishing a
              general-purpose list before the deployment exists would be a guess,
              and a subprocessor list that turns out to be wrong is worse than one
              that is openly not yet filled. The completed list is supplied with
              the data-processing terms.
            </p>
          </div>

          <div className="btn-row" style={{ marginTop: '1.75rem' }}>
            <Link to="/procurement" className="btn btn--solid-ink">
              Document drawer
            </Link>
            <Link to="/contact" className="btn btn--ink">
              Ask about a specific control
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
