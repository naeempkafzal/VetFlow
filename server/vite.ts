import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...(viteConfig as any),
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        // Don't kill the process on simple CSS warnings
        if (!msg.includes("PostCSS")) {
           process.exit(1);
        }
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // FIXED: Pointing to root index.html instead of client/index.html
      const clientTemplate = path.resolve(__dirname, "..", "index.html");

      if (!fs.existsSync(clientTemplate)) {
        throw new Error(`Template file not found: ${clientTemplate}`);
      }

      let template = await fs.promises.readFile(clientTemplate, "utf-8");

      // FIXED: Match the script tag we set in the root index.html
      template = template.replace(
        `src="/client/src/main.tsx"`,
        `src="/client/src/main.tsx?v=${Math.random().toString(36).substring(7)}"`
      );

      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // FIXED: Vercel/Vite builds usually put static files in 'dist'
  const distPath = path.resolve(__dirname, "..", "dist");

  if (!fs.existsSync(distPath)) {
    // Fallback check for 'public' if your vite config uses it
    const publicPath = path.resolve(__dirname, "..", "public");
    if (fs.existsSync(publicPath)) {
        app.use(express.static(publicPath));
        app.use("*", (_req, res) => res.sendFile(path.resolve(publicPath, "index.html")));
        return;
    }
    throw new Error(`Build directory not found. Run 'npm run build' first.`);
  }

  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}