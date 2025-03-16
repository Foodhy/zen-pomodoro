import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Volume2,
  Minimize2,
  Music,
  X,
  Maximize2,
  Plus,
  Trash,
} from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { YouTubeVideo } from "../models/types";

interface YouTubePlayerProps {
  minimized?: boolean;
  onToggleMinimize: () => void;
  setIsYouTubeMinimized: any;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  minimized = false,
  onToggleMinimize,
  setIsYouTubeMinimized,
}) => {
  const { videos, saveVideo, deleteVideo } = useApp();
  const [selectedVideoId, setSelectedVideoId] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({
    x: 20,
    y: window.innerHeight / 2,
  }); // Start bottom left
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isClosed, setIsClosed] = useState(true);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [showVideoDialog, setShowVideoDialog] = useState(false);

  const playerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (videos.length > 0 && !selectedVideoId) {
      setSelectedVideoId(videos[0].id);
    }
  }, [videos, selectedVideoId]);

  useEffect(() => {
    if (selectedVideoId) {
      const video = videos.find((v) => v.id === selectedVideoId);
      if (video) {
        // Extract YouTube video ID
        const match = video.url.match(
          /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        );
        const youtubeVideoId = match ? match[1] : null;

        if (youtubeVideoId) {
          // Keep the audio playing even when minimized by not muting
          setVideoUrl(
            `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=0&controls=1`
          );
        }
      }
    }
  }, [selectedVideoId, videos]);

  const handleVideoChange = (value: string) => {
    setSelectedVideoId(value);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (playerRef.current) {
      setIsDragging(true);
      const rect = playerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleDragMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Keep within window bounds
      const maxX = window.innerWidth - (playerRef.current?.offsetWidth || 0);
      const maxY = window.innerHeight - (playerRef.current?.offsetHeight || 0);

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
    } else {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging]);

  const handleClose = () => {
    setIsYouTubeMinimized(true);
    setIsClosed(true);
  };

  const handleReopen = () => {
    setIsYouTubeMinimized(false);
    setIsClosed(false);
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
    if (id === selectedVideoId && videos.length > 1) {
      // Find another video to select
      const otherVideo = videos.find((v) => v.id !== id);
      if (otherVideo) {
        setSelectedVideoId(otherVideo.id);
      }
    }
  };

  // if (minimized) {
  //   return (
  //     <div
  //       className="fixed z-50 cursor-move"
  //       style={{
  //         left: `${position.x}px`,
  //         top: `${position.y}px`,
  //       }}
  //       ref={playerRef}
  //       onMouseDown={handleDragStart}
  //     >
  //       <Button
  //         variant="outline"
  //         size="sm"
  //         className="h-10 w-10 rounded-full p-0 shadow-md glass-panel"
  //         onClick={onToggleMinimize}
  //       >
  //         <Music className="h-5 w-5" />
  //       </Button>
  //     </div>
  //   );
  // }

  if (isClosed) {
    return (
      <div
        className="fixed z-50 cursor-move"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        ref={playerRef}
        onMouseDown={handleDragStart}
      >
        <Button
          variant="outline"
          size="sm"
          className="h-10 w-10 rounded-full p-0 shadow-md glass-panel"
          onClick={handleReopen}
        >
          <Music className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className="fixed z-50 scale-in"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      ref={playerRef}
    >
      <div
        className={`glass-panel rounded-lg w-[320px] shadow-lg overflow-hidden ${
          minimized ? "w-fit" : ""
        }`}
        onMouseDown={handleDragStart}
      >
        <div className="flex justify-between items-center p-2 border-b border-border/50">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 cursor-pointer"
              >
                <Volume2 className="h-4 w-4" />
                <span className="text-xs font-medium">Focus Music</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="start">
              <div className="space-y-2">
                <div className="text-sm font-semibold">Select Focus Music</div>
                <Select
                  value={selectedVideoId}
                  onValueChange={handleVideoChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a video" />
                  </SelectTrigger>
                  <SelectContent>
                    {videos.map((video) => (
                      <SelectItem
                        key={video.id}
                        value={video.id}
                        className="pr-8 relative"
                      >
                        {video.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Dialog
                  open={showVideoDialog}
                  onOpenChange={setShowVideoDialog}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="w-full mt-2">
                      <Plus className="h-4 w-4 mr-2" /> Add New
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
            </PopoverContent>
          </Popover>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 cursor-pointer"
              onClick={onToggleMinimize}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 cursor-pointer"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {videoUrl && (
          <div className={`aspect-video w-full ${minimized ? "hidden" : ""}`}>
            <iframe
              ref={iframeRef}
              width="100%"
              height="100%"
              src={videoUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube video player"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubePlayer;
