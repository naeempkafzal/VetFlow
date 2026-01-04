import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Database table for Animals
export const animals = pgTable("animals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  species: text("species").notNull(), // cow, buffalo, goat, etc.
  breed: text("breed"),
  age: integer("age"),
  ownerName: text("owner_name").notNull(),
  ownerContact: text("owner_contact").notNull(),
});

// Database table for Medical Visits
export const visitRecords = pgTable("visit_records", {
  id: serial("id").primaryKey(),
  animalId: integer("animal_id").notNull(),
  visitDate: timestamp("visit_date").defaultNow().notNull(),
  diagnosis: text("diagnosis").notNull(),
  treatment: text("treatment").notNull(),
  notes: text("notes"),
});

// Schemas for inserting data
export const insertAnimalSchema = createInsertSchema(animals).omit({ id: true });
export const insertVisitSchema = createInsertSchema(visitRecords).omit({ id: true });

// Exported Types for use in the frontend
export type Animal = typeof animals.$inferSelect;
export type InsertAnimal = z.infer<typeof insertAnimalSchema>;
export type VisitRecord = typeof visitRecords.$inferSelect;
export type InsertVisit = z.infer<typeof insertVisitSchema>;