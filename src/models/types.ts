
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

// Task types
export interface Task {
  id: string;
  profileId: string;
  title: string;
  completed: boolean;
  notifyAt?: string; // ISO date string for notification, optional
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
}

// Theme types
export type ThemeOption = 'purple-space' | 'dark-blue' | 'dark-mode';

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
}
