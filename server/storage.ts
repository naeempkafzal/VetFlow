import { 
  appointments, 
  inventory, 
  outbreaks, 
  visitRecords, 
  animals, 
  vaccinations,
  billings, // NEW
  notifications // NEW
} from "@shared/schema";
import { db } from "./db";
import { eq, asc, desc, sql, gte } from "drizzle-orm";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getAnimals(): Promise<any[]>;
  getAnimal(id: number): Promise<any | undefined>;
  createAnimal(animal: any): Promise<any>;

  getAppointments(): Promise<any[]>;
  createAppointment(appointment: any): Promise<any>;
  updateAppointmentStatus(id: number, status: string): Promise<any>;

  getInventory(): Promise<any[]>;
  createInventoryItem(item: any): Promise<any>;
  updateInventoryStock(id: number, quantity: number): Promise<any>;

  getVisitRecords(animalId?: number): Promise<any[]>;
  createVisitRecord(record: any): Promise<any>;

  getVaccinations(animalId?: number): Promise<any[]>;
  createVaccination(vaccination: any): Promise<any>;

  getOutbreaks(): Promise<any[]>;
  createOutbreak(outbreak: any): Promise<any>;
  updateOutbreakStatus(id: number, status: string): Promise<any>;

  // NEW: Automation & Billing Methods
  createBilling(billing: any): Promise<any>;
  getBillings(): Promise<any[]>;

  createNotification(notification: any): Promise<any>;
  getPendingNotifications(): Promise<any[]>;

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

  // --- Animals ---
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

  // --- Appointments ---
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

  // --- Inventory (with Auto-Deduction & Forecasting Support) ---
  async getInventory(): Promise<any[]> {
    return await db.select().from(inventory).orderBy(asc(inventory.itemName));
  }

  async createInventoryItem(item: any): Promise<any> {
    const [newItem] = await db.insert(inventory).values(item).returning();
    return newItem;
  }

  async deductStock(itemId: number, amount: number): Promise<any> {
    // Updates both logical 'quantity' and tracking 'current_stock'
    const [item] = await db.update(inventory)
      .set({ 
        quantity: sql`${inventory.quantity} - ${amount}`,
        currentStock: sql`${inventory.currentStock} - ${amount}`,
        lastUpdated: new Date()
      })
      .where(eq(inventory.id, itemId))
      .returning();
    
    // Auto-create notification if Low Stock
    if (item && item.currentStock! <= item.minStockLevel) {
      await this.createNotification({
        type: 'stock',
        title: 'Low Stock Alert',
        message: `Item ${item.itemName} is running low (${item.currentStock} items).`,
        targetDate: new Date()
      });
    }
    return item;
  }

  // --- Visits ---
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

  // --- Vaccinations ---
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

  // --- Outbreaks ---
  async getOutbreaks(): Promise<any[]> {
    return await db.select().from(outbreaks).orderBy(desc(outbreaks.reportedDate));
  }

  async createOutbreak(insert: any): Promise<any> {
    const [out] = await db.insert(outbreaks).values(insert).returning();
    return out;
  }

  async updateOutbreakStatus(id: number, status: string): Promise<any> {
    const [out] = await db.update(outbreaks).set({ status }).where(eq(outbreaks.id, id)).returning();
    return out;
  }

  // --- Billing (NEW) ---
  async createBilling(billing: any): Promise<any> {
    const [bill] = await db.insert(billings).values(billing).returning();
    return bill;
  }

  async getBillings(): Promise<any[]> {
    return await db.select().from(billings).orderBy(desc(billings.createdAt));
  }

  // --- Notifications (NEW) ---
  async createNotification(notification: any): Promise<any> {
    const [notif] = await db.insert(notifications).values(notification).returning();
    return notif;
  }

  async getPendingNotifications(): Promise<any[]> {
    return await db.select().from(notifications).where(eq(notifications.isRead, false)).orderBy(asc(notifications.targetDate));
  }

  // Logic to satisfy interface if users aren't implemented
  async getUser(id: number): Promise<any> { return undefined; }
  async getUserByUsername(u: string): Promise<any> { return undefined; }
  async createUser(u: any): Promise<any> { return {} as any; }
}

export const storage = new DatabaseStorage();