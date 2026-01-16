import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";
import compression from "compression";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { db, pool } from "./db";

const PORT = 5000;
const PgSession = connectPgSimple(session);

// 1. Initialize Express App
const app = express();

// 2. Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true
}));
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 3. Session Middleware (REENABLED)
app.use(session({
  store: new PgSession({ // Fixed: was PgSimple
    pool: pool,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET || 'change_this_secret_in_prod',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// 4. Logging Middleware
app.use((req: any, res: any, next: any) => {
  const start = Date.now();
  const path = req.path;
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

// 5. Register API Routes
(async () => {
  const server = registerRoutes(app);

  // Global Error Handler
  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error("💥 SERVER ERROR DETAILS:", err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // 6. Setup Vite (Dev) or Static Files (Prod)
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // 7. Start Server
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
    console.log(`🗄️  Database connected: ${process.env.DATABASE_URL ? 'Yes' : 'No (Check .env)'}`);
  });
})();