import express, { Request, Response } from "express"; // Added explicit types
import Database from "better-sqlite3";

const router = express.Router();
const db = new Database("vet.db", { verbose: console.log }); // Added verbose for debugging

// Ensure the inventory table exists (optional, adjust if using migrations)
db.exec(`
  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    itemName TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    cost REAL NOT NULL,
    lowStockThreshold INTEGER NOT NULL DEFAULT 10
  )
`);

router.get("/", (req: Request, res: Response) => {
  try {
    const rows = db.prepare("SELECT * FROM inventory").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get("/low-stock", (req: Request, res: Response) => {
  try {
    const rows = db
      .prepare("SELECT * FROM inventory WHERE quantity < lowStockThreshold")
      .all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/", (req: Request, res: Response) => {
  const { itemName, quantity, cost, lowStockThreshold } = req.body;
  if (!itemName || !quantity || !cost) {
    return res
      .status(400)
      .json({ error: "itemName, quantity, and cost are required" });
  }
  try {
    const info = db
      .prepare(
        "INSERT INTO inventory (itemName, quantity, cost, lowStockThreshold) VALUES (?, ?, ?, ?)",
      )
      .run(itemName, quantity, cost, lowStockThreshold || 10);
    res.json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
