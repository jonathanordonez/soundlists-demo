
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

export async function saveUsername(username:string) {
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
  spotifyUserID:string,
  playlistName:string,
  description:string,
  token:string
) 
{
  if(!spotifyUserID || !playlistName || !token) {
    console.error(`CreatePlaylist failed. Parameters incomplete. spotifyUserID: ${spotifyUserID}, playlistName: ${playlistName}, token: ${token}`)
    return
  }
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

export async function addSongsToPlaylist(playlistId:string, uris:string [], token:string) {
  if(!playlistId || !uris || !token) {
    console.error(`addSongsToPlaylist failed. Parameters incomplete. playlistId: ${playlistId}, songs: ${uris}, token: ${token}`)
    return
  }
  const request = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "POST",
      body: JSON.stringify({
        uris: uris,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const json = request.json();
  return json;
}

export function getTrackUrisFromPost(postId:string) {
  const post = document.getElementById(postId);
  if(!post){
    console.error('No post element found with postId: ',postId)
    return
  }
  const tracks = post.querySelectorAll(".track");
  const trackUris = [] as string[];
  tracks.forEach((track) => {
    const trackUri = track.getAttribute("data-uri");
    if (trackUri) {
      trackUris.push(`spotify:track:${trackUri}`);
    }
  });
  return trackUris;
}

export function updateToast() {
  const toastElement = document.getElementsByClassName("toast")[0];
  const toastBodyElement = document.getElementsByClassName("toast-body")[0];

  return function (textContent:string) {
    toastElement.classList.add("show");
    toastBodyElement.textContent = textContent;
    setTimeout(() => {
      if (Array.from(toastElement.classList).includes("show")) {
        toastElement.classList.remove("show");
      }
    }, 3000);
  };
}

export async function getPlaylistItems(accessToken:string|null, playlistId:string) {
  if(!accessToken) {
    console.error('No access token passed')
    return
  }
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
  const orderedUris = data.items.map((obj:{track:{id:string}}) => obj.track.id);
  const unorderedUris = [''];
  const trackUrisNoAvailableMarkets = [''];
  const urisNoAvailableMarkets = [''];

  const promise = data.items.map(async (item:{track:{uri:string}}) => {
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

  await Promise.all(promise);
  console.log("original", orderedUris);

  const uris = getUrisInOrder(orderedUris, unorderedUris);
  console.log("after", uris);

  const trackUris = uris.map((uri) => `spotify:track:${uri}`);

  return [trackUris, uris, trackUrisNoAvailableMarkets, urisNoAvailableMarkets];
}

function getUrisInOrder(orderedUris:string[], unorderedUris:string[]) {
  const matchingIds = [];

  for (const id of orderedUris) {
    if (unorderedUris.includes(id)) {
      matchingIds.push(id);
    }
  }

  return matchingIds;
}

async function hasAvailableMarkets(trackURI:string, accessToken:string) {
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

// export async function getValidUris(uris:[''], token:string) {
//   // Receives uris in a list, i.e., ['5LciLoxa1gK70yIUeoHgRx', '7IJkIQZCy0a6gowQBhGuCJ', '7hh3JjKHOARvAS9LibvchS']

//   // Checks if each uri has markets available
//   const request = await fetch(
//     `https://api.spotify.com/v1/tracks?ids=${uris.join(",")}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
//   const json = await request.json();
//   const emptyMarketsTracksList = findTracksWithEmptyMarkets(json);
  // const urisReplaced = await replaceEmptyMarketTracksList(
  //   emptyMarketsTracksList
  // );

  // function findTracksWithEmptyMarkets(data) {
  //   const tracksWithEmptyMarkets = data.tracks
  //     .filter((track) => track.available_markets.length === 0)
  //     .map((track) => ({
  //       uri: track.id,
  //       name: track.name,
  //       artist: track.artists[0].name,
  //     }));

  //   return tracksWithEmptyMarkets;
  // }

  // async function replaceEmptyMarketTracksList(data) {
  //   // Data is, for example, [{uri: '2vXk7PcNLLXsdnVaoMxzTj', name: 'Tutti Frutti', artist: 'Little Richard'}, {uri: '0mTtWQ6A4zKzlDfUvXDmwe', name: 'No Particular Place To Go', artist: 'Chuck Berry'}]
  //   const result = {};
  //   for (const item of data) {
  //     const query = `${item.name} ${item.artist}`;
  //     const request = await fetch(
  //       `https://api.spotify.com/v1/search?q=${encodeURIComponent(
  //         query
  //       )}&type=track&market=from_token&limit=1`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     const json = await request.json();

  //     const matchingTrack = json.tracks.items.find((track) => {
  //       const isMatchingArtist = track.artists[0].name === item.artist;
  //       const isMatchingName = track.name === item.name;
  //       return isMatchingArtist && isMatchingName;
  //     });

  //     result[item.uri] = matchingTrack ? matchingTrack.id : null;
  //   }
  // }

  // Returns a list of uris that have markets available
// }


export function getOverlayContentTop() {
  return visualViewport !== null? `${visualViewport.pageTop + window.innerHeight / 2}px`:`${0 + window.innerHeight / 2}px`;
}

export function isExpiresInValid(expiresIn: number) {
  if (expiresIn > Date.now()) {
    return true;
  } else {
    return false;
  }
}

export function getOverlayTop() {
  return visualViewport !== null? `${visualViewport.pageTop}px`:'0px' ;
}


export function isBackspace(inputString:string) {
  const backspaceChar = String.fromCharCode(8); // Convert ASCII 8 to a string
  const pattern = new RegExp(`[${backspaceChar}]`);
  return pattern.test(inputString);
}

export function hasSpecialCharactersOrSpaces(inputString:string) {
  const pattern = /[!@#$%^&*()`'"/+{}[\]:;<>,?~\\|\s]/;

  // Use the test method to check if the string matches the pattern
  return pattern.test(inputString);
}

export async function getSpotifySubscription(token:string) {
  const request = await fetch("https://api.spotify.com/v1/me/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await request.json();
  console.log("this ", json.product);
  return json.product;
}
