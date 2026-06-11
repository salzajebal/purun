import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  kakao_link: text("kakao_link"),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export type SiteSettings = typeof siteSettingsTable.$inferSelect;
