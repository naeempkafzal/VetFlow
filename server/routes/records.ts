// records.ts
import express, { Request, Response } from "express";
import Database from "better-sqlite3";

const router = express.Router();
const db = new Database("vet.db", { verbose: console.log });

db.exec(`
  CREATE TABLE IF NOT EXISTS animals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ownerName TEXT NOT NULL,
    species TEXT NOT NULL,
    breed TEXT,
    location TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    animalId INTEGER NOT NULL,
    symptoms TEXT,
    diagnosis TEXT NOT NULL,
    treatment TEXT,
    medications TEXT,
    notes TEXT,
    veterinarianName TEXT
  )
`);

router.get("/", (req: Request, res: Response) => {
  try {
    const rows = db.prepare("SELECT * FROM animals").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/", (req: Request, res: Response) => {
  const { name, ownerName, species, breed, location } = req.body;
  if (!name || !ownerName || !species) {
    return res
      .status(400)
      .json({ error: "Name, ownerName, and species are required" });
  }
  try {
    const info = db
      .prepare(
        "INSERT INTO animals (name, ownerName, species, breed, location) VALUES (?, ?, ?, ?, ?)",
      )
      .run(name, ownerName, species, breed, location);
    res.json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/visits", (req: Request, res: Response) => {
  const {
    animalId,
    symptoms,
    diagnosis,
    treatment,
    medications,
    notes,
    veterinarianName,
  } = req.body;
  if (!animalId || !diagnosis) {
    return res
      .status(400)
      .json({ error: "animalId and diagnosis are required" });
  }
  try {
    const info = db
      .prepare(
        "INSERT INTO visits (animalId, symptoms, diagnosis, treatment, medications, notes, veterinarianName) VALUES (?, ?, ?, ?, ?, ?, ?)",
      )
      .run(
        animalId,
        symptoms,
        diagnosis,
        treatment,
        medications,
        notes,
        veterinarianName,
      );
    res.json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
