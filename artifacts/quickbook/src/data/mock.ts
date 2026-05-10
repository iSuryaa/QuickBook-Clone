export type CategoryId = "hospital" | "salon" | "hotel" | "gym" | "restaurant" | "entertainment" | "games" | "pharmacy";
export type BookingStatus = "upcoming" | "in-queue" | "completed" | "cancelled";
export type PriceLevel = 1 | 2 | 3 | 4;

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  rating: number;
  imageUrl?: string;
}

export interface Business {
  id: string;
  name: string;
  category: CategoryId;
  address: string;
  imageUrl: string;
  photos: string[];
  rating: number;
  reviewCount: number;
  distanceKm: number;
  priceLevel: PriceLevel;
  openNow: boolean;
  waitTimeMinutes: number;
  queueCount: number;
  phone?: string;
  website?: string;
  description: string;
  services: Service[];
  staff: StaffMember[];
  hours: string;
  amenities: string[];
  hoursDetail?: Record<string, string>;
}

export interface Booking {
  id: string;
  businessId: string;
  serviceId: string;
  staffId?: string;
  date: string;
  time: string;
  persons: number;
  status: BookingStatus;
  token: string;
  queuePosition?: number;
  totalQueue?: number;
  estimatedWait?: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "booking" | "reminder" | "promo" | "queue";
  businessId?: string;
  bookingId?: string;
}

export const BUSINESSES: Business[] = [
  {
    id: "b1",
    name: "City General Hospital",
    category: "hospital",
    address: "12 Medical Park, Sector 15, Gurugram",
    imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80",
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&q=80",
      "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=600&q=80",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
    ],
    rating: 4.6,
    reviewCount: 1240,
    distanceKm: 1.2,
    priceLevel: 2,
    openNow: true,
    waitTimeMinutes: 22,
    queueCount: 14,
    phone: "+91 98765 43210",
    website: "citygeneral.health",
    description: "A multi-specialty hospital offering world-class healthcare. Known for OPD efficiency, advanced diagnostics, and compassionate care.",
    hoursDetail: { Mon: "8 AM – 8 PM", Tue: "8 AM – 8 PM", Wed: "8 AM – 8 PM", Thu: "8 AM – 8 PM", Fri: "8 AM – 8 PM", Sat: "9 AM – 6 PM", Sun: "Closed" },
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
    hours: "Mon–Sat: 8 AM – 8 PM",
    amenities: ["Parking", "Pharmacy", "Lab", "Emergency"],
  },
  {
    id: "b2",
    name: "Aurora Hair Studio",
    category: "salon",
    address: "B-42, Defence Colony Market, New Delhi",
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
      "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=600&q=80",
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&q=80",
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80",
    ],
    rating: 4.8,
    reviewCount: 612,
    distanceKm: 0.8,
    priceLevel: 3,
    openNow: true,
    waitTimeMinutes: 18,
    queueCount: 6,
    phone: "+91 87654 32109",
    website: "aurorahair.in",
    description: "Premium hair studio specialising in color, keratin, and styling. Known for its welcoming vibe and highly skilled stylists.",
    hoursDetail: { Mon: "Closed", Tue: "10 AM – 8 PM", Wed: "10 AM – 8 PM", Thu: "10 AM – 8 PM", Fri: "10 AM – 8 PM", Sat: "9 AM – 9 PM", Sun: "10 AM – 7 PM" },
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
    hours: "Tue–Sun: 10 AM – 8 PM",
    amenities: ["WiFi", "Coffee", "Parking", "AC"],
  },
  {
    id: "b3",
    name: "Harbor Grand Hotel",
    category: "hotel",
    address: "Nariman Point, Marine Drive, Mumbai",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c4a49f8a?w=600&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    ],
    rating: 4.7,
    reviewCount: 2180,
    distanceKm: 3.4,
    priceLevel: 4,
    openNow: true,
    waitTimeMinutes: 0,
    queueCount: 0,
    phone: "+91 22 6634 4400",
    website: "harborgrand.com",
    description: "A 5-star luxury property overlooking the Arabian Sea. Featuring award-winning restaurants, a rooftop infinity pool, and a world-class spa.",
    hoursDetail: { Mon: "Open 24 hrs", Tue: "Open 24 hrs", Wed: "Open 24 hrs", Thu: "Open 24 hrs", Fri: "Open 24 hrs", Sat: "Open 24 hrs", Sun: "Open 24 hrs" },
    services: [
      { id: "s9", name: "Deluxe Sea View Room", duration: 0, price: 1200000, description: "King bed with panoramic sea view" },
      { id: "s10", name: "Premier Suite", duration: 0, price: 2500000, description: "Separate living area + personal butler" },
      { id: "s11", name: "Spa Package", duration: 120, price: 550000, description: "Full body massage + facial + jacuzzi" },
      { id: "s12", name: "Dinner for Two", duration: 90, price: 350000, description: "7-course tasting menu at The Harbour" },
    ],
    staff: [
      { id: "h1", name: "Rohan D'Souza", role: "Concierge", rating: 4.9 },
      { id: "h2", name: "Meera Iyer", role: "Spa Therapist", rating: 4.8 },
    ],
    hours: "Open 24 hours",
    amenities: ["Pool", "Spa", "Valet", "Restaurant", "Gym", "Bar"],
  },
  {
    id: "b4",
    name: "Iron Temple Gym",
    category: "gym",
    address: "7th Floor, One Horizon Center, DLF Phase 5, Gurugram",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80",
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&q=80",
    ],
    rating: 4.5,
    reviewCount: 834,
    distanceKm: 1.9,
    priceLevel: 2,
    openNow: true,
    waitTimeMinutes: 10,
    queueCount: 4,
    phone: "+91 98111 22334",
    website: "irontemple.fit",
    description: "High-performance fitness centre with premium equipment, dedicated zones for strength, cardio, and functional training.",
    hoursDetail: { Mon: "5 AM – 11 PM", Tue: "5 AM – 11 PM", Wed: "5 AM – 11 PM", Thu: "5 AM – 11 PM", Fri: "5 AM – 11 PM", Sat: "6 AM – 10 PM", Sun: "7 AM – 9 PM" },
    services: [
      { id: "s13", name: "Day Pass", duration: 120, price: 50000, description: "Full access to all equipment + locker" },
      { id: "s14", name: "Personal Training (1hr)", duration: 60, price: 180000, description: "One-on-one session with a certified trainer" },
      { id: "s15", name: "Zumba Class", duration: 45, price: 60000, description: "High-energy group dance fitness class" },
      { id: "s16", name: "Yoga Session", duration: 60, price: 70000, description: "Guided yoga for flexibility & mindfulness" },
    ],
    staff: [
      { id: "g1", name: "Vikram Khanna", role: "Head Trainer", rating: 4.9 },
      { id: "g2", name: "Deepika Roy", role: "Yoga Instructor", rating: 4.8 },
      { id: "g3", name: "Mohit Verma", role: "Zumba Instructor", rating: 4.7 },
    ],
    hours: "Mon–Sun: 5 AM – 11 PM",
    amenities: ["Locker", "Showers", "Parking", "Sauna", "Protein Bar"],
  },
  {
    id: "b5",
    name: "The Biryani Collective",
    category: "restaurant",
    address: "C-11, Khan Market, New Delhi",
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80",
    ],
    rating: 4.4,
    reviewCount: 1890,
    distanceKm: 2.1,
    priceLevel: 2,
    openNow: true,
    waitTimeMinutes: 30,
    queueCount: 22,
    phone: "+91 11 4321 8765",
    website: "biryaicollective.in",
    description: "Renowned for dum-cooked biryanis crafted from heirloom recipes. Awarded 'Best Biryani in Delhi' 3 years running.",
    hoursDetail: { Mon: "12 PM – 11:30 PM", Tue: "12 PM – 11:30 PM", Wed: "12 PM – 11:30 PM", Thu: "12 PM – 11:30 PM", Fri: "12 PM – 11:30 PM", Sat: "11 AM – 12 AM", Sun: "11 AM – 12 AM" },
    services: [
      { id: "s17", name: "Table for 2", duration: 60, price: 0, description: "Dine-in reservation" },
      { id: "s18", name: "Private Dining Room", duration: 120, price: 0, description: "Exclusive room for groups up to 10" },
      { id: "s19", name: "Chef's Tasting Menu", duration: 90, price: 250000, description: "6-course curated experience" },
    ],
    staff: [
      { id: "r1", name: "Chef Irfan Ali", role: "Head Chef", rating: 4.9 },
      { id: "r2", name: "Anjali Gupta", role: "Service Manager", rating: 4.8 },
    ],
    hours: "Daily: 12 PM – 11:30 PM",
    amenities: ["AC", "Private Dining", "Parking", "Bar", "Takeaway"],
  },
  {
    id: "b6",
    name: "PVR ICON — BKC",
    category: "entertainment",
    address: "BKC Business District, Bandra East, Mumbai",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=600&q=80",
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=600&q=80",
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&q=80",
    ],
    rating: 4.6,
    reviewCount: 3210,
    distanceKm: 4.2,
    priceLevel: 2,
    openNow: true,
    waitTimeMinutes: 0,
    queueCount: 0,
    phone: "+91 22 6888 7000",
    website: "pvrinox.com",
    description: "Mumbai's most premium multiplex with Dolby Atmos, 4DX, and IMAX screens. Luxury recliner seating and gourmet F&B.",
    hoursDetail: { Mon: "9 AM – 12 AM", Tue: "9 AM – 12 AM", Wed: "9 AM – 12 AM", Thu: "9 AM – 12 AM", Fri: "9 AM – 1 AM", Sat: "8 AM – 1 AM", Sun: "8 AM – 12 AM" },
    services: [
      { id: "s20", name: "IMAX Ticket", duration: 180, price: 85000, description: "Premium IMAX experience" },
      { id: "s21", name: "4DX Ticket", duration: 150, price: 75000, description: "Motion seat + environmental effects" },
      { id: "s22", name: "Gold Class", duration: 150, price: 120000, description: "Recliner + in-seat dining" },
      { id: "s23", name: "Regular Seat", duration: 150, price: 35000, description: "Standard screen, Dolby sound" },
    ],
    staff: [],
    hours: "Daily: 9 AM – 12 AM",
    amenities: ["IMAX", "4DX", "Gold Class", "Food Court", "Parking"],
  },
  {
    id: "b7",
    name: "Smaaash Gaming Zone",
    category: "games",
    address: "Level 3, DLF Mall of India, Sector 18, Noida",
    imageUrl: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600&q=80",
      "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?w=600&q=80",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80",
    ],
    rating: 4.3,
    reviewCount: 756,
    distanceKm: 5.6,
    priceLevel: 2,
    openNow: true,
    waitTimeMinutes: 15,
    queueCount: 8,
    description: "India's premium gaming and entertainment center featuring cricket simulators, go-karting, VR experiences and 100+ arcade games.",
    hoursDetail: { Mon: "11 AM – 10 PM", Tue: "11 AM – 10 PM", Wed: "11 AM – 10 PM", Thu: "11 AM – 10 PM", Fri: "11 AM – 11 PM", Sat: "10 AM – 11 PM", Sun: "10 AM – 10 PM" },
    services: [
      { id: "s24", name: "Cricket Simulator (30 min)", duration: 30, price: 60000, description: "Bowl & bat against virtual teams" },
      { id: "s25", name: "Go-Kart (5 laps)", duration: 20, price: 45000, description: "Indoor electric go-kart race" },
      { id: "s26", name: "VR Experience", duration: 15, price: 39900, description: "Full immersion VR headset games" },
      { id: "s27", name: "Unlimited Gaming (1hr)", duration: 60, price: 79900, description: "Access to all arcade machines" },
    ],
    staff: [
      { id: "gm1", name: "Rahul Tiwari", role: "Game Master", rating: 4.6 },
    ],
    hours: "Daily: 11 AM – 10 PM",
    amenities: ["AC", "Food Court", "Birthday Packages", "Parking"],
  },
  {
    id: "b8",
    name: "Wellness Bliss Spa",
    category: "salon",
    address: "Koregaon Park, Pune",
    imageUrl: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&q=80",
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80",
    ],
    rating: 4.9,
    reviewCount: 445,
    distanceKm: 0.5,
    priceLevel: 3,
    openNow: false,
    waitTimeMinutes: 0,
    queueCount: 0,
    description: "A tranquil urban retreat offering Ayurvedic therapies, Swedish massages, and holistic wellness treatments by certified therapists.",
    hoursDetail: { Mon: "10 AM – 9 PM", Tue: "10 AM – 9 PM", Wed: "10 AM – 9 PM", Thu: "10 AM – 9 PM", Fri: "10 AM – 9 PM", Sat: "9 AM – 10 PM", Sun: "9 AM – 9 PM" },
    services: [
      { id: "s28", name: "Swedish Full Body (60 min)", duration: 60, price: 200000, description: "Classic relaxation massage" },
      { id: "s29", name: "Abhyanga (90 min)", duration: 90, price: 350000, description: "Traditional Ayurvedic oil massage" },
      { id: "s30", name: "Couple's Package", duration: 120, price: 600000, description: "Side-by-side massage + champagne" },
      { id: "s31", name: "Facial + Head Massage", duration: 75, price: 180000, description: "Deep cleanse + scalp therapy" },
    ],
    staff: [
      { id: "sp1", name: "Kavya Nambiar", role: "Senior Therapist", rating: 5.0 },
      { id: "sp2", name: "Tanveer Sheikh", role: "Ayurvedic Specialist", rating: 4.9 },
    ],
    hours: "Mon–Sun: 10 AM – 9 PM",
    amenities: ["WiFi", "Locker", "Jacuzzi", "Steam Room", "Café"],
  },
  {
    id: "b9",
    name: "Apollo Eye & Dental Clinic",
    category: "hospital",
    address: "204, Linking Road, Bandra West, Mumbai",
    imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80",
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&q=80",
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=80",
    ],
    rating: 4.5,
    reviewCount: 920,
    distanceKm: 2.3,
    priceLevel: 2,
    openNow: true,
    waitTimeMinutes: 15,
    queueCount: 9,
    phone: "+91 22 2640 1010",
    website: "apolloeye.in",
    description: "Specialized eye and dental care clinic with state-of-the-art equipment. Expert ophthalmologists and dentists under one roof.",
    hoursDetail: { Mon: "9 AM – 7 PM", Tue: "9 AM – 7 PM", Wed: "9 AM – 7 PM", Thu: "9 AM – 7 PM", Fri: "9 AM – 7 PM", Sat: "9 AM – 5 PM", Sun: "Closed" },
    services: [
      { id: "s32", name: "Eye Checkup", duration: 30, price: 80000, description: "Comprehensive eye exam + refraction" },
      { id: "s33", name: "Dental Cleaning", duration: 45, price: 120000, description: "Scaling, polishing & fluoride treatment" },
      { id: "s34", name: "LASIK Consultation", duration: 60, price: 50000, description: "Pre-surgery evaluation for LASIK" },
      { id: "s35", name: "Root Canal", duration: 90, price: 450000, description: "Single sitting RCT with ceramic crown" },
    ],
    staff: [
      { id: "dr4", name: "Dr. Suresh Menon", role: "Senior Ophthalmologist", rating: 4.8 },
      { id: "dr5", name: "Dr. Farah Khan", role: "Dental Surgeon", rating: 4.7 },
    ],
    hours: "Mon–Sat: 9 AM – 7 PM",
    amenities: ["Parking", "Lab", "Pharmacy", "AC"],
  },
  {
    id: "b10",
    name: "Cult.fit Fitness Studio",
    category: "gym",
    address: "Ground Floor, Phoenix Palladium, Lower Parel, Mumbai",
    imageUrl: "https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=600&q=80",
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&q=80",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
    ],
    rating: 4.6,
    reviewCount: 1120,
    distanceKm: 3.1,
    priceLevel: 3,
    openNow: true,
    waitTimeMinutes: 5,
    queueCount: 3,
    phone: "+91 98201 55677",
    website: "cult.fit",
    description: "India's top boutique fitness studio offering HIIT, strength, yoga, dance, and combat classes led by certified coaches.",
    hoursDetail: { Mon: "6 AM – 10 PM", Tue: "6 AM – 10 PM", Wed: "6 AM – 10 PM", Thu: "6 AM – 10 PM", Fri: "6 AM – 10 PM", Sat: "7 AM – 8 PM", Sun: "8 AM – 6 PM" },
    services: [
      { id: "s36", name: "HIIT Class (45 min)", duration: 45, price: 90000, description: "High-intensity interval training" },
      { id: "s37", name: "Power Yoga (60 min)", duration: 60, price: 80000, description: "Vinyasa flow for strength & flexibility" },
      { id: "s38", name: "Box Fit Class", duration: 45, price: 100000, description: "Boxing-inspired full-body workout" },
      { id: "s39", name: "Nutrition Consultation", duration: 60, price: 150000, description: "Personalised diet plan from a nutritionist" },
    ],
    staff: [
      { id: "g4", name: "Shreya Malhotra", role: "HIIT Coach", rating: 4.9 },
      { id: "g5", name: "Aakash Nair", role: "Strength Coach", rating: 4.8 },
    ],
    hours: "Mon–Fri: 6 AM – 10 PM, Sat–Sun: 7 AM – 8 PM",
    amenities: ["Locker", "Showers", "Towel Service", "Smoothie Bar", "AC"],
  },
  {
    id: "b11",
    name: "The Park Bangalore",
    category: "hotel",
    address: "14/7 MG Road, Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
      "https://images.unsplash.com/photo-1562778612-e1e0cda9915c?w=600&q=80",
    ],
    rating: 4.4,
    reviewCount: 1560,
    distanceKm: 4.8,
    priceLevel: 3,
    openNow: true,
    waitTimeMinutes: 0,
    queueCount: 0,
    phone: "+91 80 2559 4666",
    website: "theparkhotels.com",
    description: "A contemporary boutique hotel in the heart of MG Road, featuring modern design, rooftop pool, and award-winning cuisine.",
    hoursDetail: { Mon: "Open 24 hrs", Tue: "Open 24 hrs", Wed: "Open 24 hrs", Thu: "Open 24 hrs", Fri: "Open 24 hrs", Sat: "Open 24 hrs", Sun: "Open 24 hrs" },
    services: [
      { id: "s40", name: "Superior Room", duration: 0, price: 550000, description: "City view room with king-size bed" },
      { id: "s41", name: "Club Lounge Room", duration: 0, price: 950000, description: "Access to private lounge & butler" },
      { id: "s42", name: "Spa & Pool Day Pass", duration: 240, price: 200000, description: "Full spa access + rooftop pool" },
    ],
    staff: [
      { id: "h3", name: "Prithvi Shetty", role: "Guest Relations", rating: 4.8 },
      { id: "h4", name: "Lydia Fernandez", role: "Spa Manager", rating: 4.7 },
    ],
    hours: "Open 24 hours",
    amenities: ["Rooftop Pool", "Spa", "Restaurant", "Bar", "Gym", "Valet"],
  },
  {
    id: "b12",
    name: "Toit Brewpub",
    category: "restaurant",
    address: "298, 100 Feet Road, Indiranagar, Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
      "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=600&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    ],
    rating: 4.5,
    reviewCount: 2340,
    distanceKm: 3.7,
    priceLevel: 3,
    openNow: true,
    waitTimeMinutes: 45,
    queueCount: 31,
    phone: "+91 80 4115 6844",
    website: "toit.in",
    description: "Bengaluru's most beloved craft brewery and gastropub. Home to award-winning ales, artisan pizzas, and vibrant weekend nights.",
    hoursDetail: { Mon: "12 PM – 11 PM", Tue: "12 PM – 11 PM", Wed: "12 PM – 11 PM", Thu: "12 PM – 11 PM", Fri: "12 PM – 12 AM", Sat: "12 PM – 12 AM", Sun: "12 PM – 11 PM" },
    services: [
      { id: "s43", name: "Table for 2", duration: 90, price: 0, description: "Dine-in table reservation" },
      { id: "s44", name: "Brewery Tour", duration: 30, price: 50000, description: "Behind-the-scenes craft beer tour" },
      { id: "s45", name: "Private Event Space", duration: 180, price: 500000, description: "Exclusive venue for parties up to 50" },
    ],
    staff: [
      { id: "r3", name: "Chef Marcus D'Mello", role: "Head Chef", rating: 4.8 },
    ],
    hours: "Daily: 12 PM – 11 PM",
    amenities: ["Brewery", "Live Music", "Bar", "Terrace", "Parking"],
  },
  {
    id: "b13",
    name: "INOX Multiplex — Forum Mall",
    category: "entertainment",
    address: "Forum Value Mall, Whitefield, Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80",
      "https://images.unsplash.com/photo-1570136522835-7d9d44b79364?w=600&q=80",
      "https://images.unsplash.com/photo-1541959833400-049d37f98ccd?w=600&q=80",
    ],
    rating: 4.4,
    reviewCount: 2100,
    distanceKm: 7.1,
    priceLevel: 2,
    openNow: true,
    waitTimeMinutes: 0,
    queueCount: 0,
    phone: "+91 80 4088 5555",
    website: "inoxmovies.com",
    description: "Premium multiplex with 8 screens, Dolby Vision, and INSIGNIA Premium format. Known for the best sound quality in Bengaluru.",
    hoursDetail: { Mon: "10 AM – 11 PM", Tue: "10 AM – 11 PM", Wed: "10 AM – 11 PM", Thu: "10 AM – 11 PM", Fri: "10 AM – 12 AM", Sat: "9 AM – 12 AM", Sun: "9 AM – 11 PM" },
    services: [
      { id: "s46", name: "INSIGNIA Premium", duration: 150, price: 90000, description: "Ultra-premium recliner with butler service" },
      { id: "s47", name: "IMAX Ticket", duration: 150, price: 60000, description: "Giant screen with immersive sound" },
      { id: "s48", name: "Standard Ticket", duration: 150, price: 25000, description: "Regular screen, comfortable seating" },
    ],
    staff: [],
    hours: "Daily: 10 AM – 11 PM",
    amenities: ["IMAX", "Dolby Vision", "Food Court", "Parking", "Wheelchair Access"],
  },
  {
    id: "b14",
    name: "Lakmé Salon",
    category: "salon",
    address: "SV Road, Andheri West, Mumbai",
    imageUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
    ],
    rating: 4.3,
    reviewCount: 890,
    distanceKm: 1.5,
    priceLevel: 2,
    openNow: true,
    waitTimeMinutes: 20,
    queueCount: 7,
    phone: "+91 98200 12345",
    website: "lakmesalon.in",
    description: "India's leading beauty salon chain offering expert hair, skin, nail, and makeup services at accessible prices.",
    hoursDetail: { Mon: "10 AM – 8 PM", Tue: "10 AM – 8 PM", Wed: "10 AM – 8 PM", Thu: "10 AM – 8 PM", Fri: "10 AM – 9 PM", Sat: "9 AM – 9 PM", Sun: "10 AM – 8 PM" },
    services: [
      { id: "s49", name: "Haircut (Women)", duration: 60, price: 110000, description: "Cut + blow-dry + hair spa" },
      { id: "s50", name: "Facial (Gold)", duration: 60, price: 200000, description: "Gold facial with de-tan and brightening" },
      { id: "s51", name: "Manicure + Pedicure", duration: 90, price: 180000, description: "Classic nail care with massage" },
      { id: "s52", name: "Waxing (Full Arms + Legs)", duration: 45, price: 90000, description: "Rica wax for smooth skin" },
    ],
    staff: [
      { id: "st4", name: "Poonam Choudhary", role: "Senior Stylist", rating: 4.6 },
      { id: "st5", name: "Divya Sharma", role: "Beauty Therapist", rating: 4.5 },
    ],
    hours: "Daily: 10 AM – 8 PM",
    amenities: ["WiFi", "AC", "Bridal Services", "Kids Services"],
  },
  {
    id: "b15",
    name: "Manipal Hospital",
    category: "hospital",
    address: "98, HAL Old Airport Road, Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
      "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=600&q=80",
      "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80",
    ],
    rating: 4.7,
    reviewCount: 3450,
    distanceKm: 5.2,
    priceLevel: 3,
    openNow: true,
    waitTimeMinutes: 35,
    queueCount: 28,
    phone: "+91 80 2502 4444",
    website: "manipalhospitals.com",
    description: "One of India's foremost multi-specialty hospitals with 600+ beds, 18 specialties, and NABH accreditation. Renowned for oncology and cardiology.",
    hoursDetail: { Mon: "Open 24 hrs", Tue: "Open 24 hrs", Wed: "Open 24 hrs", Thu: "Open 24 hrs", Fri: "Open 24 hrs", Sat: "Open 24 hrs", Sun: "Open 24 hrs" },
    services: [
      { id: "s53", name: "OPD Consultation", duration: 20, price: 80000, description: "Consultation with specialist doctor" },
      { id: "s54", name: "Health Check Package", duration: 180, price: 500000, description: "Complete health assessment" },
      { id: "s55", name: "Oncology Review", duration: 45, price: 200000, description: "Cancer specialist consultation" },
    ],
    staff: [
      { id: "dr6", name: "Dr. Ramesh Babu", role: "Cardiologist", rating: 4.9 },
      { id: "dr7", name: "Dr. Sunita Rao", role: "Oncologist", rating: 4.8 },
    ],
    hours: "Open 24 hours",
    amenities: ["Emergency", "ICU", "NICU", "Pharmacy", "Lab", "Cafeteria"],
  },
  {
    id: "b16",
    name: "MedPlus Pharmacy",
    category: "pharmacy",
    address: "Shop 4, Koramangala 80 Feet Road, Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&q=80",
      "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=600&q=80",
      "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&q=80",
    ],
    rating: 4.2,
    reviewCount: 410,
    distanceKm: 0.4,
    priceLevel: 1,
    openNow: true,
    waitTimeMinutes: 8,
    queueCount: 5,
    phone: "+91 80 4567 8901",
    website: "medplusmart.com",
    description: "India's leading pharmacy chain with certified pharmacists, 10,000+ medicines, diagnostics, and home delivery. Discounts up to 25%.",
    hoursDetail: { Mon: "8 AM – 10 PM", Tue: "8 AM – 10 PM", Wed: "8 AM – 10 PM", Thu: "8 AM – 10 PM", Fri: "8 AM – 10 PM", Sat: "8 AM – 10 PM", Sun: "9 AM – 9 PM" },
    services: [
      { id: "s56", name: "Prescription Fill", duration: 10, price: 0, description: "Fill prescription medicines quickly" },
      { id: "s57", name: "Blood Pressure Check", duration: 5, price: 0, description: "Free BP monitoring" },
      { id: "s58", name: "Vitamin & Supplement Pack", duration: 10, price: 0, description: "Pharmacist curated supplement plan" },
      { id: "s59", name: "Blood Sugar Test", duration: 10, price: 5000, description: "Point-of-care glucose testing" },
    ],
    staff: [
      { id: "ph1", name: "Kavitha Reddy", role: "Chief Pharmacist", rating: 4.7 },
    ],
    hours: "Mon–Sat: 8 AM – 10 PM, Sun: 9 AM – 9 PM",
    amenities: ["Home Delivery", "Digital Prescription", "Lab Tests", "AC"],
  },
  {
    id: "b17",
    name: "Apollo Pharmacy",
    category: "pharmacy",
    address: "15, Anna Salai, Chennai",
    imageUrl: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=600&q=80",
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&q=80",
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&q=80",
    ],
    rating: 4.4,
    reviewCount: 680,
    distanceKm: 1.1,
    priceLevel: 1,
    openNow: true,
    waitTimeMinutes: 12,
    queueCount: 9,
    phone: "+91 44 2829 5555",
    website: "apollopharmacy.in",
    description: "Trusted pharmacy by the Apollo group. 24/7 availability, certified pharmacists, and quick delivery of prescription and OTC medicines.",
    hoursDetail: { Mon: "Open 24 hrs", Tue: "Open 24 hrs", Wed: "Open 24 hrs", Thu: "Open 24 hrs", Fri: "Open 24 hrs", Sat: "Open 24 hrs", Sun: "Open 24 hrs" },
    services: [
      { id: "s60", name: "24hr Prescription Fill", duration: 10, price: 0, description: "Round-the-clock medicine dispensing" },
      { id: "s61", name: "Health Consultation", duration: 15, price: 10000, description: "Quick pharmacist wellness consultation" },
      { id: "s62", name: "Diabetics Package", duration: 20, price: 50000, description: "HbA1c + glucose + cholesterol test" },
    ],
    staff: [
      { id: "ph2", name: "Dr. Ravi Subramanian", role: "Senior Pharmacist", rating: 4.8 },
    ],
    hours: "Open 24 hours",
    amenities: ["24/7", "Home Delivery", "Senior Discount", "Digital Records"],
  },
  {
    id: "b18",
    name: "Oxygen Esports Arena",
    category: "games",
    address: "2nd Floor, Phoenix Marketcity, Whitefield, Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80",
    ],
    rating: 4.5,
    reviewCount: 530,
    distanceKm: 6.3,
    priceLevel: 2,
    openNow: true,
    waitTimeMinutes: 10,
    queueCount: 6,
    phone: "+91 80 4900 1234",
    website: "oxygenarena.gg",
    description: "Premium PC gaming arena with 80+ high-end rigs, console lounges, VR pods, and professional esports training programs.",
    hoursDetail: { Mon: "11 AM – 11 PM", Tue: "11 AM – 11 PM", Wed: "11 AM – 11 PM", Thu: "11 AM – 11 PM", Fri: "11 AM – 1 AM", Sat: "10 AM – 1 AM", Sun: "10 AM – 11 PM" },
    services: [
      { id: "s63", name: "PC Gaming (1hr)", duration: 60, price: 60000, description: "High-end PC with 240Hz monitor" },
      { id: "s64", name: "PS5 Console (1hr)", duration: 60, price: 80000, description: "PlayStation 5 with 4K TV" },
      { id: "s65", name: "VR Pod (30 min)", duration: 30, price: 50000, description: "Standalone VR with 50+ games" },
      { id: "s66", name: "Esports Training Session", duration: 90, price: 150000, description: "Pro coach, analytics & VOD review" },
    ],
    staff: [
      { id: "gm2", name: "Arnav Kapoor", role: "Esports Coach", rating: 4.7 },
    ],
    hours: "Daily: 11 AM – 11 PM",
    amenities: ["AC", "Snack Bar", "Headsets", "Locker", "Tournament Zone"],
  },
  {
    id: "b19",
    name: "The Leela Palace",
    category: "hotel",
    address: "23 Kodihalli, Airport Road, Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
    ],
    rating: 4.9,
    reviewCount: 1870,
    distanceKm: 8.4,
    priceLevel: 4,
    openNow: true,
    waitTimeMinutes: 0,
    queueCount: 0,
    phone: "+91 80 2521 1234",
    website: "theleela.com",
    description: "India's finest 5-star palace hotel inspired by the grandeur of royal Bengaluru. Featuring a stunning lobby, world-class spa, and iconic restaurants.",
    hoursDetail: { Mon: "Open 24 hrs", Tue: "Open 24 hrs", Wed: "Open 24 hrs", Thu: "Open 24 hrs", Fri: "Open 24 hrs", Sat: "Open 24 hrs", Sun: "Open 24 hrs" },
    services: [
      { id: "s67", name: "Royal Suite", duration: 0, price: 3500000, description: "Palace-style suite with private terrace" },
      { id: "s68", name: "Deluxe Room", duration: 0, price: 1800000, description: "Garden view with butler service" },
      { id: "s69", name: "Spa Day Package", duration: 240, price: 800000, description: "Full-day access with 2-hr treatment" },
      { id: "s70", name: "High Tea for Two", duration: 90, price: 350000, description: "Signature afternoon tea in the lobby" },
    ],
    staff: [
      { id: "h5", name: "Vikram Nair", role: "Personal Butler", rating: 5.0 },
      { id: "h6", name: "Swati Pillai", role: "Spa Director", rating: 4.9 },
    ],
    hours: "Open 24 hours",
    amenities: ["Pool", "Spa", "Valet", "Butler Service", "Fine Dining", "Gym", "Bar"],
  },
  {
    id: "b20",
    name: "Smoke House Deli",
    category: "restaurant",
    address: "12, Vittal Mallya Road, Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1550966871-3ed3cfd18985?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1550966871-3ed3cfd18985?w=600&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    ],
    rating: 4.6,
    reviewCount: 1450,
    distanceKm: 2.9,
    priceLevel: 3,
    openNow: true,
    waitTimeMinutes: 25,
    queueCount: 16,
    phone: "+91 80 4112 5678",
    website: "smokehousedeli.com",
    description: "A beloved Bengaluru institution serving farm-to-table European cuisine, wood-fired breads, handcrafted cocktails, and weekend brunches.",
    hoursDetail: { Mon: "Closed", Tue: "12 PM – 11 PM", Wed: "12 PM – 11 PM", Thu: "12 PM – 11 PM", Fri: "12 PM – 12 AM", Sat: "11 AM – 12 AM", Sun: "11 AM – 11 PM" },
    services: [
      { id: "s71", name: "Table for 2", duration: 90, price: 0, description: "Dine-in reservation" },
      { id: "s72", name: "Weekend Brunch", duration: 120, price: 0, description: "Unlimited food + drinks brunch" },
      { id: "s73", name: "Cocktail Pairing Dinner", duration: 120, price: 350000, description: "4-course meal with paired cocktails" },
    ],
    staff: [
      { id: "r4", name: "Chef Alex Noronha", role: "Executive Chef", rating: 4.8 },
    ],
    hours: "Tue–Sun: 12 PM – 11 PM",
    amenities: ["Bar", "Outdoor Seating", "Wheelchair Access", "Live Music Weekends"],
  },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "bk1",
    businessId: "b2",
    serviceId: "s5",
    staffId: "st1",
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    time: "11:00 AM",
    persons: 1,
    status: "upcoming",
    token: "QUE-7A3F",
    createdAt: new Date().toISOString(),
  },
  {
    id: "bk2",
    businessId: "b1",
    serviceId: "s1",
    date: new Date().toISOString().slice(0, 10),
    time: "10:30 AM",
    persons: 1,
    status: "in-queue",
    token: "QUE-9B2K",
    queuePosition: 4,
    totalQueue: 14,
    estimatedWait: 22,
    createdAt: new Date().toISOString(),
  },
  {
    id: "bk3",
    businessId: "b5",
    serviceId: "s17",
    date: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10),
    time: "7:30 PM",
    persons: 2,
    status: "completed",
    token: "QUE-4C8M",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "bk4",
    businessId: "b4",
    serviceId: "s14",
    date: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10),
    time: "6:00 AM",
    persons: 1,
    status: "cancelled",
    token: "QUE-5D1P",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Your queue is moving",
    message: "You're now 4th in queue at City General Hospital. Estimated wait: 22 mins.",
    time: "5m ago",
    read: false,
    type: "queue",
    bookingId: "bk2",
    businessId: "b1",
  },
  {
    id: "n2",
    title: "Booking confirmed",
    message: "Aurora Hair Studio on Sat, 10 Jun at 11:00 AM — QUE-7A3F",
    time: "1h ago",
    read: false,
    type: "booking",
    bookingId: "bk1",
    businessId: "b2",
  },
  {
    id: "n3",
    title: "Weekend offer 🎉",
    message: "Get 20% off on all spa services this weekend. Use code WEEKEND20.",
    time: "3h ago",
    read: true,
    type: "promo",
    businessId: "b8",
  },
  {
    id: "n4",
    title: "Upcoming booking reminder",
    message: "Your appointment at Aurora Hair Studio is tomorrow at 11:00 AM.",
    time: "1d ago",
    read: true,
    type: "reminder",
    bookingId: "bk1",
    businessId: "b2",
  },
  {
    id: "n5",
    title: "Review your visit",
    message: "How was your experience at The Biryani Collective? Leave a review.",
    time: "3d ago",
    read: true,
    type: "booking",
    bookingId: "bk3",
    businessId: "b5",
  },
];

export function formatINR(paise: number) {
  const rupees = paise / 100;
  if (rupees === 0) return "Free";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(rupees);
}

export function formatPriceLevel(level: PriceLevel) {
  return "₹".repeat(level);
}

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function generateTimeSlots(startHour = 9, endHour = 21, intervalMins = 30) {
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += intervalMins) {
      const hour = h % 12 === 0 ? 12 : h % 12;
      const ampm = h < 12 ? "AM" : "PM";
      const min = m.toString().padStart(2, "0");
      slots.push(`${hour}:${min} ${ampm}`);
    }
  }
  return slots;
}

export function getCategoryLabel(id: CategoryId) {
  const map: Record<CategoryId, string> = {
    hospital: "Hospital",
    salon: "Salon & Spa",
    hotel: "Hotel",
    gym: "Gym",
    restaurant: "Restaurant",
    entertainment: "Cinema",
    games: "Gaming",
    pharmacy: "Pharmacy",
  };
  return map[id] ?? id;
}
