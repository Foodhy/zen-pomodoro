
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import ImportExportButtons from './ImportExportButtons';

const YouTubePlayerWithImportExport = () => {
  const { videos, saveVideo, deleteVideo, exportVideosToJson, importVideosFromJsonFile } = useApp();
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoId, setVideoId] = useState('');
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(videos[0] || null);

  const handleAddVideo = () => {
    if (videoUrl && videoTitle) {
      saveVideo({
        id: videoId || undefined,
        title: videoTitle,
        url: videoUrl
      });
      setVideoUrl('');
      setVideoTitle('');
      setVideoId('');
      setShowVideoDialog(false);
    }
  };

  const handleVideoSelect = (url: string) => {
    const video = videos.find(v => v.url === url);
    if (video) {
      setSelectedVideo(video);
    }
  };

  const handleEditVideo = (video: any) => {
    setVideoId(video.id);
    setVideoTitle(video.title);
    setVideoUrl(video.url);
    setShowVideoDialog(true);
  };

  const extractVideoId = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const getEmbedUrl = (url: string) => {
    const videoId = extractVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : '';
  };

  // Render with embedded iframe if a video is selected
  return (
    <Card className="w-full h-full flex flex-col bg-background">
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Music & Ambience</CardTitle>
          <div className="flex items-center gap-2">
            <ImportExportButtons
              onExport={exportVideosToJson}
              onImport={importVideosFromJsonFile}
              buttonSize="sm"
              exportLabel="Export"
              importLabel="Import"
            />
            <Button variant="outline" size="sm" onClick={() => setShowVideoDialog(true)}>Add Video</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Video selection buttons */}
        <div className="flex flex-wrap gap-2 mb-2">
          {videos.map((video) => (
            <div key={video.id} className="flex items-center gap-1">
              <Button
                variant={selectedVideo?.id === video.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleVideoSelect(video.url)}
                className="max-w-[200px] truncate"
              >
                {video.title}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0"
                onClick={() => handleEditVideo(video)}
              >
                <span className="sr-only">Edit</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 text-destructive"
                onClick={() => deleteVideo(video.id)}
              >
                <span className="sr-only">Delete</span>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Embedded video */}
        {selectedVideo && (
          <div className="w-full flex-1 min-h-[200px]">
            <iframe
              className="w-full h-full aspect-video"
              src={getEmbedUrl(selectedVideo.url)}
              title={selectedVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {/* Dialog for adding/editing videos */}
        <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{videoId ? 'Edit Video' : 'Add Video'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title">Title</label>
                <Input
                  id="title"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Enter video title"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="url">YouTube URL</label>
                <Input
                  id="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Enter YouTube URL"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowVideoDialog(false)}>Cancel</Button>
              <Button onClick={handleAddVideo}>{videoId ? 'Update' : 'Add'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default YouTubePlayerWithImportExport;
