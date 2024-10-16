import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const { email, quizType } = await req.json();
  console.log(email, quizType);

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      // Check if the quizType already exists in the user's subscriptions
      if (!user.subscriptions.includes(quizType)) {
        // Update the user's subscription
        await prisma.user.update({
          where: { email },
          data: {
            subscriptions: {
              push: quizType,
            },
          },
        });
        return NextResponse.json(
          { message: "Subscription updated successfully" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "User already subscribed to this quiz type" },
          { status: 409 }
        );
      }
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
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

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { subscriptions: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { subscriptions: user.subscriptions },
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
