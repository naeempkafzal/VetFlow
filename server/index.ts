import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { db, pool } from "./db"; // Import db and pool from db.ts

// DO NOT IMPORT init-db anymore.
// initDatabase has been removed.
// The database initialization and table creation is handled by Drizzle migrations or raw SQL in storage.ts

// 1. Load Environment Variables
dotenv.config();

const PORT = 5000;
const PgSession = connectPgSimple(session);

// 2. Initialize Express App
const app = express();

// 3. Database Setup
const connection = drizzle(pool);

// 4. Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || true,
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

// 6. Logging Middleware
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

// 7. Register API Routes & Startup Logic
(async () => {
  const server = registerRoutes(app);

  // --- AUTOMATED REMINDER CHECK (Module D) ---
  // Check for Vaccinations due in next 7 days
  try {
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    
    const dueVaccinations = await pool.query(
      `SELECT * FROM vaccinations WHERE next_due_date <= $1 AND next_due_date >= NOW()`,
      [oneWeekFromNow.toISOString()]
    );

    if (dueVaccinations.rows.length > 0) {
      console.log(`🔔 Found ${dueVaccinations.rows.length} vaccines due soon. Sending Notifications...`);
      
      // Save to DB as notification
      dueVaccinations.rows.forEach((vax: any) => {
        console.log(`📨 REMINDER: Vaccination ID ${vax.id} for Animal ${vax.animal_id} is due on ${vax.next_due_date}`);
        
        // Create Notification using Storage Layer
        await storage.createNotification({
          type: 'vaccine',
          title: 'Vaccination Due',
          message: `Animal ID: ${vax.animal_id} needs ${vax.vaccine_name}`,
          targetDate: vax.next_due_date
        });
      });
    }
  } catch (err) {
    console.error("❌ Reminder Job Failed:", err);
  }

  // --- GLOBAL ERROR HANDLER ---
  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error("💥 SERVER ERROR DETAILS:", err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // 8. Setup Vite (Dev) or Static Files (Prod)
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // 9. Start Server
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
    console.log(`🗄️  Database connected: ${process.env.DATABASE_URL ? 'Yes' : 'No (Check .env)'}`);
    console.log(`🤖 Automation Engine: ACTIVE`);
  })();

export default app;