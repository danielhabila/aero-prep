import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const body = await req.json();
  const {
    email,
    quizType,
    activeQuestion,
    questions,
    results,
    quizStartTime,
    studyMode,
    answeredQuestions,
    saveId,
  } = body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existing = Array.isArray(user.quizSaves) ? user.quizSaves : [];
    const updatedSave = {
      id: saveId ?? crypto.randomUUID(),
      savedAt: new Date().toISOString(),
      quizType,
      activeQuestion,
      questions,
      results,
      quizStartTime,
      studyMode: studyMode ?? false,
      answeredQuestions: answeredQuestions ?? [],
    };

    const updated = saveId
      ? existing.map((s) => (s.id === saveId ? updatedSave : s))
      : [...existing, updatedSave];

    await prisma.user.update({
      where: { email },
      data: { quizSaves: JSON.parse(JSON.stringify(updated)) },
    });

    return NextResponse.json({ message: "Quiz saved successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { quizSaves: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ quizSaves: user.quizSaves ?? [] }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const id = searchParams.get("id");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existing = Array.isArray(user.quizSaves) ? user.quizSaves : [];
    const updated = id ? existing.filter((s) => s.id !== id) : [];

    await prisma.user.update({
      where: { email },
      data: { quizSaves: JSON.parse(JSON.stringify(updated)) },
    });

    return NextResponse.json({ message: "Save deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
