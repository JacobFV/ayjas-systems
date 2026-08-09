import { Link } from 'react-router-dom'
import { DocChip, KV, PageMast, Part, Value } from '../components/primitives'
import { org, procurementDocs, PENDING } from '../content/site'
import { routeMeta, useMeta } from '../lib/useMeta'

export default function Procurement() {
  useMeta(routeMeta('/procurement'))

  const available = procurementDocs.filter((d) => d.state === 'available').length

  return (
    <>
      <PageMast
        eyebrow="Procurement"
        title="The drawer, with states you can act on"
        lede="Six documents, each with an owner, a revision, and an availability state. Nothing here links to a placeholder: a document that is not written says drafting, and a document that does not exist says not produced."
        rail={[
          { label: 'Documents', value: String(procurementDocs.length) },
          { label: 'Downloadable today', value: `${available} — request instead` },
          { label: 'Turnaround on request', value: 'Two working days' },
          { label: 'Contracting contact', value: <Value v={org.contractingEmail} /> },
        ]}
      />

      <section className="section surface-document">
        <div className="wrap">
          <Part index="Document drawer" aside="six items" title="Procurement documents" />

          <div>
            {procurementDocs.map((d) => (
              <div className="docrow" key={d.id}>
                <span className="uid">{d.id}</span>
                <div>
                  <h2 className="docrow__title">{d.title}</h2>
                  <p className="docrow__sum">{d.summary}</p>
                </div>
                <div className="docrow__meta">
                  <span style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                    REV <Value v={d.revision} label="Revision" compact />
                  </span>
                  <span style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                    OWNER <Value v={d.owner} label="Owner" compact />
                  </span>
                </div>
                <div style={{ display: 'grid', gap: '0.6rem', justifyItems: 'start' }}>
                  <DocChip state={d.state} />
                  {d.state === 'available' && d.href ? (
                    <a className="btn btn--ink" href={d.href}>
                      Download
                    </a>
                  ) : d.state === 'unavailable' ? (
                    <span className="uid">Not offered</span>
                  ) : (
                    <Link
                      className="btn btn--ink"
                      to={`/contact?doc=${encodeURIComponent(d.id)}`}
                    >
                      Request
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="correction" style={{ marginTop: '2rem', maxWidth: '76ch' }}>
            <p className="correction__k">Why nothing downloads yet</p>
            <p style={{ fontSize: 'var(--step--1)', lineHeight: 1.6, color: 'var(--ink-800)' }}>
              An earlier version of this site had procurement buttons that linked
              nowhere. Rather than replace dead links with generic PDFs, each
              document is written against a real deployment as it comes into
              existence, and its state here changes when it does. Request one and
              you get the current revision or a straight answer that it is not
              written yet.
            </p>
          </div>
        </div>
      </section>

      <section className="section surface-document-pale" id="identifiers">
        <div className="wrap">
          <Part
            index="Vendor identifiers"
            aside="for contracting"
            title="Who you would be contracting with"
            lede="A supplier record cannot be opened without these. They are supplied in full with the vendor identifiers document; the fields are listed here so you know exactly what is coming."
          />

          <div className="grid-2" style={{ alignItems: 'start' }}>
            <div className="card">
              <p className="eyebrow" style={{ marginBottom: '1rem' }}>
                Entity
              </p>
              <KV
                rows={[
                  { k: 'Trading name', v: org.legalName },
                  { k: 'Registered name', v: <Value v={org.registeredName} label="Registered name" /> },
                  { k: 'CAC RC number', v: <Value v={org.rcNumber} label="RC number" /> },
                  { k: 'Tax identification', v: <Value v={org.tin} label="TIN" /> },
                  { k: 'Incorporated', v: <Value v={org.founded} label="Incorporated" /> },
                  { k: 'People', v: <Value v={org.headcount} label="Headcount" /> },
                  { k: 'Operating region', v: org.operatingRegion },
                ]}
              />
            </div>

            <div className="card">
              <p className="eyebrow" style={{ marginBottom: '1rem' }}>
                Contact of record
              </p>
              <KV
                rows={[
                  {
                    k: 'Contracting email',
                    v:
                      org.contractingEmail === PENDING ? (
                        <>
                          <Value v={org.contractingEmail} label="Contracting email" />
                          <span
                            style={{
                              display: 'block',
                              marginTop: '0.4rem',
                              fontSize: 'var(--step--2)',
                              color: 'var(--ink-400)',
                            }}
                          >
                            Use the general address below until a domain mailbox is in
                            place.
                          </span>
                        </>
                      ) : (
                        <a className="tlink" href={`mailto:${org.contractingEmail}`}>
                          {org.contractingEmail}
                        </a>
                      ),
                  },
                  {
                    k: 'General email',
                    v: (
                      <a className="tlink" href={`mailto:${org.email}`}>
                        {org.email}
                      </a>
                    ),
                  },
                  { k: 'Telephone', v: <Value v={org.phone} label="Telephone" /> },
                  { k: 'Address', v: org.addressLines.join(', ') },
                  { k: 'Hours', v: org.hours },
                ]}
              />
              <div className="notice" style={{ marginTop: '1.5rem' }}>
                The address above is a general contact address, not a registered
                office. The registered office appears on the vendor identifiers
                document once the entity record is confirmed.
              </div>
            </div>
          </div>

          <div className="btn-row" style={{ marginTop: '2rem' }}>
            <Link to="/contact" className="btn btn--solid-ink">
              Request documents
            </Link>
            <a className="btn btn--ink" href={`mailto:${org.email}`}>
              Email directly
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
