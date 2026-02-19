
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
import NotesImportExport from '../components/NotesImportExport';

type LeftTab = 'timer' | 'notes';
type RightTab = 'tasks' | 'history' | 'music';

const Index = () => {
  const { settings, isFullscreen, setIsFullscreen, isFocusMode, pomodoroCount, sessions } = useApp();
  const [leftTab, setLeftTab] = useState<LeftTab>('timer');
  const [rightTab, setRightTab] = useState<RightTab>('tasks');
  const [hasMounted, setHasMounted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

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

  // Calculate total focus minutes from completed sessions
  const totalFocusMinutes = sessions
    .filter(s => s.type === 'work' && s.completed)
    .reduce((acc, s) => acc + Math.round(s.duration / 60), 0);

  if (!hasMounted) return null;

  return (
    <div className={`zen-layout relative z-10 ${isFocusMode ? 'focus-mode' : ''}`}>
      {/* Header */}
      <header className="zen-header">
        <div className="flex items-center gap-3">
          <h1 className="zen-brand">Zen Pomodoro</h1>
          <ProfileSelector />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="zen-icon-btn"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            className="zen-icon-btn"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} />
        </div>
      </header>

      {/* Main content */}
      <main className="zen-main">
        {/* Left panel - Timer */}
        <div className="zen-card">
          {/* Left tab bar */}
          <div className="zen-tab-bar">
            <button
              className={`zen-tab ${leftTab === 'timer' ? 'zen-tab-active' : ''}`}
              onClick={() => setLeftTab('timer')}
            >
              <Timer className="h-3.5 w-3.5" />
              Timer
            </button>
            <button
              className={`zen-tab ${leftTab === 'notes' ? 'zen-tab-active' : ''}`}
              onClick={() => setLeftTab('notes')}
            >
              <FileText className="h-3.5 w-3.5" />
              Notes
              {leftTab === 'notes' && (
                <span className="ml-auto">
                  <NotesImportExport />
                </span>
              )}
            </button>
          </div>

          <div className="zen-panel-body">
            {leftTab === 'timer' && (
              <PomodoroTimer onToggleFullscreen={toggleFullscreen} />
            )}
            {leftTab === 'notes' && (
              <NotesPlanner />
            )}
          </div>
        </div>

        {/* Right panel - Tasks / History / Music */}
        <div className="zen-card">
          {/* Right tab bar */}
          <div className="zen-tab-bar">
            <button
              className={`zen-tab ${rightTab === 'tasks' ? 'zen-tab-active' : ''}`}
              onClick={() => setRightTab('tasks')}
            >
              <CheckSquare className="h-3.5 w-3.5" />
              Tasks
            </button>
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
            {rightTab === 'tasks' && <TaskList />}
            {rightTab === 'history' && <SessionHistory />}
            {rightTab === 'music' && <YouTubePlayerWithImportExport />}
          </div>
        </div>
      </main>

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
