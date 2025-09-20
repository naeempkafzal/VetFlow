import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnimalSchema, insertVisitRecordSchema, insertVaccinationSchema, insertInventorySchema, insertAppointmentSchema, insertOutbreakSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Animals
  app.get("/api/animals", async (req, res) => {
    try {
      const animals = await storage.getAnimals();
      res.json(animals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch animals" });
    }
  });

  app.get("/api/animals/:id", async (req, res) => {
    try {
      const animal = await storage.getAnimal(req.params.id);
      if (!animal) {
        return res.status(404).json({ message: "Animal not found" });
      }
      res.json(animal);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch animal" });
    }
  });

  app.post("/api/animals", async (req, res) => {
    try {
      const validatedData = insertAnimalSchema.parse(req.body);
      const animal = await storage.createAnimal(validatedData);
      res.status(201).json(animal);
    } catch (error) {
      res.status(400).json({ message: "Invalid animal data", error });
    }
  });

  app.put("/api/animals/:id", async (req, res) => {
    try {
      const animal = await storage.updateAnimal(req.params.id, req.body);
      if (!animal) {
        return res.status(404).json({ message: "Animal not found" });
      }
      res.json(animal);
    } catch (error) {
      res.status(500).json({ message: "Failed to update animal" });
    }
  });

  // Visit Records
  app.get("/api/visit-records", async (req, res) => {
    try {
      const records = await storage.getVisitRecords();
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch visit records" });
    }
  });

  app.get("/api/animals/:animalId/visit-records", async (req, res) => {
    try {
      const records = await storage.getVisitRecordsByAnimal(req.params.animalId);
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch visit records" });
    }
  });

  app.post("/api/visit-records", async (req, res) => {
    try {
      const validatedData = insertVisitRecordSchema.parse(req.body);
      const record = await storage.createVisitRecord(validatedData);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ message: "Invalid visit record data", error });
    }
  });

  // Vaccinations
  app.get("/api/vaccinations", async (req, res) => {
    try {
      const vaccinations = await storage.getVaccinations();
      res.json(vaccinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vaccinations" });
    }
  });

  app.get("/api/vaccinations/overdue", async (req, res) => {
    try {
      const overdue = await storage.getOverdueVaccinations();
      res.json(overdue);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch overdue vaccinations" });
    }
  });

  app.get("/api/animals/:animalId/vaccinations", async (req, res) => {
    try {
      const vaccinations = await storage.getVaccinationsByAnimal(req.params.animalId);
      res.json(vaccinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vaccinations" });
    }
  });

  app.post("/api/vaccinations", async (req, res) => {
    try {
      const validatedData = insertVaccinationSchema.parse(req.body);
      const vaccination = await storage.createVaccination(validatedData);
      res.status(201).json(vaccination);
    } catch (error) {
      res.status(400).json({ message: "Invalid vaccination data", error });
    }
  });

  // Inventory
  app.get("/api/inventory", async (req, res) => {
    try {
      const inventory = await storage.getInventory();
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  app.get("/api/inventory/low-stock", async (req, res) => {
    try {
      const lowStock = await storage.getLowStockItems();
      res.json(lowStock);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch low stock items" });
    }
  });

  app.get("/api/inventory/expiring", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const expiring = await storage.getExpiringItems(days);
      res.json(expiring);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expiring items" });
    }
  });

  app.post("/api/inventory", async (req, res) => {
    try {
      const validatedData = insertInventorySchema.parse(req.body);
      const item = await storage.createInventoryItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid inventory data", error });
    }
  });

  app.put("/api/inventory/:id", async (req, res) => {
    try {
      const item = await storage.updateInventoryItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to update inventory item" });
    }
  });

  // Appointments
  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.get("/api/appointments/upcoming", async (req, res) => {
    try {
      const upcoming = await storage.getUpcomingAppointments();
      res.json(upcoming);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming appointments" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error) {
      res.status(400).json({ message: "Invalid appointment data", error });
    }
  });

  app.put("/api/appointments/:id", async (req, res) => {
    try {
      const appointment = await storage.updateAppointment(req.params.id, req.body);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });

  // Outbreaks
  app.get("/api/outbreaks", async (req, res) => {
    try {
      const outbreaks = await storage.getOutbreaks();
      res.json(outbreaks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch outbreaks" });
    }
  });

  app.get("/api/outbreaks/active", async (req, res) => {
    try {
      const active = await storage.getActiveOutbreaks();
      res.json(active);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active outbreaks" });
    }
  });

  app.post("/api/outbreaks", async (req, res) => {
    try {
      const validatedData = insertOutbreakSchema.parse(req.body);
      const outbreak = await storage.createOutbreak(validatedData);
      res.status(201).json(outbreak);
    } catch (error) {
      res.status(400).json({ message: "Invalid outbreak data", error });
    }
  });

  app.put("/api/outbreaks/:id", async (req, res) => {
    try {
      const outbreak = await storage.updateOutbreak(req.params.id, req.body);
      if (!outbreak) {
        return res.status(404).json({ message: "Outbreak not found" });
      }
      res.json(outbreak);
    } catch (error) {
      res.status(500).json({ message: "Failed to update outbreak" });
    }
  });

  // Analytics endpoints
  app.get("/api/analytics/dashboard", async (req, res) => {
    try {
      const animals = await storage.getAnimals();
      const appointments = await storage.getUpcomingAppointments();
      const lowStock = await storage.getLowStockItems();
      const activeOutbreaks = await storage.getActiveOutbreaks();
      const overdueVaccinations = await storage.getOverdueVaccinations();

      const stats = {
        totalAnimals: animals.length,
        upcomingAppointments: appointments.length,
        lowStockItems: lowStock.length,
        activeOutbreaks: activeOutbreaks.length,
        overdueVaccinations: overdueVaccinations.length,
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
