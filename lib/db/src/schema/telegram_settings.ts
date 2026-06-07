import { pgTable, serial, boolean, text, timestamp } from "drizzle-orm/pg-core";

export const telegramSettingsTable = pgTable("telegram_settings", {
  id: serial("id").primaryKey(),
  enabled: boolean("enabled").notNull().default(false),
  bot_token: text("bot_token"),
  chat_id: text("chat_id"),
  chat_name: text("chat_name"),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export type TelegramSettings = typeof telegramSettingsTable.$inferSelect;
