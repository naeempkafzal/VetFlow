import { 
  appointments, 
  inventory, 
  outbreaks, 
  visitRecords, 
  animals, 
  vaccinations
} from "@shared/schema";
import { db } from "./db";
import { eq, asc, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Animals
  getAnimals(): Promise<any[]>;
  getAnimal(id: number): Promise<any | undefined>;
  createAnimal(animal: any): Promise<any>;

  // Appointments
  getAppointments(): Promise<any[]>;
  createAppointment(appointment: any): Promise<any>;
  updateAppointmentStatus(id: number, status: string): Promise<any>;

  // Inventory
  getInventory(): Promise<any[]>;
  createInventoryItem(item: any): Promise<any>;
  updateInventoryStock(id: number, quantity: number): Promise<any>;

  // Visit Records
  getVisitRecords(animalId?: number): Promise<any[]>;
  createVisitRecord(record: any): Promise<any>;

  // Vaccinations
  getVaccinations(animalId?: number): Promise<any[]>;
  createVaccination(vaccination: any): Promise<any>;

  // Outbreaks
  getOutbreaks(): Promise<any[]>;
  createOutbreak(outbreak: any): Promise<any>;
  updateOutbreakStatus(id: number, status: string): Promise<any>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // Animal Methods
  async getAnimals(): Promise<any[]> {
    return await db.select().from(animals).orderBy(asc(animals.name));
  }

  async getAnimal(id: number): Promise<any | undefined> {
    const [animal] = await db.select().from(animals).where(eq(animals.id, id));
    return animal;
  }

  async createAnimal(insertAnimal: any): Promise<any> {
    const [animal] = await db.insert(animals).values(insertAnimal).returning();
    return animal;
  }

  // Appointment Methods
  async getAppointments(): Promise<any[]> {
    return await db.select().from(appointments).orderBy(desc(appointments.appointmentDate));
  }

  async createAppointment(insert: any): Promise<any> {
    const [app] = await db.insert(appointments).values(insert).returning();
    return app;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<any> {
    const [app] = await db.update(appointments).set({ status }).where(eq(appointments.id, id)).returning();
    return app;
  }

  // Inventory Methods
  async getInventory(): Promise<any[]> {
    return await db.select().from(inventory).orderBy(asc(inventory.itemName));
  }

  async createInventoryItem(item: any): Promise<any> {
    const [newItem] = await db.insert(inventory).values(item).returning();
    return newItem;
  }

  async updateInventoryStock(id: number, quantity: number): Promise<any> {
    // FIX: Reverted to 'currentStock' to match Drizzle Schema
    // Removed 'lastUpdated' as it likely doesn't exist in schema
    const [item] = await db.update(inventory).set({ currentStock: quantity }).where(eq(inventory.id, id)).returning();
    return item;
  }

  // Visit Record Methods
  async getVisitRecords(animalId?: number): Promise<any[]> {
    if (animalId) {
      return await db.select().from(visitRecords).where(eq(visitRecords.animalId, animalId)).orderBy(desc(visitRecords.visitDate));
    }
    return await db.select().from(visitRecords).orderBy(desc(visitRecords.visitDate));
  }

  async createVisitRecord(insert: any): Promise<any> {
    const [rec] = await db.insert(visitRecords).values(insert).returning();
    return rec;
  }

  // Vaccination Methods
  async getVaccinations(animalId?: number): Promise<any[]> {
    if (animalId) {
      return await db.select().from(vaccinations).where(eq(vaccinations.animalId, animalId)).orderBy(desc(vaccinations.dateAdministered));
    }
    return await db.select().from(vaccinations).orderBy(desc(vaccinations.dateAdministered));
  }

  async createVaccination(insert: any): Promise<any> {
    const [vax] = await db.insert(vaccinations).values(insert).returning();
    return vax;
  }

  // Outbreak Methods
  async getOutbreaks(): Promise<any[]> {
    return await db.select().from(outbreaks).orderBy(desc(outbreaks.id));
  }

  async createOutbreak(insert: any): Promise<any> {
    const [out] = await db.insert(outbreaks).values(insert).returning();
    return out;
  }

  async updateOutbreakStatus(id: number, status: string): Promise<any> {
    const [out] = await db.update(outbreaks).set({ status }).where(eq(outbreaks.id, id)).returning();
    return out;
  }

  // Logic to satisfy interface if users aren't implemented
  async getUser(id: number): Promise<any> { return undefined; }
  async getUserByUsername(u: string): Promise<any> { return undefined; }
  async createUser(u: any): Promise<any> { return {} as any; }
}

export const storage = new DatabaseStorage();