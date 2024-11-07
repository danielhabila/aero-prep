import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const body = await req.json();
  const { username, email } = body;

  try {
    let user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (user) {
      // Ensure user has required fields
      if (!user.subscriptions || !user.quizResults) {
        user = await prisma.user.update({
          where: { email },
          data: {
            subscriptions: user.subscriptions || [],
            quizResults: user.quizResults || [],
            quizProgress: user.quizProgress || null,
          },
        });
      }
      return NextResponse.json(
        { message: "User exists", user },
        { status: 200 }
      );
    } else {
      // Create new user with initialized fields and PSTAR subscription
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          subscriptions: [
            {
              type: "pstar",
              startDate: new Date().toISOString(),
              duration: null,
              endDate: null,
            },
          ],
          quizResults: [],
          quizProgress: null,
        },
      });
      return NextResponse.json(
        { message: "User created", user: newUser },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error in checkUser:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
