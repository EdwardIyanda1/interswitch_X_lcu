import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import 'dotenv/config';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';

function singleServerApiPlugin() {
  return {
    name: 'single-server-api-plugin',
    async configureServer(server) {
      // Auto-initialize Render PostgreSQL table on dev server startup
      try {
        const dbPath = path.resolve(process.cwd(), 'api/_lib/db.js');
        if (fs.existsSync(dbPath)) {
          const dbModule = await import(`${pathToFileURL(dbPath).href}?t=${Date.now()}`);
          const initFn =
            dbModule.ensureDatabaseInitialized ||
            dbModule.initDb ||
            dbModule.default?.ensureDatabaseInitialized;
          if (typeof initFn === 'function') {
            await initFn();
          }
        }
      } catch (err) {
        console.error('DB auto-init error:', err.message);
      }

      // Serve /api/* directly on port 5173
      server.middlewares.use(async (req, res, next) => {
        const url = req.originalUrl || req.url || '';
        if (!url.startsWith('/api/')) {
          return next();
        }

        const parsedUrl = new URL(url, 'http://localhost:5173');
        const routeName = parsedUrl.pathname.replace(/^\/api\//, '').replace(/\/$/, '');
        const handlerPath = path.resolve(process.cwd(), 'api', `${routeName}.js`);

        if (!routeName || routeName.startsWith('_lib') || !fs.existsSync(handlerPath)) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `Route /api/${routeName} not found` }));
          return;
        }

        try {
          if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && req.body === undefined) {
            const chunks = [];
            for await (const chunk of req) {
              chunks.push(chunk);
            }
            const raw = Buffer.concat(chunks).toString('utf8');
            try {
              req.body = raw ? JSON.parse(raw) : {};
            } catch {
              req.body = raw;
            }
          }

          req.query = Object.fromEntries(parsedUrl.searchParams.entries());

          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (payload) => {
            if (!res.headersSent) {
              res.setHeader('Content-Type', 'application/json');
            }
            res.end(JSON.stringify(payload));
            return res;
          };
          res.send = (payload) => {
            if (typeof payload === 'object' && payload !== null && !Buffer.isBuffer(payload)) {
              return res.json(payload);
            }
            res.end(payload);
            return res;
          };

          const mod = await import(`${pathToFileURL(handlerPath).href}?t=${Date.now()}`);
          const handler = mod.default || mod.handler || mod;
          await handler(req, res);
        } catch (err) {
          console.error(`API error in /api/${routeName}:`, err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Server error' }));
          }
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), singleServerApiPlugin()],
  server: {
    port: 5173,
    strictPort: true,
  },
});