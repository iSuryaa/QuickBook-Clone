import { Router } from "express";
import { db } from "@workspace/db";
import { businessesTable, servicesTable, staffTable, reviewsTable } from "@workspace/db";
import { eq, ilike, and, or } from "drizzle-orm";
import { type AuthRequest, optionalAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/businesses", optionalAuth, async (req: AuthRequest, res) => {
  const { category, search, limit = "20", offset = "0" } = req.query as Record<string, string>;

  let query = db.select().from(businessesTable) as any;

  const conditions: any[] = [];
  if (category && category !== "all") {
    conditions.push(eq(businessesTable.category, category as any));
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
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const businesses = await query
    .limit(parseInt(limit))
    .offset(parseInt(offset));

  res.json({ businesses, total: businesses.length });
});

router.get("/businesses/:id", optionalAuth, async (req, res) => {
  const { id } = req.params;

  const business = await db.query.businessesTable.findFirst({
    where: eq(businessesTable.id, id),
  });

  if (!business) { res.status(404).json({ error: "Business not found" }); return; }

  const services = await db.select().from(servicesTable).where(eq(servicesTable.businessId, id));
  const staff = await db.select().from(staffTable).where(eq(staffTable.businessId, id));
  const reviews = await db.select().from(reviewsTable).where(eq(reviewsTable.businessId, id)).limit(10);

  res.json({ ...business, services, staff, reviews });
});

router.get("/businesses/:id/slots", async (req, res) => {
  const { date } = req.query as { date?: string };
  const targetDate = date ?? new Date().toISOString().slice(0, 10);

  const slots: { time: string; available: boolean; spotsLeft: number }[] = [];
  for (let h = 9; h < 21; h++) {
    for (const m of [0, 30]) {
      const hour = h % 12 === 0 ? 12 : h % 12;
      const ampm = h < 12 ? "AM" : "PM";
      const min = m.toString().padStart(2, "0");
      const time = `${hour}:${min} ${ampm}`;
      const rng = (h * 60 + m + targetDate.charCodeAt(8)) % 10;
      slots.push({ time, available: rng > 2, spotsLeft: rng > 2 ? rng - 2 : 0 });
    }
  }

  res.json({ slots, date: targetDate });
});

export default router;
