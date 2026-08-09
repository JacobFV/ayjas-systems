import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { nav, org, PENDING } from '../content/site'
import { Glyph } from './primitives'

export function Masthead() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="masthead">
      <div className="wrap masthead__bar">
        <Link to="/" className="mark" aria-label={`${org.legalName} — home`}>
          <Glyph className="mark__glyph" />
          <span className="mark__text">AYJAS</span>
        </Link>

        <nav className="masthead__nav" aria-label="Primary">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className="navlink">
              {n.label}
            </NavLink>
          ))}
          <Link to="/contact" className="btn btn--primary masthead__cta">
            Request procurement brief
          </Link>
        </nav>

        <button
          type="button"
          className="masthead__burger"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Always in the DOM so `aria-controls` always resolves; `hidden` keeps it
          out of the accessibility tree and the tab order when closed. */}
      <div className="drawer" id="mobile-nav" hidden={!open}>
        <nav className="wrap drawer__list" aria-label="Primary, mobile">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className="drawer__item">
              {n.label}
            </NavLink>
          ))}
          <NavLink to="/contact" className="drawer__item">
            Contact &amp; procurement brief
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export function Colophon() {
  return (
    <footer className="colophon">
      <div className="wrap">
        <div className="colophon__grid">
          <div>
            <Link to="/" className="mark" style={{ marginBottom: '1rem' }}>
              <Glyph className="mark__glyph" />
              <span className="mark__text">{org.wordmark}</span>
            </Link>
            <p className="prose" style={{ fontSize: 'var(--step--1)', maxWidth: '34ch' }}>
              One system, configured per institution: service requests,
              approvals, vendor coordination, and the record of both.
            </p>
            <p className="mono" style={{ marginTop: '1.25rem', color: 'var(--cmd-text-dim)' }}>
              <a className="tlink" href={`mailto:${org.email}`}>
                {org.email}
              </a>
            </p>
            <p className="uid" style={{ marginTop: '0.5rem' }}>
              {org.addressLines.join(' · ')} · {org.hours}
            </p>
          </div>

          <div>
            <h2>The system</h2>
            <div className="colophon__links">
              <Link to="/capabilities">Capabilities</Link>
              <Link to="/capabilities#reports">Standard reports</Link>
              <Link to="/implementation">Implementation planes</Link>
              <Link to="/records">Engagement register</Link>
            </div>
          </div>

          <div>
            <h2>Procurement</h2>
            <div className="colophon__links">
              <Link to="/assurance">Assurance register</Link>
              <Link to="/assurance#subprocessors">Subprocessors</Link>
              <Link to="/procurement">Document drawer</Link>
              <Link to="/procurement#identifiers">Vendor identifiers</Link>
              <Link to="/contact">Contracting contact</Link>
            </div>
          </div>
        </div>

        <div className="colophon__base">
          <span>
            © {new Date().getFullYear()} {org.legalName}
            {org.registeredName !== PENDING ? ` · ${org.registeredName}` : ''}
          </span>
          <span>
            Every claim on this site carries a state. Unfilled fields are shown as
            unfilled.
          </span>
        </div>
      </div>
    </footer>
  )
}
