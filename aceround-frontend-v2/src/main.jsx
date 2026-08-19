import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Create root and render the app
// StrictMode helps find problems in development
createRoot(document.getElementById('root')).render(   // Ye line React app ko browser me start karti hai.
  <StrictMode>
    <App />
  </StrictMode>,
)