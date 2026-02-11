import { useEffect, useState } from "react";

const useMusicApi = (query = "arijit") => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    const fetchSongs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`,
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
              "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
            },
          }
        );

        const data = await response.json();

        const colors = [
            "from-purple-600 to-indigo-600",
            "from-pink-500 to-red-500",
            "from-green-500 to-emerald-600",
            "from-blue-500 to-cyan-500",
            "from-orange-500 to-yellow-500",
        ];

        const formattedSongs = data.data.map((song, index) => ({
            id: song.id,
            title: song.title,
            artist: song.artist.name,
            src: song.preview,
            cover: song.album.cover_medium,
            bg: colors[index % colors.length], // 🎨 dynamic background
        }));


        setSongs(formattedSongs);
      } catch (err) {
        setError("Failed to load songs");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [query]);

  return { songs, loading, error };
};

export default useMusicApi;
