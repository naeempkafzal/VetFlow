import { pgTable, integer, text, timestamp, boolean } from "drizzle-orm/pg-core";

// Users Table
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  role: text("role").default("staff").notNull(),
});

// Animals Table
export const animals = pgTable("animals", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  species: text("species").notNull(),
  breed: text("breed"),
  age: integer("age"),
  ownerName: text("owner_name").notNull(),
  ownerPhone: text("owner_phone"),
  medicalHistory: text("medical_history"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Appointments Table
export const appointments = pgTable("appointments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  animalId: integer("animal_id").references(() => animals.id),
  appointmentDate: timestamp("appointment_date").notNull(),
  reason: text("reason").notNull(),
  status: text("status").default("pending").notNull(),
  isBilingual: boolean("is_bilingual").default(false).notNull(),
});