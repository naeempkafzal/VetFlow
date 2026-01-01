import { pgTable, text, serial, integer, timestamp, boolean, decimal, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- Enums for Postgres ---
export const statusEnum = pgEnum("status", ["Healthy", "Sick", "Quarantined", "Treated", "Recovered"]);
export const severityEnum = pgEnum("severity", ["Low", "Moderate", "High", "Critical"]);
export const priorityEnum = pgEnum("priority", ["Low", "Medium", "High"]);

// --- Tables ---

export const animals = pgTable("animals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  species: text("species").notNull(),
  breed: text("breed"),
  gender: text("gender"),
  dateOfBirth: timestamp("date_of_birth"),
  weight: decimal("weight", { precision: 10, scale: 2 }),
  status: text("status").default("Healthy"),
  ownerId: integer("owner_id"),
  imageUrl: text("image_url"),
  tags: text("tags").array(),
  lastVaccinationDate: timestamp("last_vaccination_date"),
  isQuarantined: boolean("is_quarantined").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const visitRecords = pgTable("visit_records", {
  id: serial("id").primaryKey(),
  animalId: integer("animal_id").references(() => animals.id).notNull(),
  visitDate: timestamp("visit_date").defaultNow().notNull(),
  type: text("type").notNull(), 
  diagnosis: text("diagnosis").notNull(),
  treatment: text("treatment"),
  prescriptions: text("prescriptions"),
  notes: text("notes"),
  followUpRequired: boolean("follow_up_required").default(false),
  followUpDate: timestamp("follow_up_date"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  veterinarian: text("veterinarian"),
  location: text("location"),
});

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  itemName: text("item_name").notNull(),
  category: text("category").notNull(), 
  currentStock: integer("current_stock").notNull(),
  minStockLevel: integer("min_stock_level").notNull(),
  unit: text("unit").notNull(), 
  expiryDate: timestamp("expiry_date"),
  supplier: text("supplier"),
  sku: text("sku").unique(),
  lastRestocked: timestamp("last_restocked").defaultNow(),
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }),
  storageInstructions: text("storage_instructions"),
});

export const vaccinations = pgTable("vaccinations", {
  id: serial("id").primaryKey(),
  animalId: integer("animal_id").references(() => animals.id).notNull(),
  vaccineName: text("vaccine_name").notNull(),
  batchNumber: text("batch_number"),
  dateGiven: timestamp("date_given").defaultNow().notNull(),
  nextDueDate: timestamp("next_due_date").notNull(),
  administeredBy: text("administered_by"),
  dosage: text("dosage"),
  sideEffects: text("side_effects"),
  notes: text("notes"),
});

export const outbreaks = pgTable("outbreaks", {
  id: serial("id").primaryKey(),
  diseaseName: text("disease_name").notNull(),
  region: text("region").notNull(),
  severity: text("severity").notNull(), 
  status: text("status").notNull(), 
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  reportedCases: integer("reported_cases").default(1),
  confirmedCases: integer("confirmed_cases").default(0),
  affectedSpecies: text("affected_species").notNull(),
  containmentMeasures: text("containment_measures"),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  animalName: text("animal_name").notNull(),
  ownerName: text("owner_name").notNull(),
  contactNumber: text("contact_number"),
  email: text("email"),
  appointmentDate: timestamp("appointment_date").notNull(),
  durationMinutes: integer("duration_minutes").default(30),
  reason: text("reason").notNull(),
  status: text("status").default("Scheduled"), 
  priority: text("priority").default("Medium"), 
  notes: text("notes"),
});

// --- Zod Insert Schemas (For Validation) ---

export const insertAnimalSchema = createInsertSchema(animals, {
  dateOfBirth: z.coerce.date(),
  lastVaccinationDate: z.coerce.date().nullable(),
  weight: z.string().or(z.number()).optional(),
}).omit({ id: true, createdAt: true });

export const insertVisitSchema = createInsertSchema(visitRecords, {
  visitDate: z.coerce.date(),
  followUpDate: z.coerce.date().nullable(),
  cost: z.string().or(z.number()),
}).omit({ id: true });

export const insertInventorySchema = createInsertSchema(inventory, {
  expiryDate: z.coerce.date().nullable(),
  lastRestocked: z.coerce.date(),
  pricePerUnit: z.string().or(z.number()),
}).omit({ id: true });

export const insertVaccinationSchema = createInsertSchema(vaccinations, {
  dateGiven: z.coerce.date(),
  nextDueDate: z.coerce.date(),
}).omit({ id: true });

export const insertOutbreakSchema = createInsertSchema(outbreaks, {
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable(),
}).omit({ id: true });

export const insertAppointmentSchema = createInsertSchema(appointments, {
  appointmentDate: z.coerce.date(),
}).omit({ id: true });

// --- TypeScript Types (For the Frontend) ---

export type Animal = typeof animals.$inferSelect;
export type InsertAnimal = z.infer<typeof insertAnimalSchema>;

export type VisitRecord = typeof visitRecords.$inferSelect;
export type InsertVisit = z.infer<typeof insertVisitSchema>;

export type InventoryItem = typeof inventory.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;

export type Vaccination = typeof vaccinations.$inferSelect;
export type InsertVaccination = z.infer<typeof insertVaccinationSchema>;

export type Outbreak = typeof outbreaks.$inferSelect;
export type InsertOutbreak = z.infer<typeof insertOutbreakSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;