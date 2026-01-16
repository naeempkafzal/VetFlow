import type { Express } from "express";
import { createServer, type Server } from "http";
import animalRoutes from "./routes/records";
import inventoryRoutes from "./routes/inventory";
import vaccinationRoutes from "./routes/vaccinations";
import outbreakRoutes from "./routes/outbreaks";
import appointmentRoutes from "./routes/appointments";

export function registerRoutes(app: Express): Server {
  app.use("/api/animals", animalRoutes);
  app.use("/api/records", animalRoutes);
  app.use("/api/visit-records", animalRoutes);
  app.use("/api/inventory", inventoryRoutes); 
  app.use("/api/vaccinations", vaccinationRoutes);
  app.use("/api/outbreaks", outbreakRoutes);
  app.use("/api/appointments", appointmentRoutes);

  // NEW: Automation Routes
  app.use("/api/billings", storage.getBillings); 
  app.use("/api/notifications", storage.getPendingNotifications);

  return createServer(app);
}