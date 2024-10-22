import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const { email, quizType } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { subscriptions: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingSubscription = user.subscriptions.find(
      (sub) => sub.type === quizType
    );

    if (existingSubscription) {
      return NextResponse.json(
        { message: "User already subscribed to this quiz type" },
        { status: 409 }
      );
    }

    await prisma.user.update({
      where: { email },
      data: {
        subscriptions: {
          push: {
            type: quizType,
            startDate: new Date().toISOString(),
            duration: quizType === "pstar" ? null : 6,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Subscription updated successfully" },
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
