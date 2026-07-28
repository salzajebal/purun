import { db, telegramSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { Application } from "@workspace/db";

export async function getTelegramConfig() {
  const [settings] = await db.select().from(telegramSettingsTable).limit(1);
  return settings ?? null;
}

export async function sendTelegramNotification(app: Application): Promise<void> {
  const settings = await getTelegramConfig();
  if (!settings || !settings.enabled || !settings.bot_token || !settings.chat_id) {
    return;
  }

  const jobTypeLabel: Record<string, string> = {
    직장인: "직장인",
    사업자: "사업자",
    주부: "주부",
    무직자: "무직자",
  };

  const message = [
    "🔔 새로운 대출 신청이 접수되었습니다!",
    "",
    `이름: ${app.name}`,
    `연락처: ${app.phone}`,
    `직업구분: ${jobTypeLabel[app.job_type] ?? app.job_type}`,
    app.loan_amount ? `대출 금액: ${app.loan_amount}` : null,
    app.loan_purpose ? `대출 목적: ${app.loan_purpose}` : null,
    app.credit_score ? `신용등급: ${app.credit_score}` : null,
    app.annual_income ? `연 소득: ${app.annual_income}` : null,
    app.message ? `메모: ${app.message}` : null,
    "",
    `신청 시간: ${app.created_at.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`,
  ].filter(Boolean).join("\n");

  const url = `https://api.telegram.org/bot${settings.bot_token}/sendMessage`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: settings.chat_id,
      text: message,
      parse_mode: "HTML",
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Telegram API error: ${err}`);
  }
}

export async function discoverChats(botToken: string): Promise<Array<{ id: string; name: string; type: string }>> {
  const url = `https://api.telegram.org/bot${botToken}/getUpdates?limit=100&allowed_updates=["message","my_chat_member"]`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Invalid bot token or Telegram API error");
  }
  const data = await response.json() as { ok: boolean; result: Array<{ message?: { chat: { id: number; title?: string; first_name?: string; last_name?: string; type: string; username?: string } }; my_chat_member?: { chat: { id: number; title?: string; first_name?: string; type: string; username?: string } } }> };
  if (!data.ok) {
    throw new Error("Telegram API returned error");
  }

  const chatMap = new Map<string, { id: string; name: string; type: string }>();
  for (const update of data.result) {
    const chat = update.message?.chat ?? update.my_chat_member?.chat;
    if (!chat) continue;
    const id = String(chat.id);
    const name = chat.title ?? [chat.first_name, (chat as { last_name?: string }).last_name].filter(Boolean).join(" ") ?? chat.username ?? id;
    chatMap.set(id, { id, name, type: chat.type });
  }

  return Array.from(chatMap.values());
}
