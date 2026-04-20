
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
  Note,
  NoteCategory,
} from "../models/types";
import * as storageService from "../services/storageService";
import notificationService from "../services/notificationService";
import { t } from "../services/translationService";
import { 
  exportNotesToMarkdown as exportNotes,
  importVideosFromJson, 
  importSessionsFromJson, 
  importNotesFromJson
} from "../services/importExportService";

// Timer types
type TimerPhase = 'work' | 'shortBreak' | 'longBreak';

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
  exportSessionsToJson: () => void;
  importSessionsFromJsonFile: (file: File) => Promise<void>;

  // Notes
  notes: Note[];
  saveNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  exportNotesToMarkdown: () => void;
  exportNotesToJson: () => void;
  importNotesFromJsonFile: (file: File) => Promise<void>;

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
  exportVideosToJson: () => void;
  importVideosFromJsonFile: (file: File) => Promise<void>;

  // UI States
  isFocusMode: boolean;
  isFullscreen: boolean;
  setIsFullscreen: (isFullscreen: boolean) => void;

  // Timer States
  timerPhase: TimerPhase;
  timeLeft: number;
  isTimerRunning: boolean;
  pomodoroCount: number;
  currentSession: PomodoroSession | null;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipToNextPhase: () => void;
  calculateProgress: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [settings, setSettings] = useState<AppSettings>(
    storageService.getSettings()
  );
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  
  // UI state
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerPhase, setTimerPhase] = useState<TimerPhase>('work');
  const [pomodoroCount, setPomodoroCount] = useState<number>(0);
  const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

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
        
        // Load notes for active profile
        const profileNotes = storageService.getNotesByProfile(activeProf.id);
        setNotes(profileNotes);
      }

      // Load settings
      setSettings(storageService.getSettings());

      // Load videos
      setVideos(storageService.getYouTubeVideos());
    };

    loadData();
  }, []);

  // Initialize timer when active profile changes
  useEffect(() => {
    if (activeProfile) {
      resetTimer();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeProfile]);
  
  // Setup audio for timer notifications
  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3');
    audioRef.current.volume = 0.7;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  
  // Timer logic
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);
  
  // Timer completion logic
  useEffect(() => {
    if (timeLeft === 0 && isTimerRunning) {
      handleTimerComplete();
    }
  }, [timeLeft, isTimerRunning]);

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

  // Timer Functions
  const handleTimerComplete = async () => {
    setIsTimerRunning(false);
    
    // Play sound if enabled
    if (settings.soundEnabled && audioRef.current) {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error('Audio playback failed:', error);
      }
    }
    
    // Send notification
    if (settings.notificationsEnabled) {
      await notificationService.notifyPomodoroCompleted(timerPhase);
    }
    
    // Update current session as completed
    if (currentSession) {
      const completedSession: PomodoroSession = {
        ...currentSession,
        endTime: new Date().toISOString(),
        completed: true
      };
      handleSaveSession(completedSession);
      setCurrentSession(null);
    }
    
    // Determine next phase
    if (timerPhase === 'work') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      
      if (activeProfile && newCount % activeProfile.longBreakInterval === 0) {
        setTimerPhase('longBreak');
        setTimeLeft(activeProfile.longBreakDuration * 60);
      } else {
        setTimerPhase('shortBreak');
        setTimeLeft(activeProfile?.shortBreakDuration ? activeProfile.shortBreakDuration * 60 : 5 * 60);
      }
    } else {
      setTimerPhase('work');
      setTimeLeft(activeProfile?.workDuration ? activeProfile.workDuration * 60 : 25 * 60);
    }
  };
  
  const startTimer = () => {
    if (timeLeft > 0) {
      setIsTimerRunning(true);
      
      // Create a new session when starting work phase
      if (timerPhase === 'work' && !currentSession && activeProfile) {
        const newSession: PomodoroSession = {
          id: `session-${Date.now()}`,
          profileId: activeProfile.id,
          startTime: new Date().toISOString(),
          duration: activeProfile.workDuration * 60,
          type: 'work',
          completed: false
        };
        
        setCurrentSession(newSession);
        handleSaveSession(newSession);
      }
      
      // Send notification of phase started
      if (settings.notificationsEnabled) {
        notificationService.notifyPhaseStarted(timerPhase);
      }
    }
  };
  
  const pauseTimer = () => {
    setIsTimerRunning(false);
  };
  
  const resetTimer = () => {
    setIsTimerRunning(false);
    
    if (activeProfile) {
      if (timerPhase === 'work') {
        setTimeLeft(activeProfile.workDuration * 60);
      } else if (timerPhase === 'shortBreak') {
        setTimeLeft(activeProfile.shortBreakDuration * 60);
      } else {
        setTimeLeft(activeProfile.longBreakDuration * 60);
      }
    }
    
    // Clear current session if resetting during work phase
    if (timerPhase === 'work' && currentSession) {
      setCurrentSession(null);
    }
  };
  
  const skipToNextPhase = () => {
    if (currentSession && timerPhase === 'work') {
      const completedSession: PomodoroSession = {
        ...currentSession,
        endTime: new Date().toISOString(),
        completed: true
      };
      handleSaveSession(completedSession);
      setCurrentSession(null);
    }
    
    handleTimerComplete();
  };
  
  // Calculate progress percentage
  const calculateProgress = (): number => {
    if (!activeProfile) return 0;
    
    let totalSeconds;
    if (timerPhase === 'work') {
      totalSeconds = activeProfile.workDuration * 60;
    } else if (timerPhase === 'shortBreak') {
      totalSeconds = activeProfile.shortBreakDuration * 60;
    } else {
      totalSeconds = activeProfile.longBreakDuration * 60;
    }
    
    return 100 - ((timeLeft / totalSeconds) * 100);
  };

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
    
    // Load notes for the selected profile
    const profileNotes = storageService.getNotesByProfile(profile.id);
    setNotes(profileNotes);
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

  const handleExportSessionsToJson = () => {
    if (activeProfile) {
      storageService.exportSessionsToJsonFile(activeProfile.id);
    }
  };

  const handleImportSessionsFromJsonFile = async (file: File): Promise<void> => {
    try {
      if (activeProfile) {
        const importedSessions = await importSessionsFromJson(file);
        storageService.bulkImportSessions(importedSessions, activeProfile.id);
        setSessions(storageService.getSessionsByProfile(activeProfile.id));
      }
    } catch (error) {
      console.error("Error importing sessions:", error);
      throw error;
    }
  };

  // Notes methods
  const handleSaveNote = (note: Note) => {
    if (activeProfile) {
      const updatedNote = { ...note, profileId: activeProfile.id };
      storageService.saveNote(updatedNote);
      setNotes(storageService.getNotesByProfile(activeProfile.id));
    }
  };

  const handleDeleteNote = (id: string) => {
    storageService.deleteNote(id);
    if (activeProfile) {
      setNotes(storageService.getNotesByProfile(activeProfile.id));
    }
  };

  const handleExportNotesToMarkdown = () => {
    if (activeProfile) {
      const profileNotes = storageService.getNotesByProfile(activeProfile.id);
      exportNotes(profileNotes);
    }
  };

  const handleExportNotesToJson = () => {
    if (activeProfile) {
      storageService.exportNotesToJsonFile(activeProfile.id);
    }
  };

  const handleImportNotesFromJsonFile = async (file: File): Promise<void> => {
    try {
      if (activeProfile) {
        const importedNotes = await importNotesFromJson(file);
        storageService.bulkImportNotes(importedNotes, activeProfile.id);
        setNotes(storageService.getNotesByProfile(activeProfile.id));
      }
    } catch (error) {
      console.error("Error importing notes:", error);
      throw error;
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

  const handleExportVideosToJson = () => {
    storageService.exportVideosToJsonFile();
  };

  const handleImportVideosFromJsonFile = async (file: File): Promise<void> => {
    try {
      const importedVideos = await importVideosFromJson(file);
      storageService.bulkImportVideos(importedVideos);
      setVideos(storageService.getYouTubeVideos());
    } catch (error) {
      console.error("Error importing videos:", error);
      throw error;
    }
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
    exportSessionsToJson: handleExportSessionsToJson,
    importSessionsFromJsonFile: handleImportSessionsFromJsonFile,
    
    notes,
    saveNote: handleSaveNote,
    deleteNote: handleDeleteNote,
    exportNotesToMarkdown: handleExportNotesToMarkdown,
    exportNotesToJson: handleExportNotesToJson,
    importNotesFromJsonFile: handleImportNotesFromJsonFile,

    settings,
    saveSettings: handleSaveSettings,
    setTheme: handleSetTheme,
    setLanguage: handleSetLanguage,
    toggleFocusMode: handleToggleFocusMode,

    videos,
    saveVideo: handleSaveVideo,
    deleteVideo: handleDeleteVideo,
    exportVideosToJson: handleExportVideosToJson,
    importVideosFromJsonFile: handleImportVideosFromJsonFile,

    isFocusMode,
    isFullscreen,
    setIsFullscreen,
    
    // Timer states and functions
    timeLeft,
    isTimerRunning,
    timerPhase,
    pomodoroCount,
    currentSession,
    startTimer,
    pauseTimer,
    resetTimer,
    skipToNextPhase,
    calculateProgress,
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
