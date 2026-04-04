import { useState } from 'react';
import { Gamepad2, Coins, Heart, Shield, Zap, Target, Users, Map, Star } from 'lucide-react';
import './AboutPage.css';

const MOCK_MAP_NODES = [
  { id: 1, title: '70+ EVENTS', x: 20, y: 30, icon: <Target size={24} /> },
  { id: 2, title: '150+ COLLEGES', x: 70, y: 50, icon: <Map size={24} /> },
  { id: 3, title: '8000+ PLAYERS', x: 40, y: 70, icon: <Users size={24} /> },
];

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  };

  const scrollToNext = () => {
    const el = document.querySelector('.about-game-world');
    if (el) {
      el.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <div className="about-game-world" onScroll={handleScroll}>
      {/* 1. Hero Section */}
      <section className="about-level hero-level">
        <div className="clouds-bg" style={{ transform: `translateX(${scrollY * 0.2}px)` }}></div>
        <div className="hero-content" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
          <h2 className="blinking-text">INSERT COIN TO ENTER</h2>
          <h1 className="retro-title">WELCOME TO CRESCENDO</h1>
          <div className="floating-coins">
            <Coins className="pixel-coin anim-bounce1" size={48} />
            <Coins className="pixel-coin anim-bounce2" size={48} />
            <Coins className="pixel-coin anim-bounce3" size={48} />
          </div>
          <button className="start-game-btn" onClick={scrollToNext}>
            START GAME
          </button>
        </div>
      </section>

      {/* 2. Level 01 - The Arena */}
      <section className="about-level arena-level">
        <div className="level-header">
          <span className="level-badge">LVL 01</span>
          <h2>THE ARENA</h2>
          <p className="subtitle">Enter the ultimate festival map</p>
        </div>
        
        <div className="map-container">
          {MOCK_MAP_NODES.map((node, i) => (
            <div key={node.id} className="map-node" style={{ left: `${node.x}%`, top: `${node.y}%`, animationDelay: `${i * 0.3}s` }}>
              <div className="node-icon">{node.icon}</div>
              <div className="node-label">{node.title}</div>
            </div>
          ))}
          <div className="pathing-line"></div>
        </div>
      </section>

      {/* 3. Level 02 - The System (SSCBS) */}
      <section className="about-level system-level">
        <div className="level-header">
          <span className="level-badge">LVL 02</span>
          <h2>THE SYSTEM: SSCBS</h2>
          <p className="subtitle">Powered by the ultimate engine</p>
        </div>

        <div className="system-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <Zap size={20} /> CORE PROCESSOR
            </div>
            <div className="stat-card-body">
              <h3>TOP 1%</h3>
              <p>Selection Ratio 1:140</p>
            </div>
            <div className="stat-card-footer">
              <span className="xp-label">INTELLIGENCE</span>
              <div className="xp-bar"><div className="xp-fill w-100"></div></div>
              <span className="xp-value">+100</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <Target size={20} /> DIFFICULTY
            </div>
            <div className="stat-card-body">
              <h3>HARDCORE</h3>
              <p>Rank 1 B-School</p>
            </div>
            <div className="stat-card-footer">
              <span className="xp-label">COMPETITION</span>
              <div className="xp-bar"><div className="xp-fill w-MAX"></div></div>
              <span className="xp-value">+200</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Player Stats */}
      <section className="about-level stats-level">
        <h2 className="section-title">GLOBAL LEADERBOARD</h2>
        <div className="stats-hud-wrapper">
          <div className="hud-metric">
            <Heart size={32} className="hud-icon pulse" />
            <div className="hud-data">
              <span className="hud-num count-up">20K+</span>
              <span className="hud-lbl">FOOTFALL</span>
            </div>
          </div>
          <div className="hud-metric">
            <Star size={32} className="hud-icon spin" />
            <div className="hud-data">
              <span className="hud-num count-up">2CR+</span>
              <span className="hud-lbl">REACH</span>
            </div>
          </div>
          <div className="hud-metric">
            <Shield size={32} className="hud-icon float" />
            <div className="hud-data">
              <span className="hud-num count-up">150+</span>
              <span className="hud-lbl">COLLEGES</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Level 03 - Why Play */}
      <section className="about-level play-level">
        <div className="level-header">
          <span className="level-badge">LVL 03</span>
          <h2>WHY PLAY?</h2>
          <p className="subtitle">The ultimate quest rewards</p>
        </div>

        <div className="memory-cards-container">
          <div className="memory-card">
            <div className="card-face front-face">NETWORKING</div>
            <div className="card-face back-face">Connect with the elite bosses of tomorrow.</div>
          </div>
          <div className="memory-card">
            <div className="card-face front-face">EXPOSURE</div>
            <div className="card-face back-face">Unlock achievements recognized globally.</div>
          </div>
          <div className="memory-card">
            <div className="card-face front-face">COMPETITION</div>
            <div className="card-face back-face">Test your builds in true PvP domains.</div>
          </div>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="about-level cta-level">
        <h2 className="glitch-text" data-text="READY PLAYER?">READY PLAYER?</h2>
        <button className="final-action-btn">
          <span>JOIN THE ARENA</span>
          <Gamepad2 size={24} className="btn-icon" />
        </button>
      </section>
    </div>
  );
}
