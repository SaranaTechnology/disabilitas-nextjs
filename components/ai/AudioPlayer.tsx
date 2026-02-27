'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Loader2, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioPlayerProps {
  audioBlob: Blob | null;
  isLoading?: boolean;
}

export default function AudioPlayer({ audioBlob, isLoading = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!audioBlob) return;

    // Cleanup previous
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    const url = URL.createObjectURL(audioBlob);
    urlRef.current = url;

    const audio = new Audio(url);
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    });
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    });

    return () => {
      audio.pause();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, [audioBlob]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
  }, [duration]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span className="text-sm text-gray-500">Membuat audio...</span>
      </div>
    );
  }

  if (!audioBlob) return null;

  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 shrink-0"
        onClick={togglePlay}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </Button>

      <Volume2 className="w-4 h-4 text-gray-400 shrink-0" />

      <div
        className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="text-xs text-gray-500 tabular-nums shrink-0">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
}
