import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const { email, quizType, duration } = await req.json();

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

    const subscriptionData = {
      type: quizType,
      startDate: new Date().toISOString(),
    };

    if (quizType !== "pstar" && quizType !== "rocA") {
      const months = duration === "12months" ? 12 : 6;
      subscriptionData.duration = months;
      subscriptionData.endDate = new Date(
        new Date().setMonth(new Date().getMonth() + months)
      ).toISOString();
    }

    await prisma.user.update({
      where: { email },
      data: {
        subscriptions: {
          push: subscriptionData,
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
