
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Plus, X, Pencil, Music, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ImportExportButtons from './ImportExportButtons';
import { t } from '../services/translationService';

const YouTubePlayerWithImportExport = () => {
  const { videos, saveVideo, deleteVideo, exportVideosToJson, importVideosFromJsonFile, settings } = useApp();
  const lang = settings.language;
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoId, setVideoId] = useState('');
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(videos[0] || null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);


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
    if (video) setSelectedVideo(video);
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
    const id = extractVideoId(url);
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : '';
  };

  return (
    <div className="zen-music-container">
      {/* Header row */}
      <div className="zen-music-header">
        <div className="flex items-center gap-1.5">
          <Music className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Music & Ambience</span>
        </div>
        <div className="flex items-center gap-1">
          <ImportExportButtons
            onExport={exportVideosToJson}
            onImport={importVideosFromJsonFile}
            buttonSize="sm"
            exportLabel=""
            importLabel=""
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => { setVideoId(''); setVideoTitle(''); setVideoUrl(''); setShowVideoDialog(true); }}
            title="Add video"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

        {/* Now playing bar */}
        {selectedVideo && (
          <div className="zen-music-now-playing">
            <span className="zen-music-now-playing-dot" />
            <span className="zen-music-now-playing-title">{selectedVideo.title}</span>
          </div>
        )}

        {/* Embedded video */}
        {selectedVideo && (
          <div className="zen-music-player">
            <iframe
              src={getEmbedUrl(selectedVideo.url)}
              title={selectedVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      {/* Video chips */}
      <div className="zen-music-chips">
        {videos.map((video) => (
          <div
            key={video.id}
            className={`zen-music-chip ${selectedVideo?.id === video.id ? 'zen-music-chip-active' : ''}`}
          >
            <button
              className="zen-music-chip-label"
              onClick={() => handleVideoSelect(video.url)}
            >
              {video.title}
            </button>
            <div className="zen-music-chip-actions">
              <button
                className="zen-music-chip-action"
                onClick={() => handleEditVideo(video)}
                title="Edit"
              >
                <Pencil className="h-3 w-3" />
              </button>
              <button
                className="zen-music-chip-action zen-music-chip-delete"
                onClick={() => setDeleteConfirmId(video.id)}
                title={t('music.deleteConfirm.confirm', lang)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>


      {/* Empty state */}
      {videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Music className="h-8 w-8 mb-3 opacity-40" />
          <p className="text-sm">No videos yet</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => setShowVideoDialog(true)}
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add your first video
          </Button>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => { if (!open) setDeleteConfirmId(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-destructive" />
              {t('music.deleteConfirm.title', lang)}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            {t('music.deleteConfirm.message', lang)}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              {t('music.deleteConfirm.cancel', lang)}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteConfirmId) {
                  if (selectedVideo?.id === deleteConfirmId) setSelectedVideo(videos.find(v => v.id !== deleteConfirmId) || null);
                  deleteVideo(deleteConfirmId);
                }
                setDeleteConfirmId(null);
              }}
            >
              {t('music.deleteConfirm.confirm', lang)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add / Edit dialog */}
      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{videoId ? 'Edit Video' : 'Add Video'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="e.g. Lofi Hip Hop Radio"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="url" className="text-sm font-medium">YouTube URL</label>
              <Input
                id="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVideoDialog(false)}>Cancel</Button>
            <Button onClick={handleAddVideo}>{videoId ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default YouTubePlayerWithImportExport;
