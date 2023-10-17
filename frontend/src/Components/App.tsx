import "./App.css";
import { createContext, useEffect, useState } from "react";
import Main from "./Main/Main";
import UseToken from "../Hooks/UseToken";
import React from "react";

export interface TokenContextType  {
  tokenContext: TokeContextValues | undefined;
};

interface TokeContextValues  
  {
    token: string | null;
    expiresIn: string | null;
  }


export interface UserDetailsContextType {
  userDetailsContext: UserDetailsValues;
  setUserDetailsContext: React.Dispatch<React.SetStateAction<UserDetailsValues>>
}

interface UserDetailsValues  
  {
    username: string | null,
    profilePicture: string | null,
    spotifyUserId:string | null
  }


export const TokenContext = createContext<TokenContextType | undefined>(undefined);
export const UserDetailsContext = createContext<UserDetailsContextType>({userDetailsContext: {
  username: null,
  profilePicture: null,
  spotifyUserId: null,
},
setUserDetailsContext: () => {},
});

function App() {
  const tokenContext = UseToken();
  const [userDetailsContext, setUserDetailsContext] = useState<UserDetailsValues>({
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
    <TokenContext.Provider value={{ tokenContext }}>
      <UserDetailsContext.Provider
        value={{ userDetailsContext, setUserDetailsContext }}
      >
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
