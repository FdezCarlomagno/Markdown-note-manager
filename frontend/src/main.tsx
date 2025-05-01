import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ContextProvider from './context/AppContext.tsx'
import { UserProvider } from './context/UserContext.tsx'

createRoot(document.getElementById('root')!).render(
 
    <UserProvider>
      <ContextProvider>
        <App />
      </ContextProvider>
    </UserProvider>

)


// <StrictMode>
//</StrictMode>,