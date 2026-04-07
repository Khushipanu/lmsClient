import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { UserContextProvider } from './context/UserContext.jsx'
import { CourseContextProvider } from './context/courseContext.jsx'
// export const server='https://lmsserver-1.onrender.com';
export const server='https://lmsserver-1.onrender.com';


createRoot(document.getElementById('root')).render(
  
    <UserContextProvider>
      <CourseContextProvider>
         <App />
      </CourseContextProvider>
   
    </UserContextProvider>
  
  
)
