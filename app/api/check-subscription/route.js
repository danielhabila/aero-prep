import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const now = new Date();
    let validSubscriptions = [];
    let subscriptionsToRemove = [];

    // Filter subscriptions and identify expired ones
    user.subscriptions.forEach((sub) => {
      if (sub.type === "pstar") {
        validSubscriptions.push(sub);
      } else {
        const endDate = new Date(sub.endDate);
        if (endDate > now) {
          validSubscriptions.push(sub);
        } else {
          subscriptionsToRemove.push(sub);
        }
      }
    });

    // If there are expired subscriptions, update the user's subscription array
    if (subscriptionsToRemove.length > 0) {
      await prisma.user.update({
        where: { email },
        data: {
          subscriptions: validSubscriptions,
        },
      });
    }

    return NextResponse.json(
      { subscriptions: validSubscriptions },
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
