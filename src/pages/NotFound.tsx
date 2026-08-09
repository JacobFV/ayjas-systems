import { Link, useLocation } from 'react-router-dom'
import { nav } from '../content/site'
import { useMeta } from '../lib/useMeta'

export default function NotFound() {
  const { pathname } = useLocation()
  useMeta({
    title: 'Not found — Ayjas Systems',
    description: 'The requested page does not exist on this site.',
    path: pathname,
  })

  return (
    <section className="section surface-command-deep">
      <div className="wrap">
        <p className="eyebrow" style={{ marginBottom: '1rem' }}>
          HTTP 404
        </p>
        <h1 className="display display--lg" style={{ maxWidth: '24ch' }}>
          No page at this address
        </h1>
        <p className="lede" style={{ marginTop: '1.25rem' }}>
          The site has six pages, listed below. It deliberately has no long tail of
          thin pages, so there is a good chance the address you followed never
          existed here.
        </p>
        <p className="uid" style={{ marginTop: '1rem' }}>
          Requested: <span className="mono">{pathname}</span>
        </p>
        <div className="btn-row" style={{ marginTop: '2rem' }}>
          <Link to="/" className="btn btn--primary">
            Home
          </Link>
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="btn">
              {n.label}
            </Link>
          ))}
          <Link to="/contact" className="btn">
            Contact
          </Link>
        </div>
      </div>
    </section>
  )
}
