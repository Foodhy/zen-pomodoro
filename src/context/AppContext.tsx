
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  Profile,
  Task,
  PomodoroSession,
  ThemeOption,
  AppSettings,
  YouTubeVideo,
  LanguageOption,
} from "../models/types";
import * as storageService from "../services/storageService";
import notificationService from "../services/notificationService";
import { t } from "../services/translationService";

interface AppContextType {
  // Profiles
  profiles: Profile[];
  activeProfile: Profile | null;
  setActiveProfile: (profile: Profile) => void;
  saveProfile: (profile: Profile) => void;
  deleteProfile: (id: string) => void;

  // Tasks
  tasks: Task[];
  saveTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  deleteCompletedTasks: () => void;
  bulkImportTasks: (tasks: Task[]) => void;

  // Pomodoro Sessions
  sessions: PomodoroSession[];
  saveSession: (session: PomodoroSession) => void;
  exportSessionsToMarkdown: () => void;

  // Settings
  settings: AppSettings;
  saveSettings: (settings: AppSettings) => void;
  setTheme: (theme: ThemeOption) => void;
  setLanguage: (language: LanguageOption) => void;
  toggleFocusMode: () => void;

  // YouTube Videos
  videos: YouTubeVideo[];
  saveVideo: (video: YouTubeVideo) => void;
  deleteVideo: (id: string) => void;

  // UI States
  isFocusMode: boolean;
  isFullscreen: boolean;
  setIsFullscreen: (isFullscreen: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [settings, setSettings] = useState<AppSettings>(
    storageService.getSettings()
  );
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  
  // UI state
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Load data on mount
  useEffect(() => {
    const loadData = () => {
      // Load profiles
      const storedProfiles = storageService.getProfiles();
      setProfiles(storedProfiles);

      // Load active profile
      const activeProfileId = storageService.getActiveProfileId();
      const activeProf =
        storedProfiles.find((p) => p.id === activeProfileId) ||
        storedProfiles[0];
      if (activeProf) {
        setActiveProfile(activeProf);
        storageService.setActiveProfileId(activeProf.id);

        // Load tasks for active profile
        const profileTasks = storageService.getTasksByProfile(activeProf.id);
        setTasks(profileTasks);

        // Load sessions for active profile
        const profileSessions = storageService.getSessionsByProfile(
          activeProf.id
        );
        setSessions(profileSessions);
      }

      // Load settings
      setSettings(storageService.getSettings());

      // Load videos
      setVideos(storageService.getYouTubeVideos());
    };

    loadData();
  }, []);

  // Apply theme when settings change
  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove(
      "theme-purple-space",
      "theme-dark-blue",
      "theme-dark-mode",
      "theme-nes-retro",
      "theme-netflix",
      "theme-isomorphic",
      "theme-minimalist",
      "theme-skeuomorphism",
      "theme-flat-design",
      "theme-bauhaus",
      "theme-neumorphism",
      "theme-glassmorphism",
      "theme-motion",
      "theme-illustration"
    );

    document.documentElement.classList.add(`theme-${settings.theme}`);
  }, [settings.theme]);

  // Check for task notifications
  useEffect(() => {
    if (settings.notificationsEnabled) {
      // Check for task notifications on load
      notificationService.checkTaskNotifications(tasks);

      // Set up interval to check for notifications
      const intervalId = setInterval(() => {
        notificationService.checkTaskNotifications(tasks);
      }, 60000); // Check every minute

      return () => clearInterval(intervalId);
    }
  }, [tasks, settings.notificationsEnabled]);

  // Profile methods
  const handleSetActiveProfile = (profile: Profile) => {
    setActiveProfile(profile);
    storageService.setActiveProfileId(profile.id);

    // Load tasks for the selected profile
    const profileTasks = storageService.getTasksByProfile(profile.id);
    setTasks(profileTasks);

    // Load sessions for the selected profile
    const profileSessions = storageService.getSessionsByProfile(profile.id);
    setSessions(profileSessions);
  };

  const handleSaveProfile = (profile: Profile) => {
    storageService.saveProfile(profile);
    setProfiles(storageService.getProfiles());

    // If we're updating the active profile, update the local state
    if (activeProfile && profile.id === activeProfile.id) {
      setActiveProfile(profile);
    }
  };

  const handleDeleteProfile = (id: string) => {
    storageService.deleteProfile(id);
    const updatedProfiles = storageService.getProfiles();
    setProfiles(updatedProfiles);

    // If we're deleting the active profile, switch to another
    if (activeProfile && id === activeProfile.id) {
      if (updatedProfiles.length > 0) {
        handleSetActiveProfile(updatedProfiles[0]);
      } else {
        setActiveProfile(null);
        setTasks([]);
        setSessions([]);
      }
    }
  };

  // Task methods
  const handleSaveTask = (task: Task) => {
    if (activeProfile) {
      const updatedTask = { ...task, profileId: activeProfile.id };
      storageService.saveTask(updatedTask);
      setTasks(storageService.getTasksByProfile(activeProfile.id));
    }
  };

  const handleDeleteTask = (id: string) => {
    storageService.deleteTask(id);
    if (activeProfile) {
      setTasks(storageService.getTasksByProfile(activeProfile.id));
    }
  };

  const handleDeleteCompletedTasks = () => {
    if (activeProfile) {
      storageService.deleteCompletedTasks(activeProfile.id);
      setTasks(storageService.getTasksByProfile(activeProfile.id));
    }
  };

  const handleBulkImportTasks = (importedTasks: Task[]) => {
    if (activeProfile) {
      // Make sure all tasks have the current profile ID
      const profileTasks = importedTasks.map(task => ({
        ...task,
        profileId: activeProfile.id
      }));
      
      storageService.bulkImportTasks(profileTasks);
      setTasks(storageService.getTasksByProfile(activeProfile.id));
    }
  };

  // Session methods
  const handleSaveSession = (session: PomodoroSession) => {
    storageService.saveSession(session);
    if (activeProfile) {
      setSessions(storageService.getSessionsByProfile(activeProfile.id));
    }
  };

  const handleExportSessionsToMarkdown = () => {
    if (activeProfile) {
      // Format sessions for markdown export
      const formattedSessions = storageService.getFormattedSessionsForExport(activeProfile.id);
      storageService.exportSessionsToMarkdown(formattedSessions);
    }
  };

  // Settings methods
  const handleSaveSettings = (newSettings: AppSettings) => {
    storageService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleSetTheme = (theme: ThemeOption) => {
    handleSaveSettings({ ...settings, theme });
  };

  const handleSetLanguage = (language: LanguageOption) => {
    handleSaveSettings({ ...settings, language });
  };

  const handleToggleFocusMode = () => {
    setIsFocusMode(!isFocusMode);
  };

  // YouTube video methods
  const handleSaveVideo = (video: YouTubeVideo) => {
    storageService.saveYouTubeVideo(video);
    setVideos(storageService.getYouTubeVideos());
  };

  const handleDeleteVideo = (id: string) => {
    storageService.deleteYouTubeVideo(id);
    setVideos(storageService.getYouTubeVideos());
  };

  const contextValue: AppContextType = {
    profiles,
    activeProfile,
    setActiveProfile: handleSetActiveProfile,
    saveProfile: handleSaveProfile,
    deleteProfile: handleDeleteProfile,

    tasks,
    saveTask: handleSaveTask,
    deleteTask: handleDeleteTask,
    deleteCompletedTasks: handleDeleteCompletedTasks,
    bulkImportTasks: handleBulkImportTasks,

    sessions,
    saveSession: handleSaveSession,
    exportSessionsToMarkdown: handleExportSessionsToMarkdown,

    settings,
    saveSettings: handleSaveSettings,
    setTheme: handleSetTheme,
    setLanguage: handleSetLanguage,
    toggleFocusMode: handleToggleFocusMode,

    videos,
    saveVideo: handleSaveVideo,
    deleteVideo: handleDeleteVideo,

    isFocusMode,
    isFullscreen,
    setIsFullscreen,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
