import { Router } from "express";
import { db } from "@workspace/db";
import { bookingsTable, businessesTable, servicesTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth";
import { z } from "zod/v4";
import crypto from "crypto";

const router = Router();

function generateToken() {
  return `QB-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}
function generateId() {
  return `bk_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

const CreateBookingBody = z.object({
  businessId: z.string(),
  serviceId: z.string().optional(),
  staffId: z.string().optional(),
  date: z.string(),
  time: z.string(),
  persons: z.number().int().min(1).max(10).default(1),
  seats: z.array(z.string()).optional(),
  notes: z.string().optional(),
  isQueueJoin: z.boolean().optional(),
});

router.get("/bookings", requireAuth, async (req: AuthRequest, res) => {
  const rawBookings = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.userId, req.userId!))
    .orderBy(desc(bookingsTable.createdAt));

  const enriched = await Promise.all(rawBookings.map(async b => {
    const biz = await db.query.businessesTable.findFirst({ where: eq(businessesTable.id, b.businessId) });
    const svc = b.serviceId ? await db.query.servicesTable.findFirst({ where: eq(servicesTable.id, b.serviceId) }) : null;
    return {
      ...b,
      businessName: biz?.name ?? "",
      businessAddress: biz?.address ?? "",
      businessImageUrl: biz?.imageUrl ?? "",
      serviceName: svc?.name ?? "",
    };
  }));

  res.json({ bookings: enriched });
});

router.post("/bookings", requireAuth, async (req: AuthRequest, res) => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid booking data", issues: parsed.error.issues }); return; }

  const { businessId, serviceId, staffId, date, time, persons, seats, notes, isQueueJoin } = parsed.data;

  const biz = await db.query.businessesTable.findFirst({ where: eq(businessesTable.id, businessId) });
  if (!biz) { res.status(404).json({ error: "Business not found" }); return; }

  const id = generateId();
  const token = generateToken();
  const status = isQueueJoin ? "in-queue" : "upcoming";
  const queuePosition = isQueueJoin ? biz.queueCount + 1 : undefined;
  const totalQueue = isQueueJoin ? biz.queueCount + 1 : undefined;
  const estimatedWait = isQueueJoin ? biz.waitTimeMinutes : undefined;

  await db.insert(bookingsTable).values({
    id, userId: req.userId!, businessId, serviceId: serviceId ?? null,
    staffId: staffId ?? null, date, time, persons, status,
    token, queuePosition, totalQueue, estimatedWait,
    seats: seats ?? null, platformFee: 2900, notes: notes ?? null,
  });

  if (isQueueJoin) {
    await db.update(businessesTable)
      .set({ queueCount: biz.queueCount + 1 })
      .where(eq(businessesTable.id, businessId));
  }

  const booking = await db.query.bookingsTable.findFirst({ where: eq(bookingsTable.id, id) });
  res.status(201).json({ booking, businessName: biz.name, businessAddress: biz.address });
});

router.patch("/bookings/:id/cancel", requireAuth, async (req: AuthRequest, res) => {
  const booking = await db.query.bookingsTable.findFirst({
    where: and(eq(bookingsTable.id, req.params.id), eq(bookingsTable.userId, req.userId!)),
  });
  if (!booking) { res.status(404).json({ error: "Booking not found" }); return; }
  if (booking.status === "cancelled") { res.status(400).json({ error: "Already cancelled" }); return; }

  await db.update(bookingsTable).set({ status: "cancelled" }).where(eq(bookingsTable.id, req.params.id));

  const bookingDate = new Date(`${booking.date}T${booking.time.replace(" AM", "").replace(" PM", "")}:00`);
  const now = new Date();
  const hoursUntil = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  const refundPercent = hoursUntil >= 24 ? 100 : hoursUntil >= 4 ? 50 : 0;

  res.json({ success: true, refundPercent, message: refundPercent === 100 ? "Full refund of ₹29 will be processed in 3-5 days" : refundPercent === 50 ? "50% refund (₹14) will be processed in 3-5 days" : "No refund — cancelled less than 4 hours before appointment" });
});

router.get("/bookings/:id", requireAuth, async (req: AuthRequest, res) => {
  const booking = await db.query.bookingsTable.findFirst({
    where: and(eq(bookingsTable.id, req.params.id), eq(bookingsTable.userId, req.userId!)),
  });
  if (!booking) { res.status(404).json({ error: "Not found" }); return; }

  const biz = await db.query.businessesTable.findFirst({ where: eq(businessesTable.id, booking.businessId) });
  const svc = booking.serviceId ? await db.query.servicesTable.findFirst({ where: eq(servicesTable.id, booking.serviceId) }) : null;

  res.json({ ...booking, businessName: biz?.name, businessAddress: biz?.address, businessImageUrl: biz?.imageUrl, serviceName: svc?.name });
});

export default router;
