import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Register PWA Service Worker only in production
// In development, automatically unregister any lingering service worker to avoid breaking Vite HMR
if ("serviceWorker" in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Kennet Guest PWA Service Worker registado:", reg.scope);
        })
        .catch((err) => {
          console.warn("Falha ao registar Service Worker:", err);
        });
    });
  } else {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then(() => {
          console.log("Service Worker antigo desregistrado em modo de desenvolvimento:", registration.scope);
        });
      }
    });
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
