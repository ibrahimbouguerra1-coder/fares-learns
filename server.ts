import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { handleGeminiApiRoute } from './src/server/geminiHandler.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const httpServer = http.createServer(app);

  app.use(express.json({ limit: '10mb' }));

  // Route Gemini AI endpoints through server-side proxy
  app.all('/api/gemini*', async (req, res) => {
    try {
      const handled = await handleGeminiApiRoute(req, res);
      if (!handled && !res.headersSent) {
        res.status(404).json({ error: 'Endpoint not found' });
      }
    } catch (error: any) {
      console.error('Server Gemini API error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: error?.message || 'Server error' });
      }
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Fares English server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
