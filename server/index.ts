import express from "express";
import session from "express-session";
import pg from "pg";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// 1. Load Environment Variables
dotenv.config();

const PORT = 5000;
const { Pool } = pg;
const PgSession = connectPgSimple(session);

// 2. Initialize Express App
const app = express();

// 3. Database Setup (PostgreSQL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
export const db = drizzle(pool);

// 4. Middleware
// CORS is handled by Vite proxy in dev, but we add it here for production safety
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true
}));
app.use(compression());

// Standard body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session Middleware
app.use(session({
  store: new PgSession({
    pool: pool,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET || 'change_this_secret_in_prod',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// Logging Middleware (From your original code)
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
  // This registers your routes located in ./routes/index.ts
  const server = registerRoutes(app);

  // Global Error Handler
  app.use((err: any, _req: any, res: any, _next: any) => {
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