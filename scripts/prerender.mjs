/**
 * Writes a real HTML file per route.
 *
 * GitHub Pages has no rewrite rules. The usual SPA trick — copy index.html to
 * 404.html — makes deep links work for a visitor but serves them under an HTTP
 * 404, so a crawler following the sitemap treats /assurance as missing. Emitting
 * dist/assurance/index.html gives a 200 and, more usefully, lets each route
 * carry its own title, description, canonical, and social tags without the
 * crawler having to run JavaScript.
 *
 * 404.html is still written, for genuinely unknown paths.
 */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const DIST = 'dist'
const SHELL = join(DIST, 'index.html')
const SITE = 'https://jacobfv.github.io/ayjas-systems'

const routes = JSON.parse(readFileSync('src/content/routes.json', 'utf8'))
const shell = readFileSync(SHELL, 'utf8')

/**
 * Replace a head tag's content, failing loudly if the tag is not found. A silent
 * miss here would ship pages whose metadata all claims to be the homepage, which
 * is worse than a broken build.
 */
function swap(html, pattern, replacement, label) {
  // Assert on the match, not on whether the string changed: for the homepage the
  // new value equals the default, and a no-op replacement is correct there.
  if (!pattern.test(html)) {
    throw new Error(
      `prerender: could not rewrite ${label} — index.html markup changed, update scripts/prerender.mjs`,
    )
  }
  return html.replace(pattern, replacement)
}

function escapeAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function render(route) {
  const url = route.path === '/' ? `${SITE}/` : `${SITE}${route.path}`
  const title = escapeAttr(route.title)
  const desc = escapeAttr(route.description)

  let html = shell
  html = swap(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`, '<title>')
  html = swap(
    html,
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${desc}" />`,
    'meta description',
  )
  html = swap(
    html,
    /<link rel="canonical"[^>]*\/>/,
    `<link rel="canonical" href="${url}" />`,
    'canonical',
  )
  html = swap(
    html,
    /<meta property="og:url"[^>]*\/>/,
    `<meta property="og:url" content="${url}" />`,
    'og:url',
  )
  html = swap(
    html,
    /<meta property="og:title"[^>]*\/>/,
    `<meta property="og:title" content="${title}" />`,
    'og:title',
  )
  html = swap(
    html,
    /<meta\s+property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${desc}" />`,
    'og:description',
  )
  html = swap(
    html,
    /<meta name="twitter:title"[^>]*\/>/,
    `<meta name="twitter:title" content="${title}" />`,
    'twitter:title',
  )
  html = swap(
    html,
    /<meta\s+name="twitter:description"[\s\S]*?\/>/,
    `<meta name="twitter:description" content="${desc}" />`,
    'twitter:description',
  )
  return html
}

for (const route of routes) {
  const out = route.path === '/' ? SHELL : join(DIST, route.path.slice(1), 'index.html')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, render(route))
  console.log(`prerender: ${out}`)
}

// Unknown paths: the shell, so the client router can render its own 404 page.
copyFileSync(SHELL, join(DIST, '404.html'))
console.log('prerender: dist/404.html')
