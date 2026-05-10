import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, otpTable } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";
import { generateToken, generateOtp, generateId } from "../lib/auth";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth";
import { z } from "zod/v4";

const router = Router();

const SendOtpBody = z.object({ phone: z.string().min(10).max(15) });
const VerifyOtpBody = z.object({ phone: z.string(), code: z.string().length(6) });
const UpdateProfileBody = z.object({ name: z.string().min(1), email: z.string().email().optional() });

router.post("/auth/send-otp", async (req, res) => {
  const parsed = SendOtpBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid phone number" }); return; }
  const { phone } = parsed.data;

  const code = process.env.NODE_ENV === "development" ? "123456" : generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  const otpId = generateId("otp");

  await db.insert(otpTable).values({ id: otpId, phone, code, expiresAt });

  req.log.info({ phone, code }, "OTP sent");
  res.json({ success: true, message: "OTP sent", expiresIn: 300 });
});

router.post("/auth/verify-otp", async (req, res) => {
  const parsed = VerifyOtpBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request" }); return; }
  const { phone, code } = parsed.data;

  const now = new Date();
  const otpRecord = await db.query.otpTable.findFirst({
    where: and(
      eq(otpTable.phone, phone),
      eq(otpTable.code, code),
      eq(otpTable.used, "false"),
      gt(otpTable.expiresAt, now),
    ),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });

  if (!otpRecord) {
    res.status(400).json({ error: "Invalid or expired OTP" });
    return;
  }

  await db.update(otpTable).set({ used: "true" }).where(eq(otpTable.id, otpRecord.id));

  let user = await db.query.usersTable.findFirst({ where: eq(usersTable.phone, phone) });
  const isNewUser = !user;

  if (!user) {
    const userId = generateId("usr");
    await db.insert(usersTable).values({ id: userId, phone });
    user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, userId) });
  }

  if (!user) { res.status(500).json({ error: "Failed to create user" }); return; }

  const token = generateToken(user.id);
  res.json({ token, user: { id: user.id, phone: user.phone, name: user.name, email: user.email }, isNewUser });
});

router.put("/auth/profile", requireAuth, async (req: AuthRequest, res) => {
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }

  await db.update(usersTable)
    .set({ name: parsed.data.name, email: parsed.data.email })
    .where(eq(usersTable.id, req.userId!));

  const user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, req.userId!) });
  res.json({ user: { id: user!.id, phone: user!.phone, name: user!.name, email: user!.email } });
});

router.get("/auth/me", requireAuth, async (req: AuthRequest, res) => {
  const user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, req.userId!) });
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  res.json({ user: { id: user.id, phone: user.phone, name: user.name, email: user.email, noShowCount: user.noShowCount } });
});

export default router;
