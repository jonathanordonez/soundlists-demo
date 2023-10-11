import React from "react";
import defaultProfilePicture from "./img/default-profile-pic.jpg";

export async function checkSpotifyTokenValidity(accessToken) {
  const url = "https://api.spotify.com/v1/me";

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      return true;
    } else {
      // Token is invalid or expired
      return false;
    }
  } catch (error) {
    // Error occurred during the request (network error, etc.)
    console.error("Error checking token validity:", error);
    return false;
  }
}

export function readTokenLocalStorage() {
  const token = localStorage.getItem("token");
  const expiresInTimestamp = localStorage.getItem("expiresInTimestamp");
  let tokenValid = false;
  if (expiresInTimestamp && expiresInTimestamp > Date.now()) {
    tokenValid = true;
  }
  return [token, expiresInTimestamp, tokenValid];
}

export function writeLocalStorage(objArgs) {
  for (let key in objArgs) {
    localStorage.setItem(key, objArgs[key]);
  }
}

export function secondsToExpireToken(timestamp) {
  return (timestamp - Date.now()) / 1000;
}

export async function refreshSpotifyToken() {
  try {
    const request = await fetch(
      `${process.env.REACT_APP_PYTHONHOST}/api/refresh_token`,
      {
        credentials: "include",
      }
    );
    const json = await request.json();
    if (json.status === "successful") {
      writeLocalStorage({
        token: json.token,
        expiresInTimestamp: json.expiresInTimestamp,
      });
    }
    return {
      status: json.status,
      token: json.token,
      expiresInTimestamp: json.expiresInTimestamp,
    };
  } catch (err) {
    console.log(
      "The following error occurred during the refreshing of the token: ",
      err
    );
  }
}

export async function isAuthenticatedInBackend() {
  const request = await fetch(
    `${process.env.REACT_APP_PYTHONHOST}/api/is_authenticated`,
    {
      credentials: "include",
    }
  );
  const token = await request.json();
  return token;
}

export async function getTokenFromBackend() {
  try {
    const request = await fetch(
      `${process.env.REACT_APP_PYTHONHOST}/api/is_authenticated`,
      {
        credentials: "include",
      }
    );
    const json = await request.json();
    return {
      authenticated: json.authenticated,
      token: json.token,
      expiresInTimestamp: json.expiresInTimestamp,
      username: json.username,
      profilePicture: json.profilePicture,
      spotifyUserId: json.spotifyUserId,
    };
  } catch (error) {
    console.error("Error obtaining token from backend ", error);
  }
}

export async function fetchPlaylistSongs(playlistId) {
  if (!isTokenValid()) {
    await refreshSpotifyToken();
  }
  const token = localStorage.getItem("token");
  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?market=US&fields=items(track(name,artists,uri,album,preview_url))`;
  const request = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await request.json();
  return json;
}

export function isTokenValid() {
  const expiresInTimestamp = localStorage.getItem("expiresInTimestamp");
  if (expiresInTimestamp > Date.now()) {
    return true;
  } else {
    return false;
  }
}

export async function getUserDetails() {
  const request = await fetch(
    `${process.env.REACT_APP_PYTHONHOST}/api/user_details`,
    {
      credentials: "include",
    }
  );
  const json = await request.json();
  return json;
}

export async function saveUsername(username) {
  const data = {
    username: username,
  };
  let request = await fetch(
    `${process.env.REACT_APP_PYTHONHOST}/api/set_username`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data),
    }
  );
  let json = await request.json();
  return json;
}

export async function createPlaylist(
  spotifyUserID,
  playlistName,
  description,
  token
) {
  const request = await fetch(
    `https://api.spotify.com/v1/users/${spotifyUserID}/playlists`,
    {
      method: "POST",
      body: JSON.stringify({
        name: playlistName,
        description: description,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const json = await request.json();
  return json;
}

export async function addSongsToPlaylist(playlistId, songs, token) {
  const request = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "POST",
      body: JSON.stringify({
        uris: songs,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const json = request.json();
  return json;
}

export function getTrackUrisFromPost(postId) {
  const post = document.getElementById(postId);
  const tracks = post.querySelectorAll(".track");
  const trackUris = [];
  tracks.forEach((track) => {
    const trackUri = track.getAttribute("uri");
    if (trackUri) {
      trackUris.push(`spotify:track:${trackUri}`);
    }
  });
  return trackUris;
}

export function updateToast() {
  const toastElement = document.getElementsByClassName("toast")[0];
  const toastBodyElement = document.getElementsByClassName("toast-body")[0];

  return function (textContent) {
    toastElement.classList.add("show");
    toastBodyElement.textContent = textContent;
    setTimeout(() => {
      if (Array.from(toastElement.classList).includes("show")) {
        toastElement.classList.remove("show");
      }
    }, 3000);
  };
}

export function displayProfilePicture(picture) {
  if (picture) {
    return `https://soundlists-profpics.s3.amazonaws.com/${picture}`;
  } else {
    return defaultProfilePicture;
  }
}

export function searchResetFilterButton(username, genre) {
  const searchFilter = document.getElementById("searchFilter");
  const filterUsername = document.getElementById("filterUsername");
  const filterGenre = document.getElementById("filterGenre");

  if (searchFilter.textContent == "Search") {
    if (username || genre) {
      searchFilter.textContent = "Reset";
      searchFilter.classList.add("buttonPurple");

      filterUsername.setAttribute("disabled", true);
      filterGenre.setAttribute("disabled", true);
      return "Reset";
    } else {
      const newToast = updateToast();
      newToast("Please enter a value to search");
      return;
    }
  } else if (searchFilter.textContent == "Reset") {
    searchFilter.textContent = "Search";
    searchFilter.classList.remove("buttonPurple");
    filterUsername.removeAttribute("disabled");
    filterGenre.removeAttribute("disabled");
    return "Search";
  }
}

export async function getPlaylistItems(accessToken, playlistId) {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch playlist items");
  }

  const data = await response.json();
  const orderedUris = data.items.map((obj) => obj.track.id);
  const unorderedUris = [];
  const trackUrisNoAvailableMarkets = [];
  const urisNoAvailableMarkets = [];

  const promise = data.items.map(async (item) => {
    console.log("this data", data.items);
    const hasAvailableMarket = await hasAvailableMarkets(
      item.track.uri.split(":")[2],
      accessToken
    );
    if (hasAvailableMarket) {
      unorderedUris.push(item.track.uri.split(":")[2]);
    } else {
      trackUrisNoAvailableMarkets.push(item.track.uri);
      urisNoAvailableMarkets.push(item.track.uri.split(":")[2]);
    }
  });

  const results = await Promise.all(promise);
  console.log("original", orderedUris);

  const uris = getUrisInOrder(orderedUris, unorderedUris);
  console.log("after", uris);

  const trackUris = uris.map((uri) => `spotify:track:${uri}`);

  return [trackUris, uris, trackUrisNoAvailableMarkets, urisNoAvailableMarkets];
}

function getUrisInOrder(orderedUris, unorderedUris) {
  const matchingIds = [];

  for (const id of orderedUris) {
    if (unorderedUris.includes(id)) {
      matchingIds.push(id);
    }
  }

  return matchingIds;
}

async function hasAvailableMarkets(trackURI, accessToken) {
  const apiUrl = `https://api.spotify.com/v1/tracks/${trackURI}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const trackData = await response.json();
      if (
        trackData.available_markets &&
        trackData.available_markets.length > 0
      ) {
        return true; // Track has available markets
      } else {
        return false; // Track does not have available markets
      }
    } else {
      console.error("Error fetching track data:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

export async function getValidUris(uris, token) {
  // Receives uris in a list, i.e., ['5LciLoxa1gK70yIUeoHgRx', '7IJkIQZCy0a6gowQBhGuCJ', '7hh3JjKHOARvAS9LibvchS']

  // Checks if each uri has markets available
  const request = await fetch(
    `https://api.spotify.com/v1/tracks?ids=${uris.join(",")}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const json = await request.json();
  const emptyMarketsTracksList = findTracksWithEmptyMarkets(json);
  const urisReplaced = await replaceEmptyMarketTracksList(
    emptyMarketsTracksList
  );

  function findTracksWithEmptyMarkets(data) {
    const tracksWithEmptyMarkets = data.tracks
      .filter((track) => track.available_markets.length === 0)
      .map((track) => ({
        uri: track.id,
        name: track.name,
        artist: track.artists[0].name,
      }));

    return tracksWithEmptyMarkets;
  }

  async function replaceEmptyMarketTracksList(data) {
    // Data is, for example, [{uri: '2vXk7PcNLLXsdnVaoMxzTj', name: 'Tutti Frutti', artist: 'Little Richard'}, {uri: '0mTtWQ6A4zKzlDfUvXDmwe', name: 'No Particular Place To Go', artist: 'Chuck Berry'}]
    const result = {};
    for (const item of data) {
      const query = `${item.name} ${item.artist}`;
      const request = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=track&market=from_token&limit=1`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await request.json();

      const matchingTrack = json.tracks.items.find((track) => {
        const isMatchingArtist = track.artists[0].name === item.artist;
        const isMatchingName = track.name === item.name;
        return isMatchingArtist && isMatchingName;
      });

      result[item.uri] = matchingTrack ? matchingTrack.id : null;
    }
  }

  // Returns a list of uris that have markets available
}

export function getOverlayContentTop() {
  return `${visualViewport.pageTop + window.innerHeight / 2}px`;
}

export function getOverlayTop() {
  return `${visualViewport.pageTop}px`;
}

export function isBackspace(inputString) {
  const backspaceChar = String.fromCharCode(8); // Convert ASCII 8 to a string
  const pattern = new RegExp(`[${backspaceChar}]`);
  return pattern.test(inputString);
}

export function hasSpecialCharactersOrSpaces(inputString) {
  const pattern = /[!@#$%^&*()`'"/+{}\[\]:;<>,?~\\|\s]/;

  // Use the test method to check if the string matches the pattern
  return pattern.test(inputString);
}

export async function getSpotifySubscription(token) {
  const request = await fetch("https://api.spotify.com/v1/me/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await request.json();
  console.log("this ", json.product);
  return json.product;
}
