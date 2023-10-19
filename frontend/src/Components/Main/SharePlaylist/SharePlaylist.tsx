import React from "react";
import { useState, useContext } from "react";
import Playlists from "./Playlists";
import { updateToast, getPlaylistItems } from "../../../Utils";
import { TokenContext } from "../../App";

export default function SharePlaylist({ handleRefreshFeed }:{handleRefreshFeed:()=>void}) {
  const [playlistSelectedId, setPlaylistSelectedId] = useState("");
  const tokenContext = useContext(TokenContext)

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

  async function sharePlaylist() {
    const playlistSelected = document.querySelector(".playlistSelector") as HTMLSelectElement;
    if(!playlistSelected){
      console.error('Playlist selected is null')
      return
    }
    const playlistName = playlistSelected.value;

    if (
      !playlistSelected.value ||
      playlistSelected.options.selectedIndex === 0
    ) {
      const newToast = updateToast();
      newToast("Select a playlist...");
      return;
    }

    const result = await getPlaylistItems(
      tokenContext.token,
      playlistSelectedId
    );
    
    const [
      trackUris,
      uris,
      trackUrisNoAvailableMarkets,
      urisNoAvailableMarkets
    ] = result || [[], [], [], []];


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

    if (json.Status === "Successful") {
      let newToast = updateToast();
      newToast("Playlist added!");
    } else {
      console.error("Playlist not added");
    }

    // Restoring default option
    const playlistSelector = document.querySelector(".playlistSelector") as HTMLSelectElement
    if(!playlistSelector) {
      return
    }
    const options = playlistSelector.options;
    if (options) {
      options.selectedIndex = 0;
    }
    handleRefreshFeed();
  }

  function getSelectedPlaylistId(e:React.ChangeEvent<HTMLSelectElement>) {
    setPlaylistSelectedId((e.target as HTMLSelectElement).selectedOptions[0].id);
  }
}
