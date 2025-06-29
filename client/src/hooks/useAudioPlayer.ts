import { useState, useEffect, useCallback, useRef } from 'react';
import { Howl } from 'howler';
import { Track, PlayerState } from '../types/Track';

export const useAudioPlayer = () => {
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTrack: null,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isMuted: false,
    isShuffled: false,
    repeatMode: 'none',
    currentPlaylist: [],
    currentIndex: -1
  });

  const howlRef = useRef<Howl | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateTime = useCallback(() => {
    if (howlRef.current && playerState.isPlaying) {
      const currentTime = howlRef.current.seek() as number;
      setPlayerState(prev => ({
        ...prev,
        currentTime: currentTime || 0
      }));
    }
  }, [playerState.isPlaying]);

  useEffect(() => {
    if (playerState.isPlaying && howlRef.current) {
      intervalRef.current = setInterval(updateTime, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [playerState.isPlaying, updateTime]);

  const loadTrack = useCallback((track: Track, playlist: Track[] = [], index: number = 0, autoPlay: boolean = false) => {
    if (howlRef.current) {
      howlRef.current.unload();
    }

    const howl = new Howl({
      src: [track.src],
      html5: true,
      volume: playerState.isMuted ? 0 : playerState.volume,
      onload: () => {
        setPlayerState(prev => ({
          ...prev,
          duration: howl.duration()
        }));
      },
      onplay: () => {
        setPlayerState(prev => ({
          ...prev,
          isPlaying: true
        }));
      },
      onpause: () => {
        setPlayerState(prev => ({
          ...prev,
          isPlaying: false
        }));
      },
      onend: () => {
        handleTrackEnd();
      },
      // @ts-ignore
      onerror: (id: any, error: any) => {
        console.error('Howler error:', error);
        setPlayerState(prev => ({
          ...prev,
          isPlaying: false
        }));
      }
    });

    howlRef.current = howl;
    setPlayerState(prev => ({
      ...prev,
      currentTrack: track,
      currentTime: 0,
      duration: 0,
      currentPlaylist: playlist.length > 0 ? playlist : prev.currentPlaylist,
      currentIndex: index >= 0 ? index : prev.currentIndex
    }));
    if (autoPlay) {
      howl.play();
    }
  }, [playerState.volume, playerState.isMuted]);

  const handleTrackEnd = useCallback(() => {
    setPlayerState(prev => {
      if (prev.repeatMode === 'one') {
        // Repeat current track
        if (howlRef.current) {
          howlRef.current.seek(0);
          howlRef.current.play();
        }
        return { ...prev, currentTime: 0 };
      } else if (prev.repeatMode === 'all' || prev.currentIndex < prev.currentPlaylist.length - 1) {
        // Play next track or loop to beginning
        const nextIndex = prev.currentIndex < prev.currentPlaylist.length - 1 
          ? prev.currentIndex + 1 
          : 0;
        const nextTrack = prev.currentPlaylist[nextIndex];
        
        if (nextTrack) {
          loadTrack(nextTrack, prev.currentPlaylist, nextIndex);
          return prev;
        }
      }
      
      // Stop playing
      return {
        ...prev,
        isPlaying: false,
        currentTime: 0
      };
    });
  }, [loadTrack]);

  const play = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.play();
    }
  }, []);

  const pause = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.pause();
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (playerState.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [playerState.isPlaying, play, pause]);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setPlayerState(prev => ({
      ...prev,
      volume: clampedVolume,
      isMuted: clampedVolume === 0
    }));

    if (howlRef.current) {
      howlRef.current.volume(clampedVolume);
    }
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    setPlayerState(prev => ({
      ...prev,
      isMuted: muted
    }));

    if (howlRef.current) {
      howlRef.current.volume(muted ? 0 : playerState.volume);
    }
  }, [playerState.volume]);

  const seek = useCallback((time: number) => {
    if (howlRef.current && playerState.duration > 0) {
      const clampedTime = Math.max(0, Math.min(playerState.duration, time));
      howlRef.current.seek(clampedTime);
      setPlayerState(prev => ({
        ...prev,
        currentTime: clampedTime
      }));
    }
  }, [playerState.duration]);

  const toggleShuffle = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      isShuffled: !prev.isShuffled
    }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      repeatMode: prev.repeatMode === 'none' ? 'all' : prev.repeatMode === 'all' ? 'one' : 'none'
    }));
  }, []);

  const playNext = useCallback(() => {
    if (playerState.currentPlaylist.length === 0) return;

    let nextIndex: number;
    if (playerState.isShuffled) {
      nextIndex = Math.floor(Math.random() * playerState.currentPlaylist.length);
    } else {
      nextIndex = playerState.currentIndex < playerState.currentPlaylist.length - 1 
        ? playerState.currentIndex + 1 
        : 0;
    }

    const nextTrack = playerState.currentPlaylist[nextIndex];
    if (nextTrack) {
      loadTrack(nextTrack, playerState.currentPlaylist, nextIndex, true);
    }
  }, [playerState.currentPlaylist, playerState.currentIndex, playerState.isShuffled, loadTrack]);

  const playPrevious = useCallback(() => {
    if (playerState.currentPlaylist.length === 0) return;

    let prevIndex: number;
    if (playerState.isShuffled) {
      prevIndex = Math.floor(Math.random() * playerState.currentPlaylist.length);
    } else {
      prevIndex = playerState.currentIndex > 0 
        ? playerState.currentIndex - 1 
        : playerState.currentPlaylist.length - 1;
    }

    const prevTrack = playerState.currentPlaylist[prevIndex];
    if (prevTrack) {
      loadTrack(prevTrack, playerState.currentPlaylist, prevIndex, true);
    }
  }, [playerState.currentPlaylist, playerState.currentIndex, playerState.isShuffled, loadTrack]);

  useEffect(() => {
    return () => {
      if (howlRef.current) {
        howlRef.current.unload();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    playerState,
    loadTrack,
    togglePlay,
    setVolume,
    setMuted,
    seek,
    toggleShuffle,
    toggleRepeat,
    playNext,
    playPrevious
  };
};