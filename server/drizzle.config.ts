// server/drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts", // Updated to point to the db subfolder
  out: "./drizzle", // Migration output folder
  dialect: "sqlite", // Use SQLite
  dbCredentials: {
    url: "./vet.db", // Path to your local database
  },
});
