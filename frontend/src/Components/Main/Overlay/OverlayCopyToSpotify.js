import React, { useEffect, useContext } from "react";
import { useState } from "react";
import { addSongsToPlaylist, createPlaylist } from "../../../Utils";
import { UserDetailsContext } from "../../App";
import { TokenContext } from "../../App";
import {
  updateToast,
  getOverlayContentTop,
  getOverlayTop,
} from "../../../Utils";

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
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {<p>Copy playlist as:</p>}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <input
              id="playlistNameToCopy"
              type="text"
              defaultValue={overlayData.playlistName}
              style={{ display: "block" }}
            ></input>
          </div>
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", margin: "20px" }}
        >
          <button className="postPlaylistButton" onClick={copyToSpotify}>
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
      tokenContext
    );

    const addSongs = await addSongsToPlaylist(
      playlist.id,
      overlayData.trackUris,
      tokenContext
    );

    setOverlayOnHandlerCopyToSpotify();

    if (addSongs.snapshot_id) {
      const newToast = updateToast();
      newToast(`${overlayData.playlistName} copied to Spotify`);
    }

    console.log("this ", addSongs);
  }
}
