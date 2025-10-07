// outbreaks.ts
import express, { Request, Response } from "express";
import Database from "better-sqlite3";

const router = express.Router();
const db = new Database("vet.db", { verbose: console.log });

db.exec(`
  CREATE TABLE IF NOT EXISTS outbreaks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    disease TEXT NOT NULL,
    geoCoordinates TEXT NOT NULL,
    province TEXT NOT NULL,
    advisory TEXT
  )
`);

router.get("/", (req: Request, res: Response) => {
  try {
    const rows = db.prepare("SELECT * FROM outbreaks").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/", (req: Request, res: Response) => {
  const { disease, geoCoordinates, province, advisory } = req.body;
  if (!disease || !geoCoordinates || !province) {
    return res
      .status(400)
      .json({ error: "disease, geoCoordinates, and province are required" });
  }
  try {
    const info = db
      .prepare(
        "INSERT INTO outbreaks (disease, geoCoordinates, province, advisory) VALUES (?, ?, ?, ?)",
      )
      .run(disease, geoCoordinates, province, advisory);
    res.json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
