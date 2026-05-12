const BASE_URL = "/api";

function getToken(): string | null {
  return localStorage.getItem("qb_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json() as T;
}

export const api = {
  // Auth — using the original /auth/* routes (6-digit OTP "123456" in dev)
  sendOtp: (phone: string) =>
    request<{ success: boolean; expiresIn: number }>("/auth/send-otp", {
      method: "POST", body: JSON.stringify({ phone }),
    }),

  verifyOtp: (phone: string, code: string) =>
    request<{ token: string; user: ApiUser; isNewUser: boolean }>("/auth/verify-otp", {
      method: "POST", body: JSON.stringify({ phone, code }),
    }),

  updateProfile: (data: { name: string; email?: string }) =>
    request<{ user: ApiUser }>("/auth/profile", {
      method: "PUT", body: JSON.stringify(data),
    }),

  getMe: () => request<{ user: ApiUser & { noShowCount: number } }>("/auth/me"),

  // Customer listings (public, no auth required)
  getBusinesses: (params?: { category?: string; search?: string; limit?: number; offset?: number }) => {
    const q = new URLSearchParams();
    if (params?.category && params.category !== "all") q.set("category", params.category);
    if (params?.search) q.set("search", params.search);
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.offset) q.set("page", String(Math.floor((params.offset ?? 0) / (params.limit ?? 20)) + 1));
    return request<{ listings: ApiBusiness[]; total: number }>(`/listings?${q}`)
      .then(r => ({ businesses: r.listings, total: r.total }));
  },

  getBusinessById: (id: string) =>
    request<ApiBusiness & { services: ApiService[]; staff: ApiStaff[]; reviews: ApiReview[] }>(`/listings/${id}`),

  getSlots: (businessId: string, date: string, serviceId?: string) => {
    const q = new URLSearchParams({ date });
    if (serviceId) q.set("serviceId", serviceId);
    return request<{ slots: ApiSlot[]; date: string; durationMin?: number }>(`/listings/${businessId}/slots?${q}`);
  },

  // Bookings
  getBookings: () => request<{ bookings: ApiBooking[] }>("/bookings"),

  createBooking: (data: CreateBookingPayload) =>
    request<{ booking: ApiBooking; token: string; platformFee: number; status: string; businessName: string; businessAddress: string }>("/bookings", {
      method: "POST", body: JSON.stringify(data),
    }),

  cancelBooking: (id: string) =>
    request<{ success: boolean; refundPercent: number; message: string }>(`/bookings/${id}/cancel`, {
      method: "PATCH",
    }),

  getBooking: (id: string) => request<ApiBooking>(`/bookings/${id}`),

  // Rating
  submitRating: (data: { token: string; rating: number; comment?: string }) =>
    request<{ success: boolean }>("/ratings", {
      method: "POST", body: JSON.stringify(data),
    }),

  // Waitlist
  joinWaitlist: (data: { listingId: string; serviceId?: string; date: string; time: string; customerName: string; customerPhone: string }) =>
    request<{ position: number; waitlistId: string }>("/waitlist", {
      method: "POST", body: JSON.stringify(data),
    }),
};

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ApiUser {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
}

export interface ApiBusiness {
  id: string;
  name: string;
  category: string;
  address: string;
  imageUrl: string;
  photos: string[];
  rating: number;
  reviewCount: number;
  distanceKm: number;
  priceLevel: number;
  openNow: boolean;
  waitTimeMinutes: number;
  queueCount: number;
  phone: string | null;
  website: string | null;
  description: string;
  hours: string;
  amenities: string[];
  hoursDetail: string | null;
}

export interface ApiService {
  id: string;
  businessId: string;
  name: string;
  duration: number;
  price: number;
  description: string | null;
}

export interface ApiStaff {
  id: string;
  businessId: string;
  name: string;
  role: string;
  rating: number;
  imageUrl: string | null;
}

export interface ApiReview {
  id: string;
  userId: string;
  businessId: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface ApiSlot {
  time: string;
  available: boolean;
  spotsLeft: number;
}

export interface ApiBooking {
  id: string;
  userId: string;
  businessId: string;
  serviceId: string | null;
  staffId: string | null;
  date: string;
  time: string;
  persons: number;
  status: "upcoming" | "in-queue" | "completed" | "cancelled";
  token: string;
  ratingToken?: string | null;
  queuePosition: number | null;
  totalQueue: number | null;
  estimatedWait: number | null;
  seats: string[] | null;
  platformFee: number;
  notes: string | null;
  createdAt: string;
  businessName?: string;
  businessAddress?: string;
  businessImageUrl?: string;
  serviceName?: string;
  staffName?: string;
}

export interface CreateBookingPayload {
  businessId?: string;
  listingId?: string;
  serviceId?: string;
  staffId?: string;
  date: string;
  time: string;
  persons?: number;
  seats?: string[];
  notes?: string;
  isQueueJoin?: boolean;
  customerPhone?: string;
  customerName?: string;
  paymentId?: string;
}
