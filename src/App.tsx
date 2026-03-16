import { useState, useEffect } from 'react'
import './App.css'
const logoUrl = '/crescendo/logo.png'
const bikeUrl = '/crescendo/bike.png'

const RANKS = ["ROOKIE", "ACE", "VETERAN", "ELITE", "LEGEND"];

const ArcadeWindow = ({ title, children, style }: { title: string, children: React.ReactNode, style?: any }) => (
  <div className="arcade-window" style={style}>
    <div className="window-title-bar">
      <span>{title}</span>
      <span>[X]</span>
    </div>
    <div className="window-content">
      {children}
    </div>
  </div>
);

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [xp, setXp] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [rankIndex, setRankIndex] = useState(0);
  const [combo, setCombo] = useState(1);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!gameStarted) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dist = Math.sqrt(
        Math.pow(e.clientX - lastPos.x, 2) + Math.pow(e.clientY - lastPos.y, 2)
      );
      
      if (dist > 0 && dist < 500) {
        setXp(prev => prev + Math.floor(dist / 10));
      }
      setLastPos({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => {
      setClicks(prev => prev + 1);
      setCombo(prev => Math.min(prev + 0.1, 5));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleClick);
    };
  }, [lastPos, gameStarted]);

  useEffect(() => {
    const newRank = Math.min(Math.floor(xp / 1000), RANKS.length - 1);
    setRankIndex(newRank);

    const decayTimer = setInterval(() => {
      setCombo(prev => Math.max(1, prev - 0.05));
    }, 100);

    return () => clearInterval(decayTimer);
  }, [xp]);

  return (
    <div className="container">
      {/* Screen Bezel (Ref 1 inspired) */}
      <div className="screen-bezel">
        <div className="bezel-text top-left-info">SYS_OS // REV: 2.0.4</div>
        <div className="bezel-text top-right-info">RCS: NOACHIS_QUADRANGLE</div>
        <div className="bezel-text bottom-left-info">CORD: 34.0522 N / 118.2437 W</div>
      </div>

      {!gameStarted && (
        <div className="start-screen">
          <div className="hi-score-display">HI-SCORE: 999,999</div>
          <h2 className="ready-prompt">ARE YOU READY?</h2>
          <button className="start-btn" onClick={() => setGameStarted(true)}>
            START GAME
          </button>
          <div style={{ marginTop: '40px', fontSize: '0.45rem', opacity: 0.6, letterSpacing: '2px' }}>
            [ SYSTEM CHECK: STABLE ]<br/>
            [ NETWORK STATUS: ONLINE ]
          </div>
        </div>
      )}

      <div className="crt-overlay"></div>
      
      <div className="scene-container">
        <div className="background-scroller">
          <div className="bg-part"></div>
          <div className="bg-part blended"></div>
        </div>
        <div className="bike-container">
          <img src={bikeUrl} alt="Bike" className="bike-img" />
        </div>
      </div>

      <header className="header">
        <img src={logoUrl} alt="Logo" className="logo-img" />
        <p className="tagline">The annual cultural fest of SSCBS</p>
        
        <nav className="arcade-nav">
          <button className="arcade-btn">HOME</button>
          <button className="arcade-btn">ABOUT</button>
          <button className="arcade-btn">EVENTS</button>
          <button className="arcade-btn">CONTACT</button>
          <button className="arcade-btn primary">REGISTER</button>
        </nav>
      </header>

      {gameStarted && (
        <>
          <div className="schedule-win">
            <ArcadeWindow title="MISSION SCHEDULE" style={{ top: '22%', left: '4%' }}>
              <p>&gt; 10:00 - OPENING CEREMONY</p>
              <p>&gt; 12:00 - PIXEL BATTLE v1.2</p>
              <p>&gt; 15:00 - NEON CONCERT [LIVE]</p>
              <div className="stat-bar"><div className="stat-bar-fill" style={{ width: '65%' }}></div></div>
            </ArcadeWindow>
          </div>

          <div className="telemetry-win">
            <ArcadeWindow title="SYSTEM TELEMETRY" style={{ top: '22%', right: '4%' }}>
              <p>&gt; ACTIVE PLAYERS: 1,244</p>
              <p>&gt; PKT LOSS: 0.02%</p>
              <p>&gt; STAGE: FINAL LEVEL</p>
              <div className="stat-bar"><div className="stat-bar-fill" style={{ width: '88%', background: 'var(--neon-blue)' }}></div></div>
            </ArcadeWindow>
          </div>

          {/* System Information Box (Ref 1 inspired) */}
          <div className="system_info_win">
            <div className="arcade-window" style={{ bottom: '15%', right: '4%', minWidth: '200px' }}>
               <div className="window-title-bar"><span>SYSTEM INFO</span></div>
               <div className="window-content" style={{ fontSize: '0.45rem' }}>
                  <p>// LOC: SECTOR 7G</p>
                  <p>// ID: CRESCENDO_MAIN</p>
                  <p>// POP: 15,200</p>
                  <div style={{ marginTop: '10px', height: '2px', background: 'rgba(255,255,255,0.2)' }}></div>
                  <p style={{ marginTop: '5px', color: 'var(--neon-pink)' }}>STATUS: OPERATIONAL</p>
               </div>
            </div>
          </div>
        </>
      )}

      <div className="stats-hud">
        <div className="stat-item">
          <span className="stat-label">EXPL EXP</span>
          <span className="stat-value">{xp.toLocaleString()}</span>
          <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${Math.min((xp/10000)*100, 100)}%` }}></div></div>
        </div>
        <div className="stat-item">
          <span className="stat-label">CLICK PWR</span>
          <span className="stat-value">{clicks}</span>
          <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${Math.min((clicks/100)*100, 100)}%`, background: 'var(--neon-blue)' }}></div></div>
        </div>
        <div className="stat-item">
          <span className="stat-label">COMBO</span>
          <span className="stat-value">X{combo.toFixed(1)}</span>
          <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${(combo/5)*100}%`, background: 'var(--arcade-orange)' }}></div></div>
        </div>
        <div className="stat-item">
          <span className="stat-label">CLASS</span>
          <span className="stat-value" style={{ color: '#00f2ff' }}>{RANKS[rankIndex]}</span>
          <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${((rankIndex+1)/RANKS.length)*100}%` }}></div></div>
        </div>
        <div className="stat-item">
          <span className="stat-label">CREDITS</span>
          <span className="stat-value" style={{ color: '#ff9d00' }}>02</span>
          <div className="stat-bar"><div className="stat-bar-fill" style={{ width: '40%' }}></div></div>
        </div>
      </div>
    </div>
  )
}

export default App
