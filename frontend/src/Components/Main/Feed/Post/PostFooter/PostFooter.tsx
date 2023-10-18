import React from "react";
import "./PostFooter.css";
import {getTrackUrisFromPost } from "../../../../../Utils";

interface PostFooterType {
  username: string | null,
  postUsername: string | null,
  delPostInFeed: (postToDelete:string)=>void,
  setOverlayOnHandlerCopyToSpotify: (data:{ playlistName: string, trackUris: string [] }|null)=>void, 
}

export default function PostFooter({
  username,
  postUsername,
  delPostInFeed,
  setOverlayOnHandlerCopyToSpotify,
}:PostFooterType) {
  return (
    <>
      <div className="postFooter">
        {username !== postUsername && (
          <>
            <div className="postOption">
              <svg viewBox="0 0 48 48" version="1.1" onClick={copyToSpotify}>
                <title>Copy playlist to Spotify</title>
                <defs></defs>
                <g
                  id="Icons"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  <g
                    id="Color-"
                    transform="translate(-200.000000, -460.000000)"
                    fill="#00DA5A"
                  >
                    <path
                      d="M238.16,481.36 C230.48,476.8 217.64,476.32 210.32,478.6 C209.12,478.96 207.92,478.24 207.56,477.16 C207.2,475.96 207.92,474.76 209,474.4 C217.52,471.88 231.56,472.36 240.44,477.64 C241.52,478.24 241.88,479.68 241.28,480.76 C240.68,481.6 239.24,481.96 238.16,481.36 M237.92,488.08 C237.32,488.92 236.24,489.28 235.4,488.68 C228.92,484.72 219.08,483.52 211.52,485.92 C210.56,486.16 209.48,485.68 209.24,484.72 C209,483.76 209.48,482.68 210.44,482.44 C219.2,479.8 230,481.12 237.44,485.68 C238.16,486.04 238.52,487.24 237.92,488.08 M235.04,494.68 C234.56,495.4 233.72,495.64 233,495.16 C227.36,491.68 220.28,490.96 211.88,492.88 C211.04,493.12 210.32,492.52 210.08,491.8 C209.84,490.96 210.44,490.24 211.16,490 C220.28,487.96 228.2,488.8 234.44,492.64 C235.28,493 235.4,493.96 235.04,494.68 M224,460 C210.8,460 200,470.8 200,484 C200,497.2 210.8,508 224,508 C237.2,508 248,497.2 248,484 C248,470.8 237.32,460 224,460"
                      id="Spotify"
                    ></path>
                  </g>
                </g>
              </svg>
            </div>
          </>
        )}
        {username === postUsername && (
          <>
            <div className="postOption">
              <svg viewBox="0 -0.5 21 21" version="1.1" onClick={deletePost}>
                <title>Delete</title>
                <defs></defs>
                <g
                  id="Page-1"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  <g
                    id="Dribbble-Light-Preview"
                    transform="translate(-179.000000, -360.000000)"
                    fill="#000000"
                  >
                    <g id="icons" transform="translate(56.000000, 160.000000)">
                      <path
                        d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216 L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206 L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204 Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220 L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z"
                        id="delete-[#1487]"
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          </>
        )}
      </div>
    </>
  );
  function deletePost(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {

    const postId = (e.target as HTMLElement)?.parentElement?.parentElement?.parentElement?.id;

    if (!postId) {
      return;
    }

  delPostInFeed(postId);
  }

  function copyToSpotify(e:React.MouseEvent<SVGSVGElement, MouseEvent>) {
    const post = (e.target as HTMLElement)?.parentElement?.parentElement?.parentElement;
    if(!post){
      return
    }
    const playlistName = post.querySelector(".postTitle")?.textContent;
    if(!playlistName){
      console.error('Copy to Spotify failed: playlistName is empty')
      return
    }
    const trackUris = getTrackUrisFromPost(post.id);
    const data = { playlistName: playlistName, trackUris: trackUris };
    setOverlayOnHandlerCopyToSpotify(data);
  }
}
