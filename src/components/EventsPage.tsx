import { useState, useMemo } from 'react';
import { 
  Gamepad2, 
  Trophy, 
  Users, 
  Zap, 
  ChevronRight,
  Info,
  X,
  Calendar,
  Clock,
  MapPin,
  Star,
  Sparkles,
  Music,
  Camera
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
  { id: 'day0', name: 'DAY 0', label: 'PROM NIGHT', icon: <Sparkles size={20} />, color: '#ff5e95' },
  { id: 'day1', name: 'DAY 1', label: 'FEST OPENING', icon: <Calendar size={20} />, color: '#00f2ff' },
  { id: 'day2', name: 'DAY 2', label: 'GRAND FINALE', icon: <Star size={20} />, color: '#bc00ff' },
];

const EVENT_DATA: EventItem[] = [
  // Day 0
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
  // Day 1
  {
    id: 'd1-1',
    name: 'OPENING CEREMONY',
    description: 'The official launch of Crescendo 2026. Experience the convergence of tech and art.',
    day: 'day1',
    time: '10:00 AM',
    venue: 'MAIN ARENA',
    category: 'MAIN',
    type: 'MAIN',
    rarity: 'EPIC'
  },
  {
    id: 'd1-2',
    name: 'NEON SYNTH BATTLE',
    description: 'A high-energy electronic music competition featuring the best DJs from across the country.',
    day: 'day1',
    time: '01:00 PM',
    venue: 'STAGE ALPHA',
    category: 'MUSIC',
    type: 'MAIN',
    reward: '₹20K + DJ Kit',
    rarity: 'RARE'
  },
  {
    id: 'd1-3',
    name: 'PIXEL ART WORKSHOP',
    description: 'Learn the fundamentals of retro game design and pixel art creation.',
    day: 'day1',
    time: '11:30 AM',
    venue: 'CREATIVE LAB',
    category: 'TECH',
    type: 'SIDE',
    rarity: 'COMMON'
  },
  // Day 2
  {
    id: 'd2-1',
    name: 'BATTLE OF BANDS',
    description: 'The ultimate rock showdown. Witness the most powerful bands competing for the crown.',
    day: 'day2',
    time: '02:00 PM',
    venue: 'MAIN STAGE',
    category: 'MUSIC',
    type: 'MAIN',
    reward: '₹50K + Recording Deal',
    rarity: 'LEGENDARY'
  },
  {
    id: 'd2-2',
    name: 'CYBER DANCE-OFF',
    description: 'High-speed choreography meets digital visuals in this futuristic dance competition.',
    day: 'day2',
    time: '12:00 PM',
    venue: 'DANCE FLOOR B',
    category: 'CULTURAL',
    type: 'MAIN',
    reward: '₹15K + Trophy',
    rarity: 'EPIC'
  },
  {
    id: 'd2-3',
    name: 'COMEDY NIGHT',
    description: 'Ending the festival with a blast of laughter. Featuring top stand-up artists.',
    day: 'day2',
    time: '07:00 PM',
    venue: 'OPEN THEATER',
    category: 'FUN',
    type: 'NIGHT',
    rarity: 'EPIC'
  }
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
