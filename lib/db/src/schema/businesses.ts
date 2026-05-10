import { pgTable, text, integer, real, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const categoryEnum = pgEnum("category", [
  "hospital", "salon", "hotel", "gym", "restaurant", "entertainment", "games",
]);

export const businessesTable = pgTable("businesses", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: categoryEnum("category").notNull(),
  address: text("address").notNull(),
  imageUrl: text("image_url").notNull(),
  photos: text("photos").array().notNull().default([]),
  rating: real("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  distanceKm: real("distance_km").notNull().default(0),
  priceLevel: integer("price_level").notNull().default(2),
  openNow: boolean("open_now").notNull().default(true),
  waitTimeMinutes: integer("wait_time_minutes").notNull().default(0),
  queueCount: integer("queue_count").notNull().default(0),
  phone: text("phone"),
  website: text("website"),
  description: text("description").notNull().default(""),
  hours: text("hours").notNull().default(""),
  amenities: text("amenities").array().notNull().default([]),
  hoursDetail: text("hours_detail"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const servicesTable = pgTable("services", {
  id: text("id").primaryKey(),
  businessId: text("business_id").notNull().references(() => businessesTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  duration: integer("duration").notNull().default(30),
  price: integer("price").notNull().default(0),
  description: text("description"),
});

export const staffTable = pgTable("staff", {
  id: text("id").primaryKey(),
  businessId: text("business_id").notNull().references(() => businessesTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  role: text("role").notNull(),
  rating: real("rating").notNull().default(4.5),
  imageUrl: text("image_url"),
});

export const insertBusinessSchema = createInsertSchema(businessesTable);
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type Business = typeof businessesTable.$inferSelect;
export type Service = typeof servicesTable.$inferSelect;
export type Staff = typeof staffTable.$inferSelect;
