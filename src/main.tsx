import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import DumpPage from './components/DumpPage.tsx'
import EventsPage from './components/EventsPage.tsx'
import ContactPage from './components/ContactPage.tsx'
import ArcadeLayer from './components/ArcadeLayer.tsx'
import GlobalNav from './components/GlobalNav.tsx'

import AboutPage from './components/AboutPage.tsx'
import PromPage from './components/PromPage.tsx'

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
