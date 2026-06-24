import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { UserContextProvider } from './context/UserContext.jsx'
import { CourseContextProvider } from './context/courseContext.jsx'
// export const server='https://lmsserver-1.onrender.com';
// Use VITE_API_URL in client/.env so it matches server PORT (defaults align with server: 5000 when unset).
export const server =
  import.meta.env.VITE_API_URL || "http://localhost:8080";


createRoot(document.getElementById('root')).render(
  
    <UserContextProvider>
      <CourseContextProvider>
         <App />
      </CourseContextProvider>
   
    </UserContextProvider>
  
  
)
