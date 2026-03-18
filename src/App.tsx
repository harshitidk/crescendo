import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStoredUser } from './lib/arcadeDB'
import './App.css'
const logoUrl = '/logo.png'
const bikeUrl = '/bike.png'
const cityBgUrl = '/city-bg.jpg'

const ArcadeWindow = ({ title, children, style, isClosed, onClose }: { title: string, children: React.ReactNode, style?: any, isClosed?: boolean, onClose?: () => void }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  if (isClosed) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="arcade-window" style={{ ...style, transform: `translate(${position.x}px, ${position.y}px)`, zIndex: isDragging ? 2000 : (style?.zIndex || undefined) }}>
      <div 
        className="window-title-bar"
        style={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <span>{title}</span>
        <span 
          style={{ cursor: 'pointer' }}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onClose?.(); }}
        >
          [X]
        </span>
      </div>
      <div className="window-content">
        {children}
      </div>
    </div>
  );
};

function App() {
  const [gameStarted, setGameStarted] = useState(() => sessionStorage.getItem('arcade_started') === 'true');
  const [winStates, setWinStates] = useState({ schedule: false, telemetry: false, sysinfo: false });
  const navigate = useNavigate();

  const handleStartGame = () => {
    setGameStarted(true);
    sessionStorage.setItem('arcade_started', 'true');
  };

  const anyClosed = Object.values(winStates).some(v => v);
  const restoreWindows = () => setWinStates({ schedule: false, telemetry: false, sysinfo: false });

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
          {/* Background image */}
          <div className="start-bg" style={{ backgroundImage: `url(${cityBgUrl})` }} />
          <div className="start-bg-overlay" />
          <div className="start-grid-bg" />
          <div className="start-scanlines" />

          {/* Corner brackets */}
          <div className="start-corner start-tl" />
          <div className="start-corner start-tr" />
          <div className="start-corner start-bl" />
          <div className="start-corner start-br" />

          {/* Content */}
          <div className="start-content">
            <img src={logoUrl} alt="Crescendo" className="start-logo" />
            <p className="start-tagline">THE ANNUAL CULTURAL FEST OF SSCBS</p>

            <div className="start-divider">
              <span className="start-divider-line" />
              <span className="start-divider-text">SEASON 2.0</span>
              <span className="start-divider-line" />
            </div>

            <div className="hi-score-display">HI-SCORE: 999,999</div>

            <button className="start-btn" onClick={handleStartGame}>
              <span className="start-btn-icon">▶</span> ENTER ARCADE
            </button>

            <div className="start-status">
              <div className="start-status-row">
                <span className="start-status-dot online" />
                SYSTEM: STABLE
              </div>
              <div className="start-status-row">
                <span className="start-status-dot online" />
                NETWORK: ONLINE
              </div>
            </div>
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
        {(() => {
          const u = getStoredUser();
          return u ? (
            <div className="player-badge">
              <span className="player-badge-icon">◆</span>
              <span className="player-badge-name">{u.name.toUpperCase()}</span>
            </div>
          ) : null;
        })()}
        
        <nav className="arcade-nav">
          <button className="arcade-btn">HOME</button>
          <button className="arcade-btn">ABOUT</button>
          <button className="arcade-btn">EVENTS</button>
          <button className="arcade-btn">CONTACT</button>
          <button className="arcade-btn primary">REGISTER</button>
          <button className="arcade-btn" onClick={() => navigate('/dump')} style={{ borderColor: 'var(--neon-purple)', color: 'var(--neon-purple)', textShadow: '0 0 5px var(--neon-purple)' }}>DUMP</button>
        </nav>
      </header>

      {gameStarted && (
        <>
          {anyClosed && (
            <button 
              className="arcade-btn" 
              style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 1000, padding: '10px 20px', fontSize: '0.45rem', borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)' }} 
              onClick={restoreWindows}
            >
              RESTORE WINDOWS
            </button>
          )}

          <div className="schedule-win">
            <ArcadeWindow 
              title="MISSION SCHEDULE" 
              style={{ top: '22%', left: '4%' }}
              isClosed={winStates.schedule}
              onClose={() => setWinStates({ ...winStates, schedule: true })}
            >
              <p>&gt; 10:00 - OPENING CEREMONY</p>
              <p>&gt; 12:00 - PIXEL BATTLE v1.2</p>
              <p>&gt; 15:00 - NEON CONCERT [LIVE]</p>
              <div className="stat-bar"><div className="stat-bar-fill" style={{ width: '65%' }}></div></div>
            </ArcadeWindow>
          </div>

          <div className="telemetry-win">
            <ArcadeWindow 
              title="SYSTEM TELEMETRY" 
              style={{ top: '22%', right: '4%' }}
              isClosed={winStates.telemetry}
              onClose={() => setWinStates({ ...winStates, telemetry: true })}
            >
              <p>&gt; ACTIVE PLAYERS: 1,244</p>
              <p>&gt; PKT LOSS: 0.02%</p>
              <p>&gt; STAGE: FINAL LEVEL</p>
              <div className="stat-bar"><div className="stat-bar-fill" style={{ width: '88%', background: 'var(--neon-blue)' }}></div></div>
            </ArcadeWindow>
          </div>

          {/* System Information Box (Ref 1 inspired) */}
          <div className="system_info_win">
            <ArcadeWindow 
              title="SYSTEM INFO" 
              style={{ bottom: '15%', right: '4%', minWidth: '200px' }}
              isClosed={winStates.sysinfo}
              onClose={() => setWinStates({ ...winStates, sysinfo: true })}
            >
              <div style={{ fontSize: '0.45rem' }}>
                <p>// LOC: SECTOR 7G</p>
                <p>// ID: CRESCENDO_MAIN</p>
                <p>// POP: 15,200</p>
                <div style={{ marginTop: '10px', height: '2px', background: 'rgba(255,255,255,0.2)' }}></div>
                <p style={{ marginTop: '5px', color: 'var(--neon-pink)' }}>STATUS: OPERATIONAL</p>
              </div>
            </ArcadeWindow>
          </div>
        </>
      )}
    </div>
  )
}

export default App
