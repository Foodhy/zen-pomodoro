
// Profile types
export interface Profile {
  id: string;
  name: string;
  workDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  longBreakInterval: number; // after how many pomodoros
  createdAt: string;
  updatedAt: string;
}

// Task priority enum
export enum TaskPriority {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

// Task types
export interface Task {
  id: string;
  profileId: string;
  title: string;
  completed: boolean;
  priority?: TaskPriority; // New field for task priority
  notifyAt?: string; // ISO date string for notification, optional
  notifyTime?: string; // Time string for notification (HH:MM), optional
  createdAt: string;
  updatedAt: string;
}

// Note category enum
export enum NoteCategory {
  TECHNICAL = "technical",
  PLANNING = "planning",
  CODE = "code",
  IDEAS = "ideas",
  OTHER = "other",
}

// Note types
export interface Note {
  id: string;
  profileId: string;
  title: string;
  content: string;
  category: NoteCategory;
  tags?: string[]; // For grouping and searching
  color?: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

// Pomodoro Timer types
export interface PomodoroSession {
  id: string;
  profileId: string;
  startTime: string;
  endTime?: string;
  duration: number; // in seconds
  type: 'work' | 'shortBreak' | 'longBreak';
  completed: boolean;
  notes?: string; // Added for session notes
  associatedTaskId?: string; // Link to a task if applicable
}

// Theme types
export type ThemeOption =
  'purple-space' |
  'dark-blue' |
  'dark-mode' |
  'nes-retro' |
  'netflix' |
  'isomorphic' |
  'minimalist' |
  'skeuomorphism' |
  'flat-design' |
  'bauhaus' |
  'neumorphism' |
  'glassmorphism' |
  'motion' |
  'illustration' |
  'miro-style' |
  'meteor-shower' |
  'particle-network' |
  'flicker-matrix' |
  'retro-wave' |
  'blueprint' |
  'graph-paper' |
  'filament' |
  'brutalist' |
  'kraft';

export type NotificationSound = 'classic' | 'chime' | 'bell';

// Language options
export type LanguageOption = 'en' | 'es' | 'fr' | 'nl' | 'de' | 'ko';

// YouTube Video type
export interface YouTubeVideo {
  id: string;
  title: string;
  url: string;
}

// Application Settings
export interface AppSettings {
  theme: ThemeOption;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  splitView: boolean;
  language: LanguageOption;
  keyboardShortcutsEnabled: boolean;
  focusModeEnabled: boolean;
  /** When true, the next phase starts on its own. Off keeps the current stop-between-phases behavior. */
  autoContinueCycle: boolean;
  notificationSound: NotificationSound;
}

// Keyboard shortcuts
export interface KeyboardShortcuts {
  startTimer: string;
  pauseTimer: string;
  resetTimer: string;
  skipPhase: string;
  toggleTasks: string;
  toggleFullscreen: string;
  toggleFocusMode: string;
  toggleSettings: string;
}
