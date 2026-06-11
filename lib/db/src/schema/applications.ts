import { pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  job_type: varchar("job_type", { length: 50 }).notNull(),
  loan_amount: varchar("loan_amount", { length: 50 }),
  loan_purpose: varchar("loan_purpose", { length: 100 }),
  residence_type: varchar("residence_type", { length: 50 }),
  annual_income: varchar("annual_income", { length: 50 }),
  credit_score: varchar("credit_score", { length: 50 }),
  message: text("message"),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const insertApplicationSchema = createInsertSchema(applicationsTable).omit({
  id: true,
  status: true,
  created_at: true,
});

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;
