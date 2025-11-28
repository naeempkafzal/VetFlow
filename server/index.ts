import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { MemStorage } from "./storage";
import {
  insertAnimalSchema,
  insertVisitRecordSchema,
  insertVaccinationSchema,
  insertInventorySchema,
  insertAppointmentSchema,
  insertOutbreakSchema,
} from "../shared/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const storage = new MemStorage();

function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse).substring(0, 80)}${
          JSON.stringify(capturedJsonResponse).length > 80 ? "…" : ""
        }`;
      }
      log(logLine);
    }
  });

  next();
});

app.get("/api/animals", async (_req, res) => {
  const animals = await storage.getAnimals();
  res.json(animals);
});

app.get("/api/animals/:id", async (req, res) => {
  const animal = await storage.getAnimal(req.params.id);
  if (!animal) return res.status(404).json({ error: "Animal not found" });
  res.json(animal);
});

app.post("/api/animals", async (req, res) => {
  try {
    const parsed = insertAnimalSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }
    const animal = await storage.createAnimal(parsed.data);
    res.status(201).json(animal);
  } catch (error) {
    res.status(500).json({ error: "Failed to create animal" });
  }
});

app.get("/api/visit-records", async (_req, res) => {
  const records = await storage.getVisitRecords();
  res.json(records);
});

app.get("/api/visit-records/:animalId", async (req, res) => {
  const records = await storage.getVisitRecordsByAnimal(req.params.animalId);
  res.json(records);
});

app.post("/api/visit-records", async (req, res) => {
  try {
    const parsed = insertVisitRecordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }
    const record = await storage.createVisitRecord(parsed.data);
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: "Failed to create visit record" });
  }
});

app.get("/api/vaccinations", async (_req, res) => {
  const vaccinations = await storage.getVaccinations();
  res.json(vaccinations);
});

app.get("/api/vaccinations/overdue", async (_req, res) => {
  const vaccinations = await storage.getOverdueVaccinations();
  res.json(vaccinations);
});

app.post("/api/vaccinations", async (req, res) => {
  try {
    const parsed = insertVaccinationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }
    const vaccination = await storage.createVaccination(parsed.data);
    res.status(201).json(vaccination);
  } catch (error) {
    res.status(500).json({ error: "Failed to create vaccination" });
  }
});

app.get("/api/inventory", async (_req, res) => {
  const items = await storage.getInventory();
  res.json(items);
});

app.get("/api/inventory/low-stock", async (_req, res) => {
  const items = await storage.getLowStockItems();
  res.json(items);
});

app.get("/api/inventory/expiring", async (req, res) => {
  const days = parseInt(req.query.days as string) || 30;
  const items = await storage.getExpiringItems(days);
  res.json(items);
});

app.post("/api/inventory", async (req, res) => {
  try {
    const parsed = insertInventorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }
    const item = await storage.createInventoryItem(parsed.data);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to create inventory item" });
  }
});

app.patch("/api/inventory/:id", async (req, res) => {
  try {
    const item = await storage.updateInventoryItem(req.params.id, req.body);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to update inventory item" });
  }
});

app.get("/api/appointments", async (_req, res) => {
  const appointments = await storage.getAppointments();
  res.json(appointments);
});

app.get("/api/appointments/upcoming", async (_req, res) => {
  const appointments = await storage.getUpcomingAppointments();
  res.json(appointments);
});

app.post("/api/appointments", async (req, res) => {
  try {
    const parsed = insertAppointmentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }
    const appointment = await storage.createAppointment(parsed.data);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create appointment" });
  }
});

app.patch("/api/appointments/:id", async (req, res) => {
  try {
    const appointment = await storage.updateAppointment(req.params.id, req.body);
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to update appointment" });
  }
});

app.get("/api/outbreaks", async (_req, res) => {
  const outbreaks = await storage.getOutbreaks();
  res.json(outbreaks);
});

app.get("/api/outbreaks/active", async (_req, res) => {
  const outbreaks = await storage.getActiveOutbreaks();
  res.json(outbreaks);
});

app.post("/api/outbreaks", async (req, res) => {
  try {
    const parsed = insertOutbreakSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }
    const outbreak = await storage.createOutbreak(parsed.data);
    res.status(201).json(outbreak);
  } catch (error) {
    res.status(500).json({ error: "Failed to create outbreak" });
  }
});

app.patch("/api/outbreaks/:id", async (req, res) => {
  try {
    const outbreak = await storage.updateOutbreak(req.params.id, req.body);
    if (!outbreak) return res.status(404).json({ error: "Outbreak not found" });
    res.json(outbreak);
  } catch (error) {
    res.status(500).json({ error: "Failed to update outbreak" });
  }
});

app.get("/api/analytics/dashboard", async (_req, res) => {
  try {
    const [animals, vaccinations, inventory, appointments, outbreaks] = await Promise.all([
      storage.getAnimals(),
      storage.getOverdueVaccinations(),
      storage.getLowStockItems(),
      storage.getUpcomingAppointments(),
      storage.getActiveOutbreaks(),
    ]);

    res.json({
      totalAnimals: animals.length,
      upcomingAppointments: appointments.length,
      overdueVaccinations: vaccinations.length,
      lowStockItems: inventory.length,
      activeOutbreaks: outbreaks.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

const server = createServer(app);

(async () => {
  if (process.env.NODE_ENV === "development") {
    const vite = await createViteServer({
      configFile: path.resolve(__dirname, "..", "vite.config.ts"),
      server: {
        middlewareMode: true,
        hmr: { server },
        allowedHosts: true as const,
      },
      appType: "custom",
    });

    app.use(vite.middlewares);
    
    app.use("/{*any}", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const clientTemplate = path.resolve(__dirname, "..", "client", "index.html");
        if (!fs.existsSync(clientTemplate)) {
          throw new Error(`Template file not found: ${clientTemplate}`);
        }
        let template = await fs.promises.readFile(clientTemplate, "utf-8");
        template = template.replace(
          `src="/client/src/main.tsx"`,
          `src="/client/src/main.tsx?v=${Date.now()}"`,
        );
        const page = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(page);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, "public");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.use("/{*any}", (_req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
      });
    }
  }

  const port = 5000;
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
