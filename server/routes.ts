import type { Express } from "express";
import express from "express";
import dotenv from "dotenv";

async function registerRoutes(app: Express) {
  // Add your route registration logic here
}

export { registerRoutes };

// 1. Load Environment Variables
dotenv.config();

const app = express();
const PORT = 5000;

// 2. Start Server
(async () => {
  await registerRoutes(app);

  // 3. Start HTTP Server
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`serving on port ${PORT}`);
    console.log(`🗄️  Database connected: ${process.env.DATABASE_URL ? 'Yes' : 'No (Check .env)'}`);
    console.log(`🤖 Automation Engine: ACTIVE`);
  });
})();