import { pgTable, text, serial, integer, timestamp, boolean, numeric, index } from "drizzle-orm/pg-core";
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

// Inventory Table (Updated with Stock Logic Fields)
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  itemName: text("item_name").notNull(),
  category: text("category"),
  currentStock: integer("current_stock").notNull().default(0), 
  unit: text("unit").notNull(),
  minStockLevel: integer("min_stock_level").notNull().default(5),
  lastUpdated: timestamp("last_updated").defaultNow(),
  // Keeping existing fields for compatibility
  cost: numeric("cost", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(0), 
  lowStockThreshold: integer("low_stock_threshold").notNull().default(10),
  initialStock: integer("initial_stock").default(0) // For AI Forecasting
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

// Appointments Table
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  animalId: integer("animal_id"),
  ownerName: text("owner_name").notNull(),
  appointmentDate: timestamp("appointment_date").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("scheduled"),
});

// NEW: Billings Table
export const billings = pgTable("billings", {
  id: serial("id").primaryKey(),
  visitId: integer("visit_id").notNull().references(() => visitRecords.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
});

// NEW: Notifications Table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'vaccine', 'appointment', 'stock'
  title: text("title").notNull(),
  message: text("message"),
  targetDate: timestamp("target_date").notNull(),
  isRead: boolean("is_read").default(false),
});

// Schemas
export const insertAnimalSchema = createInsertSchema(animals).omit({ id: true });
export const insertVisitSchema = createInsertSchema(visitRecords).omit({ id: true });
export const insertInventorySchema = createInsertSchema(inventory).omit({ id: true });
export const insertVaccinationSchema = createInsertSchema(vaccinations).omit({ id: true });
export const insertOutbreakSchema = createInsertSchema(outbreaks).omit({ id: true });
export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true });

// NEW Schemas for Automation
export const insertBillingsSchema = createInsertSchema(billings).omit({ id: true });
export const insertNotificationsSchema = createInsertSchema(notifications);

// Types
export type Animal = typeof animals.$inferSelect;
export type VisitRecord = typeof visitRecords.$inferSelect;
export type InventoryItem = typeof inventory.$inferSelect;
export type Vaccination = typeof vaccinations.$inferSelect;
export type Outbreak = typeof outbreaks.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type Billing = typeof billings.$inferSelect;
export type Notification = typeof notifications.$inferSelect;