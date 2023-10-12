import React from "react";

export default function PostProfile({ post, profilePicture }) {
  return (
    <div className="postProfile">
      <div className="profilePicContainer">
        <div>
          <img
            className="profilePicPost"
            src={postProfilePicture(post)}
            alt="profile"
          ></img>
        </div>
      </div>

      <div className="profileDetails">
        <div className="postUsername">{post.username}</div>
      </div>
    </div>
  );
  function postProfilePicture(post) {
    if (
      document.getElementById("username") &&
      document.getElementById("username").textContent == post.username
    ) {
      return `https://soundlists-profpics.s3.amazonaws.com/${profilePicture}`;
    } else {
      return `https://soundlists-profpics.s3.amazonaws.com/${post.profile_picture}`;
    }
  }
}
