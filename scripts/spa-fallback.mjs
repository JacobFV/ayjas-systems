// GitHub Pages has no rewrite rules, so a direct request to /assurance would
// 404. Serving the SPA shell as 404.html lets the client router resolve the
// path it was actually asked for.
import { copyFileSync, existsSync } from 'node:fs'

const from = 'dist/index.html'
const to = 'dist/404.html'

if (!existsSync(from)) {
  console.error(`spa-fallback: ${from} not found — did the build run?`)
  process.exit(1)
}
copyFileSync(from, to)
console.log(`spa-fallback: wrote ${to}`)
