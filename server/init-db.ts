import { db, pool } from "./db";

export async function initDatabase() {
  console.log("🔧 Initializing Database Schema...");
  const client = await pool.connect();

  try {
    // 1. Session Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL,
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL
      );
    `);

    // 2. Vaccinations
    await client.query(`
      CREATE TABLE IF NOT EXISTS "vaccinations" (
        "id" SERIAL PRIMARY KEY,
        "animal_id" INTEGER NOT NULL,
        "vaccine_name" VARCHAR(255) NOT NULL,
        "date_administered" TIMESTAMP NOT NULL,
        "next_due_date" TIMESTAMP,
        "administered_by" VARCHAR(255)
      );
    `);

    // 3. Appointments
    await client.query(`
      CREATE TABLE IF NOT EXISTS "appointments" (
        "id" SERIAL PRIMARY KEY,
        "owner_name" VARCHAR(255),
        "reason" TEXT,
        "animal_id" INTEGER,
        "status" VARCHAR(50) DEFAULT 'scheduled',
        "appointment_date" TIMESTAMP NOT NULL
      );
    `);

    // 4. Inventory
    await client.query(`
      CREATE TABLE IF NOT EXISTS "inventory" (
        "id" SERIAL PRIMARY KEY,
        "item_name" VARCHAR(255) NOT NULL,
        "quantity" INTEGER NOT NULL DEFAULT 0,
        "cost" NUMERIC(10, 2) NOT NULL DEFAULT 0,
        "low_stock_threshold" INTEGER NOT NULL DEFAULT 10
      );
    `);

    // 5. Outbreaks
    await client.query(`
      CREATE TABLE IF NOT EXISTS "outbreaks" (
        "id" SERIAL PRIMARY KEY,
        "disease" VARCHAR(255) NOT NULL,
        "geo_coordinates" VARCHAR(255),
        "province" VARCHAR(255),
        "advisory" TEXT,
        "status" VARCHAR(50) DEFAULT 'active'
      );
    `);

    // 6. Animals
    await client.query(`
      CREATE TABLE IF NOT EXISTS "animals" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "owner_name" VARCHAR(255),
        "species" VARCHAR(255),
        "breed" VARCHAR(255),
        "location" VARCHAR(255)
      );
    `);

    // 7. Visit Records
    await client.query(`
      CREATE TABLE IF NOT EXISTS "visit_records" (
        "id" SERIAL PRIMARY KEY,
        "animal_id" INTEGER NOT NULL,
        "symptoms" TEXT,
        "diagnosis" TEXT,
        "treatment" TEXT,
        "medications" TEXT,
        "notes" TEXT,
        "veterinarian_name" VARCHAR(255),
        "visit_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Database tables checked/created.");
  } catch (error) {
    console.error("❌ Database Init Failed:", error);
  } finally {
    client.release();
  }
}