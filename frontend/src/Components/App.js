import "./App.css";
import { createContext, useEffect, useState } from "react";
import Main from "./Main/Main";
import UseToken from "../Hooks/UseToken";

export const TokenContext = createContext();
export const UserDetailsContext = createContext();

function App() {
  const [tokenContext, setTokenContext] = useState({
    token: window.localStorage.getItem("token"),
    expiresIn: window.localStorage.getItem("expiresIn"),
  });
  const [userDetailsContext, setUserDetailsContext] = useState({
    username: "",
    profilePicture: "default-profile-pic.jpg",
    spotifyUserId: "",
  });

  useEffect(() => {
    (async () => {
      const request = await getUserDetails();
      if (request.status == "successful") {
        if (request.has_data) {
          setUserDetailsContext({
            username: request.username,
            profilePicture: request.profile_picture,
            spotifyUserId: request.spotifyUserId,
          });
        }
      } else {
        console.error("Failed to fetch user details");
      }
    })();
  }, []);

  return (
    <TokenContext.Provider value={{ tokenContext, setTokenContext }}>
      <UserDetailsContext.Provider
        value={{ userDetailsContext, setUserDetailsContext }}
      >
        <UseToken />
        <Main />
      </UserDetailsContext.Provider>
    </TokenContext.Provider>
  );

  async function getUserDetails() {
    const request = await fetch(
      `${process.env.REACT_APP_PYTHONHOST}/api/user_details`,
      {
        credentials: "include",
      }
    );
    const json = await request.json();
    return json;
  }
}

export default App;
