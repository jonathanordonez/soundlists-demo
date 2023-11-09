import React from "react";
import { useState, useEffect, useContext } from "react";
import { TokenContext } from "../Main";
import { UserDetailsContext } from "../Main";
import { isExpiresInValid } from "../../../Utils";

interface userPlaylistType {
  id: string
  name: string
}

interface userPlaylistsType extends Array<userPlaylistType> {}

interface PlaylistsType {
  getSelectedPlaylistId: (e:React.ChangeEvent<HTMLSelectElement>)=>void
  isPlaylistsFetched: boolean
  setIsPlaylistsFetched: React.Dispatch<React.SetStateAction<boolean>>
  
}


export default function Playlists({getSelectedPlaylistId, isPlaylistsFetched, setIsPlaylistsFetched}:PlaylistsType) {
  const [userPlaylists, setUserPlaylists] = useState([] as userPlaylistsType);
  const tokenContext = useContext(TokenContext);
  const { userDetailsContext } = useContext(UserDetailsContext);
  useEffect(() => {
    if (!userDetailsContext.spotifyUserId || !tokenContext.expiresIn || !isExpiresInValid(parseFloat(tokenContext.expiresIn)) || isPlaylistsFetched) {
      return;
    }
    callFetchUserPlaylists();
    async function callFetchUserPlaylists() {
      function fetchUserPlaylists() {
        let offset = 0;
        let playlists = [] as userPlaylistsType;
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

                if (request.ok) {
                  try{
                    const json = await request.json();
                    setIsPlaylistsFetched(true);
                    let playlistsWithMax20Items = [];
                    for (let playlist of json.items) {
                      if (playlist.tracks.total <= 20 && playlist.tracks.total >= 5) {
                        playlistsWithMax20Items.push(playlist);
                      }
                    }
                    playlists = [...playlists, ...playlistsWithMax20Items];
                    if (ranNo === 1) {
                      fetchRepeat = Math.ceil(json.total / 50);
                    }
                    offset += 50;
                    fetchRepeat--;
                    ranNo++;
                  }
                  catch (error) {
                    console.error('Failed to process the response:', error);
                  }
                }
                else{
                  console.error('Failed to fetch data:', request.status, request.statusText);
                }
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
  }, [tokenContext, userDetailsContext, isPlaylistsFetched, setIsPlaylistsFetched]);

  return (
    <select className="playlistSelector" onChange={getSelectedPlaylistId}>
      <option className="playlistSelectorTemp">Select a playlist</option>
      {userPlaylists.map((playlist) => (
        <option key={playlist.id} id={playlist.id}>
          {playlist.name}
        </option>
      ))}
    </select>
  );


}
