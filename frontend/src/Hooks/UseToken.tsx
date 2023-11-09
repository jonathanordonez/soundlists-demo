import { useRef } from "react";
import { useState, useEffect } from "react";
import { isExpiresInValid } from "../Utils";

export default function UseToken() {
  const [tokenContext, setTokenContext] = useState({
    token: window.localStorage.getItem("token"),
    expiresIn: window.localStorage.getItem("expiresIn"),
  });
  const tokenRefreshTimeout = useRef<null | NodeJS.Timeout>(null);
  const tokenCheckInterval = useRef<null | NodeJS.Timeout>(null);
  const [tokenRefreshTrigger, setTokenRefreshTrigger] = useState(0);

  useEffect(() => {
    (async () => {
      // If token is not empty AND expiresIn is valid
      if (tokenContext.token && tokenContext.expiresIn && isExpiresInValid(parseFloat(tokenContext.expiresIn))) {
        // console.log("Case 1");
        // Update token and timestamp in local storage
        window.localStorage.setItem("token", tokenContext.token);
        window.localStorage.setItem("expiresIn", tokenContext.expiresIn);

        startUpdateTokenTimer((parseFloat(tokenContext.expiresIn) - Date.now()) / 1000);
      } else {
        console.log("Case 2");
        let [token, expiresIn] = await fetchTokenFromBackend();
        setTokenContext({ token: token, expiresIn: expiresIn });
      }
      startTokenCheckInterval();
    })();
  }, [tokenContext, tokenRefreshTrigger]);

  return tokenContext

  function startTokenCheckInterval() {
    // Checks every 10 seconds if the tokenContext.expiresIn is valid. If not, it triggers a refresh of the token
    if (tokenCheckInterval.current) {
      clearInterval(tokenCheckInterval.current);
    }
    tokenCheckInterval.current = setInterval(() => {
      if (tokenContext.expiresIn && !isExpiresInValid(parseFloat(tokenContext.expiresIn))) {
        setTokenRefreshTrigger((prevCount) => prevCount + 1);
      }
    }, 10000);
  }

  async function fetchTokenFromBackend() {
    const request = await fetch(
      `${process.env.REACT_APP_PYTHONHOST}/api/fetch_token`,
      {
        credentials: "include",
      }
    );
    const { token, expiresInTimestamp: expiresIn } = await request.json();
    return [token, expiresIn];
  }

  function startUpdateTokenTimer(seconds:number) {
    if (tokenRefreshTimeout.current) {
      // console.log("clears previous timeout ");
      clearTimeout(tokenRefreshTimeout.current);
    }
    // console.log("timer starts in minutes: ", seconds / 60);

    // Check for hibernation issues (i.e., if the user closed the laptop). If the expiresIn is way past due, skip setTimeout and fetchToken immediately

    tokenRefreshTimeout.current = setTimeout(async () => {
      // console.log("timeout taking place ");
      const [token, expiresIn] = await fetchTokenFromBackend();
      setTokenContext({ token: token, expiresIn: expiresIn });
    }, seconds * 1000);
  }
}

// *** Logic ***
// tokenContext starts with local storage variables token and expiresIn. I.e., {token:1234, expiresIn:6789}
// If tokenContext.token is not empty and tokenContext.expiresIn is valid:
//           Update token and timestamp in local storage
//           Set timer to update token context
// Else
//      Refresh token from backend
//      Update token context
// Start time interval to check expiresIn every 10 seconds
