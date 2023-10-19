import React, { useContext, useState, useRef, createContext } from "react";
import { UserDetailsContext } from "../App";
import Feed from "./Feed/Feed";
import Nav from "./Nav/Nav";
import Toast from "./Toast/Toast";
import Overlay from "./Overlay/Overlay";
import SharePlaylist from "./SharePlaylist/SharePlaylist";
import OverlayCopyToSpotify from "./Overlay/OverlayCopyToSpotify";
import PreviewPlayer from "./PreviewPlayer/PreviewPlayer";

const previewPlayerDefaultValues = {
  playerState: '',
  previewUrl: '',
  postId: '',
  playingTrack: '',
}

interface PreviewPlayerContextType {
  playerState: string,
  previewUrl: string,
  postId: string,
  playingTrack: string,
}

export const PreviewPlayerContext = createContext(
  {
  previewPlayerContext: previewPlayerDefaultValues,
  setPreviewPlayerContext: (newContext:PreviewPlayerContextType) => {},
  }
);

interface overlayDataType {
  playlistName: string,
  trackUris: string[]
}

export default function Main() {
  const [overlayOn, setOverlayOn] = useState(false);
  const [overlayOnCopyToSpotify, setOverlayOnCopyToSpotify] = useState(false);
  const overlayData = useRef({} as overlayDataType);
  const [refreshFeedCounterFromMain, setRefreshFeedCounterFromMain] =
    useState(1);
  const { userDetailsContext } = useContext(UserDetailsContext);
  const { username, profilePicture } = userDetailsContext;
  const [previewPlayerContext, setPreviewPlayerContext] = useState(previewPlayerDefaultValues);
  const [previewUrl, setPreviewUrl] = useState('');

  return (
    <>
      {overlayOn && (
        <Overlay
          setOverlayOnHandler={setOverlayOnHandler}
          profilePicture={profilePicture}
        />
      )}
      {overlayOnCopyToSpotify && (
        <OverlayCopyToSpotify
          setOverlayOnHandlerCopyToSpotify={setOverlayOnHandlerCopyToSpotify}
          overlayData={overlayData.current}
        />
      )}

      <PreviewPlayerContext.Provider
        value={{ previewPlayerContext, setPreviewPlayerContext }}
      >
        <PreviewPlayer
          previewUrl={previewUrl}
        />
      </PreviewPlayerContext.Provider>

      <Nav
        setOverlayOnHandler={setOverlayOnHandler}
        profilePicture={profilePicture}
      ></Nav>
      <Toast></Toast>
      <div className="container">
        <div
          id="username"
          style={{ visibility: "hidden", position: "absolute" }}
        >
          {username}
        </div>
        <div className="main-wrapper">
          <SharePlaylist handleRefreshFeed={handleRefreshFeed} />
          <PreviewPlayerContext.Provider
            value={{ previewPlayerContext, setPreviewPlayerContext }}
          >
            <Feed
              profilePicture={profilePicture}
              refreshFeedCounterFromMain={refreshFeedCounterFromMain}
              setOverlayOnHandlerCopyToSpotify={
                setOverlayOnHandlerCopyToSpotify
              }
              handleSetPreviewUrl={handleSetPreviewUrl}
            />
          </PreviewPlayerContext.Provider>
        </div>
      </div>
    </>
  );

  function setOverlayOnHandler() {
    const body = document.getElementsByTagName("body")[0];
    if (overlayOn === false) {
      body.classList.add("overlayBody");
      setOverlayOn(true);
    } else {
      body.classList.remove("overlayBody");
      setOverlayOn(false);
    }
  }

  function setOverlayOnHandlerCopyToSpotify(data:{ playlistName: string, trackUris: string [] }|null) {
    if(data){
      overlayData.current = data;
      console.log('this ', overlayData.current)
    }
    const body = document.getElementsByTagName("body")[0];
    if (overlayOnCopyToSpotify === false) {
      body.classList.add("overlayBody");
      setOverlayOnCopyToSpotify(true);
    } else {
      body.classList.remove("overlayBody");
      setOverlayOnCopyToSpotify(false);
    }
  }

  function handleRefreshFeed() {
    setRefreshFeedCounterFromMain((counter) => counter + 1);
  }

  function handleSetPreviewUrl(preview_url:string) {
    setPreviewUrl(preview_url);
  }
}
