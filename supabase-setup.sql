-- ═══════════════════════════════════════════════════
-- ARCADE LAYER — Supabase Database Setup
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════

-- 1. Active sessions (tracked players on the site)
CREATE TABLE IF NOT EXISTS arcade_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  instagram TEXT,
  joined_at TIMESTAMPTZ DEFAULT now(),
  last_active TIMESTAMPTZ DEFAULT now(),
  time_spent INTEGER DEFAULT 0
);

-- 2. Global stats (cumulative playtime counter)
CREATE TABLE IF NOT EXISTS arcade_stats (
  id TEXT PRIMARY KEY DEFAULT 'global',
  total_time INTEGER DEFAULT 0
);

-- Insert the global row
INSERT INTO arcade_stats (id, total_time) VALUES ('global', 0)
ON CONFLICT (id) DO NOTHING;

-- 3. Instagram dump pile
CREATE TABLE IF NOT EXISTS arcade_dumps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  instagram TEXT NOT NULL,
  session_id TEXT,
  dropped_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Activity feed
CREATE TABLE IF NOT EXISTS arcade_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Heartbeat RPC function
-- Updates last_active, increments session time_spent, and increments global total_time
CREATE OR REPLACE FUNCTION arcade_heartbeat(p_session_id TEXT, p_delta INTEGER)
RETURNS VOID AS $$
BEGIN
  -- Update session
  UPDATE arcade_sessions
  SET last_active = now(),
      time_spent = time_spent + p_delta
  WHERE session_id = p_session_id;

  -- Increment global total
  UPDATE arcade_stats
  SET total_time = total_time + p_delta
  WHERE id = 'global';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Enable Realtime on all arcade tables
ALTER PUBLICATION supabase_realtime ADD TABLE arcade_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE arcade_stats;
ALTER PUBLICATION supabase_realtime ADD TABLE arcade_dumps;
ALTER PUBLICATION supabase_realtime ADD TABLE arcade_activity;

-- 7. RLS Policies (permissive for arcade — public read/write)
ALTER TABLE arcade_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE arcade_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE arcade_dumps ENABLE ROW LEVEL SECURITY;
ALTER TABLE arcade_activity ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to do everything on arcade tables
CREATE POLICY "arcade_sessions_public" ON arcade_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "arcade_stats_public" ON arcade_stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "arcade_dumps_public" ON arcade_dumps FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "arcade_activity_public" ON arcade_activity FOR ALL USING (true) WITH CHECK (true);

-- 8. Auto-cleanup: Remove sessions older than 5 minutes (optional cron)
-- You can set this up via Supabase's pg_cron extension:
-- SELECT cron.schedule('cleanup-stale-sessions', '*/5 * * * *',
--   $$DELETE FROM arcade_sessions WHERE last_active < now() - interval '5 minutes'$$
-- );
