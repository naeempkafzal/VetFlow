import express from "express";
import type { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start: number = Date.now();
  const path: string = req.path;

  res.on("finish", () => {
    const duration: number = Date.now() - start;
    if (path.startsWith("/api")) {
      log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

// Register API routes
const server = registerRoutes(app);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status: number = err.status || err.statusCode || 500;
  const message: string = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

if (process.env.NODE_ENV !== "production") {
  (async (): Promise<void> => {
    await setupVite(app, server);
    const PORT: number = parseInt(process.env.PORT || "5000", 10);
    server.listen(PORT, "0.0.0.0", () => {
      log(`Development server serving on port ${PORT}`);
    });
  })();
} else {
  // Production static serving
  serveStatic(app);
}

export default app;