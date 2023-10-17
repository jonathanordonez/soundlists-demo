import React, { useEffect, useContext } from "react";
import { useState } from "react";
import { updateToast } from "../../../Utils";
import { UserDetailsContext } from "../../App";

interface UploadProfilePictureProps {
  profilePicture: string | null
}

export default function UploadProfilePicture(props:UploadProfilePictureProps) {
  const [profilePicture, setProfilePicture] = useState(props.profilePicture);
  const { setUserDetailsContext } = useContext(UserDetailsContext);

  useEffect(() => {
    if (props.profilePicture != profilePicture) {
      setProfilePicture(props.profilePicture);
    }
  }, [props.profilePicture]);

  return (
    <>
      <input
        className="changeProfilePictureInput"
        type="file"
        onChange={upload}
      ></input>
      <img
        src={`https://soundlists-profpics.s3.amazonaws.com/${profilePicture}`}
        alt="profile"
        className="changeProfilePicture"
        onClick={openFileExplorer}
      ></img>
    </>
  );

  function openFileExplorer() {
    const changeProfilePictureInput = document.getElementsByClassName(
      "changeProfilePictureInput"
    )[0] as HTMLInputElement;
    changeProfilePictureInput.click();
  }

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    
    const file = e.target.files ? e.target.files[0] : null;

      if (!file) {
        // No file selected
        return;
      }

      const file_dots = file.name.split(".");
      const file_extension = file_dots[file_dots.length - 1];
      const valid_file_extensions = ["img", "jpeg", "jpg", "png"];
  
      if (!valid_file_extensions.includes(file_extension)) {
        const wrongFileExtensionToast = updateToast();
        wrongFileExtensionToast(
          "Please select a valid image format: .png, .jpg, .jpeg, .img"
        );
        return;
      }
  
      try {
        let formData = new FormData();
        formData.append("file", file);
        const request = await fetch(
          `${process.env.REACT_APP_PYTHONHOST}/api/upload_profile_picture`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );
        const json = await request.json();
        if (json.status == "successful") {
          updateProfilePicture(json.upload_file_name);
        } else {
          console.error("Unable to upload profile picture");
        }
      } catch (err) {
        console.log(
          "The following error occurred during the profile picture upload: ",
          err
        );
      }
    }


    function updateProfilePicture(file:string) {
      setUserDetailsContext((previousValues) => ({
        ...previousValues,
        profilePicture: file,
      }));
    }
  }


