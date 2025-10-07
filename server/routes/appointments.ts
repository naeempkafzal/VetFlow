import express, { Request, Response } from "express"; // Added explicit types
import Database from "better-sqlite3";
import { appointments } from "../../shared/schema"; // Adjusted import path

const router = express.Router();
const db = new Database("vet.db", { verbose: console.log }); // Added verbose for debugging

// Ensure the appointments table exists (optional, adjust if using migrations)
db.exec(`
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    animalId INTEGER NOT NULL,
    ownerName TEXT NOT NULL,
    dateTime TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Scheduled'
  )
`);

router.get("/", (req: Request, res: Response) => {
  try {
    const rows = db
      .prepare("SELECT * FROM appointments ORDER BY dateTime")
      .all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/", (req: Request, res: Response) => {
  const { animalId, ownerName, dateTime, reason, status } = req.body;
  if (!animalId || !ownerName || !dateTime || !reason) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const info = db
      .prepare(
        "INSERT INTO appointments (animalId, ownerName, dateTime, reason, status) VALUES (?, ?, ?, ?, ?)",
      )
      .run(animalId, ownerName, dateTime, reason, status || "Scheduled");
    res.json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
