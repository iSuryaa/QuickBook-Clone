export type CategoryId = "hospital" | "salon" | "hotel" | "gym" | "restaurant" | "entertainment" | "games";
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
}

export const BUSINESSES: Business[] = [
  {
    id: "b1",
    name: "City General Hospital",
    category: "hospital",
    address: "12 Medical Park, Sector 15, Gurugram",
    imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80",
    rating: 4.6,
    reviewCount: 1240,
    distanceKm: 1.2,
    priceLevel: 2,
    openNow: true,
    waitTimeMinutes: 22,
    queueCount: 14,
    phone: "+91 98765 43210",
    description: "A multi-specialty hospital offering world-class healthcare. Known for OPD efficiency, advanced diagnostics, and compassionate care.",
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
    rating: 4.8,
    reviewCount: 612,
    distanceKm: 0.8,
    priceLevel: 3,
    openNow: true,
    waitTimeMinutes: 18,
    queueCount: 6,
    phone: "+91 87654 32109",
    description: "Premium hair studio specialising in color, keratin, and styling. Known for its welcoming vibe and highly skilled stylists.",
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
    rating: 4.7,
    reviewCount: 2180,
    distanceKm: 3.4,
    priceLevel: 4,
    openNow: true,
    waitTimeMinutes: 0,
    queueCount: 0,
    phone: "+91 22 6634 4400",
    description: "A 5-star luxury property overlooking the Arabian Sea. Featuring award-winning restaurants, a rooftop infinity pool, and a world-class spa.",
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
    rating: 4.5,
    reviewCount: 834,
    distanceKm: 1.9,
    priceLevel: 2,
    openNow: true,
    waitTimeMinutes: 10,
    queueCount: 4,
    description: "High-performance fitness centre with premium equipment, dedicated zones for strength, cardio, and functional training.",
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
    rating: 4.4,
    reviewCount: 1890,
    distanceKm: 2.1,
    priceLevel: 2,
    openNow: true,
    waitTimeMinutes: 30,
    queueCount: 22,
    phone: "+91 11 4321 8765",
    description: "Renowned for dum-cooked biryanis crafted from heirloom recipes. Awarded 'Best Biryani in Delhi' 3 years running.",
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
    rating: 4.6,
    reviewCount: 3210,
    distanceKm: 4.2,
    priceLevel: 2,
    openNow: true,
    waitTimeMinutes: 0,
    queueCount: 0,
    description: "Mumbai's most premium multiplex with Dolby Atmos, 4DX, and IMAX screens. Luxury recliner seating and gourmet F&B.",
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
    rating: 4.3,
    reviewCount: 756,
    distanceKm: 5.6,
    priceLevel: 2,
    openNow: true,
    waitTimeMinutes: 15,
    queueCount: 8,
    description: "India's premium gaming and entertainment center featuring cricket simulators, go-karting, VR experiences and 100+ arcade games.",
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
    rating: 4.9,
    reviewCount: 445,
    distanceKm: 0.5,
    priceLevel: 3,
    openNow: false,
    waitTimeMinutes: 0,
    queueCount: 0,
    description: "A tranquil urban retreat offering Ayurvedic therapies, Swedish massages, and holistic wellness treatments by certified therapists.",
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
  },
  {
    id: "n2",
    title: "Booking confirmed",
    message: "Aurora Hair Studio on Sat, 10 Jun at 11:00 AM — QUE-7A3F",
    time: "1h ago",
    read: false,
    type: "booking",
  },
  {
    id: "n3",
    title: "Weekend offer 🎉",
    message: "Get 20% off on all spa services this weekend. Use code WEEKEND20.",
    time: "3h ago",
    read: true,
    type: "promo",
  },
  {
    id: "n4",
    title: "Upcoming booking reminder",
    message: "Your appointment at Aurora Hair Studio is tomorrow at 11:00 AM.",
    time: "1d ago",
    read: true,
    type: "reminder",
  },
  {
    id: "n5",
    title: "Review your visit",
    message: "How was your experience at The Biryani Collective? Leave a review.",
    time: "3d ago",
    read: true,
    type: "booking",
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
    games: "Games",
  };
  return map[id] ?? id;
}
