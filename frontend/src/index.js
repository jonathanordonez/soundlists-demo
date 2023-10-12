import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./Components/App";
import { BrowserRouter as Router } from "react-router-dom";

if (process.env.REACT_APP_ENVIRONMENT === "production") {
  console.log = () => {};
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <App />
  </Router>
);
