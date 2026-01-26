const SongList = ({ songs, currentSongIndex, setCurrentSongIndex }) => {
  return (
    <div>
      {songs.map((song, index) => (
        <div
          key={song.id}
          onClick={() => setCurrentSongIndex(index)}
          className={`cursor-pointer p-2 rounded transition-all duration-200 ${
            index === currentSongIndex
              ? "bg-blue-500 text-white scale-[1.02]"
              : "hover:bg-gray-200 dark:hover:bg-gray-700 hover:pl-4"
          }`}
        >
          <p className="text-sm font-medium">{song.title}</p>
          <p className="text-xs opacity-70">{song.artist}</p>
        </div>
      ))}
    </div>
  );
};

export default SongList;
