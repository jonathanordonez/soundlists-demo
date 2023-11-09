import React, { useState, useRef, createContext, useEffect } from "react";
import UseToken from "../../Hooks/UseToken";
import Feed from "./Feed/Feed";
import Nav from "./Nav/Nav";
import Toast from "./Toast/Toast";
import OverlaySettings from "./Overlay/OverlaySettings";
import SharePlaylist from "./SharePlaylist/SharePlaylist";
import OverlayCopyToSpotify from "./Overlay/OverlayCopyToSpotify";
import PreviewPlayer from "./PreviewPlayer/PreviewPlayer";
import { getUserDetails } from "../../Utils";

export interface TokenContextType  {
  token: string | null;
  expiresIn: string | null;
};

export const TokenContext = createContext<TokenContextType>({token: '', expiresIn: ''});

export interface UserDetailsContextType {
  userDetailsContext: UserDetailsValuesType;
  setUserDetailsContext: React.Dispatch<React.SetStateAction<UserDetailsValuesType>>
}

export const UserDetailsContext = createContext<UserDetailsContextType>({userDetailsContext: {
  username: '',
  profilePicture: '',
  spotifyUserId: '',
},
setUserDetailsContext: () => {},
});

interface UserDetailsValuesType  
  {
    username: string | null,
    profilePicture: string,
    spotifyUserId:string,
  }

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
  const tokenContext = UseToken();
  const [userDetailsContext, setUserDetailsContext] = useState<UserDetailsValuesType>({
    username: "",
    profilePicture: "default-profile-pic.jpg",
    spotifyUserId: "",
  });
  const [overlayOn, setOverlayOn] = useState(false);
  const [overlayOnCopyToSpotify, setOverlayOnCopyToSpotify] = useState(false);
  const overlayData = useRef({} as overlayDataType);
  const [refreshFeedCounterFromMain, setRefreshFeedCounterFromMain] =
    useState(1);
  const { username, profilePicture } = userDetailsContext;
  const [previewPlayerContext, setPreviewPlayerContext] = useState(previewPlayerDefaultValues);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    (async () => {
      const request = await getUserDetails();
      if (request.status === "successful") {
        if (request.has_data) {
          setUserDetailsContext({
            username: request.username,
            profilePicture: request.profile_picture,
            spotifyUserId: request.spotifyUserId,
          });
        }
      } 
      else{ 
        console.error("Failed to fetch user details");
        localStorage.clear(); // To ensure the user has to sign in next time and a session ID is provided
      }
    })();
  }, []);

  return (
    <TokenContext.Provider value={{ ...tokenContext }}>
    <UserDetailsContext.Provider
      value={{ userDetailsContext, setUserDetailsContext }}
    >
      {overlayOn && (
        <OverlaySettings
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
      </UserDetailsContext.Provider>
      </TokenContext.Provider>
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
