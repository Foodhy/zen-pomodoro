import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ThemeOption, PomodoroSession, YouTubeVideo } from "../models/types";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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
import { Youtube, Trash, Plus } from "lucide-react";
import notificationService from "../services/notificationService";

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
    sessions,
    activeProfile,
    videos,
    saveVideo,
    deleteVideo,
  } = useApp();

  const [notificationsRequested, setNotificationsRequested] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");

  const handleThemeChange = (value: string) => {
    setTheme(value as ThemeOption);
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize your Pomodoro experience and view your activity history.
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="app" className="w-full">
          <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-4 h-auto">
            <TabsTrigger value="app">App</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="app" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Theme</h3>
              <RadioGroup
                value={settings.theme}
                onValueChange={handleThemeChange}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="purple-space" id="theme-purple" />
                  <Label htmlFor="theme-purple">Purple Space</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark-blue" id="theme-blue" />
                  <Label htmlFor="theme-blue">Dark Blue</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark-mode" id="theme-dark" />
                  <Label htmlFor="theme-dark">Dark Mode</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nes-retro" id="theme-nes" />
                  <Label htmlFor="theme-nes">NES Retro</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="netflix" id="theme-netflix" />
                  <Label htmlFor="theme-netflix">Netflix</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="isomorphic" id="theme-isomorphic" />
                  <Label htmlFor="theme-isomorphic">Isomorphic</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="minimalist" id="theme-minimalist" />
                  <Label htmlFor="theme-minimalist">Minimalist</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Notifications & Sound</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <Switch
                    id="notifications"
                    checked={settings.notificationsEnabled}
                    onCheckedChange={handleNotificationsToggle}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sound">Enable Sound</Label>
                  <Switch
                    id="sound"
                    checked={settings.soundEnabled}
                    onCheckedChange={handleSoundToggle}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Display</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="split-view">Split View Mode</Label>
                <Switch
                  id="split-view"
                  checked={settings.splitView}
                  onCheckedChange={handleViewToggle}
                />
              </div>
            </div>
            {/* reset local storage */}
            <Button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              Reset Local Storage
            </Button>
          </TabsContent>

          <TabsContent value="videos">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">YouTube Videos</h3>
                <Dialog
                  open={showVideoDialog}
                  onOpenChange={setShowVideoDialog}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" /> Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add YouTube Video</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Title
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
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleAddVideo}>Add Video</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-2">
                {videos.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm opacity-70">No videos added</p>
                    <p className="text-xs mt-1 opacity-50">
                      Add YouTube videos for focus music
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
              <h3 className="text-sm font-medium">Pomodoro History</h3>

              {sessionsToRender.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm opacity-70">No history available</p>
                  <p className="text-xs mt-1 opacity-50">
                    Complete a Pomodoro to see it here
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
                                  ? "Work Session"
                                  : session.type === "shortBreak"
                                  ? "Short Break"
                                  : "Long Break"}
                              </span>
                              <span>
                                {format(new Date(session.startTime), "h:mm a")}
                              </span>
                            </div>
                            <div className="mt-1 opacity-70">
                              Duration: {Math.round(session.duration / 60)}{" "}
                              minutes
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
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsDrawer;
