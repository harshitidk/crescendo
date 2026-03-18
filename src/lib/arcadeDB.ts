import { supabase } from './supabase'

// ─── Types ───────────────────────────────────────────────────────
export interface ArcadeSession {
  id?: string
  name: string
  instagram?: string
  session_id: string
  joined_at?: string
  last_active?: string
  time_spent: number // seconds
}

export interface ArcadeDump {
  id?: string
  name: string
  instagram: string
  dropped_at?: string
  session_id: string
}

export interface ArcadeStats {
  id?: string
  total_time: number // cumulative seconds from all users
}

// ─── Local persistence keys ──────────────────────────────────────
const LOCAL_TOTAL_TIME_KEY = 'arcade_global_total_time'
const LOCAL_TOTAL_TIME_TIMESTAMP_KEY = 'arcade_total_time_last_sync'

// ─── Session helpers ─────────────────────────────────────────────
function getSessionId(): string {
  let sid = localStorage.getItem('arcade_session_id')
  if (!sid) {
    sid = crypto.randomUUID()
    localStorage.setItem('arcade_session_id', sid)
  }
  return sid
}

export function getStoredUser(): { name: string; instagram?: string } | null {
  const raw = localStorage.getItem('arcade_user')
  return raw ? JSON.parse(raw) : null
}

export function storeUser(name: string, instagram?: string) {
  localStorage.setItem('arcade_user', JSON.stringify({ name, instagram }))
}

// ─── Local timer persistence ─────────────────────────────────────
// Stores the global cumulative timer in localStorage so it survives
// page refreshes even when Supabase is unavailable
export function getLocalTotalTime(): number {
  const stored = localStorage.getItem(LOCAL_TOTAL_TIME_KEY)
  if (!stored) return 0
  
  const savedTime = parseInt(stored, 10) || 0
  
  // Calculate how much time has passed since last sync
  // (this handles the case where user has the page open but we haven't synced)
  const lastTimestamp = localStorage.getItem(LOCAL_TOTAL_TIME_TIMESTAMP_KEY)
  if (lastTimestamp) {
    const elapsed = Math.floor((Date.now() - parseInt(lastTimestamp, 10)) / 1000)
    // Only add elapsed time if it's reasonable (< 5 minutes means user was still active)
    // For longer gaps, we don't add — they weren't actively browsing
    if (elapsed > 0 && elapsed < 300) {
      return savedTime + elapsed
    }
  }
  
  return savedTime
}

export function saveLocalTotalTime(totalTime: number) {
  localStorage.setItem(LOCAL_TOTAL_TIME_KEY, String(Math.floor(totalTime)))
  localStorage.setItem(LOCAL_TOTAL_TIME_TIMESTAMP_KEY, String(Date.now()))
}

// ─── Join / heartbeat / leave ────────────────────────────────────
export async function joinArcade(name: string, instagram?: string) {
  const session_id = getSessionId()
  storeUser(name, instagram)

  // Upsert session row
  const { error } = await supabase.from('arcade_sessions').upsert(
    {
      session_id,
      name,
      instagram: instagram || null,
      joined_at: new Date().toISOString(),
      last_active: new Date().toISOString(),
      time_spent: 0,
    },
    { onConflict: 'session_id' }
  )

  if (error) {
    console.warn('arcade_sessions upsert failed:', error.message)
  }

  // Log activity
  await logActivity(`${name} joined`)

  return session_id
}

export async function heartbeat(deltaSeconds: number): Promise<boolean> {
  const session_id = getSessionId()
  
  // Try the RPC function first
  const { error: rpcError } = await supabase.rpc('arcade_heartbeat', {
    p_session_id: session_id,
    p_delta: deltaSeconds,
  })
  
  if (rpcError) {
    // RPC doesn't exist yet — do manual updates
    console.warn('arcade_heartbeat RPC failed, using manual fallback:', rpcError.message)
    
    // Update session last_active + time_spent
    const { error: sessionError } = await supabase
      .from('arcade_sessions')
      .update({
        last_active: new Date().toISOString()
      })
      .eq('session_id', session_id)
    
    if (sessionError) {
      console.warn('Session update failed:', sessionError.message)
    }

    // Increment global total_time
    const { data: currentStats } = await supabase
      .from('arcade_stats')
      .select('total_time')
      .eq('id', 'global')
      .single()
    
    if (currentStats) {
      const newTotal = (currentStats.total_time || 0) + deltaSeconds
      await supabase
        .from('arcade_stats')
        .update({ total_time: newTotal })
        .eq('id', 'global')
      
      saveLocalTotalTime(newTotal)
      return true
    }
    
    return false
  }
  
  return true // RPC succeeded
}

export async function leaveArcade() {
  const session_id = getSessionId()
  await supabase
    .from('arcade_sessions')
    .delete()
    .eq('session_id', session_id)
}

// ─── Active players ──────────────────────────────────────────────
export async function getActivePlayers() {
  // Players active in last 30 seconds
  const cutoff = new Date(Date.now() - 30_000).toISOString()
  const { data, error } = await supabase
    .from('arcade_sessions')
    .select('*')
    .gte('last_active', cutoff)
    .order('last_active', { ascending: false })
  
  if (error) {
    console.warn('getActivePlayers failed:', error.message)
    return []
  }
  return (data || []) as ArcadeSession[]
}

// ─── Total cumulative time ───────────────────────────────────────
export async function getTotalTime(): Promise<number> {
  const { data, error } = await supabase
    .from('arcade_stats')
    .select('total_time')
    .eq('id', 'global')
    .single()
  
  if (error || !data) {
    console.warn('getTotalTime failed, using local:', error?.message)
    return getLocalTotalTime()
  }
  
  const serverTime = data.total_time || 0
  
  // Always take the max of server vs local (in case local has accumulated more)
  const localTime = getLocalTotalTime()
  const bestTime = Math.max(serverTime, localTime)
  
  // Sync back
  saveLocalTotalTime(bestTime)
  
  return bestTime
}

// ─── Ensure global stats row exists ──────────────────────────────
export async function ensureGlobalStats() {
  const { data } = await supabase
    .from('arcade_stats')
    .select('id')
    .eq('id', 'global')
    .single()
  
  if (!data) {
    // Create the global row with current local time as seed
    const localTime = getLocalTotalTime()
    await supabase
      .from('arcade_stats')
      .upsert({ id: 'global', total_time: localTime }, { onConflict: 'id' })
  }
}

// ─── Dump (Instagram pile) ───────────────────────────────────────
export async function dropInstagram(name: string, instagram: string) {
  const session_id = getSessionId()
  const { error } = await supabase.from('arcade_dumps').insert({
    name,
    instagram,
    session_id,
    dropped_at: new Date().toISOString(),
  })
  if (error) {
    console.warn('dropInstagram failed:', error.message)
  }
  await logActivity(`${name} dropped a tag`)
}

export async function getDumps() {
  const { data, error } = await supabase
    .from('arcade_dumps')
    .select('*')
    .order('dropped_at', { ascending: false })
    .limit(200)
  
  if (error) {
    console.warn('getDumps failed:', error.message)
    return []
  }
  return (data || []) as ArcadeDump[]
}

// ─── Activity feed ───────────────────────────────────────────────
export async function logActivity(message: string) {
  const { error } = await supabase.from('arcade_activity').insert({
    message,
    created_at: new Date().toISOString(),
  })
  if (error) {
    console.warn('logActivity failed:', error.message)
  }
}

export async function getRecentActivity(limit = 8) {
  const { data, error } = await supabase
    .from('arcade_activity')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.warn('getRecentActivity failed:', error.message)
    return []
  }
  return data || []
}

// ─── Realtime subscriptions ──────────────────────────────────────
export function subscribeToSessions(callback: () => void) {
  return supabase
    .channel('arcade_sessions_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'arcade_sessions' },
      callback
    )
    .subscribe()
}

export function subscribeToActivity(callback: (payload: any) => void) {
  return supabase
    .channel('arcade_activity_changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'arcade_activity' },
      (payload) => callback(payload.new)
    )
    .subscribe()
}

export function subscribeToDumps(callback: (payload: any) => void) {
  return supabase
    .channel('arcade_dumps_changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'arcade_dumps' },
      (payload) => callback(payload.new)
    )
    .subscribe()
}

export function subscribeToStats(callback: (payload: any) => void) {
  return supabase
    .channel('arcade_stats_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'arcade_stats' },
      (payload) => callback(payload.new)
    )
    .subscribe()
}
