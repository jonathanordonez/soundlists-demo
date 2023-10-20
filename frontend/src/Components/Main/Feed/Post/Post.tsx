import React, {useContext, useState } from "react";
import PostFooter from "./PostFooter/PostFooter";
import PlaylistItems from "./PlaylistItems/PlaylistItems";
import PostProfile from "./PostProfile/PostProfile";
import { UserDetailsContext } from "../../../App";
import { PostValuesType } from "../Feed";

interface PostType{
  post: PostValuesType,
  profilePicture: string,
  delPostInFeed: (postToDelete:string)=>void,
  setOverlayOnHandlerCopyToSpotify: (data:{ playlistName: string, trackUris: string [] }|null)=>void,
  handleSetPreviewUrl: (src:string)=>void,
}

export default function Post({
  post,
  profilePicture,
  delPostInFeed,
  setOverlayOnHandlerCopyToSpotify,
  handleSetPreviewUrl,
}:PostType) {
  const { userDetailsContext } = useContext(UserDetailsContext);
  const { username } = userDetailsContext;
  const [isPlaylistItemsLoaded, setIsPlaylistItemsLoaded] = useState(false)

  return (
    <>
      <li
        className="post"
        key={post.id}
        id={post.id}
        data-collectionid={post.collectionId}
      >
        <div className="postHeaderFree">
          <PostProfile post={post} profilePicture={profilePicture} />
          {/* <div className="postTitle">{<h3>{getPlaylistName(post)}</h3>}</div> */}
          <div className="postTitle">{<h3>{post.playlist_name}</h3>}</div>
        </div>

        <PlaylistItems
          propsSongs={post.uris}
          postId={post.id}
          handleSetPreviewUrl={handleSetPreviewUrl}
          isPlaylistItemsLoaded={isPlaylistItemsLoaded}
          setIsPlaylistItemsLoaded={setIsPlaylistItemsLoaded}
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
