import express from "express";
import { storage } from "../storage";
import { insertInventorySchema } from "@shared/schema";

const router = express.Router();

router.get("/", async (_req: any, res: any) => {
  try {
    const items = await storage.getInventory();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/", async (req: any, res: any) => {
  try {
    const data = insertInventorySchema.parse(req.body);
    const item = await storage.createInventoryItem(data);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

router.patch("/:id/stock", async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    const { quantity } = req.body;
    const item = await storage.updateInventoryStock(id, quantity);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

export default router;