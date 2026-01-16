import express from "express";
import { db } from "../db";
import { vaccinations } from "@shared/schema";

const router = express.Router();

router.get("/", async (_req: any, res: any) => {
  try {
    const rows = await db.select().from(vaccinations);
    res.json(rows);
  } catch (err) {
    console.error("GET /vaccinations ERROR:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/", async (req: any, res: any, next: any) => {
  try {
    const body = req.body;
    
    console.log("📥 Incoming Body:", body);

    // Validation
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: "Request body is missing." });
    }

    const animalId = parseInt(body.animalId);
    if (isNaN(animalId)) {
      return res.status(400).json({ error: "Invalid Animal ID." });
    }

    // STRICT: Expecting Backend field names
    const [newVaccination] = await db
      .insert(vaccinations)
      .values({
        animalId: animalId,
        vaccineName: body.vaccineName, // Must match backend schema
        dateAdministered: body.dateAdministered ? new Date(body.dateAdministered) : new Date(),
        nextDueDate: body.nextDueDate ? new Date(body.nextDueDate) : null, // Must match backend schema
        administeredBy: body.administeredBy || null
      })
      .returning();
      
    console.log("✅ Saved:", newVaccination);
    res.json(newVaccination);
  } catch (err) {
    console.error("💥 POST /vaccinations FAILED:", err);
    next(err);
  }
});

export default router;