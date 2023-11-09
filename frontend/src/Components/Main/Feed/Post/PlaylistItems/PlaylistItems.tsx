import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./PlaylistItems.css";
import { TokenContext } from "../../../Main";
import TrackPreviewPlayer from "./Track/TrackPreviewPlayer";
import { isExpiresInValid } from "../../../../../Utils";

interface PlaylistItemsType {
  propsSongs: string[]
  postId: string
  handleSetPreviewUrl: (src:string)=>void
  isPlaylistItemsFetched: boolean
  setisPlaylistItemsFetched: React.Dispatch<React.SetStateAction<boolean>>
}

interface SongType {
  id: string
  album: { images: { url: string }[] };
  name: string
  artists: { name: string; }[]
  preview_url: string
  external_urls: {spotify: string}
}

export default function PlaylistItems({ propsSongs, postId, handleSetPreviewUrl, isPlaylistItemsFetched, setisPlaylistItemsFetched }:PlaylistItemsType) {
  const [songs, setSongs] = useState([]);
  const tokenContext = useContext(TokenContext);

  // Fetches the songs in the Playlist (images, uri, artists)
  useEffect(() => {

    if (propsSongs.length > 0 && tokenContext.token && tokenContext.expiresIn && isExpiresInValid(parseFloat(tokenContext.expiresIn)) && !isPlaylistItemsFetched) {
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
          setisPlaylistItemsFetched(true);
        } catch (error) {
          console.error("Error fetching songs:", error);
        }
      };

      fetchSongs();
    }
    else{
      return
    }
  }, [propsSongs, tokenContext.token, tokenContext.expiresIn, isPlaylistItemsFetched, setisPlaylistItemsFetched]);

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
