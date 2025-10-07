// vaccinations.ts
import express, { Request, Response } from "express";
import Database from "better-sqlite3";

const router = express.Router();
const db = new Database("vet.db", { verbose: console.log });

db.exec(`
  CREATE TABLE IF NOT EXISTS vaccinations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    animalId INTEGER NOT NULL,
    vaccineType TEXT NOT NULL,
    dueDate TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending'
  )
`);

router.get("/", (req: Request, res: Response) => {
  try {
    const rows = db.prepare("SELECT * FROM vaccinations").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/", (req: Request, res: Response) => {
  const { animalId, vaccineType, dueDate, status } = req.body;
  if (!animalId || !vaccineType || !dueDate) {
    return res
      .status(400)
      .json({ error: "animalId, vaccineType, and dueDate are required" });
  }
  try {
    const info = db
      .prepare(
        "INSERT INTO vaccinations (animalId, vaccineType, dueDate, status) VALUES (?, ?, ?, ?)",
      )
      .run(animalId, vaccineType, dueDate, status || "Pending");
    res.json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
