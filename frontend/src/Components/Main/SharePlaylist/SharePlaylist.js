import React from "react";
import { useState } from "react";
import Playlists from "./Playlists";
import { updateToast, getPlaylistItems } from "../../../Utils";

export default function SharePlaylist({ handleRefreshFeed }) {
  const [playlistSelectedId, setPlaylistSelectedId] = useState("");

  return (
    <div className="feed">
      <div className="postAdd">
        <div className="sharePlaylist">
          <Playlists getSelectedPlaylistId={getSelectedPlaylistId} />
          <button className="postPlaylistButton" onClick={sharePlaylist}>
            Share
          </button>
        </div>
      </div>
    </div>
  );

  async function sharePlaylist(e) {
    const playlistSelected = document.querySelector(".playlistSelector");
    const playlistName = playlistSelected.value;

    if (
      !playlistSelected.value ||
      playlistSelected.options.selectedIndex == 0
    ) {
      const newToast = updateToast();
      newToast("Select a playlist...");
      return;
    }

    const [
      trackUris,
      uris,
      trackUrisNoAvailableMarkets,
      urisNoAvailableMarkets,
    ] = await getPlaylistItems(
      localStorage.getItem("token"),
      playlistSelectedId
    );

    if (uris.length > 20) {
      const newToast = updateToast();
      newToast("Playlist can't have more than 20 tracks");
      return;
    }

    if (uris.length < 5) {
      const newToast = updateToast();
      newToast("Playlist can't have less than 5 tracks");
      return;
    }

    const data = {
      playlistId: playlistSelectedId,
      playlistName: playlistName,
      trackUris: trackUris.join(","),
      uris: uris.join(","),
      trackUrisNoAvailableMarkets: trackUrisNoAvailableMarkets.join(","),
      urisNoAvailableMarkets: urisNoAvailableMarkets.join(","),
    };

    let request = await fetch(
      `${process.env.REACT_APP_PYTHONHOST}/api/share_playlist`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
      }
    );
    let json = await request.json();

    if (json.Status == "Successful") {
      let newToast = updateToast();
      newToast("Playlist added!");
    } else {
      console.error("Playlist not added");
    }

    // Restoring default option
    document.querySelector(".playlistSelector").options.selectedIndex = 0;

    handleRefreshFeed();
  }

  function getSelectedPlaylistId(e) {
    setPlaylistSelectedId(e.target.selectedOptions[0].id);
  }
}
