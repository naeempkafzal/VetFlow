import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '../shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is missing. Ensure you have connected a database in Replit or set the environment variable."
  );
}

// The pool manages multiple connections to your Postgres DB
export const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// The db object is what you'll use in your routes (e.g., db.select().from(users))
export const db = drizzle(pool, { schema });