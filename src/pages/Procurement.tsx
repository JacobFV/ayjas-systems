import { Link } from 'react-router-dom'
import {
  DocChip,
  KV,
  PageMast,
  RevisionFoot,
  SectionHead,
  TableHead,
  Value,
} from '../components/primitives'
import { org, partByPath, procurementDocs, PENDING } from '../content/site'
import { routeMeta, useMeta } from '../lib/useMeta'

const PART = partByPath('/procurement')

export default function Procurement() {
  useMeta(routeMeta('/procurement'))

  const available = procurementDocs.filter((d) => d.state === 'available').length

  return (
    <>
      <PageMast
        part={PART}
        title="The drawer, with states you can act on"
        lede="Six documents, each with an owner, a revision, and an availability state. Nothing here links to a placeholder: a document that is not written says drafting, and a document that does not exist says not produced."
        rail={[
          { label: 'Documents', value: String(procurementDocs.length) },
          { label: 'Downloadable today', value: `${available} — request instead` },
          { label: 'Turnaround on request', value: 'Two working days' },
          { label: 'Contracting contact', value: <Value v={org.contractingEmail} /> },
        ]}
      />

      <section className="sheet section" id="drawer">
        <div className="wrap">
          <SectionHead no="6.1" aside="table 6.1" title="Document drawer" />

          <TableHead
            no="6.1"
            title="Procurement documents"
            note={`${procurementDocs.length} items`}
          />
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
                <div style={{ display: 'grid', gap: '0.55rem', justifyItems: 'start' }}>
                  <DocChip state={d.state} />
                  {d.state === 'available' && d.href ? (
                    <a className="btn btn--sm" href={d.href}>
                      Download
                    </a>
                  ) : d.state === 'unavailable' ? (
                    <span className="uid">Not offered</span>
                  ) : (
                    <Link
                      className="btn btn--sm"
                      to={`/contact?doc=${encodeURIComponent(d.id)}`}
                    >
                      Request
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="correction" style={{ marginTop: '1.75rem', maxWidth: '80ch' }}>
            <p className="correction__k">Note on availability</p>
            <p style={{ fontSize: 'var(--step--1)', lineHeight: 1.6, color: 'var(--ink-800)' }}>
              Earlier published material had procurement buttons that linked
              nowhere. Rather than replace dead links with generic documents, each
              document is written against a real deployment as it comes into
              existence, and its state here changes when it does. Request one and
              you get the current revision, or a straight answer that it is not
              written yet.
            </p>
          </div>
        </div>
      </section>

      <section className="sheet sheet--raised section" id="identifiers">
        <div className="wrap">
          <SectionHead
            no="6.2"
            aside="table 6.2"
            title="Entity identifiers"
            lede="A supplier record cannot be opened without these. They are supplied in full with AIS–DOC–05; the fields are listed here so you know exactly what is coming."
          />

          <div className="grid-2" style={{ alignItems: 'start' }}>
            <div className="card">
              <TableHead no="6.2" title="Contracting entity" />
              <KV
                rows={[
                  { k: 'Trading name', v: org.legalName },
                  {
                    k: 'Registered name',
                    v: <Value v={org.registeredName} label="Registered name" />,
                  },
                  { k: 'CAC RC number', v: <Value v={org.rcNumber} label="RC number" /> },
                  { k: 'Tax identification', v: <Value v={org.tin} label="TIN" /> },
                  { k: 'Incorporated', v: <Value v={org.founded} label="Incorporated" /> },
                  { k: 'People', v: <Value v={org.headcount} label="Headcount" /> },
                  { k: 'Operating region', v: org.operatingRegion },
                ]}
              />
            </div>

            <div className="card">
              <TableHead no="6.3" title="Contact of record" />
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
                              marginTop: '0.35rem',
                              fontSize: 'var(--step--2)',
                              color: 'var(--ink-400)',
                            }}
                          >
                            Use the general address below until a domain mailbox is
                            in place.
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
              <div className="notice" style={{ marginTop: '1.25rem' }}>
                The address above is a general contact address, not a registered
                office. The registered office appears on AIS–DOC–05 once the entity
                record is confirmed.
              </div>
            </div>
          </div>

          <div className="btn-row" style={{ marginTop: '1.75rem' }}>
            <Link to="/contact" className="btn btn--primary">
              § 7 — Request documents
            </Link>
            <a className="btn" href={`mailto:${org.email}`}>
              Email directly
            </a>
          </div>
        </div>
      </section>

      <RevisionFoot part={PART} />
    </>
  )
}
