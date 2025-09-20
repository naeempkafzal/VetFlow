export interface VaccineSchedule {
  id: string;
  name: string;
  nameUrdu: string;
  species: string[];
  ageInMonths: number;
  intervalMonths: number;
  description: string;
  descriptionUrdu: string;
  isPVMCRequired: boolean;
  cost: number; // in PKR
}

export const vaccineSchedules: VaccineSchedule[] = [
  {
    id: "hs-cattle",
    name: "Haemorrhagic Septicaemia Vaccine",
    nameUrdu: "ہیمورجک سیپٹیسیمیا ویکسین",
    species: ["cow", "buffalo"],
    ageInMonths: 6,
    intervalMonths: 12,
    description: "Annual vaccination against HS. Essential for cattle and buffalo in Pakistan.",
    descriptionUrdu: "HS کے خلاف سالانہ ویکسینیشن۔ پاکستان میں گائے اور بھینس کے لیے ضروری۔",
    isPVMCRequired: true,
    cost: 150
  },
  {
    id: "fmd-cattle",
    name: "Foot and Mouth Disease Vaccine",
    nameUrdu: "منہ اور کھر کی بیماری ویکسین",
    species: ["cow", "buffalo", "goat"],
    ageInMonths: 4,
    intervalMonths: 6,
    description: "Bi-annual vaccination against FMD. Critical for livestock protection.",
    descriptionUrdu: "FMD کے خلاف ہر چھ ماہ ویکسینیشن۔ مویشیوں کی حفاظت کے لیے انتہائی اہم۔",
    isPVMCRequired: true,
    cost: 120
  },
  {
    id: "blackquarter",
    name: "Black Quarter Vaccine", 
    nameUrdu: "بلیک کوارٹر ویکسین",
    species: ["cow", "buffalo"],
    ageInMonths: 6,
    intervalMonths: 12,
    description: "Annual vaccination against Black Quarter disease in cattle.",
    descriptionUrdu: "گائے میں بلیک کوارٹر بیماری کے خلاف سالانہ ویکسینیشن۔",
    isPVMCRequired: true,
    cost: 100
  },
  {
    id: "ppr-goat",
    name: "PPR Vaccine",
    nameUrdu: "PPR ویکسین", 
    species: ["goat"],
    ageInMonths: 4,
    intervalMonths: 36,
    description: "Vaccination against Peste des Petits Ruminants. Provides 3-year immunity.",
    descriptionUrdu: "چھوٹے رومیناٹس کی طاعون کے خلاف ویکسینیشن۔ 3 سال مدافعت فراہم کرتی ہے۔",
    isPVMCRequired: true,
    cost: 80
  },
  {
    id: "rabies-dog",
    name: "Rabies Vaccine",
    nameUrdu: "ریبیز ویکسین",
    species: ["dog", "cat"],
    ageInMonths: 3,
    intervalMonths: 12,
    description: "Annual rabies vaccination. Mandatory in urban areas of Pakistan.",
    descriptionUrdu: "سالانہ ریبیز ویکسینیشن۔ پاکستان کے شہری علاقوں میں لازمی۔",
    isPVMCRequired: true,
    cost: 200
  },
  {
    id: "dhpp-dog",
    name: "DHPP Vaccine",
    nameUrdu: "DHPP ویکسین",
    species: ["dog"],
    ageInMonths: 2,
    intervalMonths: 12,
    description: "Distemper, Hepatitis, Parvovirus, Parainfluenza vaccine for dogs.",
    descriptionUrdu: "کتوں کے لیے ڈسٹیمپر، ہیپاٹائٹس، پارووائرس، پیرا انفلوئنزا ویکسین۔",
    isPVMCRequired: false,
    cost: 250
  },
  {
    id: "fvrcp-cat",
    name: "FVRCP Vaccine",
    nameUrdu: "FVRCP ویکسین",
    species: ["cat"],
    ageInMonths: 2,
    intervalMonths: 12,
    description: "Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia vaccine for cats.",
    descriptionUrdu: "بلیوں کے لیے فیلائن وائرل رائنوٹریکائٹس، کیلیسی وائرس، پین لیوکوپینیا ویکسین۔",
    isPVMCRequired: false,
    cost: 300
  }
];

export function getVaccineScheduleForSpecies(species: string): VaccineSchedule[] {
  return vaccineSchedules.filter(schedule => schedule.species.includes(species));
}

export function calculateNextVaccinationDate(lastVaccinationDate: Date, intervalMonths: number): Date {
  const nextDate = new Date(lastVaccinationDate);
  nextDate.setMonth(nextDate.getMonth() + intervalMonths);
  return nextDate;
}

export function getOverdueVaccinations(vaccinations: any[], currentDate: Date = new Date()): any[] {
  return vaccinations.filter(vaccination => {
    if (!vaccination.nextDueDate) return false;
    return new Date(vaccination.nextDueDate) < currentDate;
  });
}

export function getUpcomingVaccinations(vaccinations: any[], daysAhead: number = 30): any[] {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);
  
  return vaccinations.filter(vaccination => {
    if (!vaccination.nextDueDate) return false;
    const dueDate = new Date(vaccination.nextDueDate);
    return dueDate <= futureDate && dueDate >= new Date();
  });
}
