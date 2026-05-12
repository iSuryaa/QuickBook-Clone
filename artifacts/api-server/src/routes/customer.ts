import { Router } from "express";
import { db } from "@workspace/db";
import {
  businessesTable,
  servicesTable,
  staffTable,
  reviewsTable,
  bookingsTable,
  usersTable,
  otpTable,
  waitlistTable,
  type Business,
  type Service,
  type Staff,
  type Booking,
} from "@workspace/db";
import { eq, ilike, or, and, desc } from "drizzle-orm";
import { z } from "zod/v4";
import crypto from "crypto";
import { generateToken as generateJwt } from "../lib/auth";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth";

const router = Router();

function genId(prefix = "id") {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

// ── Schemas ───────────────────────────────────────────────────────────────────

const ListingsQuery = z.object({
  category: z.string().optional(),
  city: z.string().optional(),
  search: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const SlotsQuery = z.object({
  serviceId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});


const SendOtpBody = z.object({ phone: z.string().min(10) });
const VerifyOtpBody = z.object({ phone: z.string(), otp: z.string() });

const RatingBody = z.object({
  token: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

const WaitlistBody = z.object({
  listingId: z.string(),
  serviceId: z.string().optional(),
  date: z.string(),
  time: z.string(),
  customerName: z.string().min(1),
  customerPhone: z.string().min(10),
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateSlots(date: string, durationMin = 30): { time: string; available: boolean; spotsLeft: number }[] {
  const slots: { time: string; available: boolean; spotsLeft: number }[] = [];
  const seed = date.charCodeAt(8) + date.charCodeAt(9);
  for (let minutes = 9 * 60; minutes < 21 * 60; minutes += durationMin) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const hour = h % 12 === 0 ? 12 : h % 12;
    const ampm = h < 12 ? "AM" : "PM";
    const min = m.toString().padStart(2, "0");
    const time = `${hour}:${min} ${ampm}`;
    const rng = (h * 60 + m + seed) % 10;
    slots.push({ time, available: rng > 2, spotsLeft: rng > 2 ? rng - 2 : 0 });
  }
  return slots;
}

// ── 1. GET /listings ──────────────────────────────────────────────────────────

router.get("/listings", async (req, res) => {
  const parsed = ListingsQuery.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query parameters", issues: parsed.error.issues });
    return;
  }
  const { category, city, search, lat, lng, page, limit } = parsed.data;
  const offset = (page - 1) * limit;

  const conditions: any[] = [];
  if (category && category !== "all") {
    conditions.push(eq(businessesTable.category, category as any));
  }
  if (city) {
    conditions.push(ilike(businessesTable.address, `%${city}%`));
  }
  if (search) {
    conditions.push(
      or(
        ilike(businessesTable.name, `%${search}%`),
        ilike(businessesTable.address, `%${search}%`),
        ilike(businessesTable.description, `%${search}%`),
      ),
    );
  }

  let query = db.select().from(businessesTable) as any;
  if (conditions.length > 0) query = query.where(and(...conditions));

  const businesses = await query.limit(limit).offset(offset);

  const listings = await Promise.all(
    businesses.map(async (biz: typeof businessesTable.$inferSelect) => {
      const services = await db
        .select()
        .from(servicesTable)
        .where(eq(servicesTable.businessId, biz.id));

      const distanceKm = lat != null && lng != null ? biz.distanceKm : null;

      const addressParts = biz.address.split(",");
      const city = addressParts[addressParts.length - 1]?.trim() ?? "";

      return {
        id: biz.id,
        name: biz.name,
        category: biz.category,
        image: biz.imageUrl,
        images: biz.photos,
        averageRating: biz.rating,
        totalRatings: biz.reviewCount,
        distanceKm,
        city,
        address: biz.address,
        openNow: biz.openNow,
        waitTimeMinutes: biz.waitTimeMinutes,
        queueCount: biz.queueCount,
        priceLevel: biz.priceLevel,
        description: biz.description,
        phone: biz.phone,
        website: biz.website,
        hours: biz.hours,
        amenities: biz.amenities,
        services: services.map((s: Service) => ({
          id: s.id,
          name: s.name,
          durationMin: s.duration,
          price: s.price,
          description: s.description,
        })),
      };
    }),
  );

  if (lat != null && lng != null) {
    listings.sort((a: any, b: any) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
  } else {
    listings.sort((a: any, b: any) => b.averageRating - a.averageRating);
  }

  res.json({ listings, total: listings.length, page, limit });
});

// ── 2. GET /listings/:id ──────────────────────────────────────────────────────

router.get("/listings/:id", async (req, res) => {
  const biz = await db.query.businessesTable.findFirst({
    where: eq(businessesTable.id, req.params.id),
  });
  if (!biz) { res.status(404).json({ error: "Listing not found" }); return; }

  const [services, staff, rawReviews] = await Promise.all([
    db.select().from(servicesTable).where(eq(servicesTable.businessId, biz.id)),
    db.select().from(staffTable).where(eq(staffTable.businessId, biz.id)),
    db
      .select({
        id: reviewsTable.id,
        rating: reviewsTable.rating,
        text: reviewsTable.text,
        createdAt: reviewsTable.createdAt,
        customerName: usersTable.name,
      })
      .from(reviewsTable)
      .leftJoin(usersTable, eq(reviewsTable.userId, usersTable.id))
      .where(eq(reviewsTable.businessId, biz.id))
      .orderBy(desc(reviewsTable.createdAt))
      .limit(10),
  ]);

  const addressParts = biz.address.split(",");
  const city = addressParts[addressParts.length - 1]?.trim() ?? "";

  res.json({
    id: biz.id,
    name: biz.name,
    category: biz.category,
    image: biz.imageUrl,
    images: biz.photos,
    address: biz.address,
    city,
    phone: biz.phone,
    website: biz.website,
    description: biz.description,
    hours: biz.hours,
    hoursDetail: biz.hoursDetail ? JSON.parse(biz.hoursDetail) : null,
    amenities: biz.amenities,
    averageRating: biz.rating,
    totalRatings: biz.reviewCount,
    priceLevel: biz.priceLevel,
    openNow: biz.openNow,
    waitTimeMinutes: biz.waitTimeMinutes,
    queueCount: biz.queueCount,
    services: services.map((s: Service) => ({
      id: s.id,
      name: s.name,
      durationMin: s.duration,
      price: s.price,
      description: s.description,
    })),
    staff: staff.map((st: Staff) => ({
      id: st.id,
      name: st.name,
      role: st.role,
      rating: st.rating,
      imageUrl: st.imageUrl,
    })),
    reviews: rawReviews.map((r: { id: string; rating: number; text: string; createdAt: Date; customerName: string | null }) => ({
      id: r.id,
      rating: r.rating,
      comment: r.text,
      customerName: r.customerName ?? "Guest",
      date: r.createdAt,
    })),
  });
});

// ── 3. GET /listings/:id/slots ────────────────────────────────────────────────

router.get("/listings/:id/slots", async (req, res) => {
  const parsed = SlotsQuery.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "serviceId and date (YYYY-MM-DD) are required", issues: parsed.error.issues });
    return;
  }
  const { serviceId, date } = parsed.data;

  const service = await db.query.servicesTable.findFirst({
    where: eq(servicesTable.id, serviceId),
  });
  if (!service) { res.status(404).json({ error: "Service not found" }); return; }

  const slots = generateSlots(date, service.duration || 30);
  res.json({ slots, date, serviceId, durationMin: service.duration });
});

// ── 4. POST /bookings — handled in bookings.ts (supports both auth + guest) ───

// ── 5. GET /bookings/:token (public lookup by token) ──────────────────────────

router.get("/bookings/by-token/:token", async (req, res) => {
  const booking = await db.query.bookingsTable.findFirst({
    where: eq(bookingsTable.token, req.params.token),
  });
  if (!booking) { res.status(404).json({ error: "Booking not found" }); return; }

  const biz = await db.query.businessesTable.findFirst({
    where: eq(businessesTable.id, booking.businessId),
  });
  const svc = booking.serviceId
    ? await db.query.servicesTable.findFirst({ where: eq(servicesTable.id, booking.serviceId) })
    : null;

  res.json({
    ...booking,
    businessName: biz?.name ?? "",
    businessAddress: biz?.address ?? "",
    businessImageUrl: biz?.imageUrl ?? "",
    serviceName: svc?.name ?? "",
  });
});

// ── 6. POST /auth/customer/otp ────────────────────────────────────────────────

router.post("/auth/customer/otp", async (req, res) => {
  const parsed = SendOtpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid phone number" });
    return;
  }
  const { phone } = parsed.data;

  const testOtp = "1234";
  const otpId = genId("otp");
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await db.insert(otpTable).values({ id: otpId, phone, code: testOtp, expiresAt });

  const payload: Record<string, string> = { message: "OTP sent" };
  if (process.env.NODE_ENV !== "production") payload.testOtp = testOtp;
  res.json(payload);
});

// ── 7. POST /auth/customer/verify ─────────────────────────────────────────────

router.post("/auth/customer/verify", async (req, res) => {
  const parsed = VerifyOtpBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request" }); return; }
  const { phone, otp } = parsed.data;

  const isDev = process.env.NODE_ENV !== "production";
  const validOtp = isDev && otp === "1234";

  if (!validOtp) {
    const now = new Date();
    const record = await db.query.otpTable.findFirst({
      where: and(
        eq(otpTable.phone, phone),
        eq(otpTable.code, otp),
        eq(otpTable.used, "false"),
      ),
      orderBy: [desc(otpTable.createdAt)],
    });
    if (!record || record.expiresAt < now) {
      res.status(400).json({ error: "Invalid or expired OTP" });
      return;
    }
    await db.update(otpTable).set({ used: "true" }).where(eq(otpTable.id, record.id));
  }

  let user = await db.query.usersTable.findFirst({ where: eq(usersTable.phone, phone) });
  if (!user) {
    const userId = genId("usr");
    await db.insert(usersTable).values({ id: userId, phone });
    user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, userId) });
  }
  if (!user) { res.status(500).json({ error: "Failed to create user" }); return; }

  const token = generateJwt(user.id);
  res.json({
    token,
    user: { id: user.id, name: user.name, phone: user.phone, email: user.email },
  });
});

// ── 8. GET /customer/bookings (auth required) ─────────────────────────────────

router.get("/customer/bookings", requireAuth, async (req: AuthRequest, res) => {
  const rawBookings = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.userId, req.userId!))
    .orderBy(desc(bookingsTable.createdAt));

  const enriched = await Promise.all(
    rawBookings.map(async (b: Booking) => {
      const biz = await db.query.businessesTable.findFirst({
        where: eq(businessesTable.id, b.businessId),
      });
      const svc = b.serviceId
        ? await db.query.servicesTable.findFirst({ where: eq(servicesTable.id, b.serviceId) })
        : null;
      return {
        ...b,
        businessName: biz?.name ?? "",
        businessAddress: biz?.address ?? "",
        businessImageUrl: biz?.imageUrl ?? "",
        serviceName: svc?.name ?? "",
      };
    }),
  );

  res.json({ bookings: enriched });
});

// ── 9. POST /ratings (one-time token) ────────────────────────────────────────

router.post("/ratings", async (req, res) => {
  const parsed = RatingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid rating data", issues: parsed.error.issues });
    return;
  }
  const { token, rating, comment } = parsed.data;

  const booking = await db.query.bookingsTable.findFirst({
    where: eq(bookingsTable.ratingToken, token),
  });
  if (!booking) { res.status(404).json({ error: "Invalid or already used rating token" }); return; }
  if (!["completed", "upcoming"].includes(booking.status)) {
    res.status(400).json({ error: "Rating only available after service completion" });
    return;
  }

  const reviewId = genId("rv");
  await db.insert(reviewsTable).values({
    id: reviewId,
    userId: booking.userId,
    businessId: booking.businessId,
    rating,
    text: comment ?? "",
  });

  const allReviews = await db
    .select({ rating: reviewsTable.rating })
    .from(reviewsTable)
    .where(eq(reviewsTable.businessId, booking.businessId));
  const avgRating = allReviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / allReviews.length;
  await db
    .update(businessesTable)
    .set({ rating: Math.round(avgRating * 10) / 10, reviewCount: allReviews.length })
    .where(eq(businessesTable.id, booking.businessId));

  await db
    .update(bookingsTable)
    .set({ ratingToken: null })
    .where(eq(bookingsTable.id, booking.id));

  res.json({ success: true });
});

// ── 10. POST /waitlist ────────────────────────────────────────────────────────

router.post("/waitlist", async (req, res) => {
  const parsed = WaitlistBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid waitlist data", issues: parsed.error.issues });
    return;
  }
  const { listingId, serviceId, date, time, customerName, customerPhone } = parsed.data;

  const biz = await db.query.businessesTable.findFirst({
    where: eq(businessesTable.id, listingId),
  });
  if (!biz) { res.status(404).json({ error: "Listing not found" }); return; }

  const existing = await db
    .select({ id: waitlistTable.id })
    .from(waitlistTable)
    .where(
      and(
        eq(waitlistTable.businessId, listingId),
        eq(waitlistTable.date, date),
        eq(waitlistTable.time, time),
        eq(waitlistTable.status, "waiting"),
      ),
    );

  const position = existing.length + 1;
  const id = genId("wl");
  await db.insert(waitlistTable).values({
    id,
    businessId: listingId,
    serviceId: serviceId ?? null,
    date,
    time,
    customerName,
    customerPhone,
    position,
    status: "waiting",
  });

  res.status(201).json({ position, waitlistId: id });
});

export default router;
