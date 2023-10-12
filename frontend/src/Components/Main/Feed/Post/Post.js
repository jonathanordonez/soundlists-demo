import React from "react";
import { useState, useContext } from "react";
import PostFooter from "./PostFooter/PostFooter";
import PlaylistItems from "./PlaylistItems/PlaylistItems";
import PostProfile from "./PostProfile/PostProfile";
import { UserDetailsContext } from "../../../App";

export default function Post({
  post,
  profilePicture,
  delPostInFeed,
  setOverlayOnHandlerCopyToSpotify,
  userSpotifySubscription,
  handleSrc,
}) {
  const [uriPlaying, setUriPlaying] = useState(null);
  const [handlePlayPauseFromPlaylist, setHandlePlayPauseFromPlaylist] =
    useState(0);
  const { userDetailsContext } = useContext(UserDetailsContext);
  const { username } = userDetailsContext;

  console.log("this post", post);
  return (
    <>
      <li
        className="post"
        key={post.id}
        id={post.id}
        collectionid={post.collectionId}
      >
        <div className="postHeaderFree">
          <PostProfile post={post} profilePicture={profilePicture} />
          {/* <div className="postTitle">{<h3>{getPlaylistName(post)}</h3>}</div> */}
          <div className="postTitle">{<h3>{post.playlist_name}</h3>}</div>
        </div>

        <PlaylistItems
          propsSongs={post.uris}
          postId={post.id}
          uriPlaying={uriPlaying}
          handlePlayPauseFromList={handlePlayPauseFromList}
          handleSrc={handleSrc}
        />
        <PostFooter
          username={username}
          postUsername={post.username}
          delPostInFeed={delPostInFeed}
          setOverlayOnHandlerCopyToSpotify={setOverlayOnHandlerCopyToSpotify}
        />
        <div></div>
      </li>
    </>
  );

  function handlePlayPauseFromList() {
    // Used for listening the play/pause signal from the Tracks.js component
    // The setHandlePlayPauseFromPlaylist simply adds a counter to re-render the MusicPlayer component and play/pause the song
    setHandlePlayPauseFromPlaylist((previous) => previous + 1);
  }

  function getFreePostTitleWidth() {
    const postId = document.getElementById(post.id);

    const postProfile = postId.querySelector(".postProfile");

    const width = `width: calc(100% - ${postProfile.clientWidth * 2}px)`;

    const postProfileTitle = postId.querySelector(".postTitle");
    postProfileTitle.setAttribute("style", `${width}`);
  }

  function getPlaylistName(post) {
    console.log("this post id ", post.id);
    const feedElement = document.getElementsByClassName("feed")[0];
    console.log("this postElement ", feedElement);
    const feedWidth = feedElement.clientWidth;
    console.log("this feed width", feedWidth);
    if (feedWidth < 400 && post.playlist_name.length > 15) {
      return `${post.playlist_name.slice(0, 15)}...`;
    } else {
      return post.playlist_name.length <= 25
        ? post.playlist_name
        : `${post.playlist_name.slice(0, 25)}...`;
    }
  }
}
