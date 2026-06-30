import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { UserContextProvider } from './context/UserContext.jsx'
import { CourseContextProvider } from './context/courseContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

// Backward-compatible server URL export (default matches Express server port 5000)
export const server =
  (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <UserContextProvider>
        <CourseContextProvider>
          <App />
        </CourseContextProvider>
      </UserContextProvider>
    </ThemeProvider>
  </StrictMode>
)
