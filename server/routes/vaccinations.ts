import express, { Request, Response } from "express";
import { db } from "../db";
import { vaccinations } from "@shared/schema";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(vaccinations);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const [newVaccination] = await db
      .insert(vaccinations)
      .values({
        ...req.body,
        dateGiven: req.body.dateGiven ? new Date(req.body.dateGiven) : new Date(),
        nextDueDate: req.body.nextDueDate ? new Date(req.body.nextDueDate) : null,
      })
      .returning();
    res.json(newVaccination);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;