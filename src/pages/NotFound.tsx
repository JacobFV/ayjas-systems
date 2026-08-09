import { Link, useLocation } from 'react-router-dom'
import { doc, parts } from '../content/site'
import { useMeta } from '../lib/useMeta'

export default function NotFound() {
  const { pathname } = useLocation()
  useMeta({
    title: 'Not found — Ayjas Systems',
    description: 'The requested page does not exist on this site.',
    path: pathname,
  })

  return (
    <section className="sheet sheet--raised section">
      <div className="wrap">
        <p className="eyebrow" style={{ marginBottom: '1rem' }}>
          {doc.id} · HTTP 404
        </p>
        <h1 className="display display--lg" style={{ maxWidth: '24ch' }}>
          No page at this address
        </h1>
        <p className="lede" style={{ marginTop: '1.25rem' }}>
          This document has seven parts, listed below. It deliberately has no long
          tail of thin pages, so there is a good chance the address you followed
          never existed here.
        </p>
        <p className="uid" style={{ marginTop: '1rem' }}>
          Requested: <span className="mono">{pathname}</span>
        </p>
        <div className="btn-row" style={{ marginTop: '2rem' }}>
          {parts.map((p) => (
            <Link key={p.to} to={p.to} className="btn">
              § {p.n} — {p.short}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
