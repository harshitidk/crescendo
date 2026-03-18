import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import DumpPage from './components/DumpPage.tsx'
import ArcadeLayer from './components/ArcadeLayer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* The Arcade Layer sits on top of everything */}
      <ArcadeLayer />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dump" element={<DumpPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
