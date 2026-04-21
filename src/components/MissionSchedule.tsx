import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterModal from './RegisterModal';
import './MissionSchedule.css';

type MissionStatus = 'LIVE' | 'UPCOMING' | 'COMPLETED';

interface Mission {
  id: string;
  name: string;
  time: string;
  date: string;
  status: MissionStatus;
  description: string;
  venue?: string;
  link?: string;
  audience?: string;
}

const MISSIONS: Mission[] = [
  {
    id: 'm1',
    name: 'PRE PROM',
    time: 'TBA',
    date: 'APRIL 17',
    status: 'UPCOMING',
    description: 'A pre-prom celebration to get everyone in the mood for the big night!',
    venue: 'Main Campus',
    audience: 'SSCBS Students Only'
  },
  {
    id: 'm3',
    name: 'PROM NIGHT',
    time: '18:00',
    date: 'APRIL 22',
    status: 'UPCOMING',
    description: 'A magical evening of music, dance, and memories under the neon lights.',
    venue: 'College Auditorium',
    link: '/#register',
    audience: 'SSCBS Students Only'
  },
  {
    id: 'm4',
    name: 'DAY 1',
    time: '09:00',
    date: 'APRIL 23',
    status: 'UPCOMING',
    description: 'The official kickoff! Technical and non-technical events, food stalls, and interactive games.',
    venue: 'Campus Wide',
    audience: 'Open to All College Students'
  },
  {
    id: 'm5',
    name: 'DAY 2',
    time: '09:00',
    date: 'APRIL 24',
    status: 'UPCOMING',
    description: 'The grand finale featuring the neon concert, prize distributions, and closing ceremony.',
    venue: 'Main Stage',
    audience: 'Open to All College Students'
  }
];

function getMissionStatus(dateStr: string): MissionStatus {
  const missionDate = new Date(`${dateStr}, 2026`);
  missionDate.setHours(0, 0, 0, 0);
  const checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);

  if (checkDate.getTime() > missionDate.getTime()) return 'COMPLETED';
  if (checkDate.getTime() === missionDate.getTime()) return 'LIVE';
  return 'UPCOMING';
}

export default function MissionSchedule() {
  const navigate = useNavigate();
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [dayProgress, setDayProgress] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus management for keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement !== containerRef.current) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, MISSIONS.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const computedMissions = MISSIONS.map(m => ({ ...m, status: getMissionStatus(m.date) }));
        const mission = computedMissions[focusedIndex];
        if (activeMissionId === mission.id) {
          setActiveMissionId(null);
        } else {
          setActiveMissionId(mission.id);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setActiveMissionId(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, activeMissionId]);

  // Meaningful real-time day progress (0-100% based on time of day)
  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
      const percent = (totalSeconds / 86400) * 100;
      setDayProgress(percent);
    };

    updateProgress();
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRowClick = (missionId: string, index: number) => {
    setFocusedIndex(index);
    setActiveMissionId(prev => prev === missionId ? null : missionId);
  };

  const computedMissions = MISSIONS.map(m => ({ ...m, status: getMissionStatus(m.date) }));
  const activeMission = computedMissions.find(m => m.id === activeMissionId);

  const handleRegisterClick = () => {
    if (!activeMission) return;
    if (activeMission.id === 'm1' || activeMission.id === 'm3') navigate('/prom');
    else if (activeMission.id === 'm4') window.open('https://forms.gle/YMtcRaATu6NddyJC8', '_blank');
    else if (activeMission.id === 'm5') window.open('https://forms.gle/mu4qU5cSUpRy7wKk9', '_blank');
    else setShowRegister(true);
  };

  return (
    <>
    <div 
      className="mission-terminal" 
      tabIndex={0} 
      ref={containerRef}
    >
      <div className="mission-list">
        {computedMissions.map((mission, index) => {
          const isActive = activeMissionId === mission.id;
          const isFocused = focusedIndex === index;
          const isTentative = false; // We no longer use tentative

          return (
            <div 
              key={mission.id}
              className={`mission-row ${isActive ? 'active' : ''} ${isTentative ? 'tentative' : ''} ${isFocused ? 'focused' : ''}`}
              onClick={() => handleRowClick(mission.id, index)}
            >
              <span className="mission-indicator">&gt;</span>
              <span className="mission-time">{mission.time}</span>
              <span className="mission-name">{mission.name}</span>
              
              <span className={`mission-tag tag-${mission.status.toLowerCase()}`}>
                {mission.status}
              </span>
            </div>
          );
        })}
      </div>

      <div className="progress-container">
        <div className="progress-label">⚡ DAY PROGRESS // LIVE</div>
        <div className="stat-bar">
          <div className="stat-bar-fill" style={{ width: `${dayProgress}%` }}></div>
        </div>
      </div>

      {activeMission && (
        <div className="mission-panel">
          <div className="panel-header">
            <span className="panel-title">{activeMission.name}</span>
            <span className="panel-close" onClick={() => setActiveMissionId(null)}>[X]</span>
          </div>
          
          <div className="panel-detail">
            <span className="panel-detail-label">📅 DATE:</span>
            <span>{activeMission.date}</span>
          </div>

          <div className="panel-detail">
            <span className="panel-detail-label">⏲ TIME:</span>
            <span>{activeMission.time}</span>
          </div>
          
          <div className="panel-detail">
            <span className="panel-detail-label">📍 LOC:</span>
            <span>{activeMission.venue || 'TBA'}</span>
          </div>

          <div className="panel-detail">
            <span className="panel-detail-label">👥 FOR:</span>
            <span>{activeMission.audience || 'TBA'}</span>
          </div>

          <div className="panel-desc">
            {activeMission.description}
          </div>

          <button
            className="panel-register-btn"
            disabled={activeMission.status === 'COMPLETED'}
            onClick={activeMission.status === 'COMPLETED' ? undefined : handleRegisterClick}
          >
            {activeMission.status === 'COMPLETED' ? 'MISSION ENDED' : 'REGISTER NOW'}
          </button>
        </div>
      )}
    </div>

    <RegisterModal
      isOpen={showRegister}
      onClose={() => setShowRegister(false)}
    />
  </>);
}
