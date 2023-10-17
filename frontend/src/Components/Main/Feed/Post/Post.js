import React, {useContext } from "react";
import PostFooter from "./PostFooter/PostFooter";
import PlaylistItems from "./PlaylistItems/PlaylistItems";
import PostProfile from "./PostProfile/PostProfile";
import { UserDetailsContext } from "../../../App";

export default function Post({
  post,
  profilePicture,
  delPostInFeed,
  setOverlayOnHandlerCopyToSpotify,
  handleSrc,
}) {
  const { userDetailsContext } = useContext(UserDetailsContext);
  const { username } = userDetailsContext;

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

}
