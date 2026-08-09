# Ayjas Systems — website

A rebuild of [ayjassystems.netlify.app](https://ayjassystems.netlify.app/) as a
site a public-sector or education procurement reviewer could actually clear.

**Live:** https://jacobfv.github.io/ayjas-systems/

React 19 · TypeScript · Vite · React Router · no CSS framework · no runtime
dependencies beyond React and the router.

---

## Why it was rebuilt this way

The original site had a clean visual skeleton and three problems that no amount
of styling fixes:

1. **Placeholder content presented as fact** — `+234 XXX XXX XXXX`,
   `sales@ayjassystems.gov`, "Example Unified School District", a status page
   reporting "degraded performance" with no incident or timestamp, and a
   testimonial section whose copy was the instruction to write testimonials.
2. **An incoherent company** — the homepage described a software company, the
   about page a B2G contracting firm, and other pages a procurement consultancy
   and a facilities-services coordinator. The product, the buyer, and the
   deliverable were all unrecoverable from the site.
3. **Claims well past the evidence** — "enterprise-grade", "SOC 2 aligned",
   "FERPA aligned", "trusted by agencies", "100% procurement compliance
   alignment", none of them substantiated. Public buyers are trained to find
   exactly this.

Also: five seconds of staggered reveal animations left the page apparently
blank on load, most conversion CTAs linked to `#` or back to the homepage, and
the homepage had no meta description, canonical, or social metadata at all.

So this rebuild takes a position: **legitimacy is a relationship between a
claim, its scope, its evidence, its state, and its owner, and the layout keeps
those adjacent.** The design is a systems dossier that happens to be
interactive, not a SaaS landing page with a government colour palette.

### The single offer

Every page is checked against one sentence, held in
[`src/content/site.ts`](src/content/site.ts) as `positioning`:

> Ayjas Systems builds one system: a configurable record of service requests,
> approvals, vendor coordination, and reporting — deployed and configured for a
> single institution at a time.

Scope boundaries are stated on the homepage: no software resale, no procurement
consultancy, no facilities staffing. FERPA and US education positioning is gone;
the entity operates from Lagos and the site says so.

### Honesty is enforced in the type system, not in review

`src/content/site.ts` is the single source of truth for every auditable claim,
and it is built so the UI *cannot* overstate:

- Every assurance row carries an `AssuranceState`
  (`none` → `designed-around` → `scoped` → `in-progress` → `available` →
  `verified`). There is no code path that renders a verified chip without
  `state: 'verified'`, and only `verified` and `available` get a halo in the
  design system.
- `PENDING` is a first-class value. A field with no real answer renders as a
  visibly hatched "not published" marker via `<Value>`, which has no prop for
  substituting placeholder prose.
- The engagement register is **empty**, with the reason stated, because there is
  nothing cleared to publish. A worked record appears beside it stamped
  `SPECIMEN · NOT AN ENGAGEMENT` so a buyer can see the evidence format.
- Rows that say nothing is held say so plainly: no SOC 2 report, no ISO 27001
  certification, no third-party penetration test, FERPA not applicable. The
  homepage carries a "correction on the record" note withdrawing the earlier
  claims.

An openly incomplete record is more credible than a completed fiction. That is
the whole design thesis, and it is why the site has six dense pages instead of
forty thin ones.

### Design system

Two registers, switched deliberately so the reader feels the epistemic mode
change between promise and evidence:

| Register | Surface | Used for |
| --- | --- | --- |
| Command | near-black teal, coordinate grid, restrained bloom | claims, diagrams, live state, procurement drawer |
| Document | warm ivory, drafting-paper grid | registers, records, implementation, evidence |

Chroma is rationed. Vermilion marks routing and intervention only — in the hero
diagram it is the one saturated line, tracing a single request down through five
planes. Cyan marks verified or active state. Indigo marks permission and domain
boundaries. Nothing else is coloured.

Type: Newsreader for display, IBM Plex Sans for interface, IBM Plex Mono for
identifiers and states. Radius hierarchy: documents 2–4px, controls 6px, major
surfaces 12px. Fonts are self-hosted from npm, so there is no third-party
request on load.

Diagrams are hand-authored SVG over a 30° axonometric projection
([`src/lib/iso.ts`](src/lib/iso.ts)) — 40 lines of maths, no 3D library. The
homepage assembly explodes a deployment into five planes; the control map
illuminates a node and its incident edges when you hover the matching control.

### Accessibility and load behaviour

- Above-the-fold content is visible at first paint. `.reveal` transitions only
  arm once JavaScript adds `.js` to `<html>`, so nothing is ever hidden waiting
  on an animation. Transitions are ~260ms and fully disabled under
  `prefers-reduced-motion`.
- Every form field has a programmatically associated `<label>`, a `name`, native
  `required`, `autocomplete`, and appropriate `inputMode`.
- Single `<h1>` per page, correct heading order, skip link, visible focus rings,
  `aria-live` on the form result, `<title>`/`<desc>` on every diagram.
- Wide tables scroll inside their own container; the page body never scrolls
  horizontally.
- Every route is prerendered to its own HTML file at build time, so deep links
  return 200 with their own `<title>`, description, canonical, and Open Graph
  tags — no crawler has to run JavaScript to see them. Plus a substantive
  `<noscript>` block with the offer, the assurance position, and the contact
  address.

### The contact form

The site is statically hosted, so there is no server to POST to. Rather than
fake a success state, the form validates, composes a structured enquiry, and
hands it to the visitor's mail client — showing the same text with a copy button
in case `mailto:` is not wired up. Set `VITE_FORM_ENDPOINT` at build time to
POST to a real handler instead; the mail-client path remains the fallback.

---

## Before you publish

The site is honest about what it does not know, but several fields should be
filled with real facts. Search `src/content/site.ts` for `PENDING` — every hit
currently renders as a visible "not published" marker.

**Blocking — fill these before sending the link to a buyer:**

| Field | Where | Note |
| --- | --- | --- |
| `org.registeredName`, `org.rcNumber`, `org.tin` | Vendor identifiers | A supplier record cannot be opened without these |
| `org.contractingEmail` | Procurement, Assurance | A domain mailbox. Until then the site correctly falls back to the Gmail address |
| `assurance[].owner`, `assurance[].reviewed` | Assurance register | A control with no named owner is not a control |
| `subprocessors[]` | Assurance | Hosting, email, monitoring, and storage providers with regions |
| `planes[].duration` | Implementation | Real ranges from a real deployment |

**Non-blocking:** `org.founded`, `org.headcount`, `org.phone` (deliberately
absent — publish only a working number), `procurementDocs[].revision` / `.owner`
/ `.href` (flip `state` to `'available'` and add `href` once a PDF exists in
`public/`).

**Do not** fill `recordRegister` or add a case study until a named client has
cleared one in writing. The empty register is doing more work for you than an
anonymous one would.

Two things to do outside this repo: point a real domain at the site (`CNAME` in
`public/`, then update `siteUrl` in `src/content/site.ts`, the URLs in
`index.html`, `public/sitemap.xml`, and `public/robots.txt`), and re-add social
links only once the accounts exist and are active — a dead social link costs
more trust than a missing one.

---

## Local development

```bash
npm install
npm run dev        # http://localhost:5173/ayjas-systems/
npm run build      # tsc -b && vite build && prerender each route
npm run preview    # serve dist/
npm run lint
npm run og         # regenerate public/og.png (needs ImageMagick)
```

`vite.config.ts` reads `BASE_PATH`, defaulting to `/ayjas-systems/` so a plain
build is deployable. The GitHub Actions workflow sets it from the Pages base
path.

## Deployment

`.github/workflows/deploy.yml` builds on every push to `main` and publishes
`dist/` to GitHub Pages.

Pages has no rewrite rules, so `scripts/prerender.mjs` writes a real
`dist/<route>/index.html` for each entry in `src/content/routes.json`, with that
route's head tags substituted in. `routes.json` is the single source shared by
the build script and the `useMeta` hook, so the two cannot drift. The script
throws if `index.html`'s head markup changes in a way it cannot rewrite —
shipping seven pages that all claim to be the homepage is worse than a failed
build. `404.html` is still emitted for genuinely unknown paths.

## Structure

```
src/
  content/site.ts     every factual claim, with an explicit state per claim
  content/routes.json per-route head metadata, shared with the build script
  lib/iso.ts          axonometric projection helpers
  lib/useMeta.ts      per-route document metadata
  components/
    SystemAxon.tsx    exploded five-plane deployment assembly
    ControlMap.tsx    interactive control-flow map
    primitives.tsx    Value, chips, Part, PageMast, Reveal, KV, Glyph
    Shell.tsx         masthead and colophon
  pages/              Home, Capabilities, Assurance, Implementation,
                      Records, Procurement, Contact, NotFound
```

## Licence

MIT for the code. Copy for the Ayjas Systems entity belongs to Ayjas Systems.
