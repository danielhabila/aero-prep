import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getPriceForDuration = (duration) => {
  return duration === "12months" ? 59 : 39;
};

export async function POST(req) {
  const { duration, email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { error: "User email is required" },
      { status: 400 }
    );
  }

  try {
    const price = getPriceForDuration(duration);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: `PPL Quiz ${
                duration === "12months" ? "12 Months" : "6 Months"
              } Access`,
            },
            unit_amount: price * 100, // Stripe expects the amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}&email=${email}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/purchase`,
      client_reference_id: email,
      metadata: {
        email: email,
        duration: duration,
      },
      customer_email: email,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
