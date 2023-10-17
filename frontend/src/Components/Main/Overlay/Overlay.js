import React from "react";
import UploadProfilePicture from "../Nav/UploadProfilePicture";

export default function Overlay(props) {
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
          updateProfilePicture={props.updateProfilePicture}
          profilePicture={props.profilePicture}
        />
        <button className="signout" onClick={props.signOut}>
          Sign out
        </button>
      </div>
    </>
  );
  function getOverlayContentTop() {
    return `${visualViewport.pageTop + window.innerHeight / 2}px`;
  }

  function getOverlayTop() {
    return `${visualViewport.pageTop}px`;
  }
}
