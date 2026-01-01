import express, { Request, Response } from "express";
import { db } from "../db";
import { appointments } from "@shared/schema";
import { asc } from "drizzle-orm";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
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

router.post("/", async (req: Request, res: Response) => {
  try {
    const [newAppointment] = await db
      .insert(appointments)
      .values({
        ...req.body,
        appointmentDate: req.body.appointmentDate ? new Date(req.body.appointmentDate) : new Date(),
      })
      .returning();
    res.json(newAppointment);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;