import { useState, useEffect, useRef } from 'react'
import { getDumps, dropInstagram, subscribeToDumps, getStoredUser, deleteDump, getSessionId, syncLocalDumpsToServer, type ArcadeDump } from '../lib/arcadeDB'
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

function generateCardStyle(index: number): CardStyle {
  const columns = 5;
  const col = index % columns;
  const row = Math.floor(index / columns);
  
  // Create a clean grid but keep the absolute positioning for drag support
  // Using fixed steps for better reliability across different screen sizes
  const left = (col * 20);
  const top = (row * 100) + 40; 
  
  return {
    left: `${left}%`,
    top: `${top}px`,
    rotation: randomInRange(-2.5, 2.5), // Subtle rotation for a "hand-placed" feel
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
  const MAX_VISIBLE = 150
  const [newCardIds, setNewCardIds] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)
  // Get session ID once to check ownership
  const sessionId = useRef(getSessionId()).current
  
  // Dragging state
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [initialStylePos, setInitialStylePos] = useState({ left: 0, top: 0 })

  const visibleDumps = dumps.slice(0, MAX_VISIBLE)
  const hiddenCount = Math.max(0, dumps.length - MAX_VISIBLE)

  // Load initial dumps — try Supabase first, fall back to localStorage
  useEffect(() => {
    // Pre-fill user info if available
    const user = getStoredUser()
    if (user) {
      if (user.name) setDropName(user.name)
      if (user.instagram) setDropInsta(user.instagram)
    }

    getDumps()
      .then((data) => {
        // Automatically push backward-compatible offline drops to the live backend
        syncLocalDumpsToServer()

        if (data.length > 0) {
          setDumps(data)
          // Build styles for initial set
          const initialMap = new Map<string, CardStyle>()
          data.forEach((d, i) => {
            const id = d.id || `${d.instagram}-${i}`
            initialMap.set(id, generateCardStyle(i))
          })
          setCardStyles(initialMap)
          saveLocalDumps(data)
        } else {
          const local = getLocalDumps()
          setDumps(local)
          // Build styles for local fallback
          const localMap = new Map<string, CardStyle>()
          local.forEach((d, i) => {
            const id = d.id || `${d.instagram}-${i}`
            localMap.set(id, generateCardStyle(i))
          })
          setCardStyles(localMap)
        }
      })
      .catch(() => {
        syncLocalDumpsToServer()
        const local = getLocalDumps()
        setDumps(local)
        const localMap = new Map<string, CardStyle>()
        local.forEach((d, i) => {
          const id = d.id || `${d.instagram}-${i}`
          localMap.set(id, generateCardStyle(i))
        })
        setCardStyles(localMap)
      })
  }, []) // Remove buildStyles from deps to only run once on mount

  // Realtime subscription for new dumps
  useEffect(() => {
    const sub = subscribeToDumps((type: 'INSERT' | 'DELETE', payload: any) => {
      if (type === 'DELETE') {
        setDumps((prev) => {
          const updated = prev.filter(d => d.id !== payload.id)
          saveLocalDumps(updated)
          return updated
        })
        return
      }

      const newDump = payload as ArcadeDump
      setDumps((prev) => {
        // Prevent duplicate if we already have this dump (from local optimistic update)
        if (prev.some(d => d.id === newDump.id || (d.instagram === newDump.instagram && (d as any).status === 'optimistic'))) {
          // If it was optimistic, replace it with the real one
          return prev.map(d => (d.instagram === newDump.instagram && (d as any).status === 'optimistic') ? newDump : d)
        }
        
        const updated = [newDump, ...prev].slice(0, 200)
        
        // Only generate style for the NEW card
        setCardStyles(prevStyles => {
          const next = new Map(prevStyles)
          const key = newDump.id || `${newDump.instagram}-new`
          if (!next.has(key)) {
            next.set(key, generateCardStyle(updated.length))
          }
          return next
        })
        
        saveLocalDumps(updated)
        return updated
      })
      
      const id = newDump.id || `${newDump.instagram}-new`
      markNew(id)
    })

    return () => { sub.unsubscribe() }
  }, [])

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

  // Global drag listeners
  useEffect(() => {
    if (!draggedId || !containerRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y

      // Convert delta px to %
      const deltaXPercent = (deltaX / rect.width) * 100
      const deltaYPercent = (deltaY / rect.height) * 100

      setCardStyles(prev => {
        const next = new Map(prev)
        const style = next.get(draggedId)
        if (style) {
          next.set(draggedId, {
            ...style,
            left: `${initialStylePos.left + deltaXPercent}%`,
            top: `${initialStylePos.top + deltaYPercent}%`
          })
        }
        return next
      })
    }

    const handleMouseUp = () => {
      setDraggedId(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [draggedId, dragStart, initialStylePos])

  const startDrag = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    const style = cardStyles.get(id)
    if (!style) return

    setDraggedId(id)
    setDragStart({ x: e.clientX, y: e.clientY })
    setInitialStylePos({
      left: parseFloat(style.left),
      top: parseFloat(style.top)
    })
    
    // Bring to front temporarily
    setCardStyles(prev => {
      const next = new Map(prev)
      const s = next.get(id)
      if (s) {
        next.set(id, { ...s, zIndex: 1000 })
      }
      return next
    })
  }

  const handleDrop = async () => {
    if (!dropInsta.trim()) return
    setDropping(true)

    const name = dropName.trim() || 'Anon'
    const instagram = dropInsta.trim().startsWith('@') ? dropInsta.trim() : `@${dropInsta.trim()}`
    const localId = `local-${Date.now()}`

    // Optimistic Update
    const newDump: ArcadeDump & { status?: string } = {
      id: localId,
      name,
      instagram,
      session_id: '',
      dropped_at: new Date().toISOString(),
      status: 'optimistic'
    }

    setDumps((prev) => {
      if (prev.some(d => d.instagram === instagram)) {
         setDropping(false)
         return prev // Don't allow duplicates of same handle in one session
      }
      const updated = [newDump, ...prev].slice(0, 200)
      
      setCardStyles(prevStyles => {
        const next = new Map(prevStyles)
        next.set(localId, generateCardStyle(updated.length))
        return next
      })

      saveLocalDumps(updated)
      return updated
    })
    markNew(localId)

    // Persist to Supabase
    try {
      await dropInstagram(name, instagram)
      // The Realtime subscription will replace our optimistic one
    } catch {
      // offline — local state is already updated
    }

    setDropping(false)
    setShowDropForm(false)
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // Optimistic remove
    setDumps((prev) => {
      const updated = prev.filter(d => d.id !== id)
      saveLocalDumps(updated)
      return updated
    })
    setSelectedCard(null)
    
    // Server delete
    try {
      await deleteDump(id)
    } catch {
      // offline fallback
    }
  }

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
      <div 
        className="dump-pit" 
        ref={containerRef}
        style={{ height: `${Math.max(600, Math.ceil(visibleDumps.length / 5) * 100 + 150)}px` }}
      >
        {visibleDumps.map((d, i) => {
          const key = d.id || `${d.instagram}-${i}`
          const style = cardStyles.get(key)
          const isNew = newCardIds.has(key)
          const isSelected = selectedCard?.id === d.id

          return (
            <div
              key={key}
              className={`dump-card ${isNew ? 'dump-card-new' : ''} ${isSelected ? 'dump-card-selected' : ''} ${draggedId === key ? 'dragging' : ''}`}
              style={{
                left: style?.left || '20%',
                top: style?.top || '20%',
                transform: `rotate(${style?.rotation || 0}deg)`,
                zIndex: isSelected || draggedId === key ? 999 : (style?.zIndex || i),
                animationDelay: isNew ? '0s' : `${(style?.delay || 0)}s`,
                cursor: draggedId === key ? 'grabbing' : 'grab'
              }}
              onClick={() => {
                if (!draggedId) setSelectedCard(isSelected ? null : d)
              }}
              onMouseDown={(e) => startDrag(e, key)}
              onMouseEnter={(e) => {
                if (!draggedId) (e.currentTarget as HTMLElement).style.zIndex = '500'
              }}
              onMouseLeave={(e) => {
                if (!isSelected && !draggedId) {
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
                  {d.session_id === sessionId && d.id && !d.id.startsWith('local-') && (
                    <button
                      className="dump-card-delete-btn"
                      onClick={(e) => handleDelete(d.id!, e)}
                    >
                      [ DELETE ]
                    </button>
                  )}
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
