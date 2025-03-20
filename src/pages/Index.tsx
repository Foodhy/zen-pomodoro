
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import PomodoroTimer from '../components/PomodoroTimer';
import TaskList from '../components/TaskList';
import NotesPlanner from '../components/NotesPlanner';
import ProfileSelector from '../components/ProfileSelector';
import SettingsDrawer from '../components/SettingsDrawer';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Maximize, Minimize, Settings } from 'lucide-react';
import YouTubePlayerWithImportExport from '../components/YouTubePlayerWithImportExport';
import SessionHistory from '../components/SessionHistory';
import NotesImportExport from '../components/NotesImportExport';

const Index = () => {
  const { settings, isFullscreen, setIsFullscreen, isFocusMode } = useApp();
  const [activeTab, setActiveTab] = useState('timer');
  const [hasMounted, setHasMounted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Handle fullscreen toggle
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

  // Set mounted state after hydration
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Exit handler for fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [setIsFullscreen]);

  if (!hasMounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className={`container pt-4 ${isFocusMode ? 'focus-mode' : ''}`}>
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">ZenPomodoro</h1>
          <ProfileSelector />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            className="rounded-full"
          >
            {isFullscreen ? <Minimize /> : <Maximize />}
          </Button>
          <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} />
        </div>
      </header>

      <div className={`${settings.splitView ? 'grid md:grid-cols-2 gap-4' : ''}`}>
        <div className="space-y-4">
          <Tabs defaultValue="timer" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-2">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="timer">Timer</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              {activeTab === 'notes' && <NotesImportExport />}
            </div>
            <TabsContent value="timer" className="tab-content">
              <PomodoroTimer onToggleFullscreen={toggleFullscreen} />
            </TabsContent>
            <TabsContent value="tasks" className="tab-content">
              <TaskList />
            </TabsContent>
            <TabsContent value="notes" className="tab-content">
              <NotesPlanner />
            </TabsContent>
          </Tabs>
        </div>

        {settings.splitView && (
          <div className="space-y-4">
            <Tabs defaultValue="history">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="music">Music</TabsTrigger>
                <TabsTrigger value="app">App</TabsTrigger>
              </TabsList>
              <TabsContent value="history" className="tab-content">
                <SessionHistory />
              </TabsContent>
              <TabsContent value="music" className="tab-content">
                <YouTubePlayerWithImportExport />
              </TabsContent>
              <TabsContent value="app" className="tab-content">
                <div className="space-y-4 p-4 bg-background rounded-lg border">
                  <h3 className="text-lg font-medium">App Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Language</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant={settings.language === 'en' ? 'default' : 'outline'}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => settings.language !== 'en' && setActiveTab('en')}
                        >
                          English
                        </Button>
                        <Button 
                          variant={settings.language === 'es' ? 'default' : 'outline'}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => settings.language !== 'es' && setActiveTab('es')}
                        >
                          Español
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Display</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex justify-between items-center"
                        onClick={() => setSettingsOpen(true)}
                      >
                        <span>More Settings</span>
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
