import React, { useContext, useEffect } from "react";
import { PreviewPlayerContext } from "../Main";

export default function PreviewPlayer({ src }) {
  const { previewPlayerContext } = useContext(PreviewPlayerContext);

  useEffect(() => {
    const audioTag = document.getElementById("spotifyFreeAudio");
    if (previewPlayerContext.playerState == "play") {
      audioTag.play();
    } else if (previewPlayerContext.playerState == "pause") {
      audioTag.pause();
    }
  }, [previewPlayerContext]);

  return (
    <>
      <audio id="spotifyFreeAudio" src={src}></audio>;
    </>
  );
}
