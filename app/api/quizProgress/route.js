import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const body = await req.json();
  const { email, quizType, activeQuestion, results, quizStartTime } = body;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (user) {
      await prisma.user.update({
        where: { email: email },
        data: {
          quizProgress: {
            quizType,
            activeQuestion,
            results,
            quizStartTime,
          },
        },
      });
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Quiz progress saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const quizType = searchParams.get("quizType");

  if (!email || !quizType) {
    return NextResponse.json(
      { error: "Email and quizType are required" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { quizProgress: true },
    });

    if (
      !user ||
      !user.quizProgress ||
      user.quizProgress.quizType !== quizType
    ) {
      return NextResponse.json(
        { error: "No quiz progress found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user.quizProgress, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
