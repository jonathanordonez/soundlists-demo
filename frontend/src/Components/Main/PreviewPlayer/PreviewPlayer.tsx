import React, { useContext, useEffect } from "react";
import { PreviewPlayerContext } from "../Main";

export default function PreviewPlayer({ previewUrl }: {previewUrl:string}) {
  const { previewPlayerContext } = useContext(PreviewPlayerContext);

  useEffect(() => {
    const audioTag = document.getElementById("spotifyFreeAudio") as HTMLAudioElement;
    if(!audioTag) {
      console.error('audioTag is empty')
      return
    }
    if (previewPlayerContext.playerState === "play") {
      audioTag.play();
    } else if (previewPlayerContext.playerState === "pause") {
      audioTag.pause();
    }
  }, [previewPlayerContext]);

  return (
    <>
      <audio id="spotifyFreeAudio" src={previewUrl}></audio>;
    </>
  );
}
