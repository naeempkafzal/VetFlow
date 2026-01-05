import express from "express";
import { storage } from "../storage";
import { insertOutbreakSchema } from "@shared/schema";

const router = express.Router();

router.get("/", async (_req: any, res: any) => {
  try {
    const outbreaks = await storage.getOutbreaks();
    res.json(outbreaks);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/", async (req: any, res: any) => {
  try {
    const data = insertOutbreakSchema.parse(req.body);
    const outbreak = await storage.createOutbreak(data);
    res.json(outbreak);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

router.patch("/:id/status", async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const outbreak = await storage.updateOutbreakStatus(id, status);
    res.json(outbreak);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

export default router;