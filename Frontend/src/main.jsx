import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/index.css";

import App from "./app/App.jsx";
import { ThemeProvider } from "./Context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>

  </StrictMode>
);



