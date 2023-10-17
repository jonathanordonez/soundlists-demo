import React from "react";
import UploadProfilePicture from "../Nav/UploadProfilePicture";

interface OverlayProps {
  profilePicture: string | null,
  setOverlayOnHandler: () => void
}

export default function Overlay(props:OverlayProps) {
  return (
    <>
      <div
        className="overlay"
        style={{ top: getOverlayTop() }}
        onClick={props.setOverlayOnHandler}
      ></div>
      <div className="overlayContent" style={{ top: getOverlayContentTop() }}>
        <div>
          <div className="settingsCloseButtonContainer">
            <div
              className="settingsCloseButton"
              onClick={props.setOverlayOnHandler}
            >
              x
            </div>
          </div>
          <div className="settings">Settings</div>
        </div>
        <hr></hr>
        <UploadProfilePicture
          profilePicture={props.profilePicture}
        />
        {/* <button className="signout" onClick={props.signOut}>
          Sign out
        </button> */}
      </div>
    </>
  );
  function getOverlayContentTop() {
    return visualViewport !== null? `${visualViewport.pageTop + window.innerHeight / 2}px`:`${0 + window.innerHeight / 2}px`;
  }

  function getOverlayTop() {
    return visualViewport !== null? `${visualViewport.pageTop}px`:'0px' ;
  }
}
