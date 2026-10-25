import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Automatically register service worker for offline caching and PWA installation
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(<App />);
