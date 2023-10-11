import React from "react";
import { useState, useEffect, useContext } from "react";
import { TokenContext } from "../../App";
import { UserDetailsContext } from "../../App";

export default function Playlists(props) {
  const [userPlaylists, setUserPlaylists] = useState([]);
  const { tokenContext } = useContext(TokenContext);
  const { userDetailsContext } = useContext(UserDetailsContext);
  useEffect(() => {
    if (!userDetailsContext.spotifyUserId || !tokenContext) {
      // console.log("Not fetching playlists ");
      return;
    }
    callFetchUserPlaylists();
  }, [tokenContext, userDetailsContext]);

  return (
    <select className="playlistSelector" onChange={props.getSelectedPlaylistId}>
      <option className="playlistSelectorTemp">Select a playlist</option>
      {userPlaylists.map((playlist) => (
        <option key={playlist.id} id={playlist.id}>
          {playlist.name}
        </option>
      ))}
    </select>
  );

  async function callFetchUserPlaylists() {
    function fetchUserPlaylists() {
      let offset = 0;
      let playlists = [];
      let fetchRepeat = 1;
      let ranNo = 1;
      return async function () {
        // To limit excesive number of fetch calls to 4 which equals 200 playlists
        if (ranNo > 4) {
          return playlists;
        }
        while (fetchRepeat !== 0) {
          const request = await fetch(
            `https://api.spotify.com/v1/users/${userDetailsContext.spotifyUserId}/playlists?limit=50&offset=${offset}`,
            { headers: { Authorization: `Bearer ${tokenContext.token}` } }
          );
          const json = await request.json();
          let playlistsWithMax100Items = [];
          for (let playlist of json.items) {
            if (playlist.tracks.total < 100) {
              playlistsWithMax100Items.push(playlist);
            }
          }
          playlists = [...playlists, ...playlistsWithMax100Items];
          if (ranNo === 1) {
            fetchRepeat = Math.ceil(json.total / 50);
          }
          offset += 50;
          fetchRepeat--;
          ranNo++;
        }
        return playlists;
      };
    }
    const getPlaylists = fetchUserPlaylists();
    const playlists = await getPlaylists();
    setUserPlaylists(playlists);
    localStorage.setItem("playlists", JSON.stringify(playlists));
    return playlists;
  }
}
