import express, { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { inventory } from "@shared/schema";
import { sql } from "drizzle-orm";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(inventory);
    res.json(rows);
  } catch (err) {
    (res as any).status(500).json({ error: (err as Error).message });
  }
});

router.get("/low-stock", async (_req: Request, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(inventory)
      .where(sql`${inventory.currentStock} < ${inventory.minStockLevel}`);
    res.json(rows);
  } catch (err) {
    (res as any).status(500).json({ error: (err as Error).message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const [newItem] = await db.insert(inventory).values(req.body).returning();
    res.json(newItem);
  } catch (err) {
    (res as any).status(500).json({ error: (err as Error).message });
  }
});

export default router;