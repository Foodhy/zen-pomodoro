import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Volume2, Minimize2, Music, X, Maximize2 } from 'lucide-react';

interface YouTubePlayerProps {
  minimized?: boolean;
  onToggleMinimize: () => void;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ 
  minimized = false,
  onToggleMinimize
}) => {
  const { videos } = useApp();
  const [selectedVideoId, setSelectedVideoId] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isClosed, setIsClosed] = useState(false);
  
  const playerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (videos.length > 0 && !selectedVideoId) {
      setSelectedVideoId(videos[0].id);
    }
    
    // Initialize position in the bottom right
    if (playerRef.current) {
      const rect = playerRef.current.getBoundingClientRect();
      setPosition({
        x: window.innerWidth - rect.width - 20,
        y: window.innerHeight - rect.height - 20
      });
    }
  }, [videos, selectedVideoId]);
  
  useEffect(() => {
    if (selectedVideoId) {
      const video = videos.find(v => v.id === selectedVideoId);
      if (video) {
        // Extract YouTube video ID
        const match = video.url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        const youtubeVideoId = match ? match[1] : null;
        
        if (youtubeVideoId) {
          setVideoUrl(`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=0&controls=1`);
        }
      }
    }
  }, [selectedVideoId, videos]);
  
  const handleVideoChange = (value: string) => {
    setSelectedVideoId(value);
  };
  
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (playerRef.current) {
      setIsDragging(true);
      const rect = playerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
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
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);
  
  const handleClose = () => {
    setIsClosed(true);
  };
  
  const handleReopen = () => {
    setIsClosed(false);
  };
  
  if (minimized) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="fixed bottom-4 right-4 h-10 w-10 rounded-full p-0 shadow-md glass-panel cursor-move"
        onClick={onToggleMinimize}
        style={{ 
          left: position.x,
          top: position.y,
          position: 'fixed',
          transform: 'translate(0, 0)'
        }}
        onMouseDown={handleDragStart}
      >
        <Music className="h-5 w-5" />
      </Button>
    );
  }
  
  if (isClosed) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="fixed h-10 w-10 rounded-full p-0 shadow-md glass-panel cursor-move"
        onClick={handleReopen}
        style={{ 
          left: position.x,
          top: position.y,
          position: 'fixed',
          transform: 'translate(0, 0)'
        }}
        onMouseDown={handleDragStart}
      >
        <Music className="h-5 w-5" />
      </Button>
    );
  }
  
  return (
    <div 
      className="fixed z-50 scale-in"
      style={{ 
        left: position.x,
        top: position.y,
        position: 'fixed',
        transform: 'translate(0, 0)'
      }}
      ref={playerRef}
    >
      <div 
        className="glass-panel rounded-lg w-[320px] shadow-lg overflow-hidden cursor-move"
        onMouseDown={handleDragStart}
      >
        <div className="flex justify-between items-center p-2 border-b border-border/50">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
                <Volume2 className="h-4 w-4" />
                <span className="text-xs font-medium">Focus Music</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="start">
              <div className="space-y-2">
                <div className="text-sm font-semibold">Select Focus Music</div>
                <Select value={selectedVideoId} onValueChange={handleVideoChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a video" />
                  </SelectTrigger>
                  <SelectContent>
                    {videos.map(video => (
                      <SelectItem key={video.id} value={video.id}>{video.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
          <div className="aspect-video w-full">
            <iframe
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
