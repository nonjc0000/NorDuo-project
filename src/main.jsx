import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/style.min.css'
import App from './App_NorDuo.jsx'
import { HashRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
