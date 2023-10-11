import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Nav(props) {
  const [profilePicture, setProfilePicture] = useState(props.profilePicture);
  useEffect(() => {
    if (props.profilePicture != profilePicture) {
      setProfilePicture(props.profilePicture);
    }
  }, [props.profilePicture]);
  return (
    <>
      <nav>
        <div className="navContainer container">
          <div className="logoNameContainer">
            <svg
              className="homepageLogo"
              viewBox="502.421 228.007 43.995 43.986"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m42.07,24.111c-2.566-2.557-6.369-2.913-8.936-0.356l-2.145,2.137-2.144-2.137c-2.566-2.557-6.369-2.2-8.935,0.356-2.566,2.557-2.566,6.701 0,9.258l.357,.356 10.008,9.97c0.395,0.394 1.035,0.394 1.43,0l10.365-10.326c2.567-2.557 2.567-6.701 0-9.258zm-1.429,7.834l-1.072,1.067-8.578,8.547-9.65-9.614c-1.776-1.771-1.776-4.64 0-6.41 1.654-1.647 4.202-2.223 6.076-0.355l3.574,3.561 3.574-3.561c1.964-1.956 4.422-1.292 6.076,0.355 1.776,1.771 1.776,4.64 7.10543e-15,6.41z"
                style={{ fill: "rgb(130, 46, 204)" }}
                transform="matrix(1, 0, 0, 1, 502.420959, 228.002258)"
              />
              <g transform="matrix(1, 0, 0, 1, 502.420959, 228.002258)">
                <g>
                  <path
                    fillRule="evenodd"
                    d="m1,2.005h28c0.552,0 1-0.447 1-1s-0.448-1-1-1h-28c-0.552,0-1,0.447-1,1s0.448,1 1,1zm17,18h-17c-0.552,0-1,0.447-1,1s0.448,1 1,1h17c0.552,0 1-0.447 1-1s-0.448-1-1-1zm11-10h-28c-0.552,0-1,0.447-1,1s0.448,1 1,1h28c0.552,0 1-0.447 1-1s-0.448-1-1-1zm-14,20h-14c-0.552-3.55271e-15-1,0.447-1,1s0.448,1 1,1h14c0.552,0 1-0.447 1-1s-0.448-1-1-1z"
                    style={{ fill: "rgb(29, 185, 84)" }}
                  />
                </g>
              </g>
            </svg>
            <Link to="/" className="logoName">
              Soundlists.com
            </Link>
          </div>
          <img
            className="navProfilePic"
            onClick={props.setOverlayOnHandler}
            src={`https://soundlists-profpics.s3.amazonaws.com/${profilePicture}`}
            alt="profile"
          ></img>
          <div className="navOptions"></div>
        </div>
      </nav>
    </>
  );
}
