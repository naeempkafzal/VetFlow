import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Animals Table
export const animals = pgTable("animals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  species: text("species").notNull(), 
  breed: text("breed"),
  age: integer("age"),
  ownerName: text("owner_name").notNull(),
  ownerContact: text("owner_contact").notNull(),
});

// Medical Visits Table
export const visitRecords = pgTable("visit_records", {
  id: serial("id").primaryKey(),
  animalId: integer("animal_id").notNull(),
  visitDate: timestamp("visit_date").defaultNow().notNull(),
  diagnosis: text("diagnosis").notNull(),
  treatment: text("treatment").notNull(),
  notes: text("notes"),
});

// Inventory Table - Column names aligned with routes
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  itemName: text("item_name").notNull(),
  category: text("category").notNull(),
  currentStock: integer("current_stock").notNull().default(0), 
  unit: text("unit").notNull(),
  minStockLevel: integer("min_stock_level").notNull().default(5),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Vaccinations Table
export const vaccinations = pgTable("vaccinations", {
  id: serial("id").primaryKey(),
  animalId: integer("animal_id").notNull(),
  vaccineName: text("vaccine_name").notNull(),
  dateAdministered: timestamp("date_administered").defaultNow().notNull(),
  nextDueDate: timestamp("next_due_date"),
  administeredBy: text("administered_by"),
});

// Outbreaks Table
export const outbreaks = pgTable("outbreaks", {
  id: serial("id").primaryKey(),
  diseaseName: text("disease_name").notNull(),
  location: text("location").notNull(),
  status: text("status").notNull(), 
  reportedDate: timestamp("reported_date").defaultNow().notNull(),
  affectedCount: integer("affected_count").default(0),
});

// Appointments Table - Column names aligned with routes
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  animalId: integer("animal_id"),
  ownerName: text("owner_name").notNull(),
  appointmentDate: timestamp("appointment_date").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("scheduled"),
});

// Schemas
export const insertAnimalSchema = createInsertSchema(animals).omit({ id: true });
export const insertVisitSchema = createInsertSchema(visitRecords).omit({ id: true });
export const insertInventorySchema = createInsertSchema(inventory).omit({ id: true });
export const insertVaccinationSchema = createInsertSchema(vaccinations).omit({ id: true });
export const insertOutbreakSchema = createInsertSchema(outbreaks).omit({ id: true });
export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true });

// Types
export type Animal = typeof animals.$inferSelect;
export type VisitRecord = typeof visitRecords.$inferSelect;
export type InventoryItem = typeof inventory.$inferSelect;
export type Vaccination = typeof vaccinations.$inferSelect;
export type Outbreak = typeof outbreaks.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;