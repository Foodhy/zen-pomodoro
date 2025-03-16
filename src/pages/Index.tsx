
import React, { useState, useEffect } from "react";
import { AppProvider, useApp } from "../context/AppContext";
import PomodoroTimer from "../components/PomodoroTimer";
import TaskList from "../components/TaskList";
import ProfileSelector from "../components/ProfileSelector";
import SettingsDrawer from "../components/SettingsDrawer";
import YouTubePlayer from "../components/YouTubePlayer";
import { Button } from "@/components/ui/button";
import { Settings, Maximize2, Minimize2, List, X, Focus } from "lucide-react";
import notificationService from "../services/notificationService";
import { initKeyboardShortcuts } from "../services/keyboardService";
import { t } from "../services/translationService";

const MainApp: React.FC = () => {
  const { 
    settings, 
    setIsFullscreen, 
    isFocusMode, 
    toggleFocusMode,
    isFullscreen
  } = useApp();
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTasksVisible, setIsTasksVisible] = useState(true);
  const [isYouTubeMinimized, setIsYouTubeMinimized] = useState(true);

  // Request notification permission on first load
  useEffect(() => {
    if (settings.notificationsEnabled) {
      notificationService.requestPermission();
    }
  }, [settings.notificationsEnabled]);

  // Set up keyboard shortcuts
  useEffect(() => {
    if (settings.keyboardShortcutsEnabled) {
      const cleanup = initKeyboardShortcuts({
        onToggleFullscreen: () => setIsFullscreen(!isFullscreen),
        onToggleTasks: () => setIsTasksVisible(!isTasksVisible),
        onToggleSettings: () => setIsSettingsOpen(!isSettingsOpen),
        onToggleFocusMode: () => toggleFocusMode(),
      }, settings.keyboardShortcutsEnabled);
      
      return cleanup;
    }
  }, [settings.keyboardShortcutsEnabled, isFullscreen, isTasksVisible, isSettingsOpen, isFocusMode]);

  // Toggle fullscreen mode
  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Toggle tasks panel visibility
  const toggleTasksPanel = () => {
    setIsTasksVisible(!isTasksVisible);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-all ${
        isFullscreen ? "overflow-hidden" : ""
      } ${isFocusMode ? "focus-mode" : ""}`}
    >
      {/* Header - Hide in focus mode */}
      {!isFocusMode && (
        <header className="py-4 px-6 border-b border-border/50 glass-panel">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-1">
              <h1 className="text-sm hidden md:text-xl md:block font-bold">
                {t("app.title", settings.language)}
              </h1>
              <h1 className="text-sm sm:block md:hidden font-bold">ZP</h1>
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
      )}

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Timer section */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            settings.splitView && isTasksVisible && !isFullscreen && !isFocusMode
              ? "w-full md:w-3/5 border-r border-border/50"
              : "w-full"
          }`}
        >
          <div className="h-full flex flex-col items-center justify-center px-6 relative">
            <PomodoroTimer onToggleFullscreen={handleToggleFullscreen} />

            {/* Control buttons - always visible */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={toggleFocusMode}
                title={t("settings.toggleFocusMode", settings.language)}
              >
                <Focus className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={handleToggleFullscreen}
                title={t("settings.toggleFullscreen", settings.language)}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Task panel toggle (on mobile or fullscreen) - Hide in focus mode */}
            {settings.splitView && !isFullscreen && !isFocusMode && (
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

        {/* Task panel - Hide in focus mode */}
        {settings.splitView && !isFullscreen && !isFocusMode && (
          <div
            className={`fixed md:relative inset-0 z-10 md:z-0 md:w-2/5 bg-background md:bg-transparent transition-transform duration-300 ${
              isTasksVisible
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            }`}
          >
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
      <SettingsDrawer open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />

      {/* YouTube player - Always visible but can be minimized */}
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
