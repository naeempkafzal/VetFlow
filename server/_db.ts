import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from "../shared/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

// --- 1. SINGLETON EXPORTS (For Routes) ---
// We expose the raw pool instance explicitly for your automation and init scripts.
export const pool = new Pool({
  connectionString,
});

// --- 2. DRIZZLE ORM INSTANCE (For Standard Routes) ---
// This is the 'db' used in your main app.
export const db = drizzle(pool, { schema });

// --- 3. TYPE EXPORTS (Optional, but good practice) ---
export type Animal = typeof schema.animals.$inferSelect;
export type InventoryItem = typeof schema.inventory.$inferSelect;
export type VisitRecord = typeof schema.visitRecords.$inferSelect;
export type Vaccination = typeof schema.vaccinations.$inferSelect;
export type Outbreak = typeof schema.outbreaks.$inferSelect;
export type Appointment = typeof schema.appointments.$inferSelect;