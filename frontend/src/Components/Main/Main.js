import React, { useContext, useState, useRef, createContext } from "react";
import { UserDetailsContext } from "../App";
import Feed from "./Feed/Feed";
import Nav from "./Nav/Nav";
import Toast from "./Toast/Toast";
import Overlay from "./Overlay/Overlay";
import SharePlaylist from "./SharePlaylist/SharePlaylist";
import OverlayCopyToSpotify from "./Overlay/OverlayCopyToSpotify";
import PreviewPlayer from "./PreviewPlayer/PreviewPlayer";

export const PreviewPlayerContext = createContext();

export default function Main(props) {
  const [overlayOn, setOverlayOn] = useState(false);
  const [overlayOnCopyToSpotify, setOverlayOnCopyToSpotify] = useState(false);
  let overlayAction = useRef();
  let overlayData = useRef();
  const [refreshFeedCounterFromMain, setRefreshFeedCounterFromMain] =
    useState(1);
  const { userDetailsContext } = useContext(UserDetailsContext);
  const { username, profilePicture } = userDetailsContext;
  const [previewPlayerContext, setPreviewPlayerContext] = useState({
    urls: [],
    playerState: "",
    previewUrl: "",
    postId: "",
    src: "",
  });
  const [src, setSrc] = useState();

  return (
    <>
      {overlayOn && (
        <Overlay
          setOverlayOnHandler={setOverlayOnHandler}
          updateProfilePicture={props.updateProfilePicture}
          profilePicture={profilePicture}
          signOut={props.signOut}
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
          src={src}
          previewUrl={previewPlayerContext.previewUrl}
          playerState={previewPlayerContext.playerState}
        />
      </PreviewPlayerContext.Provider>

      <Nav
        setOverlayOnHandler={setOverlayOnHandler}
        profilePicture={profilePicture}
        updateProfilePicture={props.updateProfilePicture}
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
              handleSrc={handleSrc}
            />
          </PreviewPlayerContext.Provider>
        </div>
      </div>
    </>
  );

  function setOverlayOnHandler(overlayActionPassed, data) {
    if (overlayActionPassed) {
      overlayAction.current = overlayActionPassed;
      overlayData.current = data;
    }
    const body = document.getElementsByTagName("body")[0];
    if (overlayOn == false) {
      body.classList.add("overlayBody");
      setOverlayOn(true);
    } else {
      body.classList.remove("overlayBody");
      setOverlayOn(false);
    }
  }

  function setOverlayOnHandlerCopyToSpotify(data) {
    overlayData.current = data;
    const body = document.getElementsByTagName("body")[0];
    if (overlayOnCopyToSpotify == false) {
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

  function handleSrc(src) {
    setSrc(src);
  }
}
