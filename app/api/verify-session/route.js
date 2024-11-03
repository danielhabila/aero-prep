import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");
  const email = searchParams.get("email");

  if (!sessionId || !email) {
    return NextResponse.json(
      { error: "Missing session_id or email" },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        const subscriptionDuration = session.amount_total === 10000 ? 12 : 6;

        await prisma.user.update({
          where: { email },
          data: {
            subscriptions: {
              push: {
                type: "ppl",
                startDate: new Date().toISOString(),
                duration: subscriptionDuration,
              },
            },
          },
        });

        return NextResponse.json({
          message: "Subscription updated successfully",
        });
      } else {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    } else {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error verifying session" },
      { status: 500 }
    );
  }
}
