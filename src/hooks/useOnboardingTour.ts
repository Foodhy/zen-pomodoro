import { useCallback, useEffect } from 'react';
import { driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';

const TOUR_DONE_KEY = 'zen_tour_done';

// Onboarding tour explaining the app. Always in English by request.
const STEPS: DriveStep[] = [
  {
    popover: {
      title: 'Welcome to Zen Pomodoro 🍅',
      description:
        'A minimalist Pomodoro timer with tasks, notes, focus music and stats. Free, offline-first, no signup. Let me show you around.',
    },
  },
  {
    element: '#tour-brand',
    popover: {
      title: 'Your workspace',
      description:
        'Everything lives here. Your data is stored locally in your browser, so it works offline and stays private.',
    },
  },
  {
    element: '#tour-profile',
    popover: {
      title: 'Profiles',
      description:
        'Switch between separate profiles. Each profile keeps its own tasks, notes, sessions and settings.',
    },
  },
  {
    element: '#tour-tabs',
    popover: {
      title: 'Navigation',
      description:
        'Move between the Timer, Tasks, Notes, History and Music panels from these tabs.',
    },
  },
  {
    element: '#tour-content',
    popover: {
      title: 'Focus timer',
      description:
        'Run your Pomodoro sessions here: start, pause, reset and skip between focus and break phases.',
    },
  },
  {
    element: '#tour-stats',
    popover: {
      title: 'Your progress',
      description:
        'Track completed pomodoros and total focus time at a glance.',
    },
  },
  {
    element: '#tour-language',
    popover: {
      title: 'Language',
      description: 'The interface is available in English, Spanish, French and Dutch.',
    },
  },
  {
    element: '#tour-fullscreen',
    popover: {
      title: 'Distraction-free mode',
      description: 'Go fullscreen for a clean, focused workspace.',
    },
  },
  {
    element: '#tour-settings',
    popover: {
      title: 'Settings',
      description:
        'Customize timer durations, themes (try Retro Wave!), split view, sounds, notifications and keyboard shortcuts.',
    },
  },
  {
    element: '#tour-help',
    popover: {
      title: 'Need this again?',
      description: 'Click this button anytime to replay the tour. Enjoy your focus sessions!',
    },
  },
];

export function useOnboardingTour() {
  const startTour = useCallback(() => {
    const d = driver({
      showProgress: true,
      allowClose: true,
      nextBtnText: 'Next',
      prevBtnText: 'Back',
      doneBtnText: 'Done',
      // Only keep steps whose target element exists (layout varies by view).
      steps: STEPS.filter((s) => !s.element || document.querySelector(s.element as string)),
    });
    d.drive();
  }, []);

  // Auto-run once on first visit.
  useEffect(() => {
    if (localStorage.getItem(TOUR_DONE_KEY)) return;
    localStorage.setItem(TOUR_DONE_KEY, '1');
    const id = window.setTimeout(startTour, 600);
    return () => window.clearTimeout(id);
  }, [startTour]);

  return { startTour };
}
