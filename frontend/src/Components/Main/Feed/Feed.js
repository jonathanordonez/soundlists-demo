import React, { useRef } from "react";
import { useState, useEffect } from "react";
import Post from "./Post/Post";
import { updateToast } from "../../../Utils";

export default function Feed({
  refreshFeedCounterFromMain,
  profilePicture,
  setOverlayOnHandlerCopyToSpotify,
  handleSrc,
}) {
  const [posts, setPosts] = useState([]);
  const [atBottomFlag, setAtBottomFlag] = useState(0);
  let postBatchNo = useRef(1);
  const refreshFeedCounterFromMainLocal = useRef(1);
  let fetchPostsOnceAtBottomHandler = fetchPostsOnceAtBottom();

  // Fetches posts from db
  useEffect(() => {
    if (refreshFeedCounterFromMain > refreshFeedCounterFromMainLocal.current) {
      // Takes place when Main.js triggers a post refresh
      postBatchNo.current = 1;
      refreshFeedCounterFromMainLocal.current = refreshFeedCounterFromMain;
    }

    let requestFilters = {
      searchUsername: "",
      searchTag: "",
      postsBatchNo: postBatchNo.current,
    };

    fetchPosts(requestFilters);
  }, [atBottomFlag, refreshFeedCounterFromMain]);

  // To set the bottom of the page every time posts are added
  useEffect(() => {
    document.removeEventListener("scroll", detectBottomOnScroll);

    // After the posts have been fetched, they takes less than a second to be rendered
    // Waiting 1 second ensure the window height is calculated properly after the posts are displayed
    if (posts.length > 0) {
      setTimeout(() => {
        // document.removeEventListener("scroll", detectBottomOnScroll);
        document.addEventListener("scroll", detectBottomOnScroll);
      }, 1000);
    }

    return () => {
      document.removeEventListener("scroll", detectBottomOnScroll);
    };
  }, [posts]);

  return (
    <>
      <div className="feed">
        <ul className="posts">
          {posts.length > 0 &&
            posts.map((post) => (
              <Post
                key={post.id}
                profilePicture={profilePicture}
                post={post}
                delPostInFeed={delPostInFeed}
                setOverlayOnHandlerCopyToSpotify={
                  setOverlayOnHandlerCopyToSpotify
                }
                handleSrc={handleSrc}
              />
            ))}
        </ul>
      </div>
    </>
  );

  function detectBottomOnScroll() {
    // When the user is [modifier]px from the bottom, fire the event.
    let modifier = 50;
    let currentScroll = window.scrollY + window.innerHeight;
    let documentHeight = document.body.scrollHeight;
    if (currentScroll + modifier > documentHeight) {
      fetchPostsOnceAtBottomHandler();
    }
  }

  function fetchPostsOnceAtBottom() {
    let counter = 1;
    return function () {
      if (counter == 1) {
        counter++;
        postBatchNo.current += 1;
        setAtBottomFlag((value) => value + 1);
      }
    };
  }

  async function fetchPosts(searchFilters) {
    let request = await fetch(
      `${process.env.REACT_APP_PYTHONHOST}/api/get_posts`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(searchFilters),
      }
    );
    let json = await request.json();
    if (json.posts.length > 0) {
      if (postBatchNo.current == 1) {
        setPosts(json.posts);
      } else {
        setPosts((posts) => [...posts, ...json.posts]);
      }
    }
  }

  async function delPostInFeed(postToDelete) {
    let request = await fetch(
      `${process.env.REACT_APP_PYTHONHOST}/api/delete_post`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ postId: postToDelete }),
      }
    );
    let json = await request.json();
    if (json.status == "successful") {
      // Delete post in UI
      const updatedPosts = posts.filter((post) => post.id !== postToDelete);
      setPosts(updatedPosts);
      const newToast = updateToast();
      newToast("Post deleted successfully");
    }
  }
}
