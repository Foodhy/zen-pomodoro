
import React, { useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Plus, X, Pencil, Music, Trash2, Youtube, Cloud, Disc3 } from 'lucide-react';
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

  const isSoundCloudUrl = (url: string) => /^(https?:\/\/)?(www\.)?(soundcloud\.com|snd\.sc|on\.soundcloud\.com)\//i.test(url.trim());

  // Detects SoundCloud playlists / sets (use a taller, "visual" player)
  const isSoundCloudPlaylist = (url: string) => /soundcloud\.com\/[^/]+\/sets\//i.test(url);

  // Spotify: tracks, albums, playlists, episodes, shows, artists
  const isSpotifyUrl = (url: string) =>
    /^(https?:\/\/)?(open\.)?spotify\.com\/(intl-[a-z]{2}\/)?(track|album|playlist|episode|show|artist)\/[A-Za-z0-9]+/i.test(url.trim()) ||
    /^spotify:(track|album|playlist|episode|show|artist):[A-Za-z0-9]+/i.test(url.trim());

  // Spotify "tall" embed for collections (album/playlist/show/artist)
  const isSpotifyCollection = (url: string) =>
    /(spotify\.com\/(intl-[a-z]{2}\/)?(album|playlist|show|artist)\/)|(^spotify:(album|playlist|show|artist):)/i.test(url.trim());

  const extractVideoId = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  // Normalise SoundCloud URLs: strip query/hash so the embed reliably resolves
  const normaliseSoundCloudUrl = (url: string) => {
    try {
      const u = new URL(url.trim());
      // Keep only protocol + host + pathname
      return `${u.protocol}//${u.host}${u.pathname}`;
    } catch {
      return url.trim();
    }
  };

  // Convert any Spotify URL/URI into the canonical embed URL
  const getSpotifyEmbedUrl = (url: string) => {
    const trimmed = url.trim();
    // spotify:type:id
    const uriMatch = trimmed.match(/^spotify:(track|album|playlist|episode|show|artist):([A-Za-z0-9]+)/i);
    if (uriMatch) {
      return `https://open.spotify.com/embed/${uriMatch[1].toLowerCase()}/${uriMatch[2]}?utm_source=generator`;
    }
    // open.spotify.com/[intl-xx/]type/id
    const webMatch = trimmed.match(/spotify\.com\/(?:intl-[a-z]{2}\/)?(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]+)/i);
    if (webMatch) {
      return `https://open.spotify.com/embed/${webMatch[1].toLowerCase()}/${webMatch[2]}?utm_source=generator`;
    }
    return '';
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (isSpotifyUrl(url)) {
      return getSpotifyEmbedUrl(url);
    }
    if (isSoundCloudUrl(url)) {
      const cleanUrl = normaliseSoundCloudUrl(url);
      const visual = isSoundCloudPlaylist(cleanUrl) ? 'true' : 'false';
      const params = new URLSearchParams({
        url: cleanUrl,
        auto_play: 'true',
        hide_related: 'true',
        show_comments: 'false',
        show_user: 'true',
        show_reposts: 'false',
        show_teaser: 'false',
        visual,
        color: 'ff5500',
      });
      return `https://w.soundcloud.com/player/?${params.toString()}`;
    }
    const id = extractVideoId(url);
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : '';
  };

  const isSoundCloudSelected = selectedVideo ? isSoundCloudUrl(selectedVideo.url) : false;
  const isSoundCloudVisual = selectedVideo ? isSoundCloudPlaylist(selectedVideo.url) : false;
  const isSpotifySelected = selectedVideo ? isSpotifyUrl(selectedVideo.url) : false;
  const isSpotifyTallSelected = selectedVideo ? isSpotifyCollection(selectedVideo.url) : false;

  // Validate URL on add: must be a valid YouTube, SoundCloud or Spotify link
  const isValidMediaUrl = (url: string) => {
    if (!url) return false;
    if (isSpotifyUrl(url)) return getSpotifyEmbedUrl(url).length > 0;
    if (isSoundCloudUrl(url)) return true;
    return extractVideoId(url).length === 11;
  };
  const urlError = videoUrl.length > 0 && !isValidMediaUrl(videoUrl);

  // Classify each video by its source platform
  const getPlatform = (url: string): 'youtube' | 'soundcloud' | 'spotify' | 'other' => {
    if (isSpotifyUrl(url)) return 'spotify';
    if (isSoundCloudUrl(url)) return 'soundcloud';
    if (extractVideoId(url)) return 'youtube';
    return 'other';
  };

  const groupedVideos = useMemo(() => {
    const groups: Record<'youtube' | 'soundcloud' | 'spotify' | 'other', typeof videos> = {
      youtube: [], soundcloud: [], spotify: [], other: [],
    };
    videos.forEach((v) => groups[getPlatform(v.url)].push(v));
    return groups;
  }, [videos]);

  const platformMeta: Record<'youtube' | 'soundcloud' | 'spotify' | 'other', { label: string; Icon: React.ComponentType<{ className?: string }>; color: string }> = {
    youtube:    { label: t('music.group.youtube', lang),    Icon: Youtube, color: 'text-red-500' },
    soundcloud: { label: t('music.group.soundcloud', lang), Icon: Cloud,   color: 'text-orange-500' },
    spotify:    { label: t('music.group.spotify', lang),    Icon: Disc3,   color: 'text-green-500' },
    other:      { label: t('music.group.other', lang),      Icon: Music,   color: 'text-muted-foreground' },
  };


  return (
    <div className="zen-music-container">
      {/* Header row */}
      <div className="zen-music-header">
        <div className="flex items-center gap-1.5">
          <Music className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{t('music.title', lang)}</span>
        </div>
        <div className="flex items-center gap-1">
          <ImportExportButtons
            onExport={exportVideosToJson}
            onImport={importVideosFromJsonFile}
            buttonSize="sm"
            exportLabel=""
            importLabel=""
            exportTitle={t('music.exportJson', lang)}
            importTitle={t('music.importJson', lang)}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => { setVideoId(''); setVideoTitle(''); setVideoUrl(''); setShowVideoDialog(true); }}
            title={t('music.addVideo', lang)}
            aria-label={t('music.addVideo', lang)}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

        {/* Embedded player (YouTube, SoundCloud or Spotify) */}
        {selectedVideo && (
          <div
            className="zen-music-player"
            style={
              isSpotifySelected
                ? { aspectRatio: 'auto', height: isSpotifyTallSelected ? 380 : 152 }
                : isSoundCloudSelected
                ? { aspectRatio: 'auto', height: isSoundCloudVisual ? 360 : 166 }
                : undefined
            }
          >
            <iframe
              key={selectedVideo.id}
              src={getEmbedUrl(selectedVideo.url)}
              title={selectedVideo.title}
              frameBorder="0"
              scrolling="no"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      {/* Video chips grouped by platform */}
      <div className="zen-music-groups flex flex-col gap-3 mt-2">
        {(['youtube', 'soundcloud', 'spotify', 'other'] as const).map((key) => {
          const items = groupedVideos[key];
          if (items.length === 0) return null;
          const { label, Icon, color } = platformMeta[key];
          return (
            <div key={key} className="zen-music-group">
              <div className="flex items-center gap-1.5 mb-1.5 px-0.5">
                <Icon className={`h-3.5 w-3.5 ${color}`} />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {label}
                </span>
                <span className="text-[11px] text-muted-foreground/60">({items.length})</span>
              </div>
              <div className="zen-music-chips">
                {items.map((video) => (
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
                        title={t('music.edit', lang)}
                        aria-label={t('music.edit', lang)}
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        className="zen-music-chip-action zen-music-chip-delete"
                        onClick={() => setDeleteConfirmId(video.id)}
                        title={t('music.deleteConfirm.confirm', lang)}
                        aria-label={t('music.deleteConfirm.confirm', lang)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>


      {/* Empty state */}
      {videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Music className="h-8 w-8 mb-3 opacity-40" />
          <p className="text-sm">{t('music.empty', lang)}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => setShowVideoDialog(true)}
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            {t('music.addFirst', lang)}
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
            <DialogTitle>{videoId ? t('music.editVideo', lang) : t('music.addVideo', lang)}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">{t('music.title.field', lang)}</label>
              <Input
                id="title"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder={t('music.title.placeholder', lang)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="url" className="text-sm font-medium">{t('music.url.field', lang)}</label>
              <Input
                id="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/... · soundcloud.com/... · open.spotify.com/..."
                aria-invalid={urlError}
              />
              {urlError ? (
                <p className="text-xs text-destructive">
                  Invalid URL. Use a YouTube video, SoundCloud track/playlist, or Spotify track/album/playlist link.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  YouTube, SoundCloud & Spotify (tracks, albums or playlists) supported.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVideoDialog(false)}>{t('music.cancel', lang)}</Button>
            <Button
              onClick={handleAddVideo}
              disabled={!videoTitle.trim() || !isValidMediaUrl(videoUrl)}
            >
              {videoId ? t('music.update', lang) : t('music.add', lang)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default YouTubePlayerWithImportExport;
