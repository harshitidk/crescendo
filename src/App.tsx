import { useState, useEffect } from 'react'
import './App.css'
import logoUrl from './assets/logo.png'
import bikeUrl from './assets/bike.png'

interface StatProps {
  label: string;
  targetValue: number;
}

const StatCounter = ({ label, targetValue }: StatProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = targetValue;
    if (start === end) return;

    let totalMiliseconds = 2000;
    let incrementTime = (totalMiliseconds / end) > 10 ? (totalMiliseconds / end) : 10;

    let timer = setInterval(() => {
      start += Math.ceil(end / 100);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [targetValue]);

  return (
    <div className="stat-item">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{count.toLocaleString()}</span>
    </div>
  );
};

function App() {
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
        <StatCounter label="Total Visitors" targetValue={12400} />
        <StatCounter label="Games Played" targetValue={8530} />
        <StatCounter label="Registrations" targetValue={3200} />
        <StatCounter label="Active Players" targetValue={152} />
        <StatCounter label="Top Score" targetValue={99999} />
      </div>
    </div>
  )
}

export default App
