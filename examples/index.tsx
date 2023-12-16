import React from "react";
import { Root, createRoot } from "react-dom/client";
import { App } from "./react-select";
const mountNode = document.getElementById("react-app")!;
let root: Root = createRoot(mountNode);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
