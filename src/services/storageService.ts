import { 
  Profile, Task, PomodoroSession, 
  ThemeOption, AppSettings, YouTubeVideo
} from '../models/types';

// Default predefined profiles
const DEFAULT_PROFILES: Profile[] = [
  {
    id: 'profile-work',
    name: 'Work',
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'profile-study',
    name: 'Study',
    workDuration: 50,
    shortBreakDuration: 10,
    longBreakDuration: 30,
    longBreakInterval: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'profile-playing',
    name: 'Playing',
    workDuration: 20,
    shortBreakDuration: 10,
    longBreakDuration: 20,
    longBreakInterval: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Default YouTube videos
const DEFAULT_VIDEOS: YouTubeVideo[] = [
  {
    id: 'video-1',
    title: 'Lofi Hip Hop Radio',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk'
  },
  {
    id: 'video-2',
    title: 'Ambient Study Music',
    url: 'https://www.youtube.com/watch?v=sjkrrmBnpGE'
  },
  {
    id: 'video-3',
    title: 'Focus Music',
    url: 'https://www.youtube.com/watch?v=brnafxH_0E8'
  }
];

// Default app settings
const DEFAULT_SETTINGS: AppSettings = {
  theme: 'purple-space',
  notificationsEnabled: true,
  soundEnabled: true,
  splitView: true
};

// Storage keys
const STORAGE_KEYS = {
  PROFILES: 'zenpomodoro-profiles',
  TASKS: 'zenpomodoro-tasks',
  POMODORO_SESSIONS: 'zenpomodoro-sessions',
  SETTINGS: 'zenpomodoro-settings',
  ACTIVE_PROFILE_ID: 'zenpomodoro-active-profile',
  YOUTUBE_VIDEOS: 'zenpomodoro-youtube-videos'
};

// Helper functions to initialize data
const initializeData = <T>(key: string, defaultData: T): T => {
  const storedData = localStorage.getItem(key);
  if (!storedData) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(storedData);
};

// Profile methods
export const getProfiles = (): Profile[] => {
  return initializeData<Profile[]>(STORAGE_KEYS.PROFILES, DEFAULT_PROFILES);
};

export const getProfile = (id: string): Profile | undefined => {
  const profiles = getProfiles();
  return profiles.find(profile => profile.id === id);
};

export const saveProfile = (profile: Profile): void => {
  const profiles = getProfiles();
  const existingIndex = profiles.findIndex(p => p.id === profile.id);
  
  if (existingIndex >= 0) {
    profiles[existingIndex] = { ...profile, updatedAt: new Date().toISOString() };
  } else {
    profiles.push({
      ...profile,
      id: profile.id || `profile-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
};

export const deleteProfile = (id: string): void => {
  const profiles = getProfiles();
  const filteredProfiles = profiles.filter(profile => profile.id !== id);
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(filteredProfiles));
  
  // Also delete associated tasks
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.profileId !== id);
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filteredTasks));
};

// Active profile methods
export const getActiveProfileId = (): string => {
  const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
  if (!activeId) {
    const profiles = getProfiles();
    if (profiles.length > 0) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, profiles[0].id);
      return profiles[0].id;
    }
  }
  return activeId || '';
};

export const setActiveProfileId = (id: string): void => {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, id);
};

// Task methods
export const getTasks = (): Task[] => {
  return initializeData<Task[]>(STORAGE_KEYS.TASKS, []);
};

export const getTasksByProfile = (profileId: string): Task[] => {
  const tasks = getTasks();
  return tasks.filter(task => task.profileId === profileId);
};

export const saveTask = (task: Task): void => {
  const tasks = getTasks();
  const existingIndex = tasks.findIndex(t => t.id === task.id);
  
  if (existingIndex >= 0) {
    tasks[existingIndex] = { ...task, updatedAt: new Date().toISOString() };
  } else {
    tasks.push({
      ...task,
      id: task.id || `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

export const deleteTask = (id: string): void => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filteredTasks));
};

export const deleteCompletedTasks = (profileId: string): void => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => !(task.profileId === profileId && task.completed));
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filteredTasks));
};

// Pomodoro session methods
export const getPomodoroSessions = (): PomodoroSession[] => {
  return initializeData<PomodoroSession[]>(STORAGE_KEYS.POMODORO_SESSIONS, []);
};

export const getSessionsByProfile = (profileId: string): PomodoroSession[] => {
  const sessions = getPomodoroSessions();
  return sessions.filter(session => session.profileId === profileId);
};

export const saveSession = (session: PomodoroSession): void => {
  const sessions = getPomodoroSessions();
  const existingIndex = sessions.findIndex(s => s.id === session.id);
  
  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.push({
      ...session,
      id: session.id || `session-${Date.now()}`
    });
  }
  
  localStorage.setItem(STORAGE_KEYS.POMODORO_SESSIONS, JSON.stringify(sessions));
};

// Settings methods
export const getSettings = (): AppSettings => {
  return initializeData<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

// YouTube videos methods
export const getYouTubeVideos = (): YouTubeVideo[] => {
  return initializeData<YouTubeVideo[]>(STORAGE_KEYS.YOUTUBE_VIDEOS, DEFAULT_VIDEOS);
};

export const saveYouTubeVideo = (video: YouTubeVideo): void => {
  const videos = getYouTubeVideos();
  const existingIndex = videos.findIndex(v => v.id === video.id);
  
  if (existingIndex >= 0) {
    videos[existingIndex] = video;
  } else {
    videos.push({
      ...video,
      id: video.id || `video-${Date.now()}`
    });
  }
  
  localStorage.setItem(STORAGE_KEYS.YOUTUBE_VIDEOS, JSON.stringify(videos));
};

export const deleteYouTubeVideo = (id: string): void => {
  const videos = getYouTubeVideos();
  const filteredVideos = videos.filter(video => video.id !== id);
  localStorage.setItem(STORAGE_KEYS.YOUTUBE_VIDEOS, JSON.stringify(filteredVideos));
};
