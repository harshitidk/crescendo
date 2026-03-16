import { useState, useEffect } from 'react'
import './App.css'
const logoUrl = '/crescendo/logo.png'
const bikeUrl = '/crescendo/bike.png'

const RANKS = ["ROOKIE", "ACE", "VETERAN", "ELITE", "LEGEND"];

function App() {
  const [xp, setXp] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [rankIndex, setRankIndex] = useState(0);
  const [combo, setCombo] = useState(1);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const dist = Math.sqrt(
        Math.pow(e.clientX - lastPos.x, 2) + Math.pow(e.clientY - lastPos.y, 2)
      );
      
      if (dist > 0 && dist < 500) { // Filter out jumps
        setXp(prev => prev + Math.floor(dist / 10));
      }
      setLastPos({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => {
      setClicks(prev => prev + 1);
      // Temporary combo boost
      setCombo(prev => Math.min(prev + 0.1, 5));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleClick);
    };
  }, [lastPos]);

  // Handle Rank and Combo decay
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
          <button className="arcade-btn">Home</button>
          <button className="arcade-btn">About</button>
          <button className="arcade-btn">Events</button>
          <button className="arcade-btn">Contact</button>
          <button className="arcade-btn primary">Register</button>
        </nav>
      </header>

      <div className="stats-hud">
        <div className="stat-item">
          <span className="stat-label">EXP GAINED</span>
          <span className="stat-value">{xp.toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">CLICK POWER</span>
          <span className="stat-value">{clicks}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">COMBO</span>
          <span className="stat-value">X{combo.toFixed(1)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">RANK</span>
          <span className="stat-value" style={{ color: '#bc00ff' }}>{RANKS[rankIndex]}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">HIGH SCORE</span>
          <span className="stat-value">99,999</span>
        </div>
      </div>
    </div>
  )
}

export default App
