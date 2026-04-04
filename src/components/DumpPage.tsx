import { useState, useEffect, useCallback, useRef } from 'react'
import { getDumps, dropInstagram, subscribeToDumps, type ArcadeDump } from '../lib/arcadeDB'
import './DumpPage.css'

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min
}

interface CardStyle {
  left: string
  top: string
  rotation: number
  zIndex: number
  delay: number
}

function generateCardStyle(index: number, total: number): CardStyle {
  const cols = Math.max(Math.ceil(Math.sqrt(total)), 1)
  const rows = Math.max(Math.ceil(total / cols), 1)
  const baseLeft = (index % cols) / cols * 70 + randomInRange(2, 12)
  const baseTop = Math.floor(index / cols) / rows * 55 + randomInRange(5, 15)
  return {
    left: `${baseLeft}%`,
    top: `${baseTop}%`,
    rotation: randomInRange(-12, 12),
    zIndex: index,
    delay: 0,
  }
}

// Stored local dumps (so they persist across component remounts within the session)
const LOCAL_STORAGE_KEY = 'arcade_local_dumps'

function getLocalDumps(): ArcadeDump[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalDumps(dumps: ArcadeDump[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dumps.slice(0, 200)))
}

export default function DumpPage() {
  const [dumps, setDumps] = useState<ArcadeDump[]>([])
  const [cardStyles, setCardStyles] = useState<Map<string, CardStyle>>(new Map())
  const [selectedCard, setSelectedCard] = useState<ArcadeDump | null>(null)
  const [showDropForm, setShowDropForm] = useState(false)
  const [dropName, setDropName] = useState('')
  const [dropInsta, setDropInsta] = useState('')
  const [dropping, setDropping] = useState(false)
  const [newCardIds, setNewCardIds] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  const MAX_VISIBLE = 150

  const buildStyles = useCallback((items: ArcadeDump[]) => {
    const map = new Map<string, CardStyle>()
    items.forEach((d, i) => {
      const key = d.id || `${d.instagram}-${i}`
      map.set(key, generateCardStyle(i, items.length))
    })
    setCardStyles(map)
  }, [])

  // Load initial dumps — try Supabase first, fall back to localStorage
  useEffect(() => {
    getDumps()
      .then((data) => {
        if (data.length > 0) {
          setDumps(data)
          buildStyles(data)
          // Sync to local storage
          saveLocalDumps(data)
        } else {
          // Supabase returned empty — use local storage
          const local = getLocalDumps()
          setDumps(local)
          buildStyles(local)
        }
      })
      .catch(() => {
        // Supabase failed — use local storage
        const local = getLocalDumps()
        setDumps(local)
        buildStyles(local)
      })
  }, [buildStyles])

  // Realtime subscription for new dumps
  useEffect(() => {
    const sub = subscribeToDumps((newDump: ArcadeDump) => {
      setDumps((prev) => {
        const updated = [newDump, ...prev].slice(0, 200)
        buildStyles(updated)
        saveLocalDumps(updated)
        return updated
      })
      const id = newDump.id || `${newDump.instagram}-new`
      markNew(id)
    })

    return () => { sub.unsubscribe() }
  }, [buildStyles])

  function markNew(id: string) {
    setNewCardIds((prev) => new Set(prev).add(id))
    setTimeout(() => {
      setNewCardIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 1200)
  }

  const handleDrop = async () => {
    if (!dropInsta.trim()) return
    setDropping(true)

    const name = dropName.trim() || 'Anon'
    const instagram = dropInsta.trim()
    const localId = `local-${Date.now()}-${Math.random().toString(36).slice(2)}`

    // Immediately add to local state so it shows up right away
    const newDump: ArcadeDump = {
      id: localId,
      name,
      instagram,
      session_id: '',
      dropped_at: new Date().toISOString(),
    }

    setDumps((prev) => {
      const updated = [newDump, ...prev].slice(0, 200)
      buildStyles(updated)
      saveLocalDumps(updated)
      return updated
    })
    markNew(localId)

    // Also try to persist to Supabase
    try {
      await dropInstagram(name, instagram)
    } catch {
      // offline — local state is already updated
    }

    setDropping(false)
    setDropName('')
    setDropInsta('')
    setShowDropForm(false)
  }

  const visibleDumps = dumps.slice(0, MAX_VISIBLE)
  const hiddenCount = Math.max(0, dumps.length - MAX_VISIBLE)

  return (
    <div className="dump-page">
      {/* Background effects */}
      <div className="dump-grid-bg" />
      <div className="dump-scanline" />

      {/* Header */}
      <div className="dump-header">
        <h1 className="dump-title">ARCADE PIT</h1>
        <p className="dump-subtitle">DROP YOUR TAG — LEAVE YOUR MARK</p>
        <button
          className="dump-drop-btn"
          onClick={() => setShowDropForm(!showDropForm)}
        >
          {showDropForm ? '[ ✕ CANCEL ]' : '[ 🕹️ DROP YOUR TAG ]'}
        </button>
      </div>

      {/* Drop form */}
      {showDropForm && (
        <div className="dump-form">
          <div className="dump-form-inner">
            <input
              className="dump-input"
              placeholder="Your name"
              value={dropName}
              onChange={(e) => setDropName(e.target.value)}
              maxLength={20}
            />
            <input
              className="dump-input"
              placeholder="@instagram"
              value={dropInsta}
              onChange={(e) => setDropInsta(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDrop()}
              maxLength={30}
              autoFocus
            />
            <button
              className="dump-submit"
              onClick={handleDrop}
              disabled={dropping || !dropInsta.trim()}
            >
              {dropping ? 'DROPPING...' : 'THROW IT IN ↓'}
            </button>
          </div>
        </div>
      )}

      {/* Card pile */}
      <div className="dump-pit" ref={containerRef}>
        {visibleDumps.map((d, i) => {
          const key = d.id || `${d.instagram}-${i}`
          const style = cardStyles.get(key)
          const isNew = newCardIds.has(key)
          const isSelected = selectedCard?.id === d.id

          return (
            <div
              key={key}
              className={`dump-card ${isNew ? 'dump-card-new' : ''} ${isSelected ? 'dump-card-selected' : ''}`}
              style={{
                left: style?.left || '20%',
                top: style?.top || '20%',
                transform: `rotate(${style?.rotation || 0}deg)`,
                zIndex: isSelected ? 999 : (style?.zIndex || i),
                animationDelay: isNew ? '0s' : `${(style?.delay || 0)}s`,
              }}
              onClick={() => setSelectedCard(isSelected ? null : d)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.zIndex = '500'
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLElement).style.zIndex = String(style?.zIndex || i)
                }
              }}
            >
              <div className="dump-card-handle">@</div>
              <div className="dump-card-insta">{d.instagram}</div>
              {isSelected && (
                <div className="dump-card-details">
                  <div className="dump-card-name">{d.name}</div>
                  <a
                    href={`https://instagram.com/${d.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dump-card-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    VIEW PROFILE →
                  </a>
                </div>
              )}
            </div>
          )
        })}

        {hiddenCount > 0 && (
          <div className="dump-overflow">
            +{hiddenCount} more tags buried below
          </div>
        )}

        {dumps.length === 0 && (
          <div className="dump-empty">
            <span className="dump-empty-icon">🏷️</span>
            <p>NO TAGS YET</p>
            <p className="dump-empty-sub">Be the first to drop your tag</p>
          </div>
        )}
      </div>
    </div>
  )
}
