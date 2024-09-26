import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from './components/LayoutComponent.jsx'
import './css/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout />
  </StrictMode>,
)
