import express from "express";
import { db } from "../db";
import { appointments } from "@shared/schema";
import { asc } from "drizzle-orm";

const router = express.Router();

router.get("/", async (_req: any, res: any) => {
  try {
    const rows = await db
      .select()
      .from(appointments)
      .orderBy(asc(appointments.appointmentDate));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/", async (req: any, res: any) => {
  try {
    const body = req.body;
    const [newAppointment] = await db
      .insert(appointments)
      .values({
        ownerName: body.ownerName,
        reason: body.reason,
        animalId: body.animalId ? parseInt(body.animalId) : null,
        status: body.status || "scheduled",
        appointmentDate: body.appointmentDate ? new Date(body.appointmentDate) : new Date(),
      })
      .returning();
    res.json(newAppointment);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;