import express, { Request, Response } from "express";
import { db } from "../db";
import { animals, visitRecords } from "@shared/schema";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    if (req.baseUrl === "/api/visit-records") {
      const allVisits = await db.select().from(visitRecords);
      return res.json(allVisits);
    }
    const allAnimals = await db.select().from(animals);
    res.json(allAnimals);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const [newItem] = await db.insert(animals).values(req.body).returning();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/new-visit", async (req: Request, res: Response) => {
  try {
    const [newVisit] = await db.insert(visitRecords).values(req.body).returning();
    res.json(newVisit);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;