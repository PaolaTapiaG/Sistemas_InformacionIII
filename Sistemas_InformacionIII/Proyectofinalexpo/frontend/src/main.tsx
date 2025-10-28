import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { MisRutas } from './routes.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MisRutas />
  </StrictMode>,
)
