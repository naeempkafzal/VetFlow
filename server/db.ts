import Database from "better-sqlite3";

const db = new Database("vet.db");

// Initialize tables
db.prepare(
  "CREATE TABLE IF NOT EXISTS animals (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, ownerName TEXT, species TEXT, breed TEXT, location TEXT)",
).run();

db.prepare(
  "CREATE TABLE IF NOT EXISTS visits (id INTEGER PRIMARY KEY AUTOINCREMENT, animalId INTEGER, symptoms TEXT, diagnosis TEXT, treatment TEXT, medications TEXT, notes TEXT, veterinarianName TEXT)",
).run();

db.prepare(
  "CREATE TABLE IF NOT EXISTS vaccinations (id INTEGER PRIMARY KEY AUTOINCREMENT, animalId INTEGER, vaccineType TEXT, dueDate TEXT, status TEXT)",
).run();

db.prepare(
  "CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY AUTOINCREMENT, itemName TEXT, quantity INTEGER, cost REAL, lowStockThreshold INTEGER)",
).run();

db.prepare(
  "CREATE TABLE IF NOT EXISTS appointments (id INTEGER PRIMARY KEY AUTOINCREMENT, animalId INTEGER, ownerName TEXT, dateTime TEXT, reason TEXT)",
).run();

db.prepare(
  "CREATE TABLE IF NOT EXISTS outbreaks (id INTEGER PRIMARY KEY AUTOINCREMENT, disease TEXT, geoCoordinates TEXT, province TEXT, advisory TEXT)",
).run();

db.close();

console.log("Database initialized successfully");
