import { useEffect } from 'react'
import routes from '../content/routes.json'
import { siteUrl } from '../content/site'

type Meta = {
  title: string
  description: string
  /** Route path, e.g. "/assurance". Used to build the canonical URL. */
  path: string
}

/**
 * Route metadata lives in routes.json because two consumers need it: this hook,
 * and scripts/prerender.mjs, which writes a real HTML file per route at build
 * time so deep links return 200 with correct head tags instead of the SPA
 * shell under a 404.
 */
export function routeMeta(path: string): Meta {
  const found = (routes as Meta[]).find((r) => r.path === path)
  if (!found) throw new Error(`routes.json has no entry for "${path}"`)
  return found
}

function setTag(
  selector: string,
  attrs: Record<string, string>,
  parent: HTMLElement = document.head,
) {
  let el = parent.querySelector<HTMLElement>(selector)
  if (!el) {
    const tag = selector.startsWith('link') ? 'link' : 'meta'
    el = document.createElement(tag)
    parent.appendChild(el)
  }
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
}

/**
 * Per-route document metadata. Each prerendered HTML file already carries the
 * right tags for a crawler that never runs JavaScript; this keeps them correct
 * as a visitor navigates within the app.
 */
export function useMeta({ title, description, path }: Meta) {
  useEffect(() => {
    const url = `${siteUrl}${path === '/' ? '/' : path}`
    document.title = title
    setTag('meta[name="description"]', { name: 'description', content: description })
    setTag('link[rel="canonical"]', { rel: 'canonical', href: url })
    setTag('meta[property="og:title"]', { property: 'og:title', content: title })
    setTag('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    })
    setTag('meta[property="og:url"]', { property: 'og:url', content: url })
    setTag('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    setTag('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    })
  }, [title, description, path])
}
