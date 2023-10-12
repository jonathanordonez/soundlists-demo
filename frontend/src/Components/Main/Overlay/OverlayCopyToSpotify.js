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

export default function OverlayCopyToSpotify({
  setOverlayOnHandlerCopyToSpotify,
  overlayData,
}) {
  const { userDetailsContext } = useContext(UserDetailsContext);
  const { spotifyUserId } = userDetailsContext;
  const { tokenContext } = useContext(TokenContext);
  return (
    <>
      <div
        className="overlay"
        onClick={setOverlayOnHandlerCopyToSpotify}
        style={{ top: getOverlayTop() }}
      ></div>
      <div className="overlayContent" style={{ top: getOverlayContentTop() }}>
        <div>
          <div className="settingsCloseButtonContainer">
            <div
              className="settingsCloseButton"
              onClick={setOverlayOnHandlerCopyToSpotify}
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
    const playlist = await createPlaylist(
      spotifyUserId,
      document.getElementById("playlistNameToCopy").value,
      "Created via Soundlists.com",
      tokenContext.token
    );

    if (!playlist.id) {
      const newToast = updateToast();
      newToast(`Error creating playlist: ${overlayData.playlistName}`);
      return;
    }

    const addSongs = await addSongsToPlaylist(
      playlist.id,
      overlayData.trackUris,
      tokenContext.token
    );

    setOverlayOnHandlerCopyToSpotify();

    if (addSongs.snapshot_id) {
      const newToast = updateToast();
      newToast(`${overlayData.playlistName} copied to Spotify`);
    } else {
      const newToast = updateToast();
      newToast(`Error creating playlist: ${overlayData.playlistName}`);
    }
  }
}
