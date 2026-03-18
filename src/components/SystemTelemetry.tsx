import { useState, useEffect } from 'react';

export default function SystemTelemetry() {
  const [players, setPlayers] = useState(1244);
  const [load, setLoad] = useState(42.5);
  const [uptime, setUptime] = useState(0); 
  const [registrations, setRegistrations] = useState(4092);

  // Active Players fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers(prev => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
        return Math.max(1200, prev + delta);
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Server Load fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setLoad(prev => {
        const delta = (Math.random() * 6 - 3); // change by up to 3%
        let newLoad = prev + delta;
        if (newLoad < 25) newLoad = 25;
        if (newLoad > 92) newLoad = 92;
        return Number(newLoad.toFixed(1));
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Uptime tick (fake base of 30 days)
  useEffect(() => {
    const baseSeconds = 30 * 24 * 60 * 60 + 5 * 60 * 60 + 12 * 60; 
    const startTime = Date.now() - baseSeconds * 1000;
    
    const interval = setInterval(() => {
      setUptime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Registrations ticking up slowly
  useEffect(() => {
    const interval = setInterval(() => {
      // 40% chance to happen every 3.5 seconds
      if (Math.random() > 0.6) {
        setRegistrations(prev => prev + 1);
      }
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / 86400);
    const hrs = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${days}D ${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.45rem', lineHeight: 1.5, minWidth: '220px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'rgba(255,255,255,0.7)' }}>&gt; ACTIVE PLAYERS:</span>
        <span style={{ color: 'var(--neon-blue)', textShadow: '0 0 5px var(--neon-blue)', transition: 'all 0.2s', fontVariantNumeric: 'tabular-nums' }}>
          {players.toLocaleString()}
        </span>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'rgba(255,255,255,0.7)' }}>&gt; REGISTRATIONS:</span>
        <span style={{ color: '#00ff88', textShadow: '0 0 5px #00ff88', transition: 'all 0.2s', fontVariantNumeric: 'tabular-nums' }}>
          {registrations.toLocaleString()}
        </span>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'rgba(255,255,255,0.7)' }}>&gt; SYS UPTIME:</span>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatUptime(uptime)}</span>
      </div>

      <div style={{ marginTop: '8px' }}>
        <div style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
          <span>&gt; SERVER LOAD:</span>
          <span style={{ 
            color: load > 80 ? 'var(--neon-pink)' : 'var(--neon-blue)',
            fontVariantNumeric: 'tabular-nums'
          }}>
            {load.toFixed(1)}%
          </span>
        </div>
        <div className="stat-bar" style={{ background: 'rgba(255, 255, 255, 0.1)', height: '10px' }}>
          <div 
            className="stat-bar-fill" 
            style={{ 
              width: `${load}%`, 
              background: load > 80 ? 'var(--neon-pink)' : 'var(--neon-blue)',
              boxShadow: load > 80 ? '0 0 10px var(--neon-pink)' : '0 0 10px var(--neon-blue)',
              transition: 'width 0.5s ease-out, background 0.3s'
            }}
          />
        </div>
      </div>
    </div>
  );
}
