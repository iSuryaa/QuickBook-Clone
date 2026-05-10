import { db } from "@workspace/db";
import { businessesTable, servicesTable, staffTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const BUSINESSES = [
  {
    id: "b1", name: "City General Hospital", category: "hospital" as const,
    address: "12 Medical Park, Sector 15, Gurugram",
    imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80",
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&q=80",
      "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=600&q=80",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
    ],
    rating: 4.6, reviewCount: 1240, distanceKm: 1.2, priceLevel: 2, openNow: true,
    waitTimeMinutes: 22, queueCount: 14, phone: "+91 98765 43210", website: "citygeneral.health",
    description: "A multi-specialty hospital offering world-class healthcare. Known for OPD efficiency, advanced diagnostics, and compassionate care.",
    hours: "Mon–Sat: 8 AM – 8 PM",
    hoursDetail: JSON.stringify({ Mon: "8 AM – 8 PM", Tue: "8 AM – 8 PM", Wed: "8 AM – 8 PM", Thu: "8 AM – 8 PM", Fri: "8 AM – 8 PM", Sat: "9 AM – 6 PM", Sun: "Closed" }),
    amenities: ["Parking", "Pharmacy", "Lab", "Emergency"],
    services: [
      { id: "s1", name: "General OPD", duration: 20, price: 50000, description: "General consultation with a senior physician" },
      { id: "s2", name: "Cardiology Consult", duration: 30, price: 120000, description: "Expert cardiology consultation" },
      { id: "s3", name: "Orthopedics", duration: 30, price: 100000, description: "Bone & joint specialist consultation" },
      { id: "s4", name: "Diagnostics Package", duration: 60, price: 180000, description: "Full blood panel + ECG + X-ray" },
    ],
    staff: [
      { id: "dr1", name: "Dr. Anita Sharma", role: "Senior Physician", rating: 4.8 },
      { id: "dr2", name: "Dr. Rajiv Malhotra", role: "Cardiologist", rating: 4.9 },
      { id: "dr3", name: "Dr. Priya Nair", role: "Orthopedic Surgeon", rating: 4.7 },
    ],
  },
  {
    id: "b2", name: "Aurora Hair Studio", category: "salon" as const,
    address: "B-42, Defence Colony Market, New Delhi",
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
      "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=600&q=80",
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&q=80",
    ],
    rating: 4.8, reviewCount: 612, distanceKm: 0.8, priceLevel: 3, openNow: true,
    waitTimeMinutes: 18, queueCount: 6, phone: "+91 87654 32109", website: "aurorahair.in",
    description: "Premium hair studio specialising in color, keratin, and styling. Known for its welcoming vibe and highly skilled stylists.",
    hours: "Tue–Sun: 10 AM – 8 PM",
    hoursDetail: JSON.stringify({ Mon: "Closed", Tue: "10 AM – 8 PM", Wed: "10 AM – 8 PM", Thu: "10 AM – 8 PM", Fri: "10 AM – 8 PM", Sat: "9 AM – 9 PM", Sun: "10 AM – 7 PM" }),
    amenities: ["WiFi", "Coffee", "Parking", "AC"],
    services: [
      { id: "s5", name: "Haircut & Blow-dry", duration: 45, price: 80000, description: "Precision cut tailored to your face shape" },
      { id: "s6", name: "Global Hair Color", duration: 90, price: 250000, description: "Full head color with Wella or L'Oréal" },
      { id: "s7", name: "Keratin Treatment", duration: 120, price: 450000, description: "Smoothing treatment for frizz-free hair" },
      { id: "s8", name: "Bridal Makeup + Hair", duration: 180, price: 800000, description: "Full bridal package" },
    ],
    staff: [
      { id: "st1", name: "Neha Kapoor", role: "Head Stylist", rating: 4.9 },
      { id: "st2", name: "Riya Singh", role: "Color Specialist", rating: 4.8 },
      { id: "st3", name: "Arjun Mehta", role: "Bridal Artist", rating: 4.7 },
    ],
  },
  {
    id: "b3", name: "Harbor Grand Hotel", category: "hotel" as const,
    address: "Nariman Point, Marine Drive, Mumbai",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c4a49f8a?w=600&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80",
    ],
    rating: 4.7, reviewCount: 2180, distanceKm: 3.4, priceLevel: 4, openNow: true,
    waitTimeMinutes: 0, queueCount: 0, phone: "+91 22 6634 4400", website: "harborgrand.com",
    description: "A 5-star luxury property overlooking the Arabian Sea. Award-winning restaurants, rooftop infinity pool, and a world-class spa.",
    hours: "Open 24 hours",
    hoursDetail: JSON.stringify({ Mon: "Open 24 hrs", Tue: "Open 24 hrs", Wed: "Open 24 hrs", Thu: "Open 24 hrs", Fri: "Open 24 hrs", Sat: "Open 24 hrs", Sun: "Open 24 hrs" }),
    amenities: ["Pool", "Spa", "Valet", "Restaurant", "Gym", "Bar"],
    services: [
      { id: "s9", name: "Deluxe Sea View Room", duration: 0, price: 1200000, description: "King bed with panoramic sea view" },
      { id: "s10", name: "Premier Suite", duration: 0, price: 2500000, description: "Separate living area + personal butler" },
      { id: "s11", name: "Spa Package", duration: 120, price: 550000, description: "Full body massage + facial + jacuzzi" },
    ],
    staff: [
      { id: "h1", name: "Rohan D'Souza", role: "Concierge", rating: 4.9 },
      { id: "h2", name: "Meera Iyer", role: "Spa Therapist", rating: 4.8 },
    ],
  },
  {
    id: "b4", name: "Iron Temple Gym", category: "gym" as const,
    address: "7th Floor, One Horizon Center, DLF Phase 5, Gurugram",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80",
    ],
    rating: 4.5, reviewCount: 834, distanceKm: 1.9, priceLevel: 2, openNow: true,
    waitTimeMinutes: 10, queueCount: 4, phone: "+91 98111 22334", website: "irontemple.fit",
    description: "High-performance fitness centre with premium equipment, dedicated zones for strength, cardio, and functional training.",
    hours: "Mon–Sun: 5 AM – 11 PM",
    hoursDetail: JSON.stringify({ Mon: "5 AM – 11 PM", Tue: "5 AM – 11 PM", Wed: "5 AM – 11 PM", Thu: "5 AM – 11 PM", Fri: "5 AM – 11 PM", Sat: "6 AM – 10 PM", Sun: "7 AM – 9 PM" }),
    amenities: ["Locker", "Showers", "Parking", "Sauna", "Protein Bar"],
    services: [
      { id: "s13", name: "Day Pass", duration: 120, price: 50000, description: "Full access to all equipment + locker" },
      { id: "s14", name: "Personal Training (1hr)", duration: 60, price: 180000, description: "One-on-one session with a certified trainer" },
      { id: "s15", name: "Zumba Class", duration: 45, price: 60000, description: "High-energy group dance fitness class" },
    ],
    staff: [
      { id: "g1", name: "Vikram Khanna", role: "Head Trainer", rating: 4.9 },
      { id: "g2", name: "Deepika Roy", role: "Yoga Instructor", rating: 4.8 },
    ],
  },
  {
    id: "b5", name: "The Biryani Collective", category: "restaurant" as const,
    address: "C-11, Khan Market, New Delhi",
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    ],
    rating: 4.4, reviewCount: 1890, distanceKm: 2.1, priceLevel: 2, openNow: true,
    waitTimeMinutes: 30, queueCount: 22, phone: "+91 11 4321 8765", website: "biryaicollective.in",
    description: "Renowned for dum-cooked biryanis crafted from heirloom recipes. Awarded 'Best Biryani in Delhi' 3 years running.",
    hours: "Daily: 12 PM – 11:30 PM",
    hoursDetail: JSON.stringify({ Mon: "12 PM – 11:30 PM", Tue: "12 PM – 11:30 PM", Wed: "12 PM – 11:30 PM", Thu: "12 PM – 11:30 PM", Fri: "12 PM – 11:30 PM", Sat: "11 AM – 12 AM", Sun: "11 AM – 12 AM" }),
    amenities: ["AC", "Private Dining", "Parking", "Bar", "Takeaway"],
    services: [
      { id: "s17", name: "Table for 2", duration: 60, price: 0, description: "Dine-in reservation" },
      { id: "s18", name: "Private Dining Room", duration: 120, price: 0, description: "Exclusive room for groups up to 10" },
      { id: "s19", name: "Chef's Tasting Menu", duration: 90, price: 250000, description: "6-course curated experience" },
    ],
    staff: [
      { id: "r1", name: "Chef Irfan Ali", role: "Head Chef", rating: 4.9 },
      { id: "r2", name: "Anjali Gupta", role: "Service Manager", rating: 4.8 },
    ],
  },
  {
    id: "b6", name: "PVR ICON — BKC", category: "entertainment" as const,
    address: "BKC Business District, Bandra East, Mumbai",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=600&q=80",
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=600&q=80",
    ],
    rating: 4.6, reviewCount: 3210, distanceKm: 4.2, priceLevel: 2, openNow: true,
    waitTimeMinutes: 0, queueCount: 0, phone: "+91 22 6888 7000", website: "pvrinox.com",
    description: "Mumbai's most premium multiplex with Dolby Atmos, 4DX, and IMAX screens. Luxury recliner seating and gourmet F&B.",
    hours: "Daily: 9 AM – 12 AM",
    hoursDetail: JSON.stringify({ Mon: "9 AM – 12 AM", Tue: "9 AM – 12 AM", Wed: "9 AM – 12 AM", Thu: "9 AM – 12 AM", Fri: "9 AM – 1 AM", Sat: "8 AM – 1 AM", Sun: "8 AM – 12 AM" }),
    amenities: ["IMAX", "4DX", "Gold Class", "Food Court", "Parking"],
    services: [
      { id: "s20", name: "IMAX Ticket", duration: 180, price: 85000, description: "Premium IMAX experience" },
      { id: "s21", name: "4DX Ticket", duration: 150, price: 75000, description: "Motion seat + environmental effects" },
      { id: "s22", name: "Gold Class", duration: 150, price: 120000, description: "Recliner + in-seat dining" },
      { id: "s23", name: "Regular Seat", duration: 150, price: 35000, description: "Standard screen, Dolby sound" },
    ],
    staff: [],
  },
  {
    id: "b7", name: "Smaaash Gaming Zone", category: "games" as const,
    address: "Level 3, DLF Mall of India, Sector 18, Noida",
    imageUrl: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600&q=80",
      "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?w=600&q=80",
    ],
    rating: 4.3, reviewCount: 756, distanceKm: 5.6, priceLevel: 2, openNow: true,
    waitTimeMinutes: 15, queueCount: 8, phone: "+91 98765 11223", website: "smaaash.in",
    description: "India's premium gaming and entertainment center featuring cricket simulators, go-karting, VR experiences and 100+ arcade games.",
    hours: "Daily: 11 AM – 10 PM",
    hoursDetail: JSON.stringify({ Mon: "11 AM – 10 PM", Tue: "11 AM – 10 PM", Wed: "11 AM – 10 PM", Thu: "11 AM – 10 PM", Fri: "11 AM – 11 PM", Sat: "10 AM – 11 PM", Sun: "10 AM – 10 PM" }),
    amenities: ["AC", "Food Court", "Birthday Packages", "Parking"],
    services: [
      { id: "s24", name: "Cricket Simulator (30 min)", duration: 30, price: 60000, description: "Bowl & bat against virtual teams" },
      { id: "s25", name: "Go-Kart (5 laps)", duration: 20, price: 45000, description: "Indoor electric go-kart race" },
      { id: "s26", name: "VR Experience", duration: 15, price: 39900, description: "Full immersion VR headset games" },
    ],
    staff: [{ id: "gm1", name: "Rahul Tiwari", role: "Game Master", rating: 4.6 }],
  },
  {
    id: "b8", name: "Wellness Bliss Spa", category: "salon" as const,
    address: "Koregaon Park, Pune",
    imageUrl: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&q=80",
    ],
    rating: 4.9, reviewCount: 445, distanceKm: 0.5, priceLevel: 3, openNow: false,
    waitTimeMinutes: 0, queueCount: 0, phone: "+91 20 6765 4321", website: "wellnessbliss.in",
    description: "A tranquil urban retreat offering Ayurvedic therapies, Swedish massages, and holistic wellness treatments by certified therapists.",
    hours: "Mon–Sun: 10 AM – 9 PM",
    hoursDetail: JSON.stringify({ Mon: "10 AM – 9 PM", Tue: "10 AM – 9 PM", Wed: "10 AM – 9 PM", Thu: "10 AM – 9 PM", Fri: "10 AM – 9 PM", Sat: "9 AM – 10 PM", Sun: "9 AM – 9 PM" }),
    amenities: ["WiFi", "Locker", "Jacuzzi", "Steam Room", "Café"],
    services: [
      { id: "s28", name: "Swedish Full Body (60 min)", duration: 60, price: 200000, description: "Classic relaxation massage" },
      { id: "s29", name: "Abhyanga (90 min)", duration: 90, price: 350000, description: "Traditional Ayurvedic oil massage" },
      { id: "s30", name: "Couple's Package", duration: 120, price: 600000, description: "Side-by-side massage + champagne" },
    ],
    staff: [
      { id: "sp1", name: "Kavya Nambiar", role: "Senior Therapist", rating: 5.0 },
      { id: "sp2", name: "Tanveer Sheikh", role: "Ayurvedic Specialist", rating: 4.9 },
    ],
  },
];

export async function seedDatabase() {
  const existing = await db.query.businessesTable.findFirst();
  if (existing) return;

  for (const biz of BUSINESSES) {
    const { services, staff, ...bizData } = biz;
    await db.insert(businessesTable).values(bizData).onConflictDoNothing();
    for (const svc of services) {
      await db.insert(servicesTable).values({ ...svc, businessId: biz.id }).onConflictDoNothing();
    }
    for (const st of staff) {
      await db.insert(staffTable).values({ ...st, businessId: biz.id }).onConflictDoNothing();
    }
  }
}
