import { Router } from "express";
import { db, applicationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { SubmitApplicationBody } from "@workspace/api-zod";
import { sendTelegramNotification } from "../lib/telegram";

const router = Router();

router.post("/applications", async (req, res) => {
  const parsed = SubmitApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }

  const { name, phone, job_type, loan_amount, loan_purpose, residence_type, annual_income, credit_score, message } = parsed.data;

  const existing = await db.select({ id: applicationsTable.id })
    .from(applicationsTable)
    .where(eq(applicationsTable.phone, phone))
    .limit(1);

  if (existing.length > 0) {
    res.status(409).json({ error: "이미 신청된 전화번호입니다. 담당자가 곧 연락드립니다." });
    return;
  }

  const [app] = await db.insert(applicationsTable).values({
    name,
    phone,
    job_type,
    loan_amount: loan_amount ?? null,
    loan_purpose: loan_purpose ?? null,
    residence_type: residence_type ?? null,
    annual_income: annual_income ?? null,
    credit_score: credit_score ?? null,
    message: message ?? null,
  }).returning();

  await sendTelegramNotification(app).catch(() => {});

  res.status(201).json({
    id: app.id,
    name: app.name,
    phone: app.phone,
    job_type: app.job_type,
    loan_amount: app.loan_amount,
    loan_purpose: app.loan_purpose,
    residence_type: app.residence_type,
    annual_income: app.annual_income,
    credit_score: app.credit_score,
    message: app.message,
    status: app.status,
    created_at: app.created_at.toISOString(),
  });
});

export default router;
