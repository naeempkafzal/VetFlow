// schema.ts
import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  real,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const animals = pgTable("animals", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  species: text("species").notNull(), // cow, buffalo, goat, dog, cat
  breed: text("breed"),
  age: integer("age"),
  weight: real("weight"),
  gender: text("gender"),
  ownerName: text("owner_name").notNull(),
  ownerPhone: text("owner_phone"),
  ownerAddress: text("owner_address"),
  location: text("location"), // province/city
  registrationDate: timestamp("registration_date").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const visitRecords = pgTable("visit_records", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  animalId: varchar("animal_id")
    .references(() => animals.id)
    .notNull(),
  visitDate: timestamp("visit_date").defaultNow(),
  symptoms: text("symptoms"),
  diagnosis: text("diagnosis"),
  treatment: text("treatment"),
  medications: text("medications"), // JSON string
  cost: real("cost"),
  notes: text("notes"),
  veterinarianName: text("veterinarian_name"),
});

export const vaccinations = pgTable("vaccinations", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  animalId: varchar("animal_id")
    .references(() => animals.id)
    .notNull(),
  vaccineName: text("vaccine_name").notNull(),
  vaccineNameUrdu: text("vaccine_name_urdu"),
  dateGiven: timestamp("date_given").notNull(),
  nextDueDate: timestamp("next_due_date"),
  batchNumber: text("batch_number"),
  cost: real("cost"),
  veterinarianName: text("veterinarian_name"),
});

export const inventory = pgTable("inventory", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  itemName: text("item_name").notNull(),
  itemNameUrdu: text("item_name_urdu"),
  category: text("category").notNull(), // vaccine, medicine, equipment
  currentStock: integer("current_stock").notNull(),
  minStockLevel: integer("min_stock_level").notNull(),
  unit: text("unit").notNull(), // vials, tablets, ml, etc
  costPerUnit: real("cost_per_unit"),
  supplier: text("supplier"),
  expiryDate: timestamp("expiry_date"),
  lastRestocked: timestamp("last_restocked").defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  animalId: varchar("animal_id").references(() => animals.id),
  ownerName: text("owner_name").notNull(),
  ownerPhone: text("owner_phone").notNull(),
  appointmentDate: timestamp("appointment_date").notNull(),
  purpose: text("purpose").notNull(),
  status: text("status").default("scheduled"), // scheduled, completed, cancelled
  notes: text("notes"),
  reminderSent: boolean("reminder_sent").default(false),
});

export const outbreaks = pgTable("outbreaks", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  diseaseName: text("disease_name").notNull(),
  diseaseNameUrdu: text("disease_name_urdu"),
  location: text("location").notNull(),
  province: text("province").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  affectedAnimals: integer("affected_animals").notNull(),
  species: text("species").notNull(),
  reportDate: timestamp("report_date").defaultNow(),
  reportedBy: text("reported_by").notNull(),
  severity: text("severity").notNull(), // low, medium, high, critical
  status: text("status").default("active"), // active, contained, resolved
  biosafetyMeasures: text("biosafety_measures"),
});

// Insert schemas
export const insertAnimalSchema = createInsertSchema(animals, {
  age: z.number().optional(),
  weight: z.number().optional(),
  breed: z.string().optional(),
  gender: z.string().optional(),
  ownerPhone: z.string().optional(),
  ownerAddress: z.string().optional(),
  location: z.string().optional(),
}).omit({
  id: true,
  registrationDate: true,
});

export const insertVisitRecordSchema = createInsertSchema(visitRecords, {
  symptoms: z.string().optional(),
  treatment: z.string().optional(),
  medications: z.string().optional(),
  cost: z.number().optional(),
  notes: z.string().optional(),
  veterinarianName: z.string().optional(),
}).omit({
  id: true,
  visitDate: true,
});

export const insertVaccinationSchema = createInsertSchema(vaccinations, {
  vaccineNameUrdu: z.string().optional(),
  nextDueDate: z.date().optional(),
  batchNumber: z.string().optional(),
  cost: z.number().optional(),
  veterinarianName: z.string().optional(),
}).omit({
  id: true,
});

export const insertInventorySchema = createInsertSchema(inventory, {
  itemNameUrdu: z.string().optional(),
  costPerUnit: z.number().optional(),
  supplier: z.string().optional(),
  expiryDate: z.date().optional(),
}).omit({
  id: true,
  lastRestocked: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments, {
  animalId: z.string().optional(),
  notes: z.string().optional(),
  status: z.string().optional(),
  reminderSent: z.boolean().optional(),
}).omit({
  id: true,
});

export const insertOutbreakSchema = createInsertSchema(outbreaks, {
  diseaseNameUrdu: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  biosafetyMeasures: z.string().optional(),
}).omit({
  id: true,
  reportDate: true,
});

// Types
export type Animal = typeof animals.$inferSelect;
export type InsertAnimal = z.infer<typeof insertAnimalSchema>;
export type VisitRecord = typeof visitRecords.$inferSelect;
export type InsertVisitRecord = z.infer<typeof insertVisitRecordSchema>;
export type Vaccination = typeof vaccinations.$inferSelect;
export type InsertVaccination = z.infer<typeof insertVaccinationSchema>;
export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Outbreak = typeof outbreaks.$inferSelect;
export type InsertOutbreak = z.infer<typeof insertOutbreakSchema>;
