import { create } from "domain";
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid ('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  username: text('name').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(), 
  updatedAt: timestamp('updated_at').defaultNow(),
})
export type User = typeof users.$inferSelect;