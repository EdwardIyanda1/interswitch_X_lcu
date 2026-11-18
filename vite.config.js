import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from "node:fs";

function localApiPlugin() {
  return {
    name: "local-api-plugin",
    async configureServer(server) {
      const env = loadEnv("development", process.cwd(), "");
      Object.assign(process.env, env);

      try {
        const dbMod = await server.ssrLoadModule("/api/_lib/db.js");
        const initFn =
          dbMod.ensureDatabaseInitialized ||
          (dbMod.db && dbMod.db.init) ||
          (dbMod.default && dbMod.default.init);
        if (typeof initFn === "function") {
          await initFn();
          console.log("✅ Vite connected to Render DB & verified table.");
        }
      } catch (err) {
        console.error("⚠️ Render DB startup check failed:", err);
      }

      server.middlewares.use(async (req, res, next) => {
        const rawUrl = req.originalUrl || req.url || "";
        if (!rawUrl.startsWith("/api/")) {
          return next();
        }

        const parsedUrl = new URL(rawUrl, "http://localhost:5173");
        const routeName = parsedUrl.pathname
          .replace(/^\/api\//, "")
          .replace(/\/$/, "");

        if (!routeName || routeName.startsWith("_lib")) {
          return next();
        }

        const filePath = path.resolve(process.cwd(), "api", `${routeName}.js`);
        if (!fs.existsSync(filePath)) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: `Not found: /api/${routeName}` }));
          return;
        }

        try {
          if (
            ["POST", "PUT", "PATCH", "DELETE"].includes(req.method) &&
            req.body === undefined
          ) {
            const chunks = [];
            for await (const chunk of req) {
              chunks.push(chunk);
            }
            const rawBody = Buffer.concat(chunks).toString("utf8");
            try {
              req.body = rawBody ? JSON.parse(rawBody) : {};
            } catch {
              req.body = rawBody;
            }
          }

          req.query = Object.fromEntries(parsedUrl.searchParams.entries());

          res.status = (code) => {
            res.statusCode = code;
            return res;
          };

          res.json = (data) => {
            if (!res.headersSent) {
              res.setHeader("Content-Type", "application/json");
            }
            res.end(JSON.stringify(data));
            return res;
          };

          res.send = (data) => {
            if (
              typeof data === "object" &&
              data !== null &&
              !Buffer.isBuffer(data)
            ) {
              return res.json(data);
            }
            res.end(data);
            return res;
          };

          const mod = await server.ssrLoadModule(`/api/${routeName}.js`);
          const handler = mod.default ? mod.default : mod.handler;
          if (typeof handler !== "function") {
            throw new Error(`api/${routeName}.js has no default export handler`);
          }

          await handler(req, res);
        } catch (err) {
          console.error(`❌ Error in /api/${routeName}:`, err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                error: err.message || "Internal Server Error",
              })
            );
          }
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
  server: {
    port: 5173,
    strictPort: true,
  },
});