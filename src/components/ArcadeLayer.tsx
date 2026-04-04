import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ArcadeEntryOverlay from './ArcadeEntryOverlay'
import ArcadeHUD from './ArcadeHUD'
import ArcadeToast from './ArcadeToast'
import { getStoredUser, leaveArcade } from '../lib/arcadeDB'

/**
 * ArcadeLayer wraps around the existing app.
 * It provides: entry overlay → HUD + toasts once joined.
 * Completely non-destructive — renders as sibling overlays.
 */
export default function ArcadeLayer() {
  const [joined, setJoined] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // If user already has a session, skip overlay
    const user = getStoredUser()
    if (user) {
      setJoined(true)
    } else {
      // Show overlay after a brief delay (don't interrupt initial load)
      const timer = setTimeout(() => setShowOverlay(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  // Cleanup on page unload
  useEffect(() => {
    const handleUnload = () => {
      leaveArcade().catch(() => {})
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [])

  const handleEntryComplete = () => {
    setShowOverlay(false)
    setJoined(true)
  }

  return (
    <>
      {/* Entry overlay */}
      {showOverlay && !joined && (
        <ArcadeEntryOverlay onComplete={handleEntryComplete} />
      )}

      {/* HUD + Toast (only after joining) */}
      {joined && (
        <>
          {location.pathname === '/' && <ArcadeHUD />}
          <ArcadeToast />
        </>
      )}
    </>
  )
}
