import express from "express";
import { db } from "../db";
import { vaccinations } from "@shared/schema";

const router = express.Router();

router.get("/", async (_req: any, res: any) => {
  try {
    const rows = await db.select().from(vaccinations);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/", async (req: any, res: any) => {
  try {
    const body = req.body;
    const [newVaccination] = await db
      .insert(vaccinations)
      .values({
        animalId: parseInt(body.animalId),
        vaccineName: body.vaccineName,
        dateAdministered: body.dateGiven ? new Date(body.dateGiven) : new Date(),
        nextDueDate: body.nextDueDate ? new Date(body.nextDueDate) : null,
        administeredBy: body.administeredBy || null
      })
      .returning();
    res.json(newVaccination);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;