import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import express from "express";

const log = (msg: string) => console.log(msg);

export async function setupVite(app: any, server: any) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

export function serveStatic(app: any) {
  const distPath = path.resolve(process.cwd(), "dist");
  
  if (!fs.existsSync(distPath)) {
    log(`Static files not found at ${distPath}. Please run 'npm run build' first.`);
    return;
  }
  
  app.use(express.static(distPath));
  
  // Fallback to index.html for SPA routing
  app.use("*", (req: any, res: any) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

export { log };