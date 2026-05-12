import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const body = await req.json();
  const { email, quizType, outcomes } = body;

  if (!email || !quizType || !Array.isArray(outcomes)) {
    return NextResponse.json(
      { error: "email, quizType, and outcomes[] are required" },
      { status: 400 }
    );
  }

  try {
    await Promise.all(
      outcomes
        .filter((o) => o && o.questionId)
        .map((o) =>
          prisma.questionHistory.upsert({
            where: {
              email_quizType_questionId: {
                email,
                quizType,
                questionId: o.questionId,
              },
            },
            update: { wasCorrect: !!o.wasCorrect, answeredAt: new Date() },
            create: {
              email,
              quizType,
              questionId: o.questionId,
              wasCorrect: !!o.wasCorrect,
            },
          })
        )
    );

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("quizHistory error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
