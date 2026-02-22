
import React, { useState, useEffect } from 'react';
import PomodoroTimer from '../components/PomodoroTimer';
import TaskList from '../components/TaskList';
import NotesPlanner from '../components/NotesPlanner';
import ProfileSelector from '../components/ProfileSelector';
import SettingsDrawer from '../components/SettingsDrawer';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Maximize, Minimize, Settings, Timer, CheckSquare, FileText, History, Music } from 'lucide-react';
import YouTubePlayerWithImportExport from '../components/YouTubePlayerWithImportExport';
import SessionHistory from '../components/SessionHistory';


type LeftTab = 'timer' | 'tasks' | 'notes';
type RightTab = 'history' | 'music';

const Index = () => {
  const { settings, isFullscreen, setIsFullscreen, isFocusMode, pomodoroCount, sessions, timeLeft, isTimerRunning, timerPhase } = useApp();
  const [leftTab, setLeftTab] = useState<LeftTab>('timer');
  const [rightTab, setRightTab] = useState<RightTab>('history');
  const [hasMounted, setHasMounted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const isSplitView = settings.splitView;
  const [singleTab, setSingleTab] = useState<'timer' | 'notes' | 'tasks' | 'history' | 'music'>('timer');

  // Update document title with timer countdown
  useEffect(() => {
    const formatTime = (seconds: number): string => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const phaseLabel = timerPhase === 'work' ? 'Focus' : timerPhase === 'shortBreak' ? 'Break' : 'Long Break';

    if (isTimerRunning) {
      document.title = `${formatTime(timeLeft)} — ${phaseLabel} | Zen Pomodoro`;
    } else if (timeLeft > 0) {
      document.title = `${formatTime(timeLeft)} (paused) | Zen Pomodoro`;
    } else {
      document.title = 'Zen Pomodoro';
    }

    return () => {
      document.title = 'Zen Pomodoro';
    };
  }, [timeLeft, isTimerRunning, timerPhase]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [setIsFullscreen]);

  const totalFocusMinutes = sessions
    .filter(s => s.type === 'work' && s.completed)
    .reduce((acc, s) => acc + Math.round(s.duration / 60), 0);

  if (!hasMounted) return null;

  return (
    <div className={`zen-layout relative z-10 ${isFocusMode ? 'focus-mode' : ''}`}>
      {/* Header */}
      <header className="zen-header">
        <div className="zen-header-left">
          <h1 className="zen-brand">Zen Pomodoro</h1>
          <ProfileSelector />
        </div>
        <div className="zen-header-right">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="zen-icon-btn"
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            className="zen-icon-btn"
            aria-label="Open settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} />
        </div>
      </header>

      {/* Main content */}
      {isSplitView ? (
        /* Split view: Timer bigger (left), secondary panel (right) */
        <main className="zen-main">
          {/* Left panel - Timer / Tasks / Notes (bigger) */}
          <div className="zen-card">
            <div className="zen-tab-bar">
              <button
                className={`zen-tab ${leftTab === 'timer' ? 'zen-tab-active' : ''}`}
                onClick={() => setLeftTab('timer')}
              >
                <Timer className="h-3.5 w-3.5" />
                Timer
              </button>
              <button
                className={`zen-tab ${leftTab === 'tasks' ? 'zen-tab-active' : ''}`}
                onClick={() => setLeftTab('tasks')}
              >
                <CheckSquare className="h-3.5 w-3.5" />
                Tasks
              </button>
              <button
                className={`zen-tab ${leftTab === 'notes' ? 'zen-tab-active' : ''}`}
                onClick={() => setLeftTab('notes')}
              >
                <FileText className="h-3.5 w-3.5" />
                Notes
              </button>
            </div>
            <div className="zen-panel-body">
              {leftTab === 'timer' && <PomodoroTimer onToggleFullscreen={toggleFullscreen} />}
              {leftTab === 'tasks' && <TaskList />}
              {leftTab === 'notes' && <NotesPlanner />}
            </div>
          </div>

          {/* Right panel - History / Music */}
          <div className="zen-card">
            <div className="zen-tab-bar">
              <button
                className={`zen-tab ${rightTab === 'history' ? 'zen-tab-active' : ''}`}
                onClick={() => setRightTab('history')}
              >
                <History className="h-3.5 w-3.5" />
                History
              </button>
              <button
                className={`zen-tab ${rightTab === 'music' ? 'zen-tab-active' : ''}`}
                onClick={() => setRightTab('music')}
              >
                <Music className="h-3.5 w-3.5" />
                Music
              </button>
            </div>
            <div className="zen-panel-body">
              {rightTab === 'history' && <SessionHistory />}
              {rightTab === 'music' && <YouTubePlayerWithImportExport />}
            </div>
          </div>
        </main>
      ) : (
        /* Single panel mode */
        <main className="zen-main-single">
          <div className="zen-card zen-card-expanded">
            <div className="zen-tab-bar">
              <button className={`zen-tab ${singleTab === 'timer' ? 'zen-tab-active' : ''}`} onClick={() => setSingleTab('timer')}>
                <Timer className="h-3.5 w-3.5" />
                Timer
              </button>
              <button className={`zen-tab ${singleTab === 'tasks' ? 'zen-tab-active' : ''}`} onClick={() => setSingleTab('tasks')}>
                <CheckSquare className="h-3.5 w-3.5" />
                Tasks
              </button>
              <button className={`zen-tab ${singleTab === 'notes' ? 'zen-tab-active' : ''}`} onClick={() => setSingleTab('notes')}>
                <FileText className="h-3.5 w-3.5" />
                Notes
              </button>
              <button className={`zen-tab ${singleTab === 'history' ? 'zen-tab-active' : ''}`} onClick={() => setSingleTab('history')}>
                <History className="h-3.5 w-3.5" />
                History
              </button>
              <button className={`zen-tab ${singleTab === 'music' ? 'zen-tab-active' : ''}`} onClick={() => setSingleTab('music')}>
                <Music className="h-3.5 w-3.5" />
                Music
              </button>
            </div>
            <div className="zen-panel-body">
              {singleTab === 'timer' && <PomodoroTimer onToggleFullscreen={toggleFullscreen} />}
              {singleTab === 'tasks' && <TaskList />}
              {singleTab === 'notes' && <NotesPlanner />}
              {singleTab === 'history' && <SessionHistory />}
              {singleTab === 'music' && <YouTubePlayerWithImportExport />}
            </div>
          </div>
        </main>
      )}

      {/* Stats row */}
      <div className="zen-stats">
        <div className="zen-stat-card">
          <span className="zen-stat-label">Pomodoros</span>
          <span className="zen-stat-value">{pomodoroCount}</span>
        </div>
        <div className="zen-stat-card">
          <span className="zen-stat-label">Total Focus</span>
          <span className="zen-stat-value">
            {totalFocusMinutes} <span className="zen-stat-unit">min</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Index;
