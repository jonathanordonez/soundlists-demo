import React, { useState, useEffect, useContext } from "react";
import "./Track.css";
import SVGPlay from "./SVGPlay";
import SVGPause from "./SVGPause";
import { PreviewPlayerContext } from "../../../../Main";

interface TrackPreviewPlayerType {
  uri: string
  postId: string
  albumCover: string
  songName: string
  artist: { name: string; }[]
  previewUrl: string
  setPreviewUrl: (src:string)=>void
}

export default function TrackPreviewPlayer({
  uri,
  postId,
  albumCover,
  songName,
  artist,
  previewUrl,
  setPreviewUrl,
}:TrackPreviewPlayerType) {
  const { previewPlayerContext, setPreviewPlayerContext } =
    useContext(PreviewPlayerContext);
  const [trackStyle, setTrackStyle] = useState("");
  const [isDisabled, setIsDisabled] = useState("");

  useEffect(() => {
    if (!previewUrl) {
      setIsDisabled("disabledTrack");
    }
  }, [previewUrl]);

  useEffect(() => {
    if (
      previewPlayerContext.postId === postId &&
      previewPlayerContext.playerState === "play" &&
      previewUrl === previewPlayerContext.previewUrl
    ) {
      setTrackStyle("active");
    } else {
      setTrackStyle("");
    }
  }, [previewPlayerContext]);

  function getArtists(artists:{name:string}[]) {
    if (artists !== undefined && artists.length > 0) {
      let newArtist = "";
      for (let index in artists) {
        newArtist = newArtist + ", " + artists[index].name;
      }
      let newArtistFixed = newArtist.slice(2, newArtist.length);

      if (window.screen.width < 400) {
        if (newArtistFixed.length > 25) {
          newArtistFixed = `${newArtistFixed.slice(0, 26)}...`;
        }
      }
      return newArtistFixed;
    }
  }

  function getSongName(name:string) {
    if (window.screen.width < 400) {
      if (name.length > 25) {
        const newSongName = `${name.slice(0, 26)}...`;
        return newSongName;
      } else {
        return name;
      }
    }
    return name;
  }

  function playOrPauseTrack() {
    setPreviewUrl(previewUrl);
    if (trackStyle === "active") {
      setPreviewPlayerContext({
        playerState: "pause",
        postId: postId,
        playingTrack: uri,
        previewUrl: previewUrl,
      });
    } else {
      setPreviewPlayerContext({
        playerState: "play",
        postId: postId,
        playingTrack: uri,
        previewUrl: previewUrl,
      });
    }
  }

  return (
    <div
      key={uri}
      className={`track ${trackStyle}${isDisabled}`}
      onClick={playOrPauseTrack}
      data-uri={uri}
    >
      <div className="imageContainer">
        <img src={albumCover} alt="Album Cover" />
        <div className="playOverlay">
          {trackStyle === "active" ? <SVGPause /> : <SVGPlay />}
        </div>
      </div>
      <div className="trackDetails">
        <div className="trackName">{getSongName(songName)}</div>
        <div className="trackArtist">{getArtists(artist)}</div>
      </div>
    </div>
  );
}
