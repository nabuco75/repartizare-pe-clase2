import React from "react";
import { createRoot } from "react-dom/client"; // Importați createRoot
import "./index.css";
import App from "./App";
import { AuthProvider } from "./components/AuthContext"; // Importați AuthProvider din calea corectă

const container = document.getElementById("root");
const root = createRoot(container); // Creați root-ul

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
