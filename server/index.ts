import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { db, pool } from "./db";

// 1. Load Environment Variables
dotenv.config();

const PORT = parseInt(process.env.PORT || "5000");
const PgSession = connectPgSimple(session);

// 2. Initialize Express App
const app = express();

// 3. Create HTTP Server
const server = createServer(app);

// 4. Middleware Setup
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 5. Session Middleware
app.use(session({
  store: new PgSession({
    pool: pool,
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || "change_this_secret_in_prod",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax"
  }
}));

// 6. Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
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

// 7. Automated Vaccination Reminder Check
const checkVaccinationReminders = async () => {
  try {
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

    const dueVaccinations = await pool.query(
      `SELECT * FROM vaccinations WHERE next_due_date <= $1 AND next_due_date >= NOW()`,
      [oneWeekFromNow.toISOString()]
    );

    if (dueVaccinations.rows.length > 0) {
      console.log(`🔔 Found ${dueVaccinations.rows.length} vaccines due soon. Sending Notifications...`);

      for (const vax of dueVaccinations.rows) {
        console.log(`📨 REMINDER: Vaccination ID ${vax.id} for Animal ${vax.animal_id} is due on ${vax.next_due_date}`);

        await pool.query(
          `INSERT INTO notifications (type, title, message, target_date) VALUES ($1, $2, $3, $4)`,
          ["vaccine", "Vaccination Due", `Animal ID: ${vax.animal_id} needs ${vax.vaccine_name}`, vax.next_due_date]
        );
      }
    }
  } catch (err) {
    console.error("❌ Reminder Job Failed:", err);
  }
};

// 8. Global Error Handler
app.use((err: Error & { status?: number; statusCode?: number }, _req: Request, res: Response, _next: NextFunction) => {
  console.error("💥 SERVER ERROR DETAILS:", err);
  const status = (err as any).status || (err as any).statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// 9. Startup Logic
(async () => {
  try {
    // Register API Routes
    await registerRoutes(app);

    // Setup Vite (Dev) or Static Files (Prod)
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Run reminder check on startup
    await checkVaccinationReminders();

    // Run reminder check every 24 hours
    setInterval(checkVaccinationReminders, 24 * 60 * 60 * 1000);

    // Start Server
    server.listen(PORT, "0.0.0.0", () => {
      log(`serving on port ${PORT}`);
      console.log(`🗄️  Database connected: ${process.env.DATABASE_URL ? "Yes" : "No (Check .env)"}`);
      console.log(`🤖 Automation Engine: ACTIVE`);
    });
  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
})();

export default app;