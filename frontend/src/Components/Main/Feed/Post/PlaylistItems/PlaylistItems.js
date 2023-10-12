import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./PlaylistItems.css";
import { TokenContext } from "../../../../App";
import TrackPreviewPlayer from "./Track/TrackPreviewPlayer";

export default function PlaylistItems({ propsSongs, postId, handleSrc }) {
  const [songs, setSongs] = useState([]);
  const { tokenContext } = useContext(TokenContext);
  const [previewUrls, setPreviewUrls] = useState([]);

  // Fetches the songs in the Playlist (images, uri, artists)
  useEffect(() => {

    if (propsSongs.length > 0 && tokenContext.token) {
      const fetchSongs = async () => {
        try {
          const response = await axios.get(
            `https://api.spotify.com/v1/tracks/?ids=${propsSongs}`,
            {
              headers: {
                Authorization: `Bearer ${tokenContext.token}`,
              },
            }
          );

          setSongs(response.data.tracks);
        } catch (error) {
          console.error("Error fetching songs:", error);
        }
      };

      fetchSongs();
    }
  }, [propsSongs]);

  useEffect(() => {
    if (songs.length > 0) {
      const urls = songs.map((song) => song.preview_url);
      setPreviewUrls(urls);
    }
  }, [songs]);

  return (
    <div className="postTracks">
      {songs.map((song) => (
        <TrackPreviewPlayer
          handleSrc={handleSrc}
          postId={postId}
          key={song.id}
          albumCover={song.album.images[2].url}
          songName={song.name}
          artist={song.artists}
          previewUrl={song.preview_url}
          previewUrls={previewUrls}
          uri={song.id}
        />
      ))}
    </div>
  );
}
