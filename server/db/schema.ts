import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const appointments = sqliteTable("appointments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  animalId: integer("animalId").notNull(),
  ownerName: text("ownerName").notNull(),
  dateTime: text("dateTime").notNull(), // Consider using a date type if supported
  reason: text("reason").notNull(),
  status: text("status").notNull().default("Scheduled"),
});

export const animals = sqliteTable("animals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  ownerName: text("ownerName").notNull(),
  species: text("species").notNull(),
});
