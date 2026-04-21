import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, Navigation } from 'lucide-react';
import './PromPage.css';

export default function PromPage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleReturn = () => {
    setIsLoaded(false);
    setTimeout(() => navigate('/'), 600); // Wait for exit animation
  };

  return (
    <div className={`prom-world ${isLoaded ? 'active' : ''}`}>
      {/* Background Layers */}
      <div className="prom-bg-gradient" />
      <div className="prom-bg-vignette" />
      
      {/* Arcade Integration faint grid */}
      <div className="prom-arcade-grid" />
      <div className="prom-scanlines" />

      {/* Floating Elements (CSS animated) */}
      <div className="prom-particles">
        {[...Array(20)].map((_, i) => (
          <div key={`heart-${i}`} className="prom-floating-heart" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 15}s`,
            opacity: 0.1 + Math.random() * 0.4,
            transform: `scale(${0.5 + Math.random() * 0.8})`
          }}>
            <Heart fill="currentColor" />
          </div>
        ))}
        {[...Array(30)].map((_, i) => (
          <div key={`sparkle-${i}`} className="prom-sparkle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${2 + Math.random() * 4}s`
          }} />
        ))}
        <div className="prom-cupid-arrow" />
      </div>

      {/* Content */}
      <div className="prom-content-wrapper">
        <button className="prom-return-btn" onClick={handleReturn}>
          &lt; RETURN TO ARCADE
        </button>

        <header className="prom-hero">
          <div className="prom-title-container">
            <h1 className="prom-title">
              <span className="prom-title-glow">PROM NIGHT</span>
              <span className="prom-title-glitch" data-text="PROM NIGHT">PROM NIGHT</span>
            </h1>
          </div>
          <p className="prom-tagline">
            Find your moment <span className="highlight-text">beyond the game</span>.
          </p>
        </header>

        <div className="prom-registration-container">
          {/* SSCBS Students Entry */}
          <div className="prom-reg-card insider-card">
            <div className="prom-card-bg-glow" />
            <div className="prom-card-content">
              <div className="prom-card-icon">
                <Sparkles size={32} />
              </div>
              <h2 className="prom-card-title">SSCBS Entry</h2>
              <p className="prom-card-desc">For CBS insiders only. Access the exclusive experience.</p>
              
              <button 
                className="prom-cta-btn" 
                onClick={() => window.open('https://forms.gle/hY3BrNTPDseCUJYM9', '_blank')}
              >
                Register as CBS Student
                <Navigation size={16} className="btn-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
