import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../shared/schema'; // Update this import path
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });