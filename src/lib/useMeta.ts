import { useEffect } from 'react'
import { siteUrl } from '../content/site'

type Meta = {
  title: string
  description: string
  /** Route path, e.g. "/assurance". Used to build the canonical URL. */
  path: string
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
 * Per-route document metadata. The static index.html carries a full default set,
 * so a crawler that never runs JavaScript still gets a title, description,
 * canonical, and social card; this hook keeps them correct as the user
 * navigates.
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
