import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import DumpPage from './components/DumpPage'
import EventsPage from './components/EventsPage'
import ContactPage from './components/ContactPage'
import ArcadeLayer from './components/ArcadeLayer'
import GlobalNav from './components/GlobalNav'

import AboutPage from './components/AboutPage'
import PromPage from './components/PromPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* The Arcade Layer sits on top of everything */}
      <ArcadeLayer />
      <GlobalNav />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/prom" element={<PromPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/dump" element={<DumpPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
