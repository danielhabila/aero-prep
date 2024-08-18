import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const body = await req.json();
  const { userId, correctAnswers, wrongAnswers } = body;

  try {
    let existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { quizResults: true },
    });
    if (
      existingUser &&
      existingUser.quizResults &&
      existingUser.quizResults.length > 0
    ) {
      const updatedUserStats = await prisma.quizResult.update({
        where: { id: existingUser.quizResults[0].id },
        data: {
          correctAnswers:
            existingUser.quizResults[0].correctAnswers + correctAnswers,
          wrongAnswers: existingUser.quizResults[0].wrongAnswers + wrongAnswers,
        },
      });
      return NextResponse.json({ updatedUserStats });
    } else {
      const newUser = await prisma.user.update({
        where: { id: userId },
        data: {
          quizResults: {
            create: {
              correctAnswers: correctAnswers,
              wrongAnswers: wrongAnswers,
            },
          },
        },
      });
      return NextResponse.json({ newUser });
    }
  } catch (error) {
    console.error(error);
    return;
  }
}
