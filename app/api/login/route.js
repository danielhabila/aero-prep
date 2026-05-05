import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST(req) {
  const { email } = await req.json().catch(() => ({}));

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (!existing) {
    const now = new Date().toISOString();
    await prisma.user.create({
      data: {
        email: normalized,
        username: normalized.split("@")[0],
        subscriptions: [
          { type: "pstar", startDate: now, duration: null, endDate: null },
          { type: "rocA", startDate: now, duration: null, endDate: null },
          { type: "inratMello", startDate: now, duration: null, endDate: null },
          { type: "ppl", startDate: now, duration: null, endDate: null },
        ],
        quizResults: [],
        quizProgress: null,
      },
    });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, normalized, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
