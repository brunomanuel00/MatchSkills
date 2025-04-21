// En tu main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import "./i18n";

// Forzar fondo inicial
document.documentElement.style.background = '#1e293b';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Restaurar estilos después de hidratación
setTimeout(() => {
  document.documentElement.style.background = '';
}, 100);