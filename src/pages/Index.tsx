
import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from '../context/AppContext';
import PomodoroTimer from '../components/PomodoroTimer';
import TaskList from '../components/TaskList';
import ProfileSelector from '../components/ProfileSelector';
import SettingsDrawer from '../components/SettingsDrawer';
import YouTubePlayer from '../components/YouTubePlayer';
import { Button } from '@/components/ui/button';
import { Settings, Maximize2, Minimize2, List, X } from 'lucide-react';
import notificationService from '../services/notificationService';

const MainApp: React.FC = () => {
  const { settings } = useApp();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTasksVisible, setIsTasksVisible] = useState(true);
  const [isYouTubeMinimized, setIsYouTubeMinimized] = useState(true);
  
  // Request notification permission on first load
  useEffect(() => {
    if (settings.notificationsEnabled) {
      notificationService.requestPermission();
    }
  }, [settings.notificationsEnabled]);
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  // Toggle tasks panel visibility
  const toggleTasksPanel = () => {
    setIsTasksVisible(!isTasksVisible);
  };
  
  return (
    <div className={`min-h-screen flex flex-col transition-all ${
      isFullscreen ? 'overflow-hidden' : ''
    }`}>
      {/* Header */}
      <header className="py-4 px-6 border-b border-border/50 glass-panel">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-1">
            <h1 className="text-xl font-medium">ZenPomodoro</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <ProfileSelector />
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Timer section */}
        <div className={`transition-all duration-300 ease-in-out ${
          settings.splitView && isTasksVisible && !isFullscreen
            ? 'w-full md:w-3/5 border-r border-border/50'
            : 'w-full'
        }`}>
          <div className="h-full flex flex-col items-center justify-center px-6 relative">
            <PomodoroTimer onToggleFullscreen={toggleFullscreen} />
            
            {/* Fullscreen toggle */}
            <div className="absolute top-4 right-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </Button>
            </div>
            
            {/* Task panel toggle (on mobile or fullscreen) */}
            {(settings.splitView && !isFullscreen) && (
              <div className="md:hidden absolute top-4 left-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9"
                  onClick={toggleTasksPanel}
                >
                  {isTasksVisible ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <List className="h-5 w-5" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Task panel */}
        {settings.splitView && !isFullscreen && (
          <div className={`fixed md:relative inset-0 z-10 md:z-0 md:w-2/5 bg-background md:bg-transparent transition-transform duration-300 ${
            isTasksVisible ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}>
            <div className="h-full md:hidden absolute top-4 right-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9"
                onClick={toggleTasksPanel}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="h-full p-6 md:pt-12 overflow-y-auto">
              <TaskList collapsed={!isTasksVisible} />
            </div>
          </div>
        )}
      </main>
      
      {/* Settings drawer */}
      <SettingsDrawer 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen}
      />
      
      {/* YouTube player */}
      <YouTubePlayer 
        minimized={isYouTubeMinimized}
        onToggleMinimize={() => setIsYouTubeMinimized(!isYouTubeMinimized)}
      />
    </div>
  );
};

const Index = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default Index;
