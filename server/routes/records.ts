import express from "express";
import { storage } from "../storage";
import { insertAnimalSchema, insertVisitSchema } from "@shared/schema";

const router = express.Router();

// Get all animals or visit records based on path
router.get("/", async (req: any, res: any) => {
  try {
    if (req.originalUrl.includes("visit-records")) {
      const records = await storage.getVisitRecords();
      return res.json(records);
    }
    const animals = await storage.getAnimals();
    res.json(animals);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/", async (req: any, res: any) => {
  try {
    if (req.originalUrl.includes("visit-records")) {
      const data = insertVisitSchema.parse(req.body);
      const record = await storage.createVisitRecord(data);
      return res.json(record);
    }
    const data = insertAnimalSchema.parse(req.body);
    const animal = await storage.createAnimal(data);
    res.json(animal);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

export default router;