
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Profile, Task, PomodoroSession, 
  ThemeOption, AppSettings, YouTubeVideo 
} from '../models/types';
import * as storageService from '../services/storageService';
import notificationService from '../services/notificationService';

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
  
  // Pomodoro Sessions
  sessions: PomodoroSession[];
  saveSession: (session: PomodoroSession) => void;
  
  // Settings
  settings: AppSettings;
  saveSettings: (settings: AppSettings) => void;
  setTheme: (theme: ThemeOption) => void;
  
  // YouTube Videos
  videos: YouTubeVideo[];
  saveVideo: (video: YouTubeVideo) => void;
  deleteVideo: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [settings, setSettings] = useState<AppSettings>(storageService.getSettings());
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);

  // Load data on mount
  useEffect(() => {
    const loadData = () => {
      // Load profiles
      const storedProfiles = storageService.getProfiles();
      setProfiles(storedProfiles);
      
      // Load active profile
      const activeProfileId = storageService.getActiveProfileId();
      const activeProf = storedProfiles.find(p => p.id === activeProfileId) || storedProfiles[0];
      if (activeProf) {
        setActiveProfile(activeProf);
        storageService.setActiveProfileId(activeProf.id);
        
        // Load tasks for active profile
        const profileTasks = storageService.getTasksByProfile(activeProf.id);
        setTasks(profileTasks);
        
        // Load sessions for active profile
        const profileSessions = storageService.getSessionsByProfile(activeProf.id);
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
    document.documentElement.classList.remove('theme-purple-space', 'theme-dark-blue', 'theme-dark-mode');
    
    if (settings.theme === 'dark-blue') {
      document.documentElement.classList.add('theme-dark-blue');
    } else if (settings.theme === 'dark-mode') {
      document.documentElement.classList.add('theme-dark-mode');
    }
    // Default 'purple-space' theme is the root theme, no need to add class
  }, [settings.theme]);

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

  // Session methods
  const handleSaveSession = (session: PomodoroSession) => {
    storageService.saveSession(session);
    if (activeProfile) {
      setSessions(storageService.getSessionsByProfile(activeProfile.id));
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
    
    sessions,
    saveSession: handleSaveSession,
    
    settings,
    saveSettings: handleSaveSettings,
    setTheme: handleSetTheme,
    
    videos,
    saveVideo: handleSaveVideo,
    deleteVideo: handleDeleteVideo
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
