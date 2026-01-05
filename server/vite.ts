import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function setupVite(app: any, server: any) {
  // We use 'require' here to bypass the TypeScript module resolution error
  // while keeping the functionality identical.
  const { createServer: createViteServer } = require("vite");

  const vite = await createViteServer({
    server: { 
      middlewareMode: true, 
      hmr: { server } 
    },
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req: any, res: any, next: any) => {
    try {
      const url = req.originalUrl;
      const clientIndex = path.resolve(__dirname, "..", "client", "index.html");
      let template = fs.readFileSync(clientIndex, "utf-8");
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: any) {
  const distPath = path.resolve(__dirname, "..", "dist", "public");

  if (!fs.existsSync(distPath)) {
    return;
  }

  app.use(express.static(distPath));
  app.use("*", (_req: any, res: any) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

export const log = (msg: string) => {
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  console.log(`${time} [vite] ${msg}`);
};