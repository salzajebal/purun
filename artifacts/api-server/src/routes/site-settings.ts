import { Router } from "express";
import { db, siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const ADMIN_TOKEN = "daechuldream-admin-token-2024";

function requireAdmin(req: import("express").Request, res: import("express").Response): boolean {
  const token = req.headers["x-admin-token"];
  if (token !== ADMIN_TOKEN) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

async function getSiteSettings() {
  const rows = await db.select().from(siteSettingsTable).limit(1);
  return rows[0] ?? null;
}

router.get("/settings/kakao-link", async (_req, res) => {
  const settings = await getSiteSettings();
  res.json({ kakao_link: settings?.kakao_link ?? null });
});

router.get("/admin/settings", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const settings = await getSiteSettings();
  res.json({ kakao_link: settings?.kakao_link ?? null });
});

router.put("/admin/settings", async (req, res) => {
  if (!requireAdmin(req, res)) return;

  const { kakao_link } = req.body as { kakao_link?: string };

  const existing = await getSiteSettings();

  if (existing) {
    const [updated] = await db
      .update(siteSettingsTable)
      .set({ kakao_link: kakao_link ?? null, updated_at: new Date() })
      .where(eq(siteSettingsTable.id, existing.id))
      .returning();
    res.json({ kakao_link: updated.kakao_link ?? null });
  } else {
    const [created] = await db
      .insert(siteSettingsTable)
      .values({ kakao_link: kakao_link ?? null })
      .returning();
    res.json({ kakao_link: created.kakao_link ?? null });
  }
});

export default router;
