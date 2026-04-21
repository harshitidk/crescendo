import { useState } from 'react';
import { Phone, Mail, MessageCircle, X, ChevronRight, Copy, Check } from 'lucide-react';
import './ContactPage.css';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

const CORE_TEAM: TeamMember[] = [
  { 
    id: 'c1', 
    name: 'NAYAN DHAR', 
    role: 'PRESIDENT', 
    photo: '/team/Nayan.JPG',
    email: 'nayan.23075@sscbs.du.ac.in', 
    phone: '9958289765',
    whatsapp: '9958289765'
  },
  { 
    id: 'c7', 
    name: 'ARYAN GUPTA', 
    role: 'CO-PRESIDENT', 
    photo: '/team/Aryan Gupta.jpeg',
    email: 'aryan.23282@sscbs.du.ac.in', 
    phone: '+91 83188 90345',
    whatsapp: '8318890345'
  },
  { 
    id: 'c2', 
    name: 'VAIBHAV', 
    role: 'VICE PRESIDENT', 
    photo: '/team/Vaibhav.jpeg',
    email: 'vaibhav.23418@sscbs.du.ac.in', 
    phone: '7834802213',
    whatsapp: '7834802213'
  },
  { 
    id: 'c3', 
    name: 'PREETI', 
    role: 'FEST DIRECTOR', 
    photo: '/team/Preeti.jpeg',
    email: 'preeti.23266@sscbs.du.ac.in', 
    phone: '7206260370',
    whatsapp: '7206260370'
  },
  { 
    id: 'c6', 
    name: 'GAGAN CHOUDHARY', 
    role: 'FEST SECRETARY',
    photo: '/team/Gagan.jpeg',
    phone: '9257476272',
    email: 'gagan.23285@sscbs.du.ac.in',
    whatsapp: '9257476272'
  },
  { 
    id: 'c4', 
    name: 'GAURI VERMA', 
    role: 'FEST COORDINATOR', 
    photo: '/team/Gauri.jpeg',
    email: 'gauri.24332@sscbs.du.ac.in', 
    phone: '9711135791',
    whatsapp: '9711135791'
  },
  { 
    id: 'c5', 
    name: 'KARAN RAINA', 
    role: 'FEST COORDINATOR', 
    photo: '/team/Karan.jpeg',
    email: 'karan.24118@sscbs.du.ac.in', 
    phone: '7982047323',
    whatsapp: '7982047323'
  },
];

const FACULTY_TEAM: TeamMember[] = [
  { 
    id: 'f1', 
    name: 'DR. SATISH KUMAR GOEL', 
    role: 'TEACHER IN CHARGE',
    photo: '/team/satish.jpeg', 
    email: '' 
  },
  { 
    id: 'f2', 
    name: 'DR. RISHI RAJAN SINGH', 
    role: 'TEACHER IN CHARGE',
    photo: '/team/rishi.jpg', 
    email: '' 
  },
  { 
    id: 'f3', 
    name: 'DR. KUMAR BIJOY', 
    role: 'TEACHER IN CHARGE',
    photo: '/team/KB.jpg', 
    email: '' 
  },
  { 
    id: 'f4', 
    name: 'DR. TUSHAR MARWAHA', 
    role: 'TEACHER IN CHARGE',
    photo: '/team/tushar.jpg', 
    email: '' 
  },
];

const DEV_TEAM: TeamMember[] = [
  { 
    id: 'h1', 
    name: 'HARSHIT', 
    role: 'TECH HEAD',
    photo: '/team/harshit.jpeg',
    email: 'harshit.23179@sscbs.du.ac.in',
    linkedin: 'https://www.linkedin.com/in/harshitheya/',
    twitter: 'https://x.com/harshitheya',
    instagram: 'https://www.instagram.com/harshit.senpai/'
  },
];

export default function ContactPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderGrid = (members: TeamMember[], startDelay: number = 0, className: string = '') => (
    <div className={`team-grid ${className}`}>
      {members.map((member, i) => (
        <div
          key={member.id}
          className="player-card"
          style={{ animationDelay: `${(i + startDelay) * 0.05}s` }}
          onClick={() => setSelectedMember(member)}
        >
          <div className="card-top-accent" />
          <div className="card-scanline" />
          <div className="card-corner tl" /><div className="card-corner tr" /><div className="card-corner bl" /><div className="card-corner br" />

          <div className="card-status-row">
            <span className="status-dot" />
            <span className="status-tag">ONLINE</span>
          </div>

          <div className="player-avatar">
            {member.photo ? (
              <img src={member.photo} alt={member.name} className="player-photo" />
            ) : (
              <span className="avatar-initials">
                {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </span>
            )}
          </div>
          <div className="player-info">
            <h3 className="player-name">{member.name}</h3>
            <div className="player-role">{member.role}</div>
          </div>
          
          <div className="card-hover-cta">
            <span>VIEW STATS</span>
            <ChevronRight size={12} />
          </div>

          <div className="card-quick-actions" onClick={e => e.stopPropagation()}>
            {member.phone && (
              <a href={`tel:${member.phone}`} className="action-ic small">
                <Phone size={11} />
              </a>
            )}
            {member.whatsapp && (
              <a href={`https://wa.me/${member.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="action-ic small">
                <MessageCircle size={11} />
              </a>
            )}
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="action-ic small">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            )}
            {member.twitter && (
              <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="action-ic small">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
              </a>
            )}
            {member.instagram && (
              <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="action-ic small">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            )}
          </div>

          <div className="card-edge-glow" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="contact-roster">
      <div className="roster-bg-ambient" />

      {/* Hero */}
      <section className="roster-hero">
        <div className="hero-hud">
          <span className="hud-tag">ROSTER_v2.1</span>
          <span className="hud-tag">OPERATIVES: {FACULTY_TEAM.length + CORE_TEAM.length}</span>
        </div>
        <h1 className="roster-title">THE ROSTER</h1>
        <p className="roster-sub">Meet the legends orchestrating the game.</p>
      </section>

      {/* Core Section */}
      <section className="roster-section">
        <div className="section-label">
          <div className="section-line" />
          <span>CORE_OPERATORS</span>
          <div className="section-line" />
        </div>
        {renderGrid(CORE_TEAM, 0, 'core-operators-grid')}
      </section>

      {/* Faculty Section */}
      <section className="roster-section faculty-section">
        <div className="section-label">
          <div className="section-line" />
          <span>FACULTY_MENTORS</span>
          <div className="section-line" />
        </div>
        {renderGrid(FACULTY_TEAM, CORE_TEAM.length, 'faculty-grid')}
      </section>

      {/* Profile Modal */}
      {selectedMember && (
        <div className="profile-overlay" onClick={() => setSelectedMember(null)}>
          <div className="profile-panel" onClick={e => e.stopPropagation()}>
            <button className="profile-close" onClick={() => setSelectedMember(null)}><X size={24} /></button>

            <div className="profile-header">
              <div className="profile-avatar-lg">
                {selectedMember.photo ? (
                  <img src={selectedMember.photo} alt={selectedMember.name} className="profile-photo-lg" />
                ) : (
                  <span>{selectedMember.name.split(' ').map(n => n[0]).join('')}</span>
                )}
              </div>
              <h2 className="profile-name">{selectedMember.name}</h2>
              <div className="profile-role">{selectedMember.role}</div>
            </div>

            {(selectedMember.phone || selectedMember.email || selectedMember.whatsapp) && (
              <div className="profile-contact-section">
                <h3 className="section-heading">// COMMUNICATIONS_LINK</h3>
                <div className="profile-contact-list">
                  {selectedMember.phone && (
                    <div className="contact-item">
                      <div className="contact-info">
                        <span className="contact-label">SIGNAL:</span>
                        <div className="value-with-copy">
                          <span className="contact-value">{selectedMember.phone}</span>
                          <button 
                            className={`copy-btn ${copiedId === 'phone' ? 'copied' : ''}`}
                            onClick={() => handleCopy(selectedMember.phone!, 'phone')}
                            title="Copy to clipboard"
                          >
                            {copiedId === 'phone' ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                      <a href={`tel:${selectedMember.phone}`} className="contact-cta-action">
                        <Phone size={14} />
                        <span>INITIALIZE CALL</span>
                      </a>
                    </div>
                  )}
                  
                  {selectedMember.email && (
                    <div className="contact-item">
                      <div className="contact-info">
                        <span className="contact-label">INTEL_NODE:</span>
                        <div className="value-with-copy">
                          <span className="contact-value">{selectedMember.email}</span>
                          <button 
                            className={`copy-btn ${copiedId === 'email' ? 'copied' : ''}`}
                            onClick={() => handleCopy(selectedMember.email!, 'email')}
                            title="Copy to clipboard"
                          >
                            {copiedId === 'email' ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                      <a href={`mailto:${selectedMember.email}`} className="contact-cta-action">
                        <Mail size={14} />
                        <span>SEND TRANSMISSION</span>
                      </a>
                    </div>
                  )}

                  {selectedMember.whatsapp && (
                    <div className="contact-item">
                      <div className="contact-info">
                        <span className="contact-label">SECURE_CHAT:</span>
                        <span className="contact-value">WHATSAPP_ID_{selectedMember.whatsapp}</span>
                      </div>
                      <a href={`https://wa.me/${selectedMember.whatsapp.replace(/[^0-9]/g, '')}`} className="contact-cta-action" target="_blank" rel="noopener noreferrer">
                        <MessageCircle size={14} />
                        <span>START_CHAT</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {(selectedMember.linkedin || selectedMember.twitter || selectedMember.instagram) && (
              <div className="profile-contact-section">
                <h3 className="section-heading">// SOCIAL_NODES</h3>
                <div className="profile-contact-list">
                  {selectedMember.linkedin && (
                    <div className="contact-item">
                      <div className="contact-info">
                        <span className="contact-label">PROFESSIONAL_LINK:</span>
                        <span className="contact-value">LINKEDIN_CONNECT</span>
                      </div>
                      <a href={selectedMember.linkedin} className="contact-cta-action" target="_blank" rel="noopener noreferrer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                        <span>VIEW_PROFILE</span>
                      </a>
                    </div>
                  )}
                  {selectedMember.twitter && (
                    <div className="contact-item">
                      <div className="contact-info">
                        <span className="contact-label">SIGNAL_X:</span>
                        <span className="contact-value">TWITTER_REF</span>
                      </div>
                      <a href={selectedMember.twitter} className="contact-cta-action" target="_blank" rel="noopener noreferrer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
                        <span>VIEW_FEED</span>
                      </a>
                    </div>
                  )}
                  {selectedMember.instagram && (
                    <div className="contact-item">
                      <div className="contact-info">
                        <span className="contact-label">VISUAL_FEED:</span>
                        <span className="contact-value">INSTAGRAM_ID</span>
                      </div>
                      <a href={selectedMember.instagram} className="contact-cta-action" target="_blank" rel="noopener noreferrer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                        <span>VIEW_GALLERY</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <section className="roster-section developer-section">
        <div className="section-label">
          <div className="section-line" />
          <span>DESIGNED AND BUILT BY</span>
          <div className="section-line" />
        </div>
        {renderGrid(DEV_TEAM, FACULTY_TEAM.length + CORE_TEAM.length)}
      </section>

      {/* Footer */}
      <footer className="roster-footer">
        <div className="footer-main-content">
          <div className="footer-info-row">
            <div className="footer-terminal"><span className="blink-cursor">_</span> ENCRYPTED CHANNEL SECURE</div>
            <div className="footer-loc">SSCBS // NEW DELHI // 28.6139° N, 77.2090° E</div>
          </div>
          <div className="footer-divider" />
        </div>
      </footer>
    </div>
  );
}
