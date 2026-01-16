import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from "@shared/schema";
import { pool } from "./db"; // Import the pool instance created here

// REMOVED top-level initDatabase() call to fix "await" error

// Connection Pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });