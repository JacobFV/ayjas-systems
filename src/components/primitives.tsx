import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ASSURANCE_LABEL,
  DOC_STATE_LABEL,
  PENDING,
  type AssuranceState,
  type DocState,
  type Maybe,
} from '../content/site'

/* ------------------------------------------------------------- pending --- */

/**
 * Renders an openly incomplete field. There is deliberately no prop that lets a
 * caller substitute placeholder prose: the only two options are a real value or
 * a visible gap.
 */
export function Value({ v, label }: { v: Maybe; label?: string }) {
  if (v === PENDING) {
    return (
      <span className="pending" title={label ? `${label}: not yet published` : 'Not yet published'}>
        not published
      </span>
    )
  }
  return <>{v}</>
}

/* ---------------------------------------------------------------- chips --- */

const ASSURANCE_CLASS: Record<AssuranceState, string> = {
  verified: 'chip--verified',
  available: 'chip--available',
  'in-progress': 'chip--progress',
  scoped: 'chip--scoped',
  'designed-around': 'chip--designed',
  none: 'chip--none',
}

export function AssuranceChip({ state }: { state: AssuranceState }) {
  return (
    <span className={`chip ${ASSURANCE_CLASS[state]}`}>
      <span className="chip__dot" aria-hidden="true" />
      {ASSURANCE_LABEL[state]}
    </span>
  )
}

const DOC_CLASS: Record<DocState, string> = {
  available: 'chip--verified',
  'on-request': 'chip--scoped',
  drafting: 'chip--progress',
  unavailable: 'chip--none',
}

export function DocChip({ state }: { state: DocState }) {
  return (
    <span className={`chip ${DOC_CLASS[state]}`}>
      <span className="chip__dot" aria-hidden="true" />
      {DOC_STATE_LABEL[state]}
    </span>
  )
}

/* -------------------------------------------------------- part opener --- */

export function Part({
  index,
  title,
  aside,
  lede,
  as: Tag = 'h2',
}: {
  index: string
  title: ReactNode
  aside?: ReactNode
  lede?: ReactNode
  as?: 'h1' | 'h2' | 'h3'
}) {
  return (
    <header className="part">
      <div className="part__row">
        <span className="eyebrow">{index}</span>
        {aside ? <span className="eyebrow">{aside}</span> : null}
      </div>
      <Tag className="display display--lg">{title}</Tag>
      {lede ? <p className="lede">{lede}</p> : null}
    </header>
  )
}

/* ------------------------------------------------------------ page mast --- */

/** Command-register page opener. Keeps every interior page on one rhythm. */
export function PageMast({
  eyebrow,
  title,
  lede,
  rail,
  children,
}: {
  eyebrow: string
  title: string
  lede: string
  rail?: { label: string; value: ReactNode }[]
  children?: ReactNode
}) {
  return (
    <section className="hero surface-command-deep">
      <div className="wrap" style={{ paddingBlock: 'clamp(2.75rem, 6vw, 5rem)' }}>
        <p className="eyebrow" style={{ marginBottom: '1rem' }}>
          {eyebrow}
        </p>
        <h1 className="display display--lg" style={{ maxWidth: '30ch' }}>
          {title}
        </h1>
        <p className="lede" style={{ marginTop: '1.25rem' }}>
          {lede}
        </p>
        {children}
      </div>
      {rail ? (
        <div className="wrap">
          <div className="rail">
            {rail.map((r) => (
              <div className="rail__item" key={r.label}>
                <p className="rail__k">{r.label}</p>
                <p className="rail__v">{r.value}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

/* --------------------------------------------------------------- reveal --- */

/**
 * Progressive enhancement only. The `.js` class is set on <html> at runtime, so
 * without JavaScript — or with reduced motion — children are visible from the
 * first paint. Nothing above the fold ever waits on this.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
}: {
  children: ReactNode
  delay?: number
  as?: 'div' | 'section' | 'li' | 'tr'
  className?: string
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || shown) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [shown])

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={['reveal', className].filter(Boolean).join(' ')}
      data-shown={shown ? 'true' : 'false'}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

/* ----------------------------------------------------------- key/value --- */

export function KV({ rows }: { rows: { k: string; v: ReactNode }[] }) {
  return (
    <dl className="kv">
      {rows.map((r) => (
        <div className="kv__row" key={r.k}>
          <dt className="kv__k">{r.k}</dt>
          <dd className="kv__v">{r.v}</dd>
        </div>
      ))}
    </dl>
  )
}

/* ---------------------------------------------------------------- mark --- */

/** Wordmark glyph: three stacked planes, matching the diagram language. */
export function Glyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 26 26" aria-hidden="true" focusable="false">
      <g stroke="#3fc3b6" strokeWidth="1.2" fill="none">
        <path d="M13 3 L23 8 L13 13 L3 8 Z" />
      </g>
      <g stroke="#6c8992" strokeWidth="1.1" fill="none" opacity="0.85">
        <path d="M13 11 L23 16 L13 21 L3 16 Z" />
      </g>
      <path d="M13 19 L23 24 L13 29 L3 24 Z" stroke="#6c8992" strokeWidth="1" fill="none" opacity="0.45" />
      <path d="M17 5.5 L7 18.5" stroke="#d64221" strokeWidth="1.3" fill="none" />
    </svg>
  )
}
