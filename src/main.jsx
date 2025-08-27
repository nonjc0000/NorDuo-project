import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/style.min.css'
import App from './App_NorDuo.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
