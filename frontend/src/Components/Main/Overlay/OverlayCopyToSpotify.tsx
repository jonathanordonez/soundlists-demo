import React, { useContext } from "react";
import { addSongsToPlaylist, createPlaylist } from "../../../Utils";
import { UserDetailsContext } from "../../App";
import { TokenContext } from "../../App";
import {
  updateToast,
  getOverlayContentTop,
  getOverlayTop,
} from "../../../Utils";
import "./OverlayCopyToSpotify.css";

interface OverlayCopyToSpotifyTypes {
  setOverlayOnHandlerCopyToSpotify: (data:{ playlistName: string, trackUris: string [] }|null)=>void,
  overlayData: { playlistName: string, trackUris: string [] }
}

export default function OverlayCopyToSpotify({
  setOverlayOnHandlerCopyToSpotify,
  overlayData
}:OverlayCopyToSpotifyTypes) {
  const { userDetailsContext } = useContext(UserDetailsContext);
  const { spotifyUserId } = userDetailsContext;
  const tokenContext = useContext(TokenContext);
  return (
    <>
      <div
        className="overlay"
        onClick={(event)=>setOverlayOnHandlerCopyToSpotify(null)}
        style={{ top: getOverlayTop() }}
      ></div>
      <div className="overlayContent" style={{ top: getOverlayContentTop() }}>
        <div>
          <div className="settingsCloseButtonContainer">
            <div
              className="settingsCloseButton"
              onClick={(event)=>setOverlayOnHandlerCopyToSpotify(null)}
            >
              x
            </div>
          </div>
          <div className="settings">Copy to Spotify</div>
        </div>
        <hr></hr>
        <div className="copyContent">
          <div className="copyAsHeader">{<p>Copy playlist as:</p>}</div>
          <div className="copyAsValue">
            <input
              id="playlistNameToCopy"
              type="text"
              defaultValue={overlayData.playlistName}
              style={{ display: "block" }}
            ></input>
          </div>
          <button
            className="postPlaylistButton copyButton"
            onClick={copyToSpotify}
          >
            Copy
          </button>
        </div>
      </div>
    </>
  );

  async function copyToSpotify() {
    const playlist = document.getElementById("playlistNameToCopy") as HTMLInputElement;
    if(!playlist || !playlist.value || !tokenContext || !tokenContext.token) {
      console.error(`Error in copying playlist to Spotify. Playlist name: ${playlist.value}, token: ${tokenContext.token}`)
      return
    }

    const newPlaylist = await createPlaylist(
      spotifyUserId,
      playlist.value,
      "Created via Soundlists.com",
      tokenContext.token
    );

    if (!newPlaylist.id) {
      const newToast = updateToast();
      newToast(`Error creating playlist: ${overlayData.playlistName}`);
      return;
    }

    console.log('over ', overlayData)

    const addSongs = await addSongsToPlaylist(
      newPlaylist.id,
      overlayData.trackUris,
      tokenContext.token
    );

    setOverlayOnHandlerCopyToSpotify(null);

    if (addSongs.snapshot_id) {
      const newToast = updateToast();
      newToast(`${overlayData.playlistName} copied to Spotify`);
    } else {
      const newToast = updateToast();
      newToast(`Error creating playlist: ${overlayData.playlistName}`);
    }
  }
}
