import React, { useEffect, useRef, useState } from "react";
import useMusicApi from "../hooks/useMusicApi.js";
import SongList from "./SongList.jsx";

const Player = () => {

  const audioRef = useRef(null);

  const [query, setQuery] = useState("arijit");
  const [debouncedQuery, setDebouncedQuery] = useState("arijit");
  const { songs, loading, error } = useMusicApi(debouncedQuery);

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(0.5);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );
  

  /* ---------------- THEME ---------------- */
  useEffect(() => {
  const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  /* ---------------- AUDIO ---------------- */
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    if (repeatMode === "one") {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    if (isShuffle) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * songs.length);
      } while (randomIndex === currentSongIndex);
      setCurrentSongIndex(randomIndex);
      return;
    }

    if (currentSongIndex === songs.length - 1) {
      if (repeatMode === "all") {
        setCurrentSongIndex(0);
      } else {
        setIsPlaying(false);
      }
    } else {
      setCurrentSongIndex(currentSongIndex + 1);
    }
  };

  const prevSong = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setCurrentSongIndex(randomIndex);
    } else {
      setCurrentSongIndex(
        currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1
      );
    }
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play();
    }
  }, [currentSongIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  /* ---------------- TIME ---------------- */
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const seekTime = Number(e.target.value);
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

    // 5️⃣ Guards AFTER all hooks
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading songs… 🎧</p>
      </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
      );
    }

  // 6️⃣ Safe to use songs now
    const currentSong = songs[currentSongIndex];


  /* ---------------- UI ---------------- */
  return (
  <div
    className={`min-h-screen flex transition-all duration-700 bg-gradient-to-br
              ${currentSong.bg}`}>
    <div className="animate-fadeIn flex flex-col md:flex-row w-full
                bg-black/40 backdrop-blur-md text-white">

    {/* Sidebar */}
    <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-gray-300 dark:border-gray-700 p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">🎵 My Music</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search artist or song..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-4 p-2 rounded bg-gray-200 dark:bg-gray-700 outline-none"
      />

      {/* Playlist */}
      <div className="flex-1 overflow-y-auto">
        <SongList
          songs={songs}
          currentSongIndex={currentSongIndex}
          setCurrentSongIndex={setCurrentSongIndex}
        />
      </div>
    </aside>

    {/* Main Player Area */}
    <main className="flex-1 flex flex-col items-center justify-center p-8
                 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl">
    
      <audio
        ref={audioRef}
        src={currentSong.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextSong}
      />


      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute top-6 right-6 text-2xl"
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </button>

      {/* Album Art */}
      <img
        src={currentSong.cover}
        className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl shadow-xl mb-6"
      />



      {/* Song Info */}
      <h2 className="text-2xl font-semibold">{currentSong.title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {currentSong.artist}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-6 mb-6 text-2xl">
        <button onClick={() => setIsShuffle(!isShuffle)}
        className="hover:scale-110 transition-transform duration-200">
          🔀
        </button>
        <button onClick={prevSong}
        className="hover:scale-110 transition-transform duration-200">
        ⏮️
        </button>

        <button
          onClick={togglePlay}
            className="bg-blue-500 hover:bg-blue-600 hover:scale-110 transition-all duration-200 text-white p-4 rounded-full shadow-lg"
        >       
          {isPlaying ? "⏸️" : "▶️"}
        </button>

        <button onClick={nextSong} 
        className="hover:scale-110 transition-transform duration-200">
        ⏭️
        </button>

        <button
          className="hover:scale-110 transition-transform duration-200"
          onClick={() =>
            setRepeatMode(
              repeatMode === "off"
                ? "one"
                : repeatMode === "one"
                ? "all"
                : "off"
            )
          }
        >
          {repeatMode === "one" ? "🔂" : "🔁"}
        </button>
      </div>

      {/* Progress */}
      <input
        type="range"
        className="w-full max-w-md md:max-w-xl"
      />

      <p className="text-xs text-gray-500 mt-2">
        Preview playback (30 seconds)
      </p>


      <div className="flex justify-between w-full max-w-xl text-sm text-gray-600 dark:text-gray-400 mt-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 mt-4 w-full max-w-xl">
        <span>{volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1"
        />
      </div>

    </main>
    </div>
  </div>
);
};

export default Player;