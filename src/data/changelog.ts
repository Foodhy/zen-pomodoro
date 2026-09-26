export interface ChangelogEntry {
  version: string;
  date: string;
  type: "feature" | "fix" | "improvement";
  title: string;
  details: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.7.0",
    date: "2026-09-26",
    type: "feature",
    title: "Layouts, music, notes, themes, and sounds",
    details: [
      "Improved layouts for short and narrow screens, including 800×600, 1280×720, and 1366×768.",
      "Music player fills the free height. On short screens the tracks move into a side list you can open to pick one.",
      "Replaced unavailable livestream links. Restore default music updates the playlist without resetting the rest of your data.",
      "Notes can be edited, reordered, and color-coded.",
      "Settings can auto-start the next phase. Off keeps the timer paused between phases.",
      "Added Blueprint, Graph Paper, Filament, Brutalist, and Kraft themes, plus Chime and Bell notification sounds.",
      "Added German and Korean.",
      "Settings theme list scrolls inside the panel so every theme can be selected.",
    ],
  },
  {
    version: "1.6.0",
    date: "2026-04-25",
    type: "fix",
    title: "Theme cleanup fix",
    details: [
      "Fixed Miro Style theme not being removed when switching to other themes.",
      "Added 'View changelog' button in Settings.",
    ],
  },
  {
    version: "1.5.0",
    date: "2026-04-24",
    type: "feature",
    title: "Multi-platform music player",
    details: [
      "Added Spotify playlist/album support with login note.",
      "Added SoundCloud track and playlist support via oEmbed.",
      "Grouped tracks by platform (YouTube, SoundCloud, Spotify) with platform-specific icons.",
      "Expanded default music library with curated tracks.",
    ],
  },
  {
    version: "1.4.0",
    date: "2026-04-20",
    type: "feature",
    title: "New visual themes",
    details: [
      "Added Skeuomorphism, Flat Design, Bauhaus, Neumorphism, Glassmorphism, Motion, Illustration and Miro Style themes.",
    ],
  },
  {
    version: "1.3.0",
    date: "2026-04-15",
    type: "feature",
    title: "Profiles & multi-language",
    details: [
      "Independent profile management with default presets.",
      "Full localization in English, Spanish, French and Dutch.",
    ],
  },
  {
    version: "1.2.0",
    date: "2026-04-10",
    type: "feature",
    title: "Notes planner & flowchart logic",
    details: [
      "Added technical notes assistant with Markdown export.",
      "Notes import/export support.",
    ],
  },
  {
    version: "1.1.0",
    date: "2026-04-05",
    type: "feature",
    title: "Tasks & notifications",
    details: [
      "Task priorities and profile filtering.",
      "Web notifications for tasks and Pomodoro phases.",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-04-01",
    type: "feature",
    title: "Initial release",
    details: [
      "Pomodoro timer with focus mode and dynamic title.",
      "YouTube ambient music player with draggable icon.",
      "Split view layout and persistent bottom bar.",
    ],
  },
];

export const APP_VERSION = CHANGELOG[0].version;

export const typeColor: Record<ChangelogEntry["type"], string> = {
  feature: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30",
  fix: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  improvement: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
};
