// storage.ts
import {
  type Animal,
  type InsertAnimal,
  type VisitRecord,
  type InsertVisitRecord,
  type Vaccination,
  type InsertVaccination,
  type Inventory,
  type InsertInventory,
  type Appointment,
  type InsertAppointment,
  type Outbreak,
  type InsertOutbreak,
} from "../../shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Animals
  getAnimal(id: string): Promise<Animal | undefined>;
  getAnimals(): Promise<Animal[]>;
  getAnimalsByOwner(ownerName: string): Promise<Animal[]>;
  createAnimal(animal: InsertAnimal): Promise<Animal>;
  updateAnimal(
    id: string,
    updates: Partial<Animal>,
  ): Promise<Animal | undefined>;

  // Visit Records
  getVisitRecord(id: string): Promise<VisitRecord | undefined>;
  getVisitRecords(): Promise<VisitRecord[]>;
  getVisitRecordsByAnimal(animalId: string): Promise<VisitRecord[]>;
  createVisitRecord(record: InsertVisitRecord): Promise<VisitRecord>;

  // Vaccinations
  getVaccination(id: string): Promise<Vaccination | undefined>;
  getVaccinations(): Promise<Vaccination[]>;
  getVaccinationsByAnimal(animalId: string): Promise<Vaccination[]>;
  getOverdueVaccinations(): Promise<Vaccination[]>;
  createVaccination(vaccination: InsertVaccination): Promise<Vaccination>;

  // Inventory
  getInventoryItem(id: string): Promise<Inventory | undefined>;
  getInventory(): Promise<Inventory[]>;
  getLowStockItems(): Promise<Inventory[]>;
  getExpiringItems(days: number): Promise<Inventory[]>;
  createInventoryItem(item: InsertInventory): Promise<Inventory>;
  updateInventoryItem(
    id: string,
    updates: Partial<Inventory>,
  ): Promise<Inventory | undefined>;

  // Appointments
  getAppointment(id: string): Promise<Appointment | undefined>;
  getAppointments(): Promise<Appointment[]>;
  getAppointmentsByDate(date: Date): Promise<Appointment[]>;
  getUpcomingAppointments(): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(
    id: string,
    updates: Partial<Appointment>,
  ): Promise<Appointment | undefined>;

  // Outbreaks
  getOutbreak(id: string): Promise<Outbreak | undefined>;
  getOutbreaks(): Promise<Outbreak[]>;
  getActiveOutbreaks(): Promise<Outbreak[]>;
  createOutbreak(outbreak: InsertOutbreak): Promise<Outbreak>;
  updateOutbreak(
    id: string,
    updates: Partial<Outbreak>,
  ): Promise<Outbreak | undefined>;
}

export class MemStorage implements IStorage {
  private animals: Map<string, Animal>;
  private visitRecords: Map<string, VisitRecord>;
  private vaccinations: Map<string, Vaccination>;
  private inventory: Map<string, Inventory>;
  private appointments: Map<string, Appointment>;
  private outbreaks: Map<string, Outbreak>;

  constructor() {
    this.animals = new Map();
    this.visitRecords = new Map();
    this.vaccinations = new Map();
    this.inventory = new Map();
    this.appointments = new Map();
    this.outbreaks = new Map();

    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample animals
    const animal1: Animal = {
      id: "animal-1",
      name: "گائے نمبر 1",
      species: "cow",
      breed: "Sahiwal",
      age: 3,
      weight: 400,
      gender: "female",
      ownerName: "احمد علی",
      ownerPhone: "+92-300-1234567",
      ownerAddress: "Village Chak 123, Faisalabad",
      location: "Punjab",
      registrationDate: new Date("2024-01-15"),
      isActive: true,
    };

    const animal2: Animal = {
      id: "animal-2",
      name: "بلی میو",
      species: "cat",
      breed: "Persian",
      age: 2,
      weight: 3.5,
      gender: "male",
      ownerName: "فاطمہ خان",
      ownerPhone: "+92-321-9876543",
      ownerAddress: "Block B, Gulshan-e-Iqbal, Karachi",
      location: "Sindh",
      registrationDate: new Date("2024-02-20"),
      isActive: true,
    };

    this.animals.set(animal1.id, animal1);
    this.animals.set(animal2.id, animal2);

    // Sample inventory
    const inventoryItems: Inventory[] = [
      {
        id: "inv-1",
        itemName: "HS Vaccine",
        itemNameUrdu: "ہیمورجک سیپٹیسیمیا ویکسین",
        category: "vaccine",
        currentStock: 50,
        minStockLevel: 20,
        unit: "vials",
        costPerUnit: 150,
        supplier: "Intervet Pakistan",
        expiryDate: new Date("2024-12-31"),
        lastRestocked: new Date("2024-09-01"),
      },
      {
        id: "inv-2",
        itemName: "Rabies Vaccine",
        itemNameUrdu: "ریبیز ویکسین",
        category: "vaccine",
        currentStock: 15,
        minStockLevel: 25,
        unit: "vials",
        costPerUnit: 200,
        supplier: "Boehringer Ingelheim",
        expiryDate: new Date("2025-03-15"),
        lastRestocked: new Date("2024-08-15"),
      },
    ];

    inventoryItems.forEach((item) => this.inventory.set(item.id, item));
  }

  // Animals
  async getAnimal(id: string): Promise<Animal | undefined> {
    return this.animals.get(id);
  }

  async getAnimals(): Promise<Animal[]> {
    return Array.from(this.animals.values()).filter(
      (animal) => animal.isActive,
    );
  }

  async getAnimalsByOwner(ownerName: string): Promise<Animal[]> {
    return Array.from(this.animals.values()).filter(
      (animal) =>
        animal.ownerName.toLowerCase().includes(ownerName.toLowerCase()) &&
        animal.isActive,
    );
  }

  async createAnimal(insertAnimal: InsertAnimal): Promise<Animal> {
    const id = randomUUID();
    const animal: Animal = {
      ...insertAnimal,
      id,
      registrationDate: new Date(),
      isActive: true,
      breed: insertAnimal.breed?.trim() || null,
      age: insertAnimal.age ?? null,
      weight: insertAnimal.weight ?? null,
      gender: insertAnimal.gender?.trim() || null,
      ownerPhone: insertAnimal.ownerPhone?.trim() || null,
      ownerAddress: insertAnimal.ownerAddress?.trim() || null,
      location: insertAnimal.location?.trim() || null,
    };
    this.animals.set(id, animal);
    return animal;
  }

  async updateAnimal(
    id: string,
    updates: Partial<Animal>,
  ): Promise<Animal | undefined> {
    const animal = this.animals.get(id);
    if (!animal) return undefined;

    const updatedAnimal = { ...animal, ...updates };
    this.animals.set(id, updatedAnimal);
    return updatedAnimal;
  }

  // Visit Records
  async getVisitRecord(id: string): Promise<VisitRecord | undefined> {
    return this.visitRecords.get(id);
  }

  async getVisitRecords(): Promise<VisitRecord[]> {
    return Array.from(this.visitRecords.values());
  }

  async getVisitRecordsByAnimal(animalId: string): Promise<VisitRecord[]> {
    return Array.from(this.visitRecords.values()).filter(
      (record) => record.animalId === animalId,
    );
  }

  async createVisitRecord(
    insertRecord: InsertVisitRecord,
  ): Promise<VisitRecord> {
    const id = randomUUID();
    const record: VisitRecord = {
      ...insertRecord,
      id,
      visitDate: new Date(),
      symptoms: insertRecord.symptoms?.trim() || null,
      diagnosis: insertRecord.diagnosis?.trim() || null,
      treatment: insertRecord.treatment?.trim() || null,
      medications: insertRecord.medications?.trim() || null,
      cost: insertRecord.cost ?? null,
      notes: insertRecord.notes?.trim() || null,
      veterinarianName: insertRecord.veterinarianName?.trim() || null,
    };
    this.visitRecords.set(id, record);
    return record;
  }

  // Vaccinations
  async getVaccination(id: string): Promise<Vaccination | undefined> {
    return this.vaccinations.get(id);
  }

  async getVaccinations(): Promise<Vaccination[]> {
    return Array.from(this.vaccinations.values());
  }

  async getVaccinationsByAnimal(animalId: string): Promise<Vaccination[]> {
    return Array.from(this.vaccinations.values()).filter(
      (vacc) => vacc.animalId === animalId,
    );
  }

  async getOverdueVaccinations(): Promise<Vaccination[]> {
    const now = new Date();
    return Array.from(this.vaccinations.values()).filter(
      (vacc) => vacc.nextDueDate && vacc.nextDueDate < now,
    );
  }

  async createVaccination(
    insertVaccination: InsertVaccination,
  ): Promise<Vaccination> {
    const id = randomUUID();
    const vaccination: Vaccination = {
      ...insertVaccination,
      id,
      vaccineNameUrdu: insertVaccination.vaccineNameUrdu?.trim() || null,
      nextDueDate: insertVaccination.nextDueDate ?? null,
      batchNumber: insertVaccination.batchNumber?.trim() || null,
      cost: insertVaccination.cost ?? null,
      veterinarianName: insertVaccination.veterinarianName?.trim() || null,
    };
    this.vaccinations.set(id, vaccination);
    return vaccination;
  }

  // Inventory
  async getInventoryItem(id: string): Promise<Inventory | undefined> {
    return this.inventory.get(id);
  }

  async getInventory(): Promise<Inventory[]> {
    return Array.from(this.inventory.values());
  }

  async getLowStockItems(): Promise<Inventory[]> {
    return Array.from(this.inventory.values()).filter(
      (item) => item.currentStock <= item.minStockLevel,
    );
  }

  async getExpiringItems(days: number): Promise<Inventory[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return Array.from(this.inventory.values()).filter(
      (item) => item.expiryDate && item.expiryDate <= futureDate,
    );
  }

  async createInventoryItem(insertItem: InsertInventory): Promise<Inventory> {
    const id = randomUUID();
    const item: Inventory = {
      ...insertItem,
      id,
      lastRestocked: new Date(),
      itemNameUrdu: insertItem.itemNameUrdu?.trim() || null,
      costPerUnit: insertItem.costPerUnit ?? null,
      supplier: insertItem.supplier?.trim() || null,
      expiryDate: insertItem.expiryDate ?? null,
    };
    this.inventory.set(id, item);
    return item;
  }

  async updateInventoryItem(
    id: string,
    updates: Partial<Inventory>,
  ): Promise<Inventory | undefined> {
    const item = this.inventory.get(id);
    if (!item) return undefined;

    const updatedItem = { ...item, ...updates };
    this.inventory.set(id, updatedItem);
    return updatedItem;
  }

  // Appointments
  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    const targetDate = date.toDateString();
    return Array.from(this.appointments.values()).filter(
      (apt) => apt.appointmentDate.toDateString() === targetDate,
    );
  }

  async getUpcomingAppointments(): Promise<Appointment[]> {
    const now = new Date();
    return Array.from(this.appointments.values())
      .filter((apt) => apt.appointmentDate >= now && apt.status === "scheduled")
      .sort(
        (a, b) => a.appointmentDate.getTime() - b.appointmentDate.getTime(),
      );
  }

  async createAppointment(
    insertAppointment: InsertAppointment,
  ): Promise<Appointment> {
    const id = randomUUID();
    const appointment: Appointment = {
      ...insertAppointment,
      id,
      animalId: insertAppointment.animalId?.trim() || null,
      notes: insertAppointment.notes?.trim() || null,
      status: insertAppointment.status?.trim() || "scheduled",
      reminderSent: insertAppointment.reminderSent ?? false,
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(
    id: string,
    updates: Partial<Appointment>,
  ): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;

    const updatedAppointment = { ...appointment, ...updates };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  // Outbreaks
  async getOutbreak(id: string): Promise<Outbreak | undefined> {
    return this.outbreaks.get(id);
  }

  async getOutbreaks(): Promise<Outbreak[]> {
    return Array.from(this.outbreaks.values());
  }

  async getActiveOutbreaks(): Promise<Outbreak[]> {
    return Array.from(this.outbreaks.values()).filter(
      (outbreak) => outbreak.status === "active",
    );
  }

  async createOutbreak(insertOutbreak: InsertOutbreak): Promise<Outbreak> {
    const id = randomUUID();
    const outbreak: Outbreak = {
      ...insertOutbreak,
      id,
      reportDate: new Date(),
      diseaseNameUrdu: insertOutbreak.diseaseNameUrdu?.trim() || null,
      latitude: insertOutbreak.latitude ?? null,
      longitude: insertOutbreak.longitude ?? null,
      status: insertOutbreak.status?.trim() || "active",
      biosafetyMeasures: insertOutbreak.biosafetyMeasures?.trim() || null,
    };
    this.outbreaks.set(id, outbreak);
    return outbreak;
  }

  async updateOutbreak(
    id: string,
    updates: Partial<Outbreak>,
  ): Promise<Outbreak | undefined> {
    const outbreak = this.outbreaks.get(id);
    if (!outbreak) return undefined;

    const updatedOutbreak = { ...outbreak, ...updates };
    this.outbreaks.set(id, updatedOutbreak);
    return updatedOutbreak;
  }
}

export const storage = new MemStorage();
