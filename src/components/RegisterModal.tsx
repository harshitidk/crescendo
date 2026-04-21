import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterModal.css';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement | null>;
}

const FORM_LINKS = {
  promCbs: 'https://forms.gle/hY3BrNTPDseCUJYM9',
  day1: 'https://forms.gle/YMtcRaATu6NddyJC8',
  day2: 'https://forms.gle/mu4qU5cSUpRy7wKk9',
};

export default function RegisterModal({ isOpen, onClose, anchorRef }: RegisterModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    // Delay to avoid the click that opened the modal
    const timer = setTimeout(() => {
      window.addEventListener('click', handleClick);
    }, 10);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleClick);
    };
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  return (
    <div className="register-modal-overlay" onClick={onClose}>
      <div
        className="register-modal"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative corner brackets */}
        <span className="reg-corner reg-tl" />
        <span className="reg-corner reg-tr" />
        <span className="reg-corner reg-bl" />
        <span className="reg-corner reg-br" />

        <div className="reg-header">
          <span className="reg-title">▸ SELECT DAY</span>
          <span className="reg-close" onClick={onClose}>[X]</span>
        </div>

        <p className="reg-subtitle">CHOOSE YOUR MISSION DAY</p>

        <div className="reg-options" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '5px' }}>
          <button
            onClick={() => {
              onClose();
              navigate('/prom');
            }}
            className="reg-option-btn"
            style={{ borderColor: 'rgba(255, 94, 149, 0.3)', width: '100%', textAlign: 'left', background: 'transparent' }}
          >
            <span className="reg-option-indicator" style={{ color: 'var(--neon-pink)' }}>00</span>
            <div className="reg-option-info">
              <span className="reg-option-name" style={{ color: 'var(--neon-pink)' }}>PROM NIGHT</span>
              <span className="reg-option-date">APRIL 22</span>
            </div>
            <span className="reg-option-arrow" style={{ color: 'var(--neon-pink)' }}>→</span>
          </button>

          <a
            href={FORM_LINKS.day1}
            target="_blank"
            rel="noopener noreferrer"
            className="reg-option-btn"
          >
            <span className="reg-option-indicator">01</span>
            <div className="reg-option-info">
              <span className="reg-option-name">DAY 1</span>
              <span className="reg-option-date">APRIL 23</span>
            </div>
            <span className="reg-option-arrow">→</span>
          </a>

          <a
            href={FORM_LINKS.day2}
            target="_blank"
            rel="noopener noreferrer"
            className="reg-option-btn"
          >
            <span className="reg-option-indicator">02</span>
            <div className="reg-option-info">
              <span className="reg-option-name">DAY 2</span>
              <span className="reg-option-date">APRIL 24</span>
            </div>
            <span className="reg-option-arrow">→</span>
          </a>
        </div>

        <div className="reg-footer">
          <span className="reg-footer-dot" />
          REGISTRATION LIVE
        </div>
      </div>
    </div>
  );
}
