

# Translate the entire UI (EN / ES / FR / NL)

Right now only the Settings drawer and Tasks panel are fully translated. Many user-facing strings across the timer, music player, history, notes, profiles and notifications are hardcoded in English. This plan extends i18n coverage to the whole app.

## What gets translated

**Header & layout (Index.tsx)**
- Tab labels: Timer, Tasks, Notes, History, Music
- Bottom bar: "Pomodoros", "Total Focus", "min"
- Mini timer phase labels and a11y labels (Reset, Pause, Start, Skip)
- Document title: "Focus / Break / Long Break", "(paused)"

**Timer area**
- `TimerDisplay`: phase labels (Focus / Short Break / Long Break)
- `TimerControls`: aria-labels (Reset / Pause / Start / Skip)
- `PomodoroCount`: "X pomodoro / pomodoros today"

**Music panel (`YouTubePlayerWithImportExport`)**
- "Music & Ambience" header
- Empty state ("No videos yet", "Add your first video")
- Add/Edit dialog: title, "Title", "YouTube URL", placeholder, Cancel, Add, Update, "Add video" tooltip, edit/delete tooltips
- Import/Export button labels passed via `ImportExportButtons`

**Session History (`SessionHistory.tsx`)**
- Card title "Session History"
- Stat pills: "Focus sessions", "Total focus", "Active days"
- Day badges: "X focus", "Xm"
- Date labels: "Today", "Yesterday" (+ localized weekday via `date-fns` locales)
- Session type labels: Focus / Short Break / Long Break
- Empty state copy
- Tooltips: Export JSON, Import JSON, Export Markdown

**Notes (`NotesPlanner.tsx`)**
- Hardcoded "Cancel" button
- Add/hide form aria-labels
- `NotesImportExport` tooltips (Export JSON / Import JSON / Export Markdown)

**Tasks (`TaskItem.tsx`)**
- Priority dropdown items (High / Medium / Low) — currently English-only
- Edit / Calendar / Time / Delete aria-labels

**Profile selector (`ProfileSelector.tsx`)**
- Dropdown trigger fallback "Profile"
- Create dialog: title, description, "Profile Name", duration labels, "Long Break After", placeholder, Cancel / Create
- Edit dialog: title, description, all duration labels, Cancel / Save Changes
- Delete dialog: title, description, Cancel / Delete

**Notifications (`notificationService.ts`)**
- Phase-completed and phase-started toast/notification copy
- Task reminder copy
- Service becomes language-aware (accepts `language` param or reads from settings)

## How it's built

1. **Extend `translationService.ts`** with all new keys for `en`, `es`, `fr`, `nl`. Group by area: `header.*`, `timer.*` (extend), `music.*`, `history.*`, `notes.*` (extend), `tasks.*` (extend), `profile.*`, `notification.*`. Keep the existing `t(key, lang)` API unchanged so no consumer signatures break.

2. **Replace hardcoded strings** in: `Index.tsx`, `TimerDisplay.tsx`, `TimerControls.tsx`, `PomodoroCount.tsx`, `YouTubePlayerWithImportExport.tsx`, `SessionHistory.tsx`, `NotesPlanner.tsx`, `NotesImportExport.tsx`, `TaskItem.tsx`, `ProfileSelector.tsx`. Each file imports `t` and reads `settings.language` from `useApp()`.

3. **Localize dates** in `SessionHistory.tsx` using `date-fns/locale` (`enUS`, `es`, `fr`, `nl`) so "Today / Yesterday / Monday Apr 22" follow the active language.

4. **Make notifications language-aware**: pass `settings.language` from `AppContext` into `notificationService` calls (`notifyPomodoroCompleted`, `notifyPhaseStarted`, `notifyTaskReminder`) and resolve copy through `t()` inside the service.

5. **Pluralization**: handle "1 pomodoro" vs "X pomodoros today" with two keys per language (`timer.pomodoroToday.one`, `timer.pomodoroToday.other`) plus a tiny helper `tn(key, lang, count)`.

## Out of scope

- Translating SEO content in `index.html` (separate task — would need `hreflang` pages).
- Translating the Pomodoro profile preset names ("Focus", "Deep Work", "Short Sprint") since they're stored in localStorage and renaming would affect existing users' saved profiles.
- Theme names already covered by existing `theme.*` keys.

## Files touched

- `src/services/translationService.ts` (large additions)
- `src/services/notificationService.ts` (accept language)
- `src/context/AppContext.tsx` (pass language to notifications)
- `src/pages/Index.tsx`
- `src/components/timer/TimerDisplay.tsx`
- `src/components/timer/TimerControls.tsx`
- `src/components/timer/PomodoroCount.tsx`
- `src/components/YouTubePlayerWithImportExport.tsx`
- `src/components/SessionHistory.tsx`
- `src/components/NotesPlanner.tsx`
- `src/components/NotesImportExport.tsx`
- `src/components/TaskItem.tsx`
- `src/components/ProfileSelector.tsx`

