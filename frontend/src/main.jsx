import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

const AppShell = googleClientId
  ? (
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  )
  : <App />

if (!googleClientId) {
  console.warn('VITE_GOOGLE_CLIENT_ID is not set; Google login is disabled.')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {AppShell}
  </StrictMode>,
)
