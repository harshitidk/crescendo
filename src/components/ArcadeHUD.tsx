import { useState, useEffect, useRef, useCallback } from 'react'
import {
  getActivePlayers,
  getTotalTime,
  heartbeat,
  subscribeToSessions,
  subscribeToStats,
  getLocalTotalTime,
  saveLocalTotalTime,
  ensureGlobalStats,
  getRecentActivity,
  subscribeToActivity,
  type ArcadeSession,
} from '../lib/arcadeDB'
import './ArcadeHUD.css'

const RANKS = ["ROOKIE", "EXPLORER", "HACKER", "ARCHITECT", "LEGEND"]

function formatTime(totalSeconds: number): string {
  const d = Math.floor(totalSeconds / 86400)
  const h = Math.floor((totalSeconds % 86400) / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = Math.floor(totalSeconds % 60)
  if (d > 0) return `${d}d ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function ArcadeHUD() {
  // Global States (from DB)
  const [totalTime, setTotalTime] = useState(() => getLocalTotalTime())
  const [players, setPlayers] = useState<ArcadeSession[]>([])
  const [activityFeed, setActivityFeed] = useState<{id: string, message: string}[]>([])
  
  // Local Interactive States (Persisted for seamless continuing)
  const [xp, setXp] = useState(() => {
    return parseInt(localStorage.getItem('arcade_xp') || '0', 10)
  })
  const [tokens, setTokens] = useState(() => {
    return parseInt(localStorage.getItem('arcade_tokens') || '0', 10)
  })
  const [interactionHeat, setInteractionHeat] = useState(0) // 0 to 100
  const [combo, setCombo] = useState(1.0)
  
  const [collapsed, setCollapsed] = useState(false)

  // Save persisted stats automatically when they change
  useEffect(() => {
    localStorage.setItem('arcade_xp', xp.toString())
  }, [xp])

  useEffect(() => {
    localStorage.setItem('arcade_tokens', tokens.toString())
  }, [tokens])
  
  const heartbeatAccumulator = useRef(0)
  const lastActiveTime = useRef(Date.now())
  
  // Ref for animations
  const [xpChanged, setXpChanged] = useState(false)
  const [interactionActive, setInteractionActive] = useState(false)

  // Fetch initial data
  const refreshData = useCallback(async () => {
    try {
      await ensureGlobalStats()    
      const [p, t, activities] = await Promise.all([
        getActivePlayers(),
        getTotalTime(),
        getRecentActivity(3),
      ])
      setPlayers(p)
      setActivityFeed(activities)
      setTotalTime((prev) => {
        const best = Math.max(t, prev)
        saveLocalTotalTime(best)
        return best
      })
    } catch {
      // offline
    }
  }, [])

  useEffect(() => {
    refreshData()

    // Database Syncs
    const tickInterval = setInterval(() => {
      setTotalTime((prev) => {
        const next = prev + 1
        saveLocalTotalTime(next)
        return next
      })
      heartbeatAccumulator.current += 1
    }, 1000)

    const hbInterval = setInterval(async () => {
      const delta = heartbeatAccumulator.current
      heartbeatAccumulator.current = 0
      if (delta > 0) {
        try {
          await heartbeat(delta)
        } catch {
          heartbeatAccumulator.current += delta
        }
      }
    }, 5000)

    const refreshInterval = setInterval(refreshData, 15000)

    const sessionSub = subscribeToSessions(() => {
      getActivePlayers().then(setPlayers).catch(() => {})
    })
    const statsSub = subscribeToStats((newRow: { total_time: number }) => {
      if (newRow?.total_time) {
        setTotalTime((prev) => {
          const best = Math.max(newRow.total_time, prev)
          saveLocalTotalTime(best)
          return best
        })
      }
    })
    
    const activitySub = subscribeToActivity((newActivity: any) => {
      setActivityFeed((prev) => [newActivity, ...prev].slice(0, 3))
    })

    return () => {
      clearInterval(tickInterval)
      clearInterval(hbInterval)
      clearInterval(refreshInterval)
      sessionSub.unsubscribe()
      statsSub.unsubscribe()
      activitySub.unsubscribe()
    }
  }, [refreshData])

  // Local interaction tracking
  useEffect(() => {
    const handleActivity = (amount: number, type: 'scroll' | 'click' | 'move') => {
      lastActiveTime.current = Date.now()
      
      setInteractionActive(true)
      setTimeout(() => setInteractionActive(false), 200)

      setInteractionHeat(prev => Math.min(prev + amount, 100))
      
      if (type === 'click') {
        setXp(prev => prev + 15)
        setTokens(prev => prev + 1)
        setXpChanged(true)
        setTimeout(() => setXpChanged(false), 300)
      } else if (type === 'scroll') {
        setXp(prev => prev + 2)
      }
    }

    const onScroll = () => handleActivity(5, 'scroll')
    const onClick = () => handleActivity(20, 'click')
    const onMove = () => handleActivity(0.5, 'move')

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('click', onClick)
    window.addEventListener('mousemove', onMove)

    // Decoupled tick for Heat decay and Combo logic
    const logicTick = setInterval(() => {
      const now = Date.now()
      const idleTime = now - lastActiveTime.current

      // Heat drains quickly when idle
      setInteractionHeat(prev => Math.max(0, prev - 2))

      // Combo System
      if (idleTime > 3000) {
        // Reset combo if idle for 3s
        setCombo(1.0)
      } else {
        // Build combo continuously while active
        setCombo(prev => Math.min(prev + 0.05, 5.0))
      }

      // Automatically give tokens based on combo
      setTokens(prev => {
        if (Math.random() < 0.1 && idleTime < 1000) {
           return prev + 1
        }
        return prev
      })

    }, 200)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('click', onClick)
      window.removeEventListener('mousemove', onMove)
      clearInterval(logicTick)
    }
  }, [])

  // Calculate Rank
  const rankIndex = Math.min(Math.floor(xp / 1000), RANKS.length - 1)
  const currentRank = RANKS[rankIndex]
  const rankProgress = xp > 0 ? ((xp % 1000) / 1000) * 100 : 0

  if (collapsed) {
    return (
      <button className="hud-expand-btn" onClick={() => setCollapsed(false)} title="Open Arcade HUD">
        <span className="hud-expand-icon">🕹️</span>
        <span className="hud-expand-dot" />
      </button>
    )
  }

  return (
    <div className="arcade-hud floating-hud">
      {/* Top Border / Title & Live Feed */}
      <div className="hud-header">
        <div className="hud-title">LIVE TELEMETRY</div>
        
        <div className="hud-ticker-wrap">
          <div className="hud-ticker">
            {activityFeed.length > 0 ? activityFeed.map(act => (
              <span key={act.id || Math.random()} className="ticker-item">
                <span className="ticker-dot">•</span> {act.message}
              </span>
            )) : <span className="ticker-item text-cyan">AWAITING TRANSMISSION...</span>}
          </div>
        </div>

        <button className="hud-minimize" onClick={() => setCollapsed(true)}>—</button>
      </div>

      <div className="hud-grid">
        {/* GLOBAL ENERGY */}
        <div className="hud-stat-box highlight-box">
          <div className="stat-name">GLOBAL ENERGY</div>
          <div className="stat-big-val roll-text">{formatTime(totalTime)}</div>
          <div className="stat-sub">ACTIVE PLAYERS: <span className="pulse-text">{players.length}</span></div>
        </div>

        {/* EXPLORATION XP */}
        <div className={`hud-stat-box ${xpChanged ? 'glow-burst' : ''}`}>
          <div className="stat-name">EXPLORATION XP</div>
          <div className="stat-val text-pink">{Math.floor(xp).toLocaleString()}</div>
          <div className="hud-bar-bg"><div className="hud-bar-fill bg-pink" style={{ width: '100%' }}></div></div>
        </div>

        {/* INTERACTION HEAT */}
        <div className={`hud-stat-box ${interactionActive ? 'active-heat' : ''}`}>
          <div className="stat-name">HEAT</div>
          <div className="stat-val text-cyan">{Math.floor(interactionHeat)}%</div>
          <div className="hud-bar-bg"><div className="hud-bar-fill bg-cyan" style={{ width: `${interactionHeat}%` }}></div></div>
        </div>

        {/* FLOW COMBO */}
        <div className="hud-stat-box">
          <div className="stat-name">FLOW STATE</div>
          <div className={`stat-val text-orange ${combo > 2 ? 'combo-shake' : ''}`}>
            x{combo.toFixed(1)}
          </div>
          <div className="hud-bar-bg"><div className="hud-bar-fill bg-orange" style={{ width: `${(combo / 5) * 100}%` }}></div></div>
        </div>

        {/* CLASS & TOKENS */}
        <div className="hud-stat-box">
          <div className="stat-row">
            <div>
              <div className="stat-name">CLASS</div>
              <div className="stat-val text-neon">{currentRank}</div>
            </div>
            <div className="align-right">
              <div className="stat-name">TOKENS</div>
              <div className="stat-val text-yellow">{tokens}</div>
            </div>
          </div>
          <div className="hud-bar-bg"><div className="hud-bar-fill bg-neon" style={{ width: `${rankIndex === RANKS.length - 1 ? 100 : rankProgress}%` }}></div></div>
        </div>
      </div>
    </div>
  )
}
