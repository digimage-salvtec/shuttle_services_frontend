import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ContextProvider } from "./context/ContextProvider.jsx";
import { ReservationProvider } from "./context/ReservationContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ContextProvider>
      <ReservationProvider>
        <App />
      </ReservationProvider>
    </ContextProvider>
  </React.StrictMode>
);
