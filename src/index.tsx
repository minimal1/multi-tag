/** @format */

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App tagRegExp='number' />
  </React.StrictMode>,
  document.getElementById("root")
);
