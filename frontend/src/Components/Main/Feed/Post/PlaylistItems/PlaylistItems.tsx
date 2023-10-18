import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./PlaylistItems.css";
import { TokenContext } from "../../../../App";
import TrackPreviewPlayer from "./Track/TrackPreviewPlayer";

interface PlaylistItemsType {
  propsSongs: string[]
  postId: string
  setPreviewUrl: (src:string)=>void
}

interface SongType {
  id: string
  album: { images: { url: string }[] };
  name: string
  artists: { name: string; }[]
  preview_url: string
}

export default function PlaylistItems({ propsSongs, postId, setPreviewUrl }:PlaylistItemsType) {
  const [songs, setSongs] = useState([]);
  const tokenContext = useContext(TokenContext);

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

  return (
    <div className="postTracks">
      {songs.map((song:SongType) => (
        <TrackPreviewPlayer
          setPreviewUrl={setPreviewUrl}
          postId={postId}
          key={song.id}
          albumCover={song.album.images[2].url}
          songName={song.name}
          artist={song.artists}
          previewUrl={song.preview_url}
          uri={song.id}
        />
      ))}
    </div>
  );
}
