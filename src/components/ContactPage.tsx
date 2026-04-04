import { useState } from 'react';
import { Phone, Mail, MessageCircle, X, ChevronRight } from 'lucide-react';
import './ContactPage.css';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
}

const CORE_TEAM: TeamMember[] = [
  { id: 'c1', name: 'NAYAN DHAR', role: 'PRESIDENT', photo: '' },
  { id: 'c2', name: 'VAIBHAV KUMAR', role: 'VICE PRESIDENT', photo: '' },
  { id: 'c3', name: 'PREETI', role: 'FEST DIRECTOR', photo: '' },
  { id: 'c4', name: 'KARAN RAINA', role: 'FEST COORDINATOR', photo: '' },
  { id: 'c5', name: 'GAURI VERMA', role: 'FEST COORDINATOR', photo: '' },
  { id: 'c6', name: 'GAGAN', role: 'FEST SECRETARY', photo: '' },
];

const DEPARTMENT_HEADS: TeamMember[] = [
  { id: 'd1', name: 'HARSHIT', role: 'HEAD OF WEBSITE', photo: '' },
  { id: 'd2', name: 'UTKARSH', role: 'HEAD OF MARKETING', photo: '' },
  { id: 'd3', name: 'ASHISH', role: 'HEAD OF SPONSORSHIP', photo: '' },
  { id: 'd4', name: 'SAMYAK', role: 'HEAD OF HOSPITALITY', photo: '' },
  { id: 'd5', name: 'PREETI', role: 'HEAD OF ARTIST', photo: '' },
];

export default function ContactPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const renderGrid = (members: TeamMember[], startDelay: number = 0) => (
    <div className="team-grid">
      {members.map((member, i) => (
        <div
          key={member.id}
          className="player-card"
          style={{ animationDelay: `${(i + startDelay) * 0.05}s` }}
          onClick={() => setSelectedMember(member)}
        >
          <div className="player-avatar">
            {member.photo ? (
              <img src={member.photo} alt={member.name} className="player-photo" />
            ) : (
              <span className="avatar-initials">
                {member.name.split(' ').map(n => n[0]).join('')}
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
                <Phone size={12} />
              </a>
            )}
            {member.whatsapp && (
              <a href={`https://wa.me/${member.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="action-ic small">
                <MessageCircle size={12} />
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
          <span className="hud-tag">ROSTER_v2.0</span>
          <span className="hud-tag">PLAYERS: {CORE_TEAM.length + DEPARTMENT_HEADS.length}</span>
        </div>
        <h1 className="roster-title">MEET THE PLAYERS</h1>
        <p className="roster-sub">Every game has its operators. This one has legends.</p>
      </section>

      {/* Core Section */}
      <section className="roster-section">
        <div className="section-label">
          <div className="section-line" />
          <span>CORE_OPERATORS</span>
          <div className="section-line" />
        </div>
        {renderGrid(CORE_TEAM, 0)}
      </section>

      {/* Departments Section */}
      <section className="roster-section">
        <div className="section-label">
          <div className="section-line" />
          <span>DEPARTMENT_HEADS</span>
          <div className="section-line" />
        </div>
        {renderGrid(DEPARTMENT_HEADS, CORE_TEAM.length)}
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

            <div className="profile-contact-section">
              <h3 className="section-heading">// DIRECT LINK</h3>
              <div className="profile-contact-btns">
                {selectedMember.phone ? (
                  <a href={`tel:${selectedMember.phone}`} className="contact-action-btn">
                    <Phone size={18} />
                    <span>CALL</span>
                  </a>
                ) : (
                  <div className="contact-action-btn disabled">
                    <Phone size={18} />
                    <span>CALL UNKNOWN</span>
                  </div>
                )}
                
                {selectedMember.email ? (
                  <a href={`mailto:${selectedMember.email}`} className="contact-action-btn">
                    <Mail size={18} />
                    <span>EMAIL</span>
                  </a>
                ) : (
                  <div className="contact-action-btn disabled">
                    <Mail size={18} />
                    <span>EMAIL UNKNOWN</span>
                  </div>
                )}

                {selectedMember.whatsapp && (
                  <a href={`https://wa.me/${selectedMember.whatsapp.replace(/[^0-9]/g, '')}`} className="contact-action-btn" target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={18} />
                    <span>WHATSAPP</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="roster-footer">
        <div className="footer-terminal"><span className="blink-cursor">_</span> ENCRYPTED CHANNEL SECURE</div>
        <div className="footer-loc">SSCBS // NEW DELHI // 28.6139° N, 77.2090° E</div>
      </footer>
    </div>
  );
}
