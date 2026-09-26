
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { ThemeOption, PomodoroSession, YouTubeVideo, LanguageOption, KeyboardShortcuts, Note, NoteCategory } from "../models/types";
import { format } from "date-fns";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Save,
  PencilLine,
  Upload,
  Import,
  FileUp,
  X,
  RotateCcw,
  History as HistoryIcon,
} from "lucide-react";
import notificationService from "../services/notificationService";
import { DEFAULT_SHORTCUTS } from "../services/keyboardService";
import { t } from "../services/translationService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();
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
    notes,
    saveNote,
    deleteNote,
    exportNotesToMarkdown,
  } = useApp();

  const [notificationsRequested, setNotificationsRequested] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteCategory, setNewNoteCategory] = useState<NoteCategory>(NoteCategory.TECHNICAL);
  const [newNoteTags, setNewNoteTags] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAddOrUpdateNote = () => {
    if (newNoteTitle.trim() && newNoteContent.trim() && activeProfile) {
      const tags = newNoteTags.split(",").map(tag => tag.trim()).filter(tag => tag !== "");
      
      if (editingNoteId) {
        // Update existing note
        const updatedNote = notes.find(note => note.id === editingNoteId);
        if (updatedNote) {
          saveNote({
            ...updatedNote,
            title: newNoteTitle.trim(),
            content: newNoteContent.trim(),
            category: newNoteCategory,
            tags: tags,
            updatedAt: new Date().toISOString(),
          });
        }
      } else {
        // Add new note
        saveNote({
          id: `note-${Date.now()}`,
          profileId: activeProfile.id,
          title: newNoteTitle.trim(),
          content: newNoteContent.trim(),
          category: newNoteCategory,
          tags: tags,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      setNewNoteTitle("");
      setNewNoteContent("");
      setNewNoteCategory(NoteCategory.TECHNICAL);
      setNewNoteTags("");
      setEditingNoteId(null);
      setShowNoteDialog(false);
    }
  };

  const handleEditNote = (noteId: string) => {
    const noteToEdit = notes.find(note => note.id === noteId);
    if (noteToEdit) {
      setNewNoteTitle(noteToEdit.title);
      setNewNoteContent(noteToEdit.content);
      setNewNoteCategory(noteToEdit.category || NoteCategory.TECHNICAL);
      setNewNoteTags(noteToEdit.tags ? noteToEdit.tags.join(", ") : "");
      setEditingNoteId(noteId);
      setShowNoteDialog(true);
    }
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
  };

  const handleExportNotes = () => {
    exportNotesToMarkdown();
  };

  const handleResetAllData = () => {
    localStorage.clear();
    window.location.reload();
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

  // Filter notes for active profile
  const profileNotes = activeProfile
    ? notes.filter(note => note.profileId === activeProfile.id)
    : [];

  // Keyboard shortcuts
  const shortcuts: KeyboardShortcuts = DEFAULT_SHORTCUTS;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="flex max-h-[90dvh] flex-col overflow-hidden p-4 bg-background border-t border-border">
        <DrawerClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none drawer-close-button">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DrawerClose>
        
        <DrawerHeader className="mb-4 shrink-0 px-0">
          <DrawerTitle>{t("settings.title", settings.language)}</DrawerTitle>
          <DrawerDescription>
            {t("settings.customize", settings.language)}
          </DrawerDescription>
        </DrawerHeader>

        <Tabs defaultValue="app" className="flex min-h-0 w-full flex-1 flex-col">
          <TabsList className="grid w-full shrink-0 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 mb-4 h-auto">
            <TabsTrigger value="app">{t("settings.app", settings.language)}</TabsTrigger>
            <TabsTrigger value="themes">{t("settings.theme", settings.language)}</TabsTrigger>
            <TabsTrigger value="videos">{t("settings.videos", settings.language)}</TabsTrigger>
            <TabsTrigger value="history">{t("settings.history", settings.language)}</TabsTrigger>
            <TabsTrigger value="notes">{t("notes.title", settings.language)}</TabsTrigger>
          </TabsList>

          <div data-vaul-no-drag className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-2">
            <TabsContent value="app" className="mt-0">
              <div className="space-y-6 bg-background p-4 rounded-lg">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">{t("settings.language", settings.language)}</h3>
                  <RadioGroup
                    value={settings.language}
                    onValueChange={handleLanguageChange}
                    className="flex flex-wrap gap-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="en" id="lang-en" />
                      <Label htmlFor="lang-en">🇬🇧 English</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="es" id="lang-es" />
                      <Label htmlFor="lang-es">🇪🇸 Español</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fr" id="lang-fr" />
                      <Label htmlFor="lang-fr">🇫🇷 Français</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nl" id="lang-nl" />
                      <Label htmlFor="lang-nl">🇳🇱 Nederlands</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="de" id="lang-de" />
                      <Label htmlFor="lang-de">🇩🇪 Deutsch</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ko" id="lang-ko" />
                      <Label htmlFor="lang-ko">🇰🇷 한국어</Label>
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
                    <div className="space-y-2">
                      <Label>{t("settings.notificationSound", settings.language)}</Label>
                      <RadioGroup
                        value={settings.notificationSound || "classic"}
                        onValueChange={(value) => saveSettings({ ...settings, notificationSound: value as "classic" | "chime" | "bell" })}
                        className="flex flex-wrap gap-3"
                      >
                        {(["classic", "chime", "bell"] as const).map((sound) => (
                          <div key={sound} className="flex items-center space-x-2">
                            <RadioGroupItem value={sound} id={`sound-${sound}`} />
                            <Label htmlFor={`sound-${sound}`}>{t(`settings.sound.${sound}`, settings.language)}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <Label htmlFor="auto-cycle">{t("settings.autoContinue", settings.language)}</Label>
                      <p className="text-xs text-muted-foreground mt-1">{t("settings.autoContinueHelp", settings.language)}</p>
                    </div>
                    <Switch
                      id="auto-cycle"
                      checked={!!settings.autoContinueCycle}
                      onCheckedChange={(checked) => saveSettings({ ...settings, autoContinueCycle: checked })}
                    />
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
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => setShowShortcutsDialog(true)}
                    title={t("settings.viewShortcuts", settings.language)}
                  >
                    <Keyboard className="h-4 w-4 shrink-0" />
                    <span className="hidden sm:inline truncate">{t("settings.viewShortcuts", settings.language)}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => {
                      onOpenChange(false);
                      navigate("/changelog");
                    }}
                    title={t("settings.viewChangelog", settings.language)}
                  >
                    <HistoryIcon className="h-4 w-4 shrink-0" />
                    <span className="hidden sm:inline truncate">{t("settings.viewChangelog", settings.language)}</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleResetAllData}
                    title={t("settings.resetStorage", settings.language)}
                  >
                    <RotateCcw className="h-4 w-4 shrink-0" />
                    <span className="hidden sm:inline truncate">{t("settings.resetStorage", settings.language)}</span>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="themes" className="mt-0">
              <div className="bg-background p-4 rounded-lg">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">{t("settings.theme", settings.language)}</h3>
                  <RadioGroup
                    value={settings.theme}
                    onValueChange={handleThemeChange}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2"
                  >
                    {[
                      { value: "purple-space", id: "theme-purple", label: t("theme.purpleSpace", settings.language) },
                      { value: "dark-blue", id: "theme-blue", label: t("theme.darkBlue", settings.language) },
                      { value: "dark-mode", id: "theme-dark", label: t("theme.darkMode", settings.language) },
                      { value: "nes-retro", id: "theme-nes", label: t("theme.nesRetro", settings.language) },
                      { value: "netflix", id: "theme-netflix", label: t("theme.netflix", settings.language) },
                      { value: "isomorphic", id: "theme-isomorphic", label: t("theme.isomorphic", settings.language) },
                      { value: "minimalist", id: "theme-minimalist", label: t("theme.minimalist", settings.language) },
                      { value: "skeuomorphism", id: "theme-skeuomorphism", label: t("theme.skeuomorphism", settings.language) },
                      { value: "flat-design", id: "theme-flat-design", label: t("theme.flatDesign", settings.language) },
                      { value: "bauhaus", id: "theme-bauhaus", label: t("theme.bauhaus", settings.language) },
                      { value: "neumorphism", id: "theme-neumorphism", label: t("theme.neumorphism", settings.language) },
                      { value: "glassmorphism", id: "theme-glassmorphism", label: t("theme.glassmorphism", settings.language) },
                      { value: "motion", id: "theme-motion", label: t("theme.motion", settings.language) },
                      { value: "illustration", id: "theme-illustration", label: t("theme.illustration", settings.language) },
                      { value: "miro-style", id: "theme-miro", label: t("theme.miroStyle", settings.language) },
                      { value: "meteor-shower", id: "theme-meteor-shower", label: t("theme.meteorShower", settings.language) },
                      { value: "particle-network", id: "theme-particle-network", label: t("theme.particleNetwork", settings.language) },
                      { value: "flicker-matrix", id: "theme-flicker-matrix", label: t("theme.flickerMatrix", settings.language) },
                      { value: "retro-wave", id: "theme-retro-wave", label: t("theme.retroWave", settings.language) },
                      { value: "blueprint", id: "theme-blueprint", label: t("theme.blueprint", settings.language) },
                      { value: "graph-paper", id: "theme-graph-paper", label: t("theme.graphPaper", settings.language) },
                      { value: "filament", id: "theme-filament", label: t("theme.filament", settings.language) },
                      { value: "brutalist", id: "theme-brutalist", label: t("theme.brutalist", settings.language) },
                      { value: "kraft", id: "theme-kraft", label: t("theme.kraft", settings.language) },
                    ].map((option) => {
                      const isActive = settings.theme === option.value;
                      return (
                        <Label
                          key={option.value}
                          htmlFor={option.id}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors text-sm ${
                            isActive
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border/40 hover:bg-muted/40 text-muted-foreground"
                          }`}
                        >
                          <RadioGroupItem value={option.value} id={option.id} />
                          <span className="truncate">{option.label}</span>
                        </Label>
                      );
                    })}
                  </RadioGroup>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="videos" className="mt-0">
              <div className="bg-background p-4 rounded-lg">
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
                              {t("settings.titleField", settings.language)}
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
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <div className="bg-background p-4 rounded-lg">
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
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-0">
              <div className="bg-background p-4 rounded-lg">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">{t("notes.title", settings.language)}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={handleExportNotes}
                      >
                        <FileDown className="h-4 w-4" />
                        {t("notes.export", settings.language)}
                      </Button>
                      <Dialog
                        open={showNoteDialog}
                        onOpenChange={setShowNoteDialog}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" variant="default">
                            <Plus className="h-4 w-4 mr-2" /> {t("notes.add", settings.language)}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                          <DialogHeader>
                            <DialogTitle>
                              {editingNoteId 
                                ? t("notes.editNote", settings.language) 
                                : t("notes.add", settings.language)}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="note-title" className="text-right">
                                {t("notes.titlePlaceholder", settings.language)}
                              </Label>
                              <Input
                                id="note-title"
                                value={newNoteTitle}
                                onChange={(e) => setNewNoteTitle(e.target.value)}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                              <Label htmlFor="note-content" className="text-right pt-2">
                                {t("notes.contentPlaceholder", settings.language)}
                              </Label>
                              <Textarea
                                id="note-content"
                                value={newNoteContent}
                                onChange={(e) => setNewNoteContent(e.target.value)}
                                className="col-span-3 h-32"
                                placeholder={t("notes.contentPlaceholder", settings.language)}
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="note-category" className="text-right">
                                {t("notes.category", settings.language)}
                              </Label>
                              <Select 
                                value={newNoteCategory} 
                                onValueChange={(value) => setNewNoteCategory(value as NoteCategory)}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder={t("notes.category", settings.language)} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={NoteCategory.TECHNICAL}>{t("notes.category.technical", settings.language)}</SelectItem>
                                  <SelectItem value={NoteCategory.PLANNING}>{t("notes.category.planning", settings.language)}</SelectItem>
                                  <SelectItem value={NoteCategory.CODE}>{t("notes.category.code", settings.language)}</SelectItem>
                                  <SelectItem value={NoteCategory.IDEAS}>{t("notes.category.ideas", settings.language)}</SelectItem>
                                  <SelectItem value={NoteCategory.OTHER}>{t("notes.category.other", settings.language)}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="note-tags" className="text-right">
                                {t("notes.tags", settings.language)}
                              </Label>
                              <Input
                                id="note-tags"
                                value={newNoteTags}
                                onChange={(e) => setNewNoteTags(e.target.value)}
                                className="col-span-3"
                                placeholder={t("notes.tags", settings.language)}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">{t("settings.cancel", settings.language)}</Button>
                            </DialogClose>
                            <Button onClick={handleAddOrUpdateNote}>
                              {editingNoteId ? t("notes.save", settings.language) : t("notes.add", settings.language)}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {profileNotes.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-sm opacity-70">{t("notes.noNotes", settings.language)}</p>
                        <p className="text-xs mt-1 opacity-50">
                          {t("notes.addToStart", settings.language)}
                        </p>
                      </div>
                    ) : (
                      profileNotes.map((note) => (
                        <div
                          key={note.id}
                          className="flex flex-col p-3 rounded-md bg-secondary/30"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium">{note.title}</div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditNote(note.id)}
                              >
                                <PencilLine className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteNote(note.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-xs whitespace-pre-wrap">
                            {note.content.length > 200 
                              ? `${note.content.substring(0, 200)}...` 
                              : note.content}
                          </div>
                          {note.category && (
                            <div className="text-xs inline-flex items-center px-2 py-1 mt-2 bg-primary/10 rounded-full">
                              {t(`notes.category.${note.category}`, settings.language)}
                            </div>
                          )}
                          {note.tags && note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {note.tags.map((tag, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary/50 text-xs">
                                  # {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground mt-2">
                            {format(new Date(note.updatedAt), "MMM d, yyyy h:mm a")}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
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
