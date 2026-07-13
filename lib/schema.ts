import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const registrationsTable = pgTable("registrations", {
  id: serial("id").primaryKey(),
  nickname: text("nickname").notNull(),
  contact: text("contact"),
  role: text("role").notNull(), // 'visitor' | 'participant'
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Registration = typeof registrationsTable.$inferSelect;

export const subscriptionsTable = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  contact: text("contact").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Subscription = typeof subscriptionsTable.$inferSelect;
