import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./PlaylistItems.css";
import { TokenContext } from "../../../../App";
import TrackPreviewPlayer from "./Track/TrackPreviewPlayer";
import { isExpiresInValid } from "../../../../../Utils";

interface PlaylistItemsType {
  propsSongs: string[]
  postId: string
  handleSetPreviewUrl: (src:string)=>void
  isPlaylistItemsLoaded: boolean
  setIsPlaylistItemsLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

interface SongType {
  id: string
  album: { images: { url: string }[] };
  name: string
  artists: { name: string; }[]
  preview_url: string
}

export default function PlaylistItems({ propsSongs, postId, handleSetPreviewUrl, isPlaylistItemsLoaded, setIsPlaylistItemsLoaded }:PlaylistItemsType) {
  const [songs, setSongs] = useState([]);
  const tokenContext = useContext(TokenContext);

  // Fetches the songs in the Playlist (images, uri, artists)
  useEffect(() => {
    if(isPlaylistItemsLoaded) {
      console.log('playlists items have loaded already',)
      return
    }

    console.log('Loading playlist items ',)
    if (propsSongs.length > 0 && tokenContext.token && tokenContext.expiresIn && isExpiresInValid(parseFloat(tokenContext.expiresIn))) {
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
          setIsPlaylistItemsLoaded(true);
        } catch (error) {
          console.error("Error fetching songs:", error);
        }
      };

      fetchSongs();
    }
    else{
      console.log('skip ',)
    }
  }, [propsSongs, tokenContext.token, tokenContext.expiresIn, isPlaylistItemsLoaded, setIsPlaylistItemsLoaded]);

  return (
    <div className="postTracks">
      {songs.map((song:SongType) => (
        <TrackPreviewPlayer
          handleSetPreviewUrl={handleSetPreviewUrl}
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
