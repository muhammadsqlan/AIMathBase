import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ScienceApp from "./ScienceApp";
import { applyPageMetadata } from "./applyPageMetadata";
import { pageMetadataForPath } from "./pageMetadata";
import "./styles.css";
import "./science.css";

const path = window.location.pathname.replace(/\/+$/, "") || "/";
const RootApp = path === "/math" ? App : ScienceApp;
applyPageMetadata(pageMetadataForPath(path));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
);
