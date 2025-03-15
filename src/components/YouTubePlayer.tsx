
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Volume2, Minimize2, Music } from 'lucide-react';

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
  
  useEffect(() => {
    if (videos.length > 0 && !selectedVideoId) {
      setSelectedVideoId(videos[0].id);
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
  
  if (minimized) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="fixed bottom-4 right-4 h-10 w-10 rounded-full p-0 shadow-md glass-panel"
        onClick={onToggleMinimize}
      >
        <Music className="h-5 w-5" />
      </Button>
    );
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 scale-in">
      <div className="glass-panel rounded-lg w-[320px] shadow-lg overflow-hidden">
        <div className="flex justify-between items-center p-2 border-b border-border/50">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
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
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={onToggleMinimize}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
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
