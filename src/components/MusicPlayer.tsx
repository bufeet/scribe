import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, 
  Upload, FolderOpen, ListMusic, Music, Disc, RefreshCw, ChevronRight, ChevronLeft
} from "lucide-react";

export interface Track {
  id: string;
  name: string;
  url: string;
  source: "built-in" | "local";
  duration?: string;
  file?: File;
}

interface MusicPlayerProps {
  onShowNotification?: (message: string, type?: "info" | "success" | "warning" | "error") => void;
  isSidebarCollapsed?: boolean;
}

const DEFAULT_TRACKS: Track[] = [
  {
    id: "lofi-sanctuary",
    name: "Lo-Fi Writing Sanctuary (Lively)",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    source: "built-in"
  },
  {
    id: "cozy-cabin",
    name: "Rainy Cabin Cabin (Ambient)",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    source: "built-in"
  },
  {
    id: "midnight-quill",
    name: "Midnight Quill (Serene Piano)",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    source: "built-in"
  }
];

export default function MusicPlayer({ onShowNotification, isSidebarCollapsed }: MusicPlayerProps) {
  const [tracks, setTracks] = useState<Track[]>(() => {
    const saved = localStorage.getItem("scribe_local_tracks_metadata");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Track[];
        // Filter out local files since blob URLs expire, keeping only built-ins
        return [...DEFAULT_TRACKS];
      } catch (e) {
        return DEFAULT_TRACKS;
      }
    }
    return DEFAULT_TRACKS;
  });

  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.5);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  const currentTrack = tracks[currentTrackIndex] || DEFAULT_TRACKS[0];

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio(currentTrack.url);
    audioRef.current.volume = isMuted ? 0 : volume;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrackIndex]);

  // Handle Play/Pause
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  // Handle volume changes
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (onShowNotification) {
      onShowNotification(
        !isPlaying ? `Spinning up: ${currentTrack.name}` : `Paused: ${currentTrack.name}`,
        "info"
      );
    }
  };

  const handleNext = () => {
    let nextIndex = currentTrackIndex + 1;
    if (nextIndex >= tracks.length) nextIndex = 0;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
    if (onShowNotification) {
      onShowNotification(`Now playing: ${tracks[nextIndex].name}`, "success");
    }
  };

  const handlePrev = () => {
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) prevIndex = tracks.length - 1;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
    if (onShowNotification) {
      onShowNotification(`Now playing: ${tracks[prevIndex].name}`, "success");
    }
  };

  const skipForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration);
    if (onShowNotification) {
      onShowNotification("Fast-forwarded 10 seconds", "info");
    }
  };

  const skipBackward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    if (onShowNotification) {
      onShowNotification("Rewound 10 seconds", "info");
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleImportFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newTracks: Track[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newTracks.push({
        id: `local-${Date.now()}-${i}`,
        name: file.name.replace(/\.[^/.]+$/, ""), // strip extension
        url: url,
        source: "local",
        file: file
      });
    }

    if (newTracks.length > 0) {
      const updated = [...tracks, ...newTracks];
      setTracks(updated);
      setCurrentTrackIndex(tracks.length); // Play the first imported file
      setIsPlaying(true);

      if (onShowNotification) {
        onShowNotification(`Successfully loaded ${newTracks.length} creative tracks!`, "success");
      }
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "00:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-[#FAF9F6]/5 border border-[#EEEDE9]/10 rounded-2xl p-4 flex flex-col gap-3 font-mono text-xs select-none relative overflow-hidden transition-all duration-300">
      
      {/* Visual Header */}
      <div className="flex items-center justify-between border-b border-[#EEEDE9]/10 pb-2">
        <div className="flex items-center gap-1.5 text-[#EEEDE9]/80 font-serif font-semibold text-xs tracking-wider">
          <Disc className={`w-3.5 h-3.5 text-[#D97757] ${isPlaying ? "animate-spin" : ""}`} />
          <span>Scribe Gramophone</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1 rounded hover:bg-[#EEEDE9]/10 text-[#EEEDE9]/60 hover:text-[#D97757] transition-all cursor-pointer"
            title="Import Music File(s)"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => folderInputRef.current?.click()}
            className="p-1 rounded hover:bg-[#EEEDE9]/10 text-[#EEEDE9]/60 hover:text-[#D97757] transition-all cursor-pointer"
            title="Import Music Folder Library"
          >
            <FolderOpen className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className={`p-1 rounded hover:bg-[#EEEDE9]/10 transition-all cursor-pointer ${
              showPlaylist ? "text-[#D97757] bg-[#EEEDE9]/5" : "text-[#EEEDE9]/60 hover:text-[#EEEDE9]"
            }`}
            title="Library Playlist"
          >
            <ListMusic className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Inputs (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".mp3,.wav,.flac"
        onChange={handleImportFiles}
        className="hidden"
      />
      <input
        ref={folderInputRef}
        type="file"
        {...({
          webkitdirectory: "",
          directory: "",
          multiple: true,
          type: "file",
          accept: ".mp3,.wav,.flac"
        } as any)}
        onChange={handleImportFiles}
        className="hidden"
      />

      {/* Main Player Row */}
      <div className="flex items-center gap-4 py-1">
        {/* Vinyl Record animation */}
        <div className="relative w-14 h-14 rounded-full bg-[#1c1a17] shadow-lg flex items-center justify-center border border-[#33322e] shrink-0 group">
          {/* Record grooves */}
          <div className="absolute inset-1 rounded-full border border-[#2b2a26]/40 pointer-events-none" />
          <div className="absolute inset-2.5 rounded-full border border-[#2b2a26]/60 pointer-events-none" />
          <div className="absolute inset-4 rounded-full border border-[#2b2a26]/80 pointer-events-none" />
          
          {/* Center Label */}
          <motion.div 
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{
              repeat: isPlaying ? Infinity : 0,
              ease: "linear",
              duration: 4
            }}
            className="w-5 h-5 rounded-full bg-[#D97757] flex items-center justify-center relative border border-[#141413]/30 shadow"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#EEEDE9]" />
          </motion.div>

          {/* Tonearm */}
          <div 
            className="absolute -top-1 -right-0.5 w-6 h-6 origin-top-right transition-transform duration-500 pointer-events-none"
            style={{
              transform: isPlaying ? "rotate(-12deg)" : "rotate(-32deg)"
            }}
          >
            {/* Metallic tonearm stick */}
            <div className="w-0.5 h-6 bg-[#A49E93] shadow-sm ml-auto mr-1 relative">
              {/* Headshell / Cartridge */}
              <div className="absolute -bottom-1 -left-1 w-2.5 h-1.5 bg-[#4A473E] rounded-sm transform rotate-12" />
            </div>
          </div>
        </div>

        {/* Current track metadata */}
        <div className="flex-grow min-w-0 flex flex-col justify-center">
          <div className="text-[10px] font-bold text-[#EEEDE9] truncate" title={currentTrack.name}>
            {currentTrack.name}
          </div>
          <div className="text-[9px] text-[#EEEDE9]/40 mt-0.5 flex items-center gap-1">
            <span className="uppercase text-[8px] bg-[#EEEDE9]/5 px-1 py-0.5 rounded text-[#D97757] font-semibold">
              {currentTrack.source === "built-in" ? "Sanctuary" : "Library"}
            </span>
            <span>&bull;</span>
            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Progress & Seeking Bar */}
      <div className="flex items-center gap-2">
        <span className="text-[9px] text-[#EEEDE9]/40 font-mono w-7 shrink-0 text-left">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="flex-grow h-1 bg-[#EEEDE9]/10 rounded-lg appearance-none cursor-pointer accent-[#D97757] outline-none"
        />
        <span className="text-[9px] text-[#EEEDE9]/40 font-mono w-7 shrink-0 text-right">{formatTime(duration)}</span>
      </div>

      {/* Interactive Playback Controls */}
      <div className="flex items-center justify-between px-1.5">
        <div className="flex items-center gap-2">
          {/* Volume Control Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1 rounded hover:bg-[#EEEDE9]/10 text-[#EEEDE9]/60 hover:text-[#EEEDE9] transition-all cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-12 h-1 bg-[#EEEDE9]/10 rounded-lg appearance-none cursor-pointer accent-[#D97757]"
            title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
          />
        </div>

        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={skipBackward}
            className="p-1 rounded hover:bg-[#EEEDE9]/10 text-[#EEEDE9]/70 hover:text-white transition-all cursor-pointer font-mono font-bold text-[10px]"
            title="Rewind 10s"
          >
            -10s
          </button>
          <button
            onClick={handlePrev}
            className="p-1 rounded hover:bg-[#EEEDE9]/10 text-[#EEEDE9]/70 hover:text-white transition-all cursor-pointer"
            title="Previous Track"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={togglePlay}
            className="p-2 rounded-full bg-[#D97757] text-[#EEEDE9] hover:scale-105 transition-all shadow cursor-pointer flex items-center justify-center"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-white" /> : <Play className="w-3.5 h-3.5 text-white" />}
          </button>
          <button
            onClick={handleNext}
            className="p-1 rounded hover:bg-[#EEEDE9]/10 text-[#EEEDE9]/70 hover:text-white transition-all cursor-pointer"
            title="Next Track"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={skipForward}
            className="p-1 rounded hover:bg-[#EEEDE9]/10 text-[#EEEDE9]/70 hover:text-white transition-all cursor-pointer font-mono font-bold text-[10px]"
            title="Fast Forward 10s"
          >
            +10s
          </button>
        </div>
      </div>

      {/* Playlist Drawer with list */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-[#EEEDE9]/10 pt-2 flex flex-col gap-1 overflow-hidden"
          >
            <div className="text-[9px] uppercase tracking-wider text-[#EEEDE9]/30 mb-1 flex items-center justify-between">
              <span>Sanctuary Playlist</span>
              <span>{tracks.length} track{tracks.length > 1 ? "s" : ""}</span>
            </div>
            <div className="max-h-28 overflow-y-auto space-y-0.5 pr-1">
              {tracks.map((track, idx) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    setIsPlaying(true);
                    if (onShowNotification) {
                      onShowNotification(`Selected: ${track.name}`, "info");
                    }
                  }}
                  className={`w-full flex items-center gap-1.5 p-1 rounded text-left transition-all cursor-pointer ${
                    idx === currentTrackIndex 
                      ? "bg-[#D97757]/10 text-[#D97757] font-bold" 
                      : "text-[#EEEDE9]/50 hover:bg-[#EEEDE9]/5 hover:text-[#EEEDE9]/80"
                  }`}
                >
                  <Music className="w-2.5 h-2.5 shrink-0" />
                  <span className="truncate flex-grow text-[9.5px]">{track.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
