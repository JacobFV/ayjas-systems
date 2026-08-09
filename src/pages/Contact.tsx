import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  KV,
  PageMast,
  RevisionFoot,
  SectionHead,
} from '../components/primitives'
import { org, partByPath, procurementDocs } from '../content/site'
import { routeMeta, useMeta } from '../lib/useMeta'

/**
 * The site is statically hosted, so there is no server to accept a POST. Rather
 * than fake a success state, the form composes a structured enquiry and hands it
 * to the visitor's mail client, showing the same text with a copy button in case
 * `mailto:` is not wired up on their machine.
 *
 * Set VITE_FORM_ENDPOINT at build time to POST to a real handler instead; the
 * mail-client path stays as the fallback if the request fails.
 */
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined

type State = 'idle' | 'sending' | 'handed-off' | 'error'

const ENQUIRY_TYPES = [
  'Procurement brief',
  'Security or assurance question',
  'Working session / live walkthrough',
  'Document request',
  'Something else',
] as const

const PART = partByPath('/contact')

export default function Contact() {
  useMeta(routeMeta('/contact'))

  const [params] = useSearchParams()
  const requestedDoc = params.get('doc')
  const requestedDocTitle = useMemo(
    () => procurementDocs.find((d) => d.id === requestedDoc)?.title,
    [requestedDoc],
  )

  const [state, setState] = useState<State>('idle')
  const [composed, setComposed] = useState('')
  const [copied, setCopied] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const get = (k: string) => String(data.get(k) ?? '').trim()

    const body = [
      `Institution: ${get('organisation')}`,
      `Name: ${get('name')}`,
      `Role: ${get('role') || '—'}`,
      `Email: ${get('email')}`,
      `Enquiry type: ${get('enquiry')}`,
      `Request types to bring under control: ${get('requestTypes') || '—'}`,
      `Approvers / sign-off: ${get('approvers') || '—'}`,
      '',
      get('message'),
    ].join('\n')

    const subject = `${get('enquiry')} — ${get('organisation') || 'enquiry'}`

    setComposed(`To: ${org.email}\nSubject: ${subject}\n\n${body}`)
    setState('sending')

    if (ENDPOINT) {
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(Object.fromEntries(data.entries())),
        })
        if (res.ok) {
          setState('handed-off')
          form.reset()
          return
        }
      } catch {
        // fall through to the mail-client path
      }
    }

    window.location.href = `mailto:${org.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
    setState('handed-off')
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(composed)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2400)
    } catch {
      setState('error')
    }
  }

  return (
    <>
      <PageMast
        part={PART}
        title="Tell us the operation, not the requirement list"
        lede="The useful first message names the institution, the two or three request types that are currently ungoverned, and who has to sign off. That is enough to write a brief against — or to tell you we are not the right fit, which is a faster answer than a discovery call."
        rail={[
          { label: 'Response time', value: 'Two working days' },
          { label: 'Replies from', value: 'A person, not a queue' },
          { label: 'Hours', value: org.hours },
          { label: 'Location', value: org.addressLines.join(', ') },
        ]}
      />

      <section className="sheet section" id="enquiry">
        <div className="wrap">
          <div className="grid-2" style={{ alignItems: 'start' }}>
            {/* ------------------------------------------------------ form */}
            <div>
              <SectionHead no="7.1" aside="composed locally" title="Send a message" as="h2" />

              {requestedDocTitle ? (
                <div className="notice notice--ok" style={{ marginBottom: '1.5rem' }}>
                  Requesting <strong>{requestedDocTitle}</strong> ({requestedDoc}). The
                  document reference is included in your message.
                </div>
              ) : null}

              <form
                ref={formRef}
                onSubmit={onSubmit}
                noValidate={false}
                className="form-grid"
                aria-describedby="form-note"
              >
                <div className="form-grid form-grid--2" style={{ gap: '1.1rem' }}>
                  <p className="field">
                    <label htmlFor="name">
                      Name <span className="req" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      enterKeyHint="next"
                    />
                  </p>
                  <p className="field">
                    <label htmlFor="role">Role</label>
                    <input
                      id="role"
                      name="role"
                      type="text"
                      autoComplete="organization-title"
                      placeholder="e.g. Facilities Manager"
                    />
                  </p>
                </div>

                <div className="form-grid form-grid--2" style={{ gap: '1.1rem' }}>
                  <p className="field">
                    <label htmlFor="organisation">
                      Institution <span className="req" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="organisation"
                      name="organisation"
                      type="text"
                      required
                      autoComplete="organization"
                    />
                  </p>
                  <p className="field">
                    <label htmlFor="email">
                      Email <span className="req" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                    />
                  </p>
                </div>

                <p className="field">
                  <label htmlFor="enquiry">
                    Enquiry type <span className="req" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="enquiry"
                    name="enquiry"
                    required
                    defaultValue={requestedDoc ? 'Document request' : 'Procurement brief'}
                  >
                    {ENQUIRY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </p>

                <p className="field">
                  <label htmlFor="requestTypes">
                    Request types you need under control
                  </label>
                  <input
                    id="requestTypes"
                    name="requestTypes"
                    type="text"
                    placeholder="e.g. maintenance, IT access, purchase requests"
                  />
                  <span className="field__hint">
                    Two or three is more useful than a complete list.
                  </span>
                </p>

                <p className="field">
                  <label htmlFor="approvers">Who has to sign off</label>
                  <input
                    id="approvers"
                    name="approvers"
                    type="text"
                    placeholder="e.g. campus head above ₦500k, then bursar"
                  />
                </p>

                <p className="field">
                  <label htmlFor="message">
                    Message <span className="req" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    defaultValue={
                      requestedDoc
                        ? `Please send ${requestedDocTitle} (${requestedDoc}).\n\n`
                        : ''
                    }
                  />
                </p>

                <input type="hidden" name="documentRef" value={requestedDoc ?? ''} />

                <div className="btn-row">
                  <button
                    type="submit"
                    className="btn btn--solid-ink"
                    disabled={state === 'sending'}
                  >
                    {state === 'sending' ? 'Composing…' : 'Send message'}
                  </button>
                  <a className="btn btn--ink" href={`mailto:${org.email}`}>
                    Or email directly
                  </a>
                </div>

                <p className="field__hint" id="form-note">
                  Fields marked <span className="req">*</span> are required. This site is
                  statically hosted and has no server: submitting opens your mail
                  client with the message composed. Nothing you type is stored or
                  transmitted anywhere else.
                </p>
              </form>

              <div aria-live="polite">
                {state === 'handed-off' && (
                  <div className="notice notice--ok" style={{ marginTop: '1.5rem' }}>
                    <p style={{ marginBottom: '0.75rem' }}>
                      Your mail client should have opened with the message ready to
                      send. If it did not, copy the text below and email it to{' '}
                      <a className="tlink" href={`mailto:${org.email}`}>
                        {org.email}
                      </a>
                      .
                    </p>
                    <pre
                      className="mono"
                      style={{
                        whiteSpace: 'pre-wrap',
                        margin: '0 0 0.85rem',
                        padding: '0.85rem',
                        background: '#fff',
                        border: '1px solid var(--rule)',
                        borderRadius: 'var(--r-doc)',
                        maxHeight: '16rem',
                        overflow: 'auto',
                        color: 'var(--ink-800)',
                      }}
                    >
                      {composed}
                    </pre>
                    <button type="button" className="btn btn--ink" onClick={copy}>
                      {copied ? 'Copied' : 'Copy message'}
                    </button>
                  </div>
                )}
                {state === 'error' && (
                  <div className="notice" style={{ marginTop: '1.5rem' }}>
                    Copying to the clipboard was blocked. Select the text above and
                    copy it manually.
                  </div>
                )}
              </div>
            </div>

            {/* --------------------------------------------------- details */}
            <div>
              <SectionHead no="7.2" aside="published details" title="Contact of record" as="h2" />

              <div className="card">
                <KV
                  rows={[
                    {
                      k: 'Email',
                      v: (
                        <a className="tlink" href={`mailto:${org.email}`}>
                          {org.email}
                        </a>
                      ),
                    },
                    { k: 'Location', v: org.addressLines.join(', ') },
                    { k: 'Hours', v: org.hours },
                    { k: 'Response time', v: 'Two working days' },
                  ]}
                />
              </div>

              <div className="notice" style={{ marginTop: '1.5rem' }}>
                No telephone number is published. The previous version of this site
                showed <span className="mono">+234 XXX XXX XXXX</span>, which is not a
                number; a placeholder that looks like a contact detail is worse than
                no contact detail. A line will appear here when there is one to
                publish.
              </div>

              <div style={{ marginTop: '2rem' }}>
                <p className="eyebrow" style={{ marginBottom: '1rem' }}>
                  What happens next
                </p>
                <ul className="tick">
                  <li>
                    We reply within two working days, from a person, with either a
                    scoped brief or a straight no.
                  </li>
                  <li>
                    If it is a fit, the next step is a working session against a
                    configured staging deployment — not a slide deck.
                  </li>
                  <li>
                    Documents you request come with their current revision number and
                    owner, or a note that the document is not written yet.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <RevisionFoot part={PART} />
    </>
  )
}
