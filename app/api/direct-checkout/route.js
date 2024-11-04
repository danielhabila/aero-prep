import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSession } from "@auth0/nextjs-auth0";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getPriceForDuration = (duration) => {
  return duration === "12months" ? 100 : 60;
};

export async function GET(req) {
  try {
    const session = await getSession(req);

    if (!session || !session.user) {
      return NextResponse.redirect(new URL("/api/auth/login", req.url));
    }

    // Check if user already has a valid PPL subscription
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { subscriptions: true },
    });

    if (user) {
      const now = new Date();
      const hasValidPplSubscription = user.subscriptions.some((sub) => {
        if (sub.type === "ppl") {
          const endDate = new Date(sub.startDate);
          endDate.setMonth(endDate.getMonth() + sub.duration);
          return endDate > now;
        }
        return false;
      });

      if (hasValidPplSubscription) {
        return NextResponse.redirect(
          new URL("/dashboard/subscriptions", req.url)
        );
      }
    }

    const duration = req.nextUrl.searchParams.get("duration") || "12months";
    const price = getPriceForDuration(duration);
    const priceInCents = price * 100;

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: "PPL Quiz Access",
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}&email=${session.user.email}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/purchase`,
      client_reference_id: session.user.email,
      metadata: {
        email: session.user.email,
        duration: duration,
      },
      customer_email: session.user.email,
    });

    return NextResponse.redirect(stripeSession.url);
  } catch (error) {
    console.error("Error in direct-checkout:", error);
    return NextResponse.redirect(new URL("/dashboard/purchase", req.url));
  }
}
