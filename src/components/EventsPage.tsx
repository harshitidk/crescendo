import { useState, useMemo } from 'react';
import { 
  Gamepad2, 
  Trophy, 
  X,
  Calendar,
  Clock,
  MapPin,
  Star,
  Sparkles
} from 'lucide-react';
import './EventsPage.css';

interface EventItem {
  id: string;
  name: string;
  description: string;
  day: string;
  time: string;
  venue: string;
  category: string;
  type: 'MAIN' | 'SIDE' | 'NIGHT';
  reward?: string;
  image?: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
}

const DAYS = [
  { id: 'day0', name: 'DAY 0', label: '22 APRIL', icon: <Sparkles size={20} />, color: '#ff5e95' },
  { id: 'day1', name: 'DAY 1', label: '23 APRIL', icon: <Calendar size={20} />, color: '#00f2ff' },
  { id: 'day2', name: 'DAY 2', label: '24 APRIL', icon: <Star size={20} />, color: '#bc00ff' },
];

const EVENT_DATA: EventItem[] = [
  // DAY 0 - PROM NIGHT
  {
    id: 'p1',
    name: 'THE PROM NIGHT',
    description: 'An enchanting evening of music, dance, and elegance. The grand prelude to Crescendo 2026.',
    day: 'day0',
    time: '06:00 PM - 10:00 PM',
    venue: 'GRAND BALLROOM',
    category: 'SPECIAL',
    type: 'NIGHT',
    rarity: 'LEGENDARY'
  },
  {
    id: 'p2',
    name: 'RED CARPET ENTRY',
    description: 'Strike a pose as you enter the most awaited night of the year.',
    day: 'day0',
    time: '05:30 PM',
    venue: 'MAIN ENTRANCE',
    category: 'PHOTOGRAPHY',
    type: 'SIDE',
    rarity: 'RARE'
  },

  // DAY 1 - ACADEMIC
  { id: 'd1-1', name: 'Finance Fiasco', description: 'Organized by IFSA Network India', day: 'day1', time: '9 AM - 3 PM', venue: 'Seminar hall / Class rooms', category: 'ACADEMIC', type: 'MAIN', rarity: 'RARE' },
  { id: 'd1-2', name: 'Social Case Competition', description: 'Organized by CII Yi Yuva SSCBS', day: 'day1', time: '9 AM - 3 PM', venue: 'Tute rooms / Seminar hall', category: 'ACADEMIC', type: 'MAIN', rarity: 'COMMON' },
  { id: 'd1-3', name: 'Vivante (Social Case)', description: 'Organized by Kartavya', day: 'day1', time: '9 AM - 5 PM', venue: 'Class rooms / Auditorium', category: 'ACADEMIC', type: 'MAIN', rarity: 'RARE' },
  { id: 'd1-4', name: 'Social Case Competition', description: 'Organized by Connecting Dreams Foundation', day: 'day1', time: '9 AM - 5 PM', venue: 'Class rooms / Tute rooms', category: 'ACADEMIC', type: 'MAIN', rarity: 'COMMON' },
  { id: 'd1-5', name: 'Capital Conquest', description: 'Organized by Bridges for Enterprise', day: 'day1', time: '9 AM - 5 PM', venue: 'Seminar hall / Tute rooms', category: 'ACADEMIC', type: 'MAIN', rarity: 'EPIC' },
  { id: 'd1-6', name: 'Code Twist 3.0', description: 'Organized by ACM SSCBS', day: 'day1', time: '9 AM - 3 PM', venue: 'Auditorium / Class rooms', category: 'ACADEMIC', type: 'MAIN', rarity: 'EPIC' },
  { id: 'd1-7', name: 'mAD Libs', description: 'Organized by Mark-It', day: 'day1', time: '10 AM - 3 PM', venue: 'Class rooms 623 / Tute rooms', category: 'ACADEMIC', type: 'SIDE', rarity: 'RARE' },
  { id: 'd1-8', name: 'Bidweiser', description: 'Organized by FMA India', day: 'day1', time: '10 AM - 3 PM', venue: 'Seminar hall / Class rooms', category: 'ACADEMIC', type: 'MAIN', rarity: 'EPIC' },
  { id: 'd1-9', name: 'Viz-A-Thon', description: 'Organized by NUCLEUS', day: 'day1', time: '10 AM - 3 PM', venue: 'Seminar hall / Class rooms', category: 'ACADEMIC', type: 'MAIN', rarity: 'RARE' },
  { id: 'd1-10', name: 'Abhivaykt', description: 'Organized by Enactus SSCBS', day: 'day1', time: '10 AM - 4 PM', venue: 'Seminar hall / Tute rooms', category: 'ACADEMIC', type: 'MAIN', rarity: 'RARE' },
  { id: 'd1-11', name: 'Management Maze', description: 'Organized by IMA SSCBS', day: 'day1', time: '10 AM - 4 PM', venue: 'Class rooms / Seminar hall', category: 'ACADEMIC', type: 'MAIN', rarity: 'COMMON' },
  { id: 'd1-12', name: 'Grandeur Simulation Challenge', description: 'Organized by Grandeur', day: 'day1', time: '10 AM - 4 PM', venue: 'Seminar hall / Class rooms', category: 'ACADEMIC', type: 'MAIN', rarity: 'EPIC' },
  { id: 'd1-13', name: 'Euphoria', description: 'Organized by Synergy - The Corporate', day: 'day1', time: '10 AM - 3 PM', venue: 'Seminar hall / Tute rooms', category: 'ACADEMIC', type: 'SIDE', rarity: 'COMMON' },
  { id: 'd1-14', name: 'VentureX', description: 'Organized by CEO', day: 'day1', time: '10 AM - 3 PM', venue: 'Tute rooms / Class rooms', category: 'ACADEMIC', type: 'MAIN', rarity: 'EPIC' },
  { id: 'd1-15', name: 'Equithon', description: 'Organized by FinX', day: 'day1', time: '10 AM - 2 PM', venue: 'Class rooms / Tute rooms', category: 'ACADEMIC', type: 'MAIN', rarity: 'RARE' },
  { id: 'd1-16', name: 'Confluence – The Networking Mixer', description: 'Organized by COMMUNIQUE', day: 'day1', time: '10 AM - 4 PM', venue: 'Seminar hall', category: 'ACADEMIC', type: 'SIDE', rarity: 'COMMON' },
  { id: 'd1-17', name: 'FinStrat', description: 'Organized by Financial Literacy Cell', day: 'day1', time: '10 AM - 12 PM', venue: 'Class rooms / Seminar hall', category: 'ACADEMIC', type: 'MAIN', rarity: 'RARE' },
  { id: 'd1-18', name: '180Connect Networking Mixer', description: 'Organized by 180 Degrees Consulting', day: 'day1', time: '10 AM - 12 PM', venue: 'Seminar hall / Tute rooms', category: 'ACADEMIC', type: 'SIDE', rarity: 'COMMON' },

  // DAY 1 - CULTURAL
  { id: 'd1-c1', name: 'Raasa 2026', description: 'Organized by Fourth Wall Productions', day: 'day1', time: '9 AM - 5 PM', venue: 'Auditorium', category: 'CULTURAL', type: 'SIDE', rarity: 'EPIC' },
  { id: 'd1-c2', name: 'CBSFest', description: 'Organized by Illuminati', day: 'day1', time: '9 AM - 5 PM', venue: 'Class rooms / Tute rooms', category: 'CULTURAL', type: 'SIDE', rarity: 'RARE' },
  { id: 'd1-c3', name: 'Bibliotheca (4 events)', description: 'Organized by The Literary Society', day: 'day1', time: '9 AM - 5 PM', venue: 'Tute rooms / Class rooms', category: 'CULTURAL', type: 'SIDE', rarity: 'COMMON' },
  { id: 'd1-c4', name: 'Venture Hunt', description: 'Organized by YUVA', day: 'day1', time: '9 AM - 5 PM', venue: 'Yuva Room 168 / Conference 159', category: 'SOCIAL', type: 'SIDE', rarity: 'RARE' },
  { id: 'd1-c5', name: 'Double Trouble, Art Exhibition, Mono', description: 'Organized by Kriti', day: 'day1', time: '9 AM - 5 PM', venue: 'Seminar hall / Tute rooms', category: 'CULTURAL', type: 'SIDE', rarity: 'EPIC' },
  { id: 'd1-c6', name: 'Mindful Gaming Garden + Yoga', description: 'Organized by Sadhana', day: 'day1', time: '9 AM - 5 PM', venue: 'Tute rooms / Corridor', category: 'SOCIAL', type: 'SIDE', rarity: 'COMMON' },
  { id: 'd1-c7', name: 'EcoClash 2026 (Debate)', description: 'Organized by EcoClub', day: 'day1', time: '10 AM - 4 PM', venue: 'Seminar hall / Tute rooms', category: 'SOCIAL', type: 'SIDE', rarity: 'COMMON' },
  { id: 'd1-c8', name: 'Encore (Dance Competition)', description: 'Organized by Blitz', day: 'day1', time: '10 AM - 2 PM', venue: 'Auditorium / Main stage', category: 'CULTURAL', type: 'MAIN', rarity: 'LEGENDARY' },
  { id: 'd1-c9', name: 'MIC SSCBS Networking Mixer', description: 'Organized by Management Interaction', day: 'day1', time: '10 AM - 4 PM', venue: 'Class rooms / Tute rooms', category: 'SOCIAL', type: 'SIDE', rarity: 'COMMON' },
  { id: 'd1-c10', name: 'Jurisprudence', description: 'Organized by Lawrence', day: 'day1', time: '11 AM - 4 PM', venue: 'Seminar hall / Corridor', category: 'SOCIAL', type: 'SIDE', rarity: 'RARE' },
  { id: 'd1-c11', name: 'EcoClash – second event', description: 'Organized by EcoClub', day: 'day1', time: '12 PM onwards', venue: 'Seminar hall', category: 'SOCIAL', type: 'SIDE', rarity: 'COMMON' },

  // DAY 1 - EVENING
  { id: 'd1-e1', name: 'Opening Act 1', description: 'Crescendo 2026', day: 'day1', time: '5 PM - 6 PM', venue: 'Main Ground', category: 'EVENING', type: 'NIGHT', rarity: 'EPIC' },
  { id: 'd1-e2', name: 'Opening Act 2', description: 'Crescendo 2026', day: 'day1', time: '6 PM - 7 PM', venue: 'Main Ground', category: 'EVENING', type: 'NIGHT', rarity: 'EPIC' },
  { id: 'd1-e3', name: 'DJ', description: 'Crescendo 2026', day: 'day1', time: '7 PM - 9 PM', venue: 'Main Ground', category: 'EVENING', type: 'NIGHT', rarity: 'LEGENDARY' },

  // DAY 2 - ACADEMIC
  { id: 'd2-1', name: 'IFSA Mixer (Networking)', description: 'Organized by IFSA Network India', day: 'day2', time: '9 AM - 5 PM', venue: 'Seminar hall / Class rooms', category: 'ACADEMIC', type: 'SIDE', rarity: 'COMMON' },
  { id: 'd2-2', name: 'Vivaad Sabha (Parl. Debates)', description: 'Organized by CBSMUN', day: 'day2', time: '9 AM - 1 PM', venue: 'Seminar hall / Class rooms', category: 'ACADEMIC', type: 'MAIN', rarity: 'RARE' },
  { id: 'd2-3', name: 'Dard-e-Disco (Selection+Quiz)', description: 'Organized by Rotaract Club', day: 'day2', time: '10 AM - 5 PM', venue: 'Reception area / Class rooms', category: 'SOCIAL', type: 'SIDE', rarity: 'COMMON' },
  { id: 'd2-4', name: 'Bid for Brilliance', description: 'Organized by Management Interaction', day: 'day2', time: '10 AM - 4 PM', venue: 'Seminar hall / Tute rooms', category: 'ACADEMIC', type: 'MAIN', rarity: 'RARE' },
  { id: 'd2-5', name: 'VentureX (continued/Day 2)', description: 'Organized by CEO', day: 'day2', time: '10 AM - 5 PM', venue: 'Tute rooms / Class rooms', category: 'ACADEMIC', type: 'MAIN', rarity: 'EPIC' },
  { id: 'd2-6', name: 'Code Twist 3.0 (Day 2)', description: 'Organized by ACM SSCBS', day: 'day2', time: '10 AM - 3 PM', venue: 'Auditorium / Class rooms', category: 'ACADEMIC', type: 'MAIN', rarity: 'EPIC' },
  { id: 'd2-7', name: 'Bidweiser (Round 2)', description: 'Organized by FMA India', day: 'day2', time: '10 AM - 1 PM', venue: 'Seminar hall / Class rooms', category: 'ACADEMIC', type: 'MAIN', rarity: 'EPIC' },
  { id: 'd2-8', name: 'Mantavya (HR competition)', description: 'Organized by Anthropos HRDC', day: 'day2', time: '10 AM - 3 PM', venue: 'Seminar hall / Class rooms', category: 'ACADEMIC', type: 'MAIN', rarity: 'RARE' },
  { id: 'd2-9', name: 'JIT Buzzinga Treasure Hunt', description: 'Organized by APICS SSCBS', day: 'day2', time: '12 PM - 3 PM', venue: 'Class rooms / Tute rooms', category: 'ACADEMIC', type: 'SIDE', rarity: 'COMMON' },
  { id: 'd2-10', name: 'CBS Excel Simulation Challenge', description: 'Organized by Ecovision', day: 'day2', time: '12 PM - 1 PM', venue: 'Class rooms / Seminar hall', category: 'ACADEMIC', type: 'MAIN', rarity: 'RARE' },

  // DAY 2 - CULTURAL
  { id: 'd2-c1', name: 'Raasa 2026 (Day 2)', description: 'Organized by Fourth Wall Productions', day: 'day2', time: '9 AM - 5 PM', venue: 'Auditorium', category: 'CULTURAL', type: 'SIDE', rarity: 'EPIC' },
  { id: 'd2-c2', name: 'Art Exhibition Comp + Mono', description: 'Organized by Kriti', day: 'day2', time: '10 AM - 4 PM', venue: 'Seminar hall / Tute rooms', category: 'CULTURAL', type: 'SIDE', rarity: 'RARE' },
  { id: 'd2-c3', name: 'MIC Networking Mixer (Day 2)', description: 'Organized by Management Interaction', day: 'day2', time: '10 AM - 4 PM', venue: 'Class rooms / Tute rooms', category: 'SOCIAL', type: 'SIDE', rarity: 'COMMON' },
  { id: 'd2-c4', name: 'Mindful Gaming Garden', description: 'Organized by Sadhana (The Mental Health Society)', day: 'day2', time: '10 AM - 4 PM', venue: 'Game stalls / Seminar hall', category: 'SOCIAL', type: 'SIDE', rarity: 'COMMON' },
  { id: 'd2-c5', name: 'Encore – Group Western Dance', description: 'Organized by Blitz', day: 'day2', time: '10 AM - 3 PM', venue: 'Auditorium / Main stage', category: 'CULTURAL', type: 'MAIN', rarity: 'LEGENDARY' },
  { id: 'd2-c6', name: 'Jurisprudence (Day 2)', description: 'Organized by Lawrence', day: 'day2', time: '11 AM onwards', venue: 'Seminar hall', category: 'SOCIAL', type: 'SIDE', rarity: 'RARE' },
  { id: 'd2-c7', name: 'CBS Quiz Fest \'25', description: 'Organized by Illuminati', day: 'day2', time: '11 AM - 4 PM', venue: 'Class rooms / Tute rooms', category: 'CULTURAL', type: 'SIDE', rarity: 'RARE' },
  { id: 'd2-c8', name: 'Mindful Gaming Garden (Day 2)', description: 'Organized by Sadhana', day: 'day2', time: '12 PM - 5 PM', venue: 'Corridor / Tute rooms', category: 'SOCIAL', type: 'SIDE', rarity: 'COMMON' },
  { id: 'd2-c9', name: 'Mantavya (Day 2)', description: 'Organized by Anthropos HRDC', day: 'day2', time: '12 PM - 4 PM', venue: 'Seminar hall / Class rooms', category: 'ACADEMIC', type: 'MAIN', rarity: 'RARE' },

  // DAY 2 - EVENING
  { id: 'd2-e1', name: 'Opening Act 1', description: 'Crescendo 2026', day: 'day2', time: '5 PM - 6 PM', venue: 'Main Ground', category: 'EVENING', type: 'NIGHT', rarity: 'EPIC' },
  { id: 'd2-e2', name: 'Opening Act 2', description: 'Crescendo 2026', day: 'day2', time: '6 PM - 7 PM', venue: 'Main Ground', category: 'EVENING', type: 'NIGHT', rarity: 'EPIC' },
  { id: 'd2-e3', name: 'Main Artist', description: 'Crescendo 2026', day: 'day2', time: '7 PM - 9 PM', venue: 'Main Ground', category: 'EVENING', type: 'NIGHT', rarity: 'LEGENDARY' }
];

export default function EventsPage() {
  const [activeDay, setActiveDay] = useState('day0');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const currentEvents = useMemo(() => {
    return EVENT_DATA.filter(e => e.day === activeDay);
  }, [activeDay]);

  return (
    <div className="events-game-screen">
      {/* Background Decor */}
      <div className="events-bg-grid" />
      
      {/* 1. Timeline Header */}
      <section className="events-timeline-header">
        <div className="hud-top">
          <div className="hud-stat">
            <span className="hud-label">LOCATION:</span>
            <span className="hud-value">TIMELINE_V3 // SECTOR_SCHEDULE</span>
          </div>
          <div className="hud-stat">
            <span className="hud-label">STATUS:</span>
            <span className="hud-value text-neon">SEQUENCING...</span>
          </div>
        </div>

        <div className="main-title-box">
          <h1 className="timeline-title" data-text="FESTIVAL TIMELINE">FESTIVAL TIMELINE</h1>
          <div className="timeline-dot-path">
            <div className="path-line" />
            <div className={`path-node ${activeDay === 'day0' ? 'active' : ''}`} />
            <div className={`path-node ${activeDay === 'day1' ? 'active' : ''}`} />
            <div className={`path-node ${activeDay === 'day2' ? 'active' : ''}`} />
          </div>
        </div>

        {/* 2. Day Selectors (The "Levels") */}
        <div className="day-selector-grid">
          {DAYS.map((day, idx) => (
            <button 
              key={day.id}
              className={`day-card ${activeDay === day.id ? 'active' : ''}`}
              onClick={() => setActiveDay(day.id)}
              style={{ '--day-clr': day.color } as any}
            >
              <div className="day-number">0{idx}</div>
              <div className="day-info">
                <div className="day-name">{day.name}</div>
                <div className="day-label">{day.label}</div>
              </div>
              <div className="day-icon">{day.icon}</div>
              <div className="day-glow" />
            </button>
          ))}
        </div>
      </section>

      {/* 3. Events List */}
      <section className="events-list-container">
        <div className="events-scroll-wrap">
          <div className="events-timeline">
            {currentEvents.map((event, i) => (
              <div 
                key={event.id} 
                className={`event-timeline-item rarity-${event.rarity.toLowerCase()}`}
                style={{ '--delay': `${i * 0.1}s` } as any}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="event-time-stamp">
                  <Clock size={14} />
                  <span>{event.time.split(' - ')[0]}</span>
                </div>

                <div className="event-marker">
                  <div className="marker-dot" />
                  <div className="marker-line" />
                </div>

                <div className="event-content-box">
                  <div className="event-header">
                    <span className="event-type-badge">{event.type}</span>
                    <span className="event-rarity-label">{event.rarity}</span>
                  </div>
                  
                  <h3 className="event-name">{event.name}</h3>
                  <p className="event-excerpt">{event.description.substring(0, 80)}...</p>
                  
                  <div className="event-footer">
                    <div className="event-meta">
                      <MapPin size={12} />
                      <span>{event.venue}</span>
                    </div>
                    {event.reward && (
                      <div className="event-reward-tag">
                        <Trophy size={12} />
                        <span>{event.reward}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="card-glitch-border" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Event Detail Modal */}
      {selectedEvent && (
        <div className="event-modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="event-modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedEvent(null)}>
              <X size={24} />
            </button>

            <div className={`modal-header-banner rarity-${selectedEvent.rarity.toLowerCase()}`}>
              <div className="modal-badge-row">
                <span className="modal-type-tag">{selectedEvent.type} EVENT</span>
                <span className="modal-rarity-tag">{selectedEvent.rarity} LEVEL</span>
              </div>
              <h2 className="modal-event-title">{selectedEvent.name}</h2>
            </div>

            <div className="modal-body-scroll">
              <div className="modal-info-grid">
                <div className="info-box">
                  <Clock size={20} className="text-neon-blue" />
                  <div className="info-inner">
                    <span className="info-label">TIME</span>
                    <span className="info-value">{selectedEvent.time}</span>
                  </div>
                </div>
                <div className="info-box">
                  <MapPin size={20} className="text-neon-pink" />
                  <div className="info-inner">
                    <span className="info-label">VENUE</span>
                    <span className="info-value">{selectedEvent.venue}</span>
                  </div>
                </div>
              </div>

              <div className="modal-desc-section">
                <h3 className="modal-section-title">// EVENT DESCRIPTION</h3>
                <p>{selectedEvent.description}</p>
              </div>

              {selectedEvent.reward && (
                <div className="modal-reward-section">
                  <h3 className="modal-section-title">// GRAND PRIZE</h3>
                  <div className="modal-reward-box">
                    <Trophy size={28} className="text-yellow" />
                    <span>{selectedEvent.reward}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="confirm-btn">
                <span>ADD TO MY TIMELINE</span>
                <Gamepad2 size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
