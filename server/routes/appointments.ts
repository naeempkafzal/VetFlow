import express, { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { appointments } from "@shared/schema";
import { asc, sql } from "drizzle-orm";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(appointments)
      .orderBy(asc(appointments.appointmentDate));

    res.json(rows);
  } catch (err) {
    (res as any).status(500).json({ error: (err as Error).message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body) return (res as any).status(400).json({ error: "No body provided" });

    const insertData = {
      ...body,
      appointmentDate: body.appointmentDate ? new Date(body.appointmentDate) : new Date(),
    };

    const [newAppointment] = await db
      .insert(appointments)
      .values(insertData)
      .returning();

    res.json(newAppointment);
  } catch (err) {
    (res as any).status(500).json({ error: (err as Error).message });
  }
});

export default router;