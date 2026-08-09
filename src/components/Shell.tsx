import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { doc, org, parts, PENDING } from '../content/site'
import { Glyph } from './primitives'

/**
 * Letterhead, not an app bar: wordmark, the controlled-document line it belongs
 * to, and the contents of that document as a running strip. There is no filled
 * accent CTA anywhere in it — a document header does not sell.
 */
export function Masthead() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="letterhead">
      <div className="wrap letterhead__bar">
        <Link to="/" className="mark" aria-label={`${org.legalName} — home`}>
          <Glyph className="mark__glyph" />
          <span className="mark__text">AYJAS SYSTEMS</span>
        </Link>

        <p className="letterhead__doc">
          {doc.title} · {doc.id} · rev {doc.revision} · {doc.classification}
        </p>

        <button
          type="button"
          className="burger"
          aria-expanded={open}
          aria-controls="contents-drawer"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Contents'}
        </button>
      </div>

      <nav className="wrap contents-strip" aria-label="Contents">
        <div className="contents-strip__list">
          {parts.map((p) => (
            <NavLink key={p.to} to={p.to} className="contents-strip__item" end={p.to === '/'}>
              <span className="contents-strip__n">§&nbsp;{p.n}</span>
              <span>{p.short}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Always in the DOM so `aria-controls` resolves; `hidden` keeps it out of
          the accessibility tree and tab order when closed. */}
      <div className="drawer" id="contents-drawer" hidden={!open}>
        <nav className="wrap drawer__list" aria-label="Contents, narrow viewport">
          {parts.map((p) => (
            <NavLink key={p.to} to={p.to} className="drawer__item" end={p.to === '/'}>
              <span className="drawer__n">§&nbsp;{p.n}</span>
              <span>{p.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export function Colophon() {
  return (
    <footer className="colophon sheet panel-ink">
      <div className="wrap">
        <div className="colophon__grid">
          <div>
            <p className="eyebrow" style={{ marginBottom: '0.85rem' }}>
              Issued by
            </p>
            <p
              className="display display--sm"
              style={{ marginBottom: '0.75rem', maxWidth: '18ch' }}
            >
              {org.legalName}
            </p>
            <p className="prose" style={{ fontSize: 'var(--step--1)', maxWidth: '36ch' }}>
              One system, configured per institution: service requests, approvals,
              vendor coordination, and the record of all three.
            </p>
            <p className="mono" style={{ marginTop: '1.1rem' }}>
              <a className="tlink" href={`mailto:${org.email}`}>
                {org.email}
              </a>
            </p>
            <p className="uid" style={{ marginTop: '0.45rem' }}>
              {org.addressLines.join(' · ')} · {org.hours}
            </p>
          </div>

          <div>
            <h2>Contents</h2>
            <div className="colophon__links">
              {parts.map((p) => (
                <Link key={p.to} to={p.to}>
                  § {p.n} — {p.title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2>Cited sections</h2>
            <div className="colophon__links">
              <Link to="/capabilities#reports">§ 2.3 — Standard reports</Link>
              <Link to="/assurance#definitions">§ 3.1 — State definitions</Link>
              <Link to="/assurance#subprocessors">§ 3.3 — Subprocessors</Link>
              <Link to="/records#format">§ 5.2 — Record format</Link>
              <Link to="/procurement#identifiers">§ 6.2 — Entity identifiers</Link>
            </div>
          </div>
        </div>

        <div className="colophon__base">
          <span>
            © {new Date().getFullYear()} {org.legalName}
            {org.registeredName !== PENDING ? ` · ${org.registeredName}` : ''}
          </span>
          <span>
            {doc.id} · rev {doc.revision} · issued {doc.issued}
          </span>
          <span>Unfilled fields are shown as unfilled.</span>
        </div>
      </div>
    </footer>
  )
}
