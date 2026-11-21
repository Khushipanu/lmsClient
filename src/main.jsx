import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/pages.css";
import { UserContextProvider } from "./context/UserContext.jsx";
import { CourseContextProvider } from "./context/courseContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <UserContextProvider>
        <CourseContextProvider>
          <App />
        </CourseContextProvider>
      </UserContextProvider>
    </ThemeProvider>
  </StrictMode>
);
