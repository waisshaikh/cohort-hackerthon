import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/index.css";

import App from "./app/App.jsx";
import { ThemeProvider } from "./project/ThemeContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>

  </StrictMode>
);



