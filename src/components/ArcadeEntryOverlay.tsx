import { useState } from 'react'
import { joinArcade, storeUser } from '../lib/arcadeDB'
import './ArcadeOverlay.css'

interface Props {
  onComplete: () => void
}

export default function ArcadeEntryOverlay({ onComplete }: Props) {
  const [name, setName] = useState('')
  const [instagram, setInstagram] = useState('')
  const [loading, setLoading] = useState(false)
  const [shaking, setShaking] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim()) {
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
      return
    }
    setLoading(true)
    try {
      await joinArcade(name.trim(), instagram.trim() || undefined)
    } catch {
      // silently continue — offline-friendly
      storeUser(name.trim(), instagram.trim() || undefined)
    }
    setLoading(false)
    onComplete()
  }

  const handleGuest = () => {
    storeUser('Guest')
    onComplete()
  }

  return (
    <div className="arcade-entry-backdrop">
      <div className={`arcade-entry-modal ${shaking ? 'shake' : ''}`}>
        {/* Decorative corner brackets */}
        <div className="modal-corner tl" />
        <div className="modal-corner tr" />
        <div className="modal-corner bl" />
        <div className="modal-corner br" />

        <div className="entry-scanline" />

        <h2 className="entry-title">
          <span className="entry-icon">▶</span> PLAYER LOGIN
        </h2>
        <p className="entry-subtitle">Optional — join the arcade layer</p>

        <div className="entry-field">
          <label className="entry-label">CALLSIGN</label>
          <input
            className="entry-input"
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            autoFocus
            maxLength={20}
          />
        </div>

        <div className="entry-field">
          <label className="entry-label">INSTAGRAM <span className="optional-tag">[OPT]</span></label>
          <input
            className="entry-input"
            type="text"
            placeholder="@username"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            maxLength={30}
          />
        </div>

        <button
          className="entry-submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '[ CONNECTING... ]' : '[ INSERT COIN ]'}
        </button>

        <button className="entry-guest-btn" onClick={handleGuest}>
          CONTINUE AS GUEST →
        </button>

        <div className="entry-footer-text">
          SESSION DATA • LOCAL ONLY • NO TRACKING
        </div>
      </div>
    </div>
  )
}
