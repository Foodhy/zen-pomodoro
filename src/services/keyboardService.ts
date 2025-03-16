
import { KeyboardShortcuts } from "../models/types";

// Default keyboard shortcuts
export const DEFAULT_SHORTCUTS: KeyboardShortcuts = {
  startTimer: "s",
  pauseTimer: "p",
  resetTimer: "r",
  skipPhase: "n",
  toggleTasks: "t",
  toggleFullscreen: "f",
  toggleFocusMode: "m",
  toggleSettings: ",",
};

// Initialize keyboard shortcuts
export const initKeyboardShortcuts = (
  callbacks: {
    onStartTimer?: () => void;
    onPauseTimer?: () => void;
    onResetTimer?: () => void;
    onSkipPhase?: () => void;
    onToggleTasks?: () => void;
    onToggleFullscreen?: () => void;
    onToggleFocusMode?: () => void;
    onToggleSettings?: () => void;
  },
  enabled: boolean,
  shortcuts: KeyboardShortcuts = DEFAULT_SHORTCUTS
) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Skip if shortcuts are disabled or if an input element is focused
    if (!enabled || 
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement ||
        e.ctrlKey || e.altKey || e.metaKey) {
      return;
    }

    const key = e.key.toLowerCase();

    switch (key) {
      case shortcuts.startTimer:
        callbacks.onStartTimer?.();
        break;
      case shortcuts.pauseTimer:
        callbacks.onPauseTimer?.();
        break;
      case shortcuts.resetTimer:
        callbacks.onResetTimer?.();
        break;
      case shortcuts.skipPhase:
        callbacks.onSkipPhase?.();
        break;
      case shortcuts.toggleTasks:
        callbacks.onToggleTasks?.();
        break;
      case shortcuts.toggleFullscreen:
        callbacks.onToggleFullscreen?.();
        break;
      case shortcuts.toggleFocusMode:
        callbacks.onToggleFocusMode?.();
        break;
      case shortcuts.toggleSettings:
        callbacks.onToggleSettings?.();
        break;
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  // Return cleanup function
  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
};
