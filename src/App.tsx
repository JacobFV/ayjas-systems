import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Colophon, Masthead } from './components/Shell'
import Assurance from './pages/Assurance'
import Capabilities from './pages/Capabilities'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Implementation from './pages/Implementation'
import NotFound from './pages/NotFound'
import Procurement from './pages/Procurement'
import Records from './pages/Records'

/**
 * Restore the top of the document on navigation, but leave in-page anchors
 * alone so the footer's deep links still land on their section.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ block: 'start' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <ScrollManager />
      <Masthead />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/capabilities" element={<Capabilities />} />
          <Route path="/assurance" element={<Assurance />} />
          <Route path="/implementation" element={<Implementation />} />
          <Route path="/records" element={<Records />} />
          <Route path="/procurement" element={<Procurement />} />
          <Route path="/contact" element={<Contact />} />
          {/* Legacy paths from the previous site, kept as redirects so old links
              and search results land somewhere coherent instead of a 404. */}
          <Route path="/contact-us" element={<Navigate to="/contact" replace />} />
          <Route path="/about-us" element={<Navigate to="/procurement" replace />} />
          <Route path="/education" element={<Navigate to="/capabilities" replace />} />
          <Route path="/facilities" element={<Navigate to="/capabilities" replace />} />
          <Route path="/facilities-management" element={<Navigate to="/capabilities" replace />} />
          <Route path="/security" element={<Navigate to="/assurance" replace />} />
          <Route path="/compliance" element={<Navigate to="/assurance" replace />} />
          <Route path="/status" element={<Navigate to="/assurance" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Colophon />
    </>
  )
}
