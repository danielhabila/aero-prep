import { NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const session = await getSession(req);
    if (!session || !session.user) {
      return NextResponse.redirect(new URL("/api/auth/login", req.url));
    }

    const quizType = req.nextUrl.searchParams.get("type");
    if (!quizType || !["pstar", "rocA", "inratMello"].includes(quizType)) {
      return NextResponse.redirect(
        new URL("/dashboard/subscriptions", req.url)
      );
    }

    // Check if user already has this subscription
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { subscriptions: true },
    });

    if (user) {
      const hasSubscription = user.subscriptions.some(
        (sub) => sub.type === quizType
      );

      if (!hasSubscription) {
        // Add subscription
        await prisma.user.update({
          where: { email: session.user.email },
          data: {
            subscriptions: {
              push: {
                type: quizType,
                startDate: new Date().toISOString(),
              },
            },
          },
        });
      }
    }

    return NextResponse.redirect(new URL("/dashboard/subscriptions", req.url));
  } catch (error) {
    console.error("Error in auto-subscribe:", error);
    return NextResponse.redirect(new URL("/dashboard/subscriptions", req.url));
  }
}
