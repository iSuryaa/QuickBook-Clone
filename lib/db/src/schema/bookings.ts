import { pgTable, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { businessesTable, servicesTable, staffTable } from "./businesses";

export const bookingStatusEnum = pgEnum("booking_status", [
  "upcoming", "in-queue", "completed", "cancelled",
]);

export const bookingsTable = pgTable("bookings", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  businessId: text("business_id").notNull().references(() => businessesTable.id, { onDelete: "cascade" }),
  serviceId: text("service_id").references(() => servicesTable.id),
  staffId: text("staff_id").references(() => staffTable.id),
  date: text("date").notNull(),
  time: text("time").notNull(),
  persons: integer("persons").notNull().default(1),
  status: bookingStatusEnum("status").notNull().default("upcoming"),
  token: text("token").notNull(),
  ratingToken: text("rating_token"),
  queuePosition: integer("queue_position"),
  totalQueue: integer("total_queue"),
  estimatedWait: integer("estimated_wait"),
  seats: text("seats").array(),
  platformFee: integer("platform_fee").notNull().default(2900),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reviewsTable = pgTable("reviews", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id),
  businessId: text("business_id").notNull().references(() => businessesTable.id),
  rating: integer("rating").notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const waitlistTable = pgTable("waitlist", {
  id: text("id").primaryKey(),
  businessId: text("business_id").notNull().references(() => businessesTable.id, { onDelete: "cascade" }),
  serviceId: text("service_id"),
  date: text("date").notNull(),
  time: text("time").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  position: integer("position").notNull(),
  status: text("status").notNull().default("waiting"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
export type Review = typeof reviewsTable.$inferSelect;
export type Waitlist = typeof waitlistTable.$inferSelect;
