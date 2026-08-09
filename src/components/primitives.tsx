import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ASSURANCE_LABEL,
  DOC_STATE_LABEL,
  PENDING,
  doc,
  limitations,
  revisions,
  type AssuranceState,
  type DocState,
  type Maybe,
  type Part,
} from '../content/site'

/* ------------------------------------------------------------- pending --- */

/**
 * Renders an openly unfilled field. There is deliberately no prop that lets a
 * caller substitute placeholder prose: the only two options are a real value or
 * a visible blank.
 */
export function Value({
  v,
  label,
  compact,
}: {
  v: Maybe
  label?: string
  /** Hatch mark only, for dense table cells. The words stay in the a11y tree. */
  compact?: boolean
}) {
  if (v === PENDING) {
    const title = label ? `${label}: not yet published` : 'Not yet published'
    return (
      <span className={compact ? 'pending pending--tight' : 'pending'} title={title}>
        <span className={compact ? 'sr-only' : undefined}>not published</span>
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

/* --------------------------------------------------------- section head --- */

/**
 * A numbered section opener. The number is the whole point: it makes the heading
 * citable, so a reviewer can quote "§ 3.2" back at us.
 */
export function SectionHead({
  no,
  title,
  aside,
  lede,
  as: Tag = 'h2',
  id,
}: {
  /** Section number within the part, e.g. "3.2". */
  no: string
  title: ReactNode
  aside?: ReactNode
  lede?: ReactNode
  as?: 'h1' | 'h2' | 'h3'
  id?: string
}) {
  return (
    <header className="part" id={id}>
      <div className="part__row">
        <span className="part__no">§ {no}</span>
        {aside ? <span className="part__aside">{aside}</span> : null}
      </div>
      <Tag className="display display--lg">{title}</Tag>
      {lede ? <p className="lede">{lede}</p> : null}
    </header>
  )
}

/* -------------------------------------------------------- document control --- */

/** The block a procurement reviewer looks for before reading anything else. */
export function DocControl({ part }: { part: Part }) {
  const rows: [string, ReactNode][] = [
    ['Document', doc.id],
    ['Title', doc.title],
    ['Part', `${part.n} of 7 — ${part.title}`],
    ['Revision', doc.revision],
    ['Date of issue', doc.issued],
    ['Classification', doc.classification],
    ['Prepared by', <Value key="p" v={doc.preparedBy} label="Prepared by" />],
    ['Approved by', <Value key="a" v={doc.approvedBy} label="Approved by" />],
  ]

  return (
    <div className="doccontrol">
      <div className="doccontrol__head">
        <span>Document control</span>
        <span>
          {doc.id} r{doc.revision}
        </span>
      </div>
      <dl className="doccontrol__body">
        {rows.map(([k, v]) => (
          <div className="doccontrol__row" key={k}>
            <dt className="doccontrol__k">{k}</dt>
            <dd className="doccontrol__v">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** Formal statement of what this document is and is not. */
export function StatusOfDocument() {
  return (
    <div className="status-note">
      <p className="status-note__k">Status of this document</p>
      {limitations.map((l, i) => (
        <p key={i}>{l}</p>
      ))}
    </div>
  )
}

/* --------------------------------------------------------------- figures --- */

/**
 * A figure is a plate: an ink panel, ruled, with a numbered caption beneath it.
 * This is the only place the dark surface appears inside the document body, so
 * the diagrams read as plates in a printed report rather than as hero art.
 */
export function Figure({
  no,
  caption,
  children,
  id,
}: {
  /** Figure number within the part, e.g. "1.1". */
  no: string
  caption: ReactNode
  children: ReactNode
  id?: string
}) {
  return (
    <figure className="figure" id={id}>
      <div className="figure__plate panel-ink">{children}</div>
      <figcaption className="figure__cap">
        <span className="figure__no">Figure {no}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  )
}

/** Numbered table caption. Tables in a report are cited, so they are numbered. */
export function TableHead({
  no,
  title,
  note,
}: {
  no: string
  title: string
  note?: ReactNode
}) {
  return (
    <div className="reg-head">
      <span className="reg-head__no">
        Table {no} — {title}
      </span>
      {note ? <span className="reg-head__note">{note}</span> : null}
    </div>
  )
}

/* ------------------------------------------------------------ page mast --- */

/** Cover block for a part: title left, document control right. */
export function PageMast({
  part,
  title,
  lede,
  rail,
  children,
}: {
  part: Part
  title: string
  lede: string
  rail?: { label: string; value: ReactNode; note?: string }[]
  children?: ReactNode
}) {
  return (
    <section className="sheet sheet--raised">
      <div className="wrap section--tight">
        <div className="mast">
          <div>
            <p className="eyebrow" style={{ marginBottom: '0.85rem' }}>
              Part {part.n} of 7 · {part.title}
            </p>
            <h1 className="display display--lg" style={{ maxWidth: '30ch' }}>
              {title}
            </h1>
            <p className="lede" style={{ marginTop: '1rem' }}>
              {lede}
            </p>
            {children}
          </div>
          <div>
            <DocControl part={part} />
          </div>
        </div>
      </div>
      {rail ? (
        <div className="wrap" style={{ paddingBottom: '0.5rem' }}>
          <div className="rail">
            {rail.map((r) => (
              <div className="rail__item" key={r.label}>
                <p className="rail__k">{r.label}</p>
                <p className="rail__v">{r.value}</p>
                {r.note ? <p className="rail__n">{r.note}</p> : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

/* --------------------------------------------------- revision + running foot --- */

/** Closes every part: revision history, then the running footer line. */
export function RevisionFoot({ part }: { part: Part }) {
  return (
    <section className="sheet section--tight">
      <div className="wrap">
        <div className="revhist">
          <TableHead no={`${part.n}.R`} title="Revision history" />
          <div className="scroll-x scroll-x--fluid">
            <table className="reg">
              <thead>
                <tr>
                  <th scope="col">Rev</th>
                  <th scope="col">Date</th>
                  <th scope="col">Change</th>
                </tr>
              </thead>
              <tbody>
                {revisions.map((r) => (
                  <tr key={r.rev}>
                    <td className="mono">{r.rev}</td>
                    <td className="mono">{r.date}</td>
                    <td style={{ color: 'var(--ink-500)' }}>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="runfoot">
          <span>
            {doc.id} · rev {doc.revision} · issued {doc.issued}
          </span>
          <span>
            Part {part.n} of 7 — {part.title}
          </span>
          <span>{doc.classification}</span>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- reveal --- */

/**
 * Progressive enhancement only. The `.js` class is set on <html> at runtime, so
 * without JavaScript — or with reduced motion — children are visible from the
 * first paint.
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
    // Safety net: content must never be able to stay hidden behind an animation
    // that did not fire. The transition is polish, not a gate on reading.
    const t = window.setTimeout(() => setShown(true), 1000)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
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

/** Three stacked planes and one annotation stroke — the diagram language, small. */
export function Glyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 26 26" aria-hidden="true" focusable="false">
      <g fill="none" strokeLinejoin="round">
        <path d="M13 3.5 L23 8 L13 12.5 L3 8 Z" stroke="#14171b" strokeWidth="1.3" />
        <path d="M13 11 L23 15.5 L13 20 L3 15.5 Z" stroke="#6a7480" strokeWidth="1.2" />
        <path d="M16.5 6 L8 17.5" stroke="#a8351c" strokeWidth="1.4" />
      </g>
    </svg>
  )
}
