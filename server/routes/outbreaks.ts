import express, { Request, Response } from "express";
import { db } from "../db";
import { outbreaks } from "@shared/schema";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(outbreaks);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const [newOutbreak] = await db.insert(outbreaks).values(req.body).returning();
    res.json(newOutbreak);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;