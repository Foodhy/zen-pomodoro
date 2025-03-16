
import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ThemeOption, PomodoroSession, YouTubeVideo, LanguageOption, KeyboardShortcuts } from "../models/types";
import { format } from "date-fns";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Youtube,
  Trash,
  Plus,
  Keyboard,
  FileDown,
  Download,
  Languages,
} from "lucide-react";
import notificationService from "../services/notificationService";
import { DEFAULT_SHORTCUTS } from "../services/keyboardService";
import { t } from "../services/translationService";

interface SettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  open,
  onOpenChange,
}) => {
  const {
    settings,
    saveSettings,
    setTheme,
    setLanguage,
    sessions,
    activeProfile,
    videos,
    saveVideo,
    deleteVideo,
    exportSessionsToMarkdown,
  } = useApp();

  const [notificationsRequested, setNotificationsRequested] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false);

  const handleThemeChange = (value: string) => {
    setTheme(value as ThemeOption);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value as LanguageOption);
  };

  const handleNotificationsToggle = async (checked: boolean) => {
    if (checked && !notificationsRequested) {
      const granted = await notificationService.requestPermission();
      setNotificationsRequested(true);

      if (!granted) {
        // If permission denied, don't enable notifications
        saveSettings({
          ...settings,
          notificationsEnabled: false,
        });
        return;
      }
    }

    saveSettings({
      ...settings,
      notificationsEnabled: checked,
    });
  };

  const handleSoundToggle = (checked: boolean) => {
    saveSettings({
      ...settings,
      soundEnabled: checked,
    });
  };

  const handleViewToggle = (checked: boolean) => {
    saveSettings({
      ...settings,
      splitView: checked,
    });
  };

  const handleKeyboardShortcutsToggle = (checked: boolean) => {
    saveSettings({
      ...settings,
      keyboardShortcutsEnabled: checked,
    });
  };

  const handleAddVideo = () => {
    if (newVideoTitle.trim() && newVideoUrl.trim()) {
      const newVideo: YouTubeVideo = {
        id: `video-${Date.now()}`,
        title: newVideoTitle.trim(),
        url: newVideoUrl.trim(),
      };

      saveVideo(newVideo);
      setNewVideoTitle("");
      setNewVideoUrl("");
      setShowVideoDialog(false);
    }
  };

  const handleDeleteVideo = (id: string) => {
    deleteVideo(id);
  };

  const handleExportMarkdown = () => {
    exportSessionsToMarkdown();
  };

  const sessionsToRender = activeProfile
    ? sessions.filter(
        (session) => session.profileId === activeProfile.id && session.completed
      )
    : [];

  // Group sessions by day
  const groupedSessions = sessionsToRender.reduce<
    Record<string, PomodoroSession[]>
  >((acc, session) => {
    const date = new Date(session.startTime);
    const dateStr = format(date, "yyyy-MM-dd");

    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }

    acc[dateStr].push(session);
    return acc;
  }, {});

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedSessions).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // Keyboard shortcuts
  const shortcuts: KeyboardShortcuts = DEFAULT_SHORTCUTS;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="sm:max-w-md overflow-y-auto">
        <DrawerHeader className="mb-6">
          <DrawerTitle>{t("settings.title", settings.language)}</DrawerTitle>
          <DrawerDescription>
            {t("settings.customize", settings.language)}
          </DrawerDescription>
        </DrawerHeader>

        <Tabs defaultValue="app" className="w-full">
          <TabsList className="grid grid-cols-1 md:grid-cols-5 mb-4 h-auto">
            <TabsTrigger value="app">{t("settings.app", settings.language)}</TabsTrigger>
            <TabsTrigger value="themes">{t("settings.theme", settings.language)}</TabsTrigger>
            <TabsTrigger value="videos">{t("settings.videos", settings.language)}</TabsTrigger>
            <TabsTrigger value="history">{t("settings.history", settings.language)}</TabsTrigger>
            <TabsTrigger value="notes">{t("notes.title", settings.language)}</TabsTrigger>
          </TabsList>

          <TabsContent value="app" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">{t("settings.language", settings.language)}</h3>
              <RadioGroup
                value={settings.language}
                onValueChange={handleLanguageChange}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="en" id="lang-en" />
                  <Label htmlFor="lang-en">English</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="es" id="lang-es" />
                  <Label htmlFor="lang-es">Español</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">{t("settings.notifications", settings.language)}</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">{t("settings.notificationsEnable", settings.language)}</Label>
                  <Switch
                    id="notifications"
                    checked={settings.notificationsEnabled}
                    onCheckedChange={handleNotificationsToggle}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sound">{t("settings.soundEnable", settings.language)}</Label>
                  <Switch
                    id="sound"
                    checked={settings.soundEnabled}
                    onCheckedChange={handleSoundToggle}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">{t("settings.display", settings.language)}</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="split-view">{t("settings.splitViewMode", settings.language)}</Label>
                <Switch
                  id="split-view"
                  checked={settings.splitView}
                  onCheckedChange={handleViewToggle}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">{t("settings.keyboard", settings.language)}</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="keyboard-shortcuts">{t("settings.keyboardShortcuts", settings.language)}</Label>
                <Switch
                  id="keyboard-shortcuts"
                  checked={settings.keyboardShortcutsEnabled}
                  onCheckedChange={handleKeyboardShortcutsToggle}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center gap-2"
                onClick={() => setShowShortcutsDialog(true)}
              >
                <Keyboard className="h-4 w-4" />
                {t("settings.viewShortcuts", settings.language)}
              </Button>
            </div>

            <Button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              {t("settings.resetStorage", settings.language)}
            </Button>
          </TabsContent>

          <TabsContent value="themes" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">{t("settings.theme", settings.language)}</h3>
              <RadioGroup
                value={settings.theme}
                onValueChange={handleThemeChange}
                className="space-y-2"
              >
                {/* Original themes */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="purple-space" id="theme-purple" />
                  <Label htmlFor="theme-purple">{t("theme.purpleSpace", settings.language)}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark-blue" id="theme-blue" />
                  <Label htmlFor="theme-blue">{t("theme.darkBlue", settings.language)}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark-mode" id="theme-dark" />
                  <Label htmlFor="theme-dark">{t("theme.darkMode", settings.language)}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nes-retro" id="theme-nes" />
                  <Label htmlFor="theme-nes">{t("theme.nesRetro", settings.language)}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="netflix" id="theme-netflix" />
                  <Label htmlFor="theme-netflix">{t("theme.netflix", settings.language)}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="isomorphic" id="theme-isomorphic" />
                  <Label htmlFor="theme-isomorphic">{t("theme.isomorphic", settings.language)}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="minimalist" id="theme-minimalist" />
                  <Label htmlFor="theme-minimalist">{t("theme.minimalist", settings.language)}</Label>
                </div>

                {/* New themes */}
                <div className="pt-2 border-t border-border/30">
                  <div className="text-xs font-medium text-muted-foreground mb-2">
                    {t("settings.newThemes", settings.language)}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="skeuomorphism" id="theme-skeuomorphism" />
                  <Label htmlFor="theme-skeuomorphism">{t("theme.skeuomorphism", settings.language)}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flat-design" id="theme-flat-design" />
                  <Label htmlFor="theme-flat-design">{t("theme.flatDesign", settings.language)}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bauhaus" id="theme-bauhaus" />
                  <Label htmlFor="theme-bauhaus">{t("theme.bauhaus", settings.language)}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="neumorphism" id="theme-neumorphism" />
                  <Label htmlFor="theme-neumorphism">{t("theme.neumorphism", settings.language)}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="glassmorphism" id="theme-glassmorphism" />
                  <Label htmlFor="theme-glassmorphism">{t("theme.glassmorphism", settings.language)}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="motion" id="theme-motion" />
                  <Label htmlFor="theme-motion">{t("theme.motion", settings.language)}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="illustration" id="theme-illustration" />
                  <Label htmlFor="theme-illustration">{t("theme.illustration", settings.language)}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="miro-style" id="theme-miro" />
                  <Label htmlFor="theme-miro">{t("theme.miroStyle", settings.language)}</Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{t("settings.youtubeVideos", settings.language)}</h3>
                <Dialog
                  open={showVideoDialog}
                  onOpenChange={setShowVideoDialog}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" /> {t("settings.add", settings.language)}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{t("settings.addVideo", settings.language)}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          {t("settings.title", settings.language)}
                        </Label>
                        <Input
                          id="title"
                          value={newVideoTitle}
                          onChange={(e) => setNewVideoTitle(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="url" className="text-right">
                          URL
                        </Label>
                        <Input
                          id="url"
                          value={newVideoUrl}
                          onChange={(e) => setNewVideoUrl(e.target.value)}
                          className="col-span-3"
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">{t("settings.cancel", settings.language)}</Button>
                      </DialogClose>
                      <Button onClick={handleAddVideo}>{t("settings.add", settings.language)}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-2">
                {videos.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm opacity-70">{t("settings.noVideos", settings.language)}</p>
                    <p className="text-xs mt-1 opacity-50">
                      {t("settings.addYoutube", settings.language)}
                    </p>
                  </div>
                ) : (
                  videos.map((video) => (
                    <div
                      key={video.id}
                      className="flex items-center justify-between p-3 rounded-md bg-secondary/30"
                    >
                      <div className="flex items-center gap-2 overflow-x-auto">
                        <Youtube className="h-4 w-4 text-primary" />
                        <div>
                          <div className="text-sm font-medium">
                            {video.title}
                          </div>
                          <div className="text-xs opacity-70 truncate max-w-[220px]">
                            {video.url}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteVideo(video.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{t("settings.pomodoroHistory", settings.language)}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="mb-4 gap-1"
                  onClick={handleExportMarkdown}
                >
                  <FileDown className="h-4 w-4" />
                  {t("settings.exportMarkdown", settings.language)}
                </Button>
              </div>

              {sessionsToRender.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm opacity-70">{t("settings.noHistory", settings.language)}</p>
                  <p className="text-xs mt-1 opacity-50">
                    {t("settings.completePomodoro", settings.language)}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedDates.map((dateStr) => (
                    <div key={dateStr} className="space-y-2">
                      <h4 className="text-xs font-medium opacity-70">
                        {format(new Date(dateStr), "MMMM d, yyyy")}
                      </h4>

                      <div className="space-y-2">
                        {groupedSessions[dateStr].map((session) => (
                          <div
                            key={session.id}
                            className={`px-3 py-2 rounded-md text-xs ${
                              session.type === "work"
                                ? "bg-secondary"
                                : "bg-secondary/50"
                            }`}
                          >
                            <div className="flex justify-between">
                              <span>
                                {session.type === "work"
                                  ? t("timer.work", settings.language)
                                  : session.type === "shortBreak"
                                  ? t("timer.shortBreak", settings.language)
                                  : t("timer.longBreak", settings.language)}
                              </span>
                              <span>
                                {format(new Date(session.startTime), "h:mm a")}
                              </span>
                            </div>
                            <div className="mt-1 opacity-70">
                              {t("settings.duration", settings.language)}: {Math.round(session.duration / 60)}{" "}
                              {t("settings.minutes", settings.language)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{t("notes.title", settings.language)}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="mb-4 gap-1"
                  onClick={() => exportSessionsToMarkdown()}
                >
                  <FileDown className="h-4 w-4" />
                  {t("notes.export", settings.language)}
                </Button>
              </div>

              <div className="text-center py-8">
                <p className="text-sm opacity-70">
                  {t("notes.title", settings.language)}
                </p>
                <p className="text-xs mt-1 opacity-50">
                  Organiza notas técnicas, extrae puntos clave y estructura código de manera eficiente.
                </p>
                <div className="mt-4 p-4 border border-primary/20 rounded-md bg-secondary/30 text-left">
                  <p className="text-sm font-medium mb-2">📌 Funciones clave:</p>
                  <ul className="text-xs space-y-1 list-disc pl-5">
                    <li>Extraer ideas principales de notas técnicas.</li>
                    <li>Generar listas de tareas con prioridades.</li>
                    <li>Sugerir estructuras de código basadas en requisitos.</li>
                    <li>Crear diagramas de flujo automáticos para visualizar lógica.</li>
                    <li>Recomendar mejoras en el código según buenas prácticas.</li>
                    <li>Establecer recordatorios automáticos para tareas de desarrollo.</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Keyboard shortcuts dialog */}
        <Dialog
          open={showShortcutsDialog}
          onOpenChange={setShowShortcutsDialog}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("settings.keyboardShortcuts", settings.language)}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">{t("timer.start", settings.language)}/{t("timer.pause", settings.language)}</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">{shortcuts.startTimer}/{shortcuts.pauseTimer}</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">{t("timer.reset", settings.language)}</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">{shortcuts.resetTimer}</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">{t("timer.skip", settings.language)}</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">{shortcuts.skipPhase}</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">{t("settings.toggleTasks", settings.language)}</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">{shortcuts.toggleTasks}</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">{t("settings.toggleFullscreen", settings.language)}</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">{shortcuts.toggleFullscreen}</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">{t("settings.toggleFocusMode", settings.language)}</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">{shortcuts.toggleFocusMode}</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">{t("settings.toggleSettings", settings.language)}</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">{shortcuts.toggleSettings}</kbd>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DrawerContent>
    </Drawer>
  );
};

export default SettingsDrawer;
