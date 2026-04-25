import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { t } from "../services/translationService";
import { LanguageOption } from "../models/types";

interface ChangelogEntry {
  version: string;
  date: string;
  type: "feature" | "fix" | "improvement";
  title: string;
  details: string[];
}

const CHANGELOG: ChangelogEntry[] = [
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

const typeColor: Record<ChangelogEntry["type"], string> = {
  feature: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30",
  fix: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  improvement: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
};

interface ChangelogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: LanguageOption;
}

export const ChangelogDialog: React.FC<ChangelogDialogProps> = ({
  open,
  onOpenChange,
  language,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("settings.changelogTitle", language)}</DialogTitle>
          <DialogDescription>
            {t("settings.changelogDescription", language)}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {CHANGELOG.map((entry) => (
              <div key={entry.version} className="border-l-2 border-border pl-4">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-sm">v{entry.version}</span>
                  <span className="text-xs text-muted-foreground">{entry.date}</span>
                  <Badge variant="outline" className={`text-[10px] uppercase ${typeColor[entry.type]}`}>
                    {entry.type}
                  </Badge>
                </div>
                <h4 className="font-medium text-sm mb-2">{entry.title}</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {entry.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ChangelogDialog;
