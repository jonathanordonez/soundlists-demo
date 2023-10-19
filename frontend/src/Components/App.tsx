import "./App.css";
import { createContext, useEffect, useState } from "react";
import Main from "./Main/Main";
import UseToken from "../Hooks/UseToken";
import React from "react";

export interface TokenContextType  {
  token: string | null;
  expiresIn: string | null;
};


export interface UserDetailsContextType {
  userDetailsContext: UserDetailsValuesType;
  setUserDetailsContext: React.Dispatch<React.SetStateAction<UserDetailsValuesType>>
}

interface UserDetailsValuesType  
  {
    username: string | null,
    profilePicture: string,
    spotifyUserId:string,
  }


export const TokenContext = createContext<TokenContextType>({token: '', expiresIn: ''});
export const UserDetailsContext = createContext<UserDetailsContextType>({userDetailsContext: {
  username: '',
  profilePicture: '',
  spotifyUserId: '',
},
setUserDetailsContext: () => {},
});

function App() {
  const tokenContext = UseToken();
  const [userDetailsContext, setUserDetailsContext] = useState<UserDetailsValuesType>({
    username: "",
    profilePicture: "default-profile-pic.jpg",
    spotifyUserId: "",
  });

  useEffect(() => {
    (async () => {
      const request = await getUserDetails();
      if (request.status === "successful") {
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
    <TokenContext.Provider value={{ ...tokenContext }}>
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
