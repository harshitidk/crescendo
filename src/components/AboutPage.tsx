import { useState, useEffect, useRef } from 'react';
import { Gamepad2, Zap, Target, Users, Star, Shield, Trophy, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AboutPage.css';

/* ── Animated Counter Hook ── */
function useCounter(end: number, duration: number = 2000, trigger: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [trigger, end, duration]);
  return count;
}

/* ── Intersection Observer Hook ── */
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function AboutPage() {
  const navigate = useNavigate();
  const statsObserver = useInView(0.4);

  const footfall = useCounter(20000, 2000, statsObserver.inView);
  const reach = useCounter(200, 1800, statsObserver.inView);
  const colleges = useCounter(150, 1600, statsObserver.inView);
  const events = useCounter(70, 1400, statsObserver.inView);

  const scrollToLevel = () => {
    const el = document.querySelector('.about-page-root');
    if (el) el.scrollTo({ top: window.innerHeight * 0.85, behavior: 'smooth' });
  };

  return (
    <div className="about-page-root">
      <div className="about-bg-ambient" />

      {/* ═══════════ 1. HERO — ENTRY SCREEN ═══════════ */}
      <section className="about-hero">
        <div className="hero-hud-bar">
          <span className="hud-chip">SYS://ABOUT_MODULE</span>
          <span className="hud-chip">STATUS: <span className="text-green">ONLINE</span></span>
        </div>

        <div className="hero-center">
          <div className="hero-badge">THE ANNUAL CULTURAL FEST OF SSCBS, UNIVERSITY OF DELHI</div>
          <h1 className="hero-headline">WELCOME TO<br/><span className="hero-accent">CRESCENDO</span></h1>
          <p className="hero-tagline">
            Delhi's premier multi-domain college festival — where business, culture, creativity, and technology 
            converge into one electrifying experience.
          </p>
          <button className="hero-cta" onClick={scrollToLevel}>
            <span className="cta-blink">▶</span> START EXPLORATION
          </button>
        </div>

        <div className="hero-scroll-hint">
          <div className="scroll-line" />
          <span>SCROLL TO EXPLORE</span>
        </div>
      </section>

      {/* ═══════════ 2. LEVEL 01 — WHAT IS CRESCENDO ═══════════ */}
      <section className="about-section">
        <div className="level-tag">
          <span className="level-num">01</span>
          <span className="level-title">WHAT IS CRESCENDO</span>
        </div>

        <div className="content-split">
          <div className="content-text">
            <h2 className="section-headline">The Arena Where<br/>Talent Meets Opportunity</h2>
            <p className="section-body">
              Crescendo is the flagship annual fest of Shaheed Sukhdev College of Business Studies (SSCBS), 
              University of Delhi. Spanning multiple days, it brings together students from 150+ colleges 
              across India to compete, collaborate, and celebrate across domains — from business strategy 
              and entrepreneurship to performing arts, design, and technology.
            </p>
            <p className="section-body">
              With 70+ curated events, high-profile artist performances, industry panels, and competitive 
              arenas, Crescendo is not just a college fest — it's a launchpad for the next generation of 
              leaders, creators, and innovators.
            </p>
          </div>

          <div className="content-visual">
            <div className="arena-map">
              <div className="map-zone" style={{ '--zone-clr': '#ff5e95' } as any}>
                <div className="zone-icon"><Target size={20} /></div>
                <div className="zone-info">
                  <span className="zone-count">70+</span>
                  <span className="zone-label">EVENTS</span>
                </div>
              </div>
              <div className="map-zone" style={{ '--zone-clr': '#00f2ff' } as any}>
                <div className="zone-icon"><Users size={20} /></div>
                <div className="zone-info">
                  <span className="zone-count">150+</span>
                  <span className="zone-label">COLLEGES</span>
                </div>
              </div>
              <div className="map-zone" style={{ '--zone-clr': '#bc00ff' } as any}>
                <div className="zone-icon"><Zap size={20} /></div>
                <div className="zone-info">
                  <span className="zone-count">8000+</span>
                  <span className="zone-label">PARTICIPANTS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 3. LEVEL 02 — ABOUT SSCBS ═══════════ */}
      <section className="about-section dark-section">
        <div className="level-tag">
          <span className="level-num">02</span>
          <span className="level-title">THE SYSTEM CORE: SSCBS</span>
        </div>

        <div className="content-split reverse">
          <div className="content-text">
            <h2 className="section-headline">Powered By One of<br/>India's Top B-Schools</h2>
            <p className="section-body">
              Shaheed Sukhdev College of Business Studies (SSCBS) is a premier institution under the 
              University of Delhi, consistently ranked among the top business schools in India. With a 
              selection ratio of 1:140, it attracts some of the sharpest minds in the country.
            </p>
            <p className="section-body">
              The college's culture of excellence in academics, leadership, and extracurricular endeavors 
              is what fuels Crescendo — a fest built by students who set the bar, not follow it.
            </p>

            <div className="sscbs-stats-row">
              <div className="sscbs-stat">
                <Shield size={18} />
                <div>
                  <span className="stat-num">1:140</span>
                  <span className="stat-lbl">SELECTION RATIO</span>
                </div>
              </div>
              <div className="sscbs-stat">
                <Star size={18} />
                <div>
                  <span className="stat-num">TOP 1%</span>
                  <span className="stat-lbl">NATIONALLY</span>
                </div>
              </div>
              <div className="sscbs-stat">
                <Trophy size={18} />
                <div>
                  <span className="stat-num">#1</span>
                  <span className="stat-lbl">DU B-SCHOOL</span>
                </div>
              </div>
            </div>
          </div>

          <div className="content-visual">
            <div className="system-core-visual">
              <div className="core-ring ring-1" />
              <div className="core-ring ring-2" />
              <div className="core-ring ring-3" />
              <div className="core-center">SSCBS</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 4. STATS SECTION — ARCADE COUNTERS ═══════════ */}
      <section className="about-section stats-section" ref={statsObserver.ref}>
        <div className="level-tag">
          <span className="level-num">▸▸</span>
          <span className="level-title">GLOBAL LEADERBOARD</span>
        </div>

        <div className="stats-grid">
          <div className="stat-counter">
            <span className="counter-value">{footfall.toLocaleString()}+</span>
            <div className="counter-bar">
              <div className="counter-fill" style={{ width: statsObserver.inView ? '92%' : '0%' }} />
            </div>
            <span className="counter-label">FOOTFALL</span>
          </div>
          <div className="stat-counter">
            <span className="counter-value">{reach}L+</span>
            <div className="counter-bar">
              <div className="counter-fill purple" style={{ width: statsObserver.inView ? '88%' : '0%' }} />
            </div>
            <span className="counter-label">SOCIAL REACH</span>
          </div>
          <div className="stat-counter">
            <span className="counter-value">{colleges}+</span>
            <div className="counter-bar">
              <div className="counter-fill pink" style={{ width: statsObserver.inView ? '80%' : '0%' }} />
            </div>
            <span className="counter-label">COLLEGES</span>
          </div>
          <div className="stat-counter">
            <span className="counter-value">{events}+</span>
            <div className="counter-bar">
              <div className="counter-fill orange" style={{ width: statsObserver.inView ? '75%' : '0%' }} />
            </div>
            <span className="counter-label">EVENTS</span>
          </div>
        </div>
      </section>

      {/* ═══════════ 5. LEVEL 03 — WHY CRESCENDO ═══════════ */}
      <section className="about-section">
        <div className="level-tag">
          <span className="level-num">03</span>
          <span className="level-title">WHY PLAY</span>
        </div>

        <h2 className="section-headline center">Every Player Leaves<br/>With Something Gained</h2>

        <div className="purpose-grid">
          <div className="purpose-card">
            <div className="purpose-icon" style={{ '--p-clr': '#00f2ff' } as any}>
              <Target size={28} />
            </div>
            <h3>COMPETITION</h3>
            <p>Battle-tested events designed to push your limits. Win prizes, recognition, and bragging rights.</p>
          </div>
          <div className="purpose-card">
            <div className="purpose-icon" style={{ '--p-clr': '#ff5e95' } as any}>
              <Users size={28} />
            </div>
            <h3>NETWORKING</h3>
            <p>Connect with students, entrepreneurs, and industry leaders from across the country.</p>
          </div>
          <div className="purpose-card">
            <div className="purpose-icon" style={{ '--p-clr': '#bc00ff' } as any}>
              <Zap size={28} />
            </div>
            <h3>EXPOSURE</h3>
            <p>Showcase your talent on a platform with 2 crore+ social reach and national visibility.</p>
          </div>
          <div className="purpose-card">
            <div className="purpose-icon" style={{ '--p-clr': '#ff9d00' } as any}>
              <Star size={28} />
            </div>
            <h3>EXPERIENCE</h3>
            <p>Live performances, immersive installations, and memories that define your college years.</p>
          </div>
        </div>
      </section>

      {/* ═══════════ 6. CTA — JOIN THE GAME ═══════════ */}
      <section className="about-section cta-section">
        <div className="cta-inner">
          <h2 className="cta-headline">READY<br/>PLAYER?</h2>
          <p className="cta-sub">The arena is set. The clock is ticking. Your move.</p>
          <div className="cta-buttons">
            <button className="cta-primary" onClick={() => navigate('/events')}>
              <span>EXPLORE EVENTS</span>
              <ChevronRight size={20} />
            </button>
            <button className="cta-secondary" onClick={() => navigate('/contact')}>
              <Gamepad2 size={20} />
              <span>MEET THE TEAM</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
