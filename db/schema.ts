import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { organization, user } from "../auth-schema";

// Location Table
export const location = pgTable("location", {
  id: text("id").primaryKey(),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organization.id),
  name: text("name").notNull(),
  address: text("address"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Space Table
export const space = pgTable("space", {
  id: text("id").primaryKey(),
  locationId: text("locationId")
    .notNull()
    .references(() => location.id),
  name: text("name").notNull(),
  type: text("type").notNull(), // e.g., 'desk', 'meeting_room'
  capacity: integer("capacity").notNull(),
  isAvailable: boolean("isAvailable").notNull().default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Booking Table
export const booking = pgTable("booking", {
  id: text("id").primaryKey(),
  spaceId: text("spaceId")
    .notNull()
    .references(() => space.id),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organization.id),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime").notNull(),
  status: text("status").notNull().default("'confirmed'"), // e.g., 'confirmed', 'cancelled'
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
