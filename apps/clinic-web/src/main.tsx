import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import "./index.css";

registerSW({
  immediate: true,
  onNeedRefresh() {
    window.location.reload();
  },
});

setInterval(async () => {
  const reg = await navigator.serviceWorker?.getRegistration();
  reg?.update();
}, 60_000);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
