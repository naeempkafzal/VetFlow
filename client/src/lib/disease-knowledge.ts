export interface Disease {
  id: string;
  name: string;
  nameUrdu: string;
  species: string[];
  symptoms: string[];
  symptomsUrdu: string[];
  treatment: string;
  treatmentUrdu: string;
  prevention: string;
  preventionUrdu: string;
  severity: "low" | "medium" | "high" | "critical";
}

export const diseases: Disease[] = [
  {
    id: "hs",
    name: "Haemorrhagic Septicaemia",
    nameUrdu: "ہیمورجک سیپٹیسیمیا",
    species: ["cow", "buffalo"],
    symptoms: [
      "High fever (104-106°F)",
      "Difficulty breathing",
      "Swelling of throat and neck",
      "Drooling",
      "Loss of appetite",
      "Depression"
    ],
    symptomsUrdu: [
      "تیز بخار (104-106°F)",
      "سانس لینے میں دشواری",
      "گلے اور گردن میں سوجن",
      "منہ سے لعاب آنا",
      "بھوک نہ لگنا",
      "اداسی"
    ],
    treatment: "Immediate antibiotic therapy (Penicillin + Streptomycin). Supportive care with fluids. Isolate affected animals. Contact veterinarian immediately.",
    treatmentUrdu: "فوری طور پر اینٹی بائیوٹک تھراپی (پینسلین + سٹریپٹومائسن)۔ سیال کے ساتھ معاون علاج۔ متاثرہ جانوروں کو الگ رکھیں۔ فوری طور پر ویٹرنریرین سے رابطہ کریں۔",
    prevention: "Annual HS vaccination. Avoid stress and overcrowding. Maintain good hygiene. Quarantine new animals.",
    preventionUrdu: "سالانہ HS ویکسینیشن۔ تناؤ اور بھیڑ سے بچیں۔ اچھی صفائی برقرار رکھیں۔ نئے جانوروں کو قرنطینہ میں رکھیں۔",
    severity: "critical"
  },
  {
    id: "fmd",
    name: "Foot and Mouth Disease",
    nameUrdu: "منہ اور کھر کی بیماری",
    species: ["cow", "buffalo", "goat"],
    symptoms: [
      "Vesicles on mouth, tongue, and lips",
      "Blisters on feet and udder",
      "Excessive salivation",
      "Lameness",
      "Loss of appetite",
      "Fever"
    ],
    symptomsUrdu: [
      "منہ، زبان اور ہونٹوں پر چھالے",
      "پاؤں اور تھنوں پر چھالے",
      "زیادہ لعاب آنا",
      "لنگڑاہٹ",
      "بھوک نہ لگنا",
      "بخار"
    ],
    treatment: "No specific cure. Supportive care with anti-inflammatory drugs. Keep animals comfortable. Maintain good nutrition and hygiene.",
    treatmentUrdu: "کوئی مخصوص علاج نہیں۔ سوزش مخالف ادویات کے ساتھ معاون علاج۔ جانوروں کو آرام دہ رکھیں۔ اچھی غذائیت اور صفائی برقرار رکھیں۔",
    prevention: "FMD vaccination every 6 months. Quarantine new animals. Disinfect premises regularly. Control animal movement.",
    preventionUrdu: "ہر 6 ماہ میں FMD ویکسینیشن۔ نئے جانوروں کو قرنطینہ میں رکھیں۔ احاطے کو باقاعدگی سے جراثیم کش کریں۔ جانوروں کی نقل و حرکت کو کنٹرول کریں۔",
    severity: "high"
  },
  {
    id: "rabies",
    name: "Rabies",
    nameUrdu: "ریبیز (کتے کا پاگل پن)",
    species: ["dog", "cat"],
    symptoms: [
      "Behavioral changes",
      "Aggressive or fearful behavior",
      "Excessive salivation",
      "Difficulty swallowing",
      "Paralysis",
      "Seizures"
    ],
    symptomsUrdu: [
      "رفتار میں تبدیلی",
      "جارحانہ یا خوفناک رفتار",
      "زیادہ لعاب آنا",
      "نگلنے میں دشواری",
      "فالج",
      "دورے"
    ],
    treatment: "NO CURE once symptoms appear. Prevention is key. If bite occurs, immediate wound cleaning and post-exposure prophylaxis required.",
    treatmentUrdu: "علامات ظاہر ہونے کے بعد کوئی علاج نہیں۔ بچاؤ ہی اصل ہے۔ اگر کاٹے تو فوری طور پر زخم صاف کریں اور نمائش کے بعد کا تحفظ ضروری ہے۔",
    prevention: "Annual rabies vaccination. Avoid contact with stray animals. Report aggressive animals to authorities.",
    preventionUrdu: "سالانہ ریبیز ویکسینیشن۔ آوارہ جانوروں سے رابطے سے بچیں۔ جارح جانوروں کی اطلاع حکام کو دیں۔",
    severity: "critical"
  },
  {
    id: "mastitis",
    name: "Mastitis",
    nameUrdu: "تھن کی سوزش",
    species: ["cow", "buffalo"],
    symptoms: [
      "Swollen, hot, hard udder",
      "Pain and tenderness",
      "Abnormal milk (clots, blood)",
      "Reduced milk production",
      "Fever",
      "Loss of appetite"
    ],
    symptomsUrdu: [
      "سوجے ہوئے، گرم، سخت تھن",
      "درد اور حساسیت",
      "غیر معمولی دودھ (گانٹھیں، خون)",
      "دودھ کی پیداوار میں کمی",
      "بخار",
      "بھوک نہ لگنا"
    ],
    treatment: "Antibiotic therapy as per culture and sensitivity. Frequent milking. Hot compress. Anti-inflammatory drugs.",
    treatmentUrdu: "کلچر اور حساسیت کے مطابق اینٹی بائیوٹک تھراپی۔ بار بار دودھ نکالنا۔ گرم سیک۔ سوزش مخالف ادویات۔",
    prevention: "Proper milking hygiene. Teat dipping. Dry cow therapy. Regular udder examination.",
    preventionUrdu: "دودھ نکالنے کی مناسب صفائی۔ تھن کو ڈبونا۔ خشک گائے کا علاج۔ تھنوں کا باقاعدہ معائنہ۔",
    severity: "medium"
  },
  {
    id: "ppr",
    name: "Peste des Petits Ruminants",
    nameUrdu: "چھوٹے رومیناٹس کی طاعون",
    species: ["goat"],
    symptoms: [
      "High fever",
      "Nasal and eye discharge",
      "Mouth ulcers",
      "Diarrhea",
      "Pneumonia",
      "Death in severe cases"
    ],
    symptomsUrdu: [
      "تیز بخار",
      "ناک اور آنکھ سے رطوبت",
      "منہ میں زخم",
      "اسہال",
      "نمونیا",
      "شدید صورتوں میں موت"
    ],
    treatment: "No specific treatment. Supportive care with antibiotics for secondary infections. Fluid therapy. Good nursing care.",
    treatmentUrdu: "کوئی مخصوص علاج نہیں۔ ثانوی انفیکشن کے لیے اینٹی بائیوٹک کے ساتھ معاون علاج۔ سیال تھراپی۔ اچھی نرسنگ کیئر۔",
    prevention: "PPR vaccination. Quarantine new animals. Maintain biosecurity. Avoid contact with infected animals.",
    preventionUrdu: "PPR ویکسینیشن۔ نئے جانوروں کو قرنطینہ میں رکھیں۔ حیاتیاتی تحفظ برقرار رکھیں۔ متاثرہ جانوروں سے رابطے سے بچیں۔",
    severity: "high"
  }
];

export function diagnoseSymptoms(species: string, selectedSymptoms: string[]): Disease[] {
  return diseases
    .filter(disease => disease.species.includes(species))
    .map(disease => ({
      ...disease,
      matchScore: selectedSymptoms.filter(symptom => 
        disease.symptoms.some(s => s.toLowerCase().includes(symptom.toLowerCase()))
      ).length
    }))
    .filter(disease => disease.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function getCommonSymptoms(species: string): string[] {
  const relevantDiseases = diseases.filter(disease => disease.species.includes(species));
  const allSymptoms = relevantDiseases.flatMap(disease => disease.symptoms);
  
  // Get unique symptoms
  return Array.from(new Set(allSymptoms)).sort();
}
