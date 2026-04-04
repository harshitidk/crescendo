import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Info, Calendar, Database, Mail } from 'lucide-react';
import './GlobalNav.css';

export default function GlobalNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  return (
    <nav className={`arcade-nav-global ${!isHome ? 'bottom-center' : 'at-home'}`}>
      <button className="arcade-btn primary register-btn mobile-only">REGISTER</button>
      <div className="nav-main-options">
        <button className="arcade-btn nav-item" onClick={() => navigate('/')}>
          <Home className="nav-icon" />
          <span className="nav-text">HOME</span>
        </button>
        <button className="arcade-btn nav-item" onClick={() => navigate('/about')}>
          <Info className="nav-icon" />
          <span className="nav-text">ABOUT</span>
        </button>
        <button className="arcade-btn nav-item" onClick={() => navigate('/events')}>
          <Calendar className="nav-icon" />
          <span className="nav-text">EVENTS</span>
        </button>
        <button className="arcade-btn nav-item" onClick={() => navigate('/dump')}>
          <Database className="nav-icon" />
          <span className="nav-text">DUMP</span>
        </button>
        <button className="arcade-btn nav-item" onClick={() => navigate('/contact')}>
          <Mail className="nav-icon" />
          <span className="nav-text">CONTACT</span>
        </button>
        <button className="arcade-btn primary register-btn desktop-only">REGISTER</button>
      </div>
    </nav>
  );
}
