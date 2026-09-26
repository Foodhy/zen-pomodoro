
import { v4 as uuidv4 } from 'uuid';
import { 
  Profile, 
  Task, 
  PomodoroSession, 
  AppSettings, 
  YouTubeVideo,
  ThemeOption,
  Note
} from '../models/types';
import { 
  exportNotesToMarkdown, 
  exportSessionsToMarkdown as exportSessionsToMd,
  exportVideosToJson,
  exportSessionsToJson,
  exportNotesToJson
} from './importExportService';

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  theme: 'retro-wave',
  notificationsEnabled: true,
  soundEnabled: true,
  splitView: false,
  language: 'en',
  keyboardShortcutsEnabled: true,
  focusModeEnabled: false,
  autoContinueCycle: false,
  notificationSound: 'classic'
};

// Default profiles
const DEFAULT_PROFILES: Profile[] = [
  {
    id: 'default',
    name: 'Focus',
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'deep-work',
    name: 'Deep Work',
    workDuration: 50,
    shortBreakDuration: 10,
    longBreakDuration: 30,
    longBreakInterval: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'short-sprint',
    name: 'Short Sprint',
    workDuration: 15,
    shortBreakDuration: 3,
    longBreakDuration: 10,
    longBreakInterval: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];


// Default YouTube videos
const DEFAULT_YOUTUBE_VIDEOS: YouTubeVideo[] = [
  {
    id: 'yt-default-1',
    title: '🎵 Lofi Hiphop Radio - Study/Relax/Game',
    url: 'https://www.youtube.com/watch?v=m4ArvE3hFLo'
  },
  {
    id: 'yt-default-2',
    title: '🎵 1 Hour of Rain Lofi Hip Hop',
    url: 'https://www.youtube.com/watch?v=KuC4dBSHUoA'
  },
  {
    id: 'yt-default-3',
    title: '🎵 City of Gamers — chill studying lofi mix',
    url: 'https://www.youtube.com/watch?v=AskMUDFV57k'
  },
  {
    id: 'yt-default-4',
    title: '🎹 1 Hour of Slow LoFi Hip Hop',
    url: 'https://www.youtube.com/watch?v=fSnCDspFC-g'
  },
  {
    id: 'yt-default-5b',
    title: '🎵 3 A.M Coding Session - Chillstep Beats',
    url: 'https://www.youtube.com/watch?v=Yd7vDterctQ'
  },
  {
    id: 'yt-default-5',
    title: '🎵 1 9 9 4　ＦRＥQ U E Ｎ C Y // Synthwave',
    url: 'https://www.youtube.com/watch?v=-0VRrnJx7u8'
  },
  {
    id: 'yt-default-6',
    title: '🎵 THE BEST GYM PHONK 2025',
    url: 'https://www.youtube.com/watch?v=zM1H3NkMYv4'
  },
  {
    id: 'yt-default-claude',
    title: '🎵 Claude FM - music for thinking and building',
    url: 'https://www.youtube.com/watch?v=tRsQsTMvPNg'
  },
  // SoundCloud defaults
  {
    id: 'sc-default-1',
    title: '☁️ 4 A.M Study Session 📚 - lofi hip hop/chill beats',
    url: 'https://soundcloud.com/lofi_girl/4-am-studysession'
  },
  {
    id: 'sc-default-2',
    title: '☁️ Phonk',
    url: 'https://soundcloud.com/lander-gonzalo-ramirez-rojas/sets/phonk'
  },
  {
    id: 'sc-default-3',
    title: '☁️ Chill/Relaxing Pokémon music (Gen 4 & 5)',
    url: 'https://soundcloud.com/qinoxis-95450564/sets/chill-relaxing-pokemon-music'
  },
  {
    id: 'sc-default-4',
    title: '☁️ Relax and Chill',
    url: 'https://soundcloud.com/gregory-innovo/sets/relax-and-chill'
  },
  {
    id: 'sc-default-5',
    title: "☁️ WESTLIBERTY'S - Immersion",
    url: 'https://soundcloud.com/wuh4n/westlibertys-immersion'
  },
  // Spotify defaults
  {
    id: 'sp-default-1',
    title: '🟢 The Start up, investment and more',
    url: 'https://open.spotify.com/playlist/5PqMbsx7V1y1YfjZfTlDku'
  },
  {
    id: 'sp-default-2',
    title: '🟢 Learning to code',
    url: 'https://open.spotify.com/album/1tR9wqOiY6bgJNloyNpAIi'
  },
  {
    id: 'sp-default-3',
    title: '🟢 Dark Ambient - music to escape/dream to',
    url: 'https://open.spotify.com/playlist/07lYUEyTkWP3NqIa7Kzyqx'
  },
  {
    id: 'sp-default-4',
    title: '🟢 Synthwave - beats to chill/game to',
    url: 'https://open.spotify.com/playlist/1YIe34rcmLjCYpY9wJoM2p'
  },
  {
    id: 'sp-default-5',
    title: '🟢 Goth (Slowed + Reverb)',
    url: 'https://open.spotify.com/album/7FcVJdKdyryXNniCPg75fi'
  }
];

// Local storage keys
const KEYS = {
  PROFILES: 'zen_profiles',
  ACTIVE_PROFILE: 'zen_active_profile',
  TASKS: 'zen_tasks',
  SESSIONS: 'zen_sessions',
  SETTINGS: 'zen_settings',
  VIDEOS: 'zen_youtube_videos',
  NOTES: 'zen_notes'
};

// PROFILES

// Get all profiles
export const getProfiles = (): Profile[] => {
  const profiles = localStorage.getItem(KEYS.PROFILES);
  if (!profiles) {
    // Initialize with default profiles
    localStorage.setItem(KEYS.PROFILES, JSON.stringify(DEFAULT_PROFILES));
    return DEFAULT_PROFILES;
  }
  return JSON.parse(profiles);
};


// Save a profile
export const saveProfile = (profile: Profile): void => {
  const profiles = getProfiles();
  const now = new Date().toISOString();
  
  if (!profile.id) {
    // New profile
    profile.id = uuidv4();
    profile.createdAt = now;
    profile.updatedAt = now;
    profiles.push(profile);
  } else {
    // Update existing profile
    const index = profiles.findIndex(p => p.id === profile.id);
    if (index >= 0) {
      profile.updatedAt = now;
      profiles[index] = profile;
    } else {
      // Not found, add as new
      profile.createdAt = now;
      profile.updatedAt = now;
      profiles.push(profile);
    }
  }
  
  localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));
};

// Delete a profile
export const deleteProfile = (id: string): void => {
  const profiles = getProfiles().filter(p => p.id !== id);
  localStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));
  
  // If we deleted the active profile, set another one as active
  if (getActiveProfileId() === id && profiles.length > 0) {
    setActiveProfileId(profiles[0].id);
  }
};

// Get active profile ID
export const getActiveProfileId = (): string => {
  return localStorage.getItem(KEYS.ACTIVE_PROFILE) || '';
};

// Set active profile ID
export const setActiveProfileId = (id: string): void => {
  localStorage.setItem(KEYS.ACTIVE_PROFILE, id);
};

// TASKS

// Get tasks for a profile
export const getTasksByProfile = (profileId: string): Task[] => {
  const tasks = getAllTasks();
  return tasks.filter(task => task.profileId === profileId);
};

// Get all tasks
export const getAllTasks = (): Task[] => {
  const tasks = localStorage.getItem(KEYS.TASKS);
  return tasks ? JSON.parse(tasks) : [];
};

// Save a task
export const saveTask = (task: Task): void => {
  const tasks = getAllTasks();
  const now = new Date().toISOString();
  
  if (!task.id) {
    // New task
    task.id = uuidv4();
    task.createdAt = now;
    task.updatedAt = now;
    tasks.push(task);
  } else {
    // Update existing task
    const index = tasks.findIndex(t => t.id === task.id);
    if (index >= 0) {
      task.updatedAt = now;
      tasks[index] = task;
    } else {
      // Not found, add as new
      task.createdAt = now;
      task.updatedAt = now;
      tasks.push(task);
    }
  }
  
  localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
};

// Delete a task
export const deleteTask = (id: string): void => {
  const tasks = getAllTasks().filter(t => t.id !== id);
  localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
};

// Delete completed tasks for a profile
export const deleteCompletedTasks = (profileId: string): void => {
  const tasks = getAllTasks().filter(t => !t.completed || t.profileId !== profileId);
  localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
};

// Bulk import tasks
export const bulkImportTasks = (tasksToImport: Task[]): void => {
  const existingTasks = getAllTasks();
  const now = new Date().toISOString();
  
  // Process each imported task
  const processedTasks = tasksToImport.map(task => {
    if (!task.id) {
      task.id = uuidv4();
    }
    if (!task.createdAt) {
      task.createdAt = now;
    }
    task.updatedAt = now;
    return task;
  });
  
  // Combine existing and new tasks, replacing any duplicates
  const allTasks = [...existingTasks];
  
  processedTasks.forEach(newTask => {
    const existingIndex = allTasks.findIndex(t => t.id === newTask.id);
    if (existingIndex >= 0) {
      allTasks[existingIndex] = newTask;
    } else {
      allTasks.push(newTask);
    }
  });
  
  localStorage.setItem(KEYS.TASKS, JSON.stringify(allTasks));
};

// SESSIONS

// Get sessions for a profile
export const getSessionsByProfile = (profileId: string): PomodoroSession[] => {
  const sessions = getAllSessions();
  return sessions.filter(session => session.profileId === profileId);
};

// Get all sessions
export const getAllSessions = (): PomodoroSession[] => {
  const sessions = localStorage.getItem(KEYS.SESSIONS);
  return sessions ? JSON.parse(sessions) : [];
};

// Save a session
export const saveSession = (session: PomodoroSession): void => {
  const sessions = getAllSessions();
  
  if (!session.id) {
    session.id = uuidv4();
    sessions.push(session);
  } else {
    const index = sessions.findIndex(s => s.id === session.id);
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }
  }
  
  localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
};

// Format sessions for export
export const getFormattedSessionsForExport = (profileId: string): Record<string, any> => {
  const sessions = getSessionsByProfile(profileId);
  const formattedSessions: Record<string, any[]> = {};
  
  sessions.forEach(session => {
    const date = new Date(session.startTime).toISOString().split('T')[0];
    const time = new Date(session.startTime).toLocaleTimeString();
    
    if (!formattedSessions[date]) {
      formattedSessions[date] = [];
    }
    
    formattedSessions[date].push({
      time,
      type: session.type,
      duration: session.duration,
      notes: session.notes || '',
      task: session.associatedTaskId ? getTaskTitle(session.associatedTaskId) : ''
    });
  });
  
  return formattedSessions;
};

// Helper function to get task title by ID
const getTaskTitle = (taskId: string): string => {
  const tasks = getAllTasks();
  const task = tasks.find(t => t.id === taskId);
  return task ? task.title : 'Unknown Task';
};

// Export sessions to markdown
export const exportSessionsToMarkdown = (formattedSessions: Record<string, any>): void => {
  exportSessionsToMd(formattedSessions);
};

// Export videos to JSON
export const exportVideosToJsonFile = (): void => {
  const videos = getYouTubeVideos();
  exportVideosToJson(videos);
};

// Export sessions to JSON
export const exportSessionsToJsonFile = (profileId: string): void => {
  const sessions = getSessionsByProfile(profileId);
  exportSessionsToJson(sessions);
};

// Export notes to JSON
export const exportNotesToJsonFile = (profileId: string): void => {
  const notes = getNotesByProfile(profileId);
  exportNotesToJson(notes);
};

// Import videos from JSON
export const bulkImportVideos = (videosToImport: YouTubeVideo[]): void => {
  const existingVideos = getYouTubeVideos();
  
  // Process each imported video
  const processedVideos = videosToImport.map(video => {
    if (!video.id) {
      video.id = uuidv4();
    }
    return video;
  });
  
  // Combine existing and new videos, replacing any duplicates
  const allVideos = [...existingVideos];
  
  processedVideos.forEach(newVideo => {
    const existingIndex = allVideos.findIndex(v => v.id === newVideo.id);
    if (existingIndex >= 0) {
      allVideos[existingIndex] = newVideo;
    } else {
      allVideos.push(newVideo);
    }
  });
  
  localStorage.setItem(KEYS.VIDEOS, JSON.stringify(allVideos));
};

// Import sessions
export const bulkImportSessions = (sessionsToImport: PomodoroSession[], profileId: string): void => {
  const existingSessions = getAllSessions();
  
  // Process each imported session
  const processedSessions = sessionsToImport.map(session => {
    if (!session.id) {
      session.id = uuidv4();
    }
    // Ensure profileId is set to the current profile
    session.profileId = profileId;
    return session;
  });
  
  // Combine existing and new sessions, replacing any duplicates
  const allSessions = [...existingSessions];
  
  processedSessions.forEach(newSession => {
    const existingIndex = allSessions.findIndex(s => s.id === newSession.id);
    if (existingIndex >= 0) {
      allSessions[existingIndex] = newSession;
    } else {
      allSessions.push(newSession);
    }
  });
  
  localStorage.setItem(KEYS.SESSIONS, JSON.stringify(allSessions));
};

// Import notes
export const bulkImportNotes = (notesToImport: Note[], profileId: string): void => {
  const existingNotes = getAllNotes();
  const now = new Date().toISOString();
  
  // Process each imported note
  const processedNotes = notesToImport.map(note => {
    if (!note.id) {
      note.id = uuidv4();
    }
    if (!note.createdAt) {
      note.createdAt = now;
    }
    note.updatedAt = now;
    // Ensure profileId is set to the current profile
    note.profileId = profileId;
    return note;
  });
  
  // Combine existing and new notes, replacing any duplicates
  const allNotes = [...existingNotes];
  
  processedNotes.forEach(newNote => {
    const existingIndex = allNotes.findIndex(n => n.id === newNote.id);
    if (existingIndex >= 0) {
      allNotes[existingIndex] = newNote;
    } else {
      allNotes.push(newNote);
    }
  });
  
  localStorage.setItem(KEYS.NOTES, JSON.stringify(allNotes));
};

// NOTES

// Get notes for a profile
export const getNotesByProfile = (profileId: string): Note[] => {
  const notes = getAllNotes();
  return notes.filter(note => note.profileId === profileId);
};

// Get all notes
export const getAllNotes = (): Note[] => {
  const notes = localStorage.getItem(KEYS.NOTES);
  return notes ? JSON.parse(notes) : [];
};

// Save a note
export const saveNote = (note: Note): void => {
  const notes = getAllNotes();
  const now = new Date().toISOString();
  
  if (!note.id) {
    // New note
    note.id = uuidv4();
    note.createdAt = now;
    note.updatedAt = now;
    notes.push(note);
  } else {
    // Update existing note
    const index = notes.findIndex(n => n.id === note.id);
    if (index >= 0) {
      note.updatedAt = now;
      notes[index] = note;
    } else {
      // Not found, add as new
      note.createdAt = now;
      note.updatedAt = now;
      notes.push(note);
    }
  }
  
  localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
};

// Delete a note
export const deleteNote = (id: string): void => {
  const notes = getAllNotes().filter(n => n.id !== id);
  localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
};

export const moveNote = (id: string, direction: 'up' | 'down', profileId: string): void => {
  const notes = getAllNotes();
  const profileNotes = notes
    .filter((note) => note.profileId === profileId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.createdAt.localeCompare(b.createdAt));
  profileNotes.forEach((note, index) => {
    note.order = index;
  });
  const index = profileNotes.findIndex((note) => note.id === id);
  const swapWith = direction === 'up' ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= profileNotes.length) {
    localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
    return;
  }
  const currentOrder = profileNotes[index].order ?? index;
  profileNotes[index].order = profileNotes[swapWith].order ?? swapWith;
  profileNotes[swapWith].order = currentOrder;
  localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
};

// SETTINGS

// Get app settings
export const getSettings = (): AppSettings => {
  const settings = localStorage.getItem(KEYS.SETTINGS);
  return settings ? { ...DEFAULT_SETTINGS, ...JSON.parse(settings) } : DEFAULT_SETTINGS;
};

// Save app settings
export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

// YOUTUBE VIDEOS

// Get all YouTube videos
export const getYouTubeVideos = (): YouTubeVideo[] => {
  const videos = localStorage.getItem(KEYS.VIDEOS);
  if (!videos) {
    localStorage.setItem(KEYS.VIDEOS, JSON.stringify(DEFAULT_YOUTUBE_VIDEOS));
    return DEFAULT_YOUTUBE_VIDEOS;
  }
  const parsed: YouTubeVideo[] = JSON.parse(videos);
  const defaultsById = new Map(DEFAULT_YOUTUBE_VIDEOS.map((video) => [video.id, video]));
  let changed = false;
  const migrated = parsed.map((video) => {
    const shipped = defaultsById.get(video.id);
    if (shipped && shipped.url !== video.url) {
      changed = true;
      return { ...video, url: shipped.url, title: shipped.title };
    }
    return video;
  });
  if (changed) {
    localStorage.setItem(KEYS.VIDEOS, JSON.stringify(migrated));
  }
  return migrated;
};

// Save a YouTube video
export const saveYouTubeVideo = (video: YouTubeVideo): void => {
  const videos = getYouTubeVideos();
  
  if (!video.id) {
    video.id = uuidv4();
    videos.push(video);
  } else {
    const index = videos.findIndex(v => v.id === video.id);
    if (index >= 0) {
      videos[index] = video;
    } else {
      videos.push(video);
    }
  }
  
  localStorage.setItem(KEYS.VIDEOS, JSON.stringify(videos));
};

// Delete a YouTube video
export const deleteYouTubeVideo = (id: string): void => {
  const videos = getYouTubeVideos().filter(v => v.id !== id);
  localStorage.setItem(KEYS.VIDEOS, JSON.stringify(videos));
};

/** Merge the shipped playlist back in without wiping tasks, notes, or custom tracks. */
export const restoreDefaultMusic = (): YouTubeVideo[] => {
  const current = getYouTubeVideos();
  const byId = new Map(current.map((video) => [video.id, video]));
  DEFAULT_YOUTUBE_VIDEOS.forEach((def) => {
    byId.set(def.id, { ...byId.get(def.id), ...def });
  });
  const restored = [
    ...DEFAULT_YOUTUBE_VIDEOS.map((def) => byId.get(def.id)!),
    ...current.filter((video) => !DEFAULT_YOUTUBE_VIDEOS.some((def) => def.id === video.id)),
  ];
  localStorage.setItem(KEYS.VIDEOS, JSON.stringify(restored));
  return restored;
};

// Reset all storage (for development/testing)
export const resetAllStorage = (): void => {
  localStorage.removeItem(KEYS.PROFILES);
  localStorage.removeItem(KEYS.ACTIVE_PROFILE);
  localStorage.removeItem(KEYS.TASKS);
  localStorage.removeItem(KEYS.SESSIONS);
  localStorage.removeItem(KEYS.SETTINGS);
  localStorage.removeItem(KEYS.VIDEOS);
  localStorage.removeItem(KEYS.NOTES);
  
  // Initialize with defaults
  localStorage.setItem(KEYS.PROFILES, JSON.stringify(DEFAULT_PROFILES));
  setActiveProfileId(DEFAULT_PROFILES[0].id);
  saveSettings(DEFAULT_SETTINGS);
  localStorage.setItem(KEYS.VIDEOS, JSON.stringify(DEFAULT_YOUTUBE_VIDEOS));
};

