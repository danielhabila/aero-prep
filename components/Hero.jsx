"use client";

import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const Hero = () => {
  const { user } = useUser();

  const handlePstarRocA = async (quizType) => {
    if (!user) {
      // If user is not logged in, store quiz type and redirect to login
      localStorage.setItem("pendingQuizSubscription", quizType);
      window.location.href = `/api/auth/login?returnTo=/api/auto-subscribe?type=${quizType}`;
      return;
    }

    // User is logged in, check their subscriptions
    try {
      const response = await axios.get("/api/check-subscription", {
        params: { email: user.email },
      });

      const hasSubscription = response.data.subscriptions?.some(
        (sub) => sub.type === quizType
      );

      if (hasSubscription) {
        window.location.href = "/dashboard/subscriptions";
      } else {
        // Subscribe user to the quiz
        await axios.post("/api/updateSubscription", {
          email: user.email,
          quizType: quizType,
        });
        window.location.href = "/dashboard/subscriptions";
      }
    } catch (error) {
      console.error("Error checking/updating subscription:", error);
    }
  };

  const handlePPL = async () => {
    if (!user) {
      localStorage.setItem("pendingSubscriptionDuration", "6months"); // Default to 6 months
      window.location.href = `/api/auth/login?returnTo=/api/direct-checkout?duration=6months`;
      return;
    }

    try {
      const response = await axios.get("/api/check-subscription", {
        params: { email: user.email },
      });

      const hasPPLSubscription = response.data.subscriptions?.some(
        (sub) => sub.type === "ppl"
      );

      if (hasPPLSubscription) {
        window.location.href = "/dashboard/subscriptions";
      } else {
        const stripe = await stripePromise;
        const checkoutResponse = await axios.post(
          "/api/create-checkout-session",
          {
            duration: "6months",
            email: user.email,
          }
        );

        const { sessionId } = checkoutResponse.data;
        if (!sessionId) {
          throw new Error("Failed to create checkout session");
        }

        const result = await stripe.redirectToCheckout({
          sessionId: sessionId,
        });

        if (result.error) {
          console.error(result.error.message);
        }
      }
    } catch (error) {
      console.error("Error in PPL subscription process:", error);
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center">
      <Image
        src="https://images.pexels.com/photos/6894103/pexels-photo-6894103.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt="Background Image"
        fill
        style={{ objectFit: "cover" }}
        quality={100}
        className="opacity-30"
      />
      <div className="absolute inset-0 bg-[#111827] opacity-70"></div>
      <div className="relative z-10 text-center text-white">
        <div className="px-4 md:px-6 max-w-[1500px] mx-auto sm:w-[90%]">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
              Pass your TC exams in days not months
            </h1>
            <p className="text-gray-200 text-xl py-4">
              Save time and practice questions that will appear on the actual
              exam.
            </p>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => handlePstarRocA("pstar")}
              className="px-6 py-2 rounded-full inline-flex items-center bg-white text-black font-medium text-lg hover:bg-white/80 group"
            >
              PSTAR
            </button>
            <button
              onClick={() => handlePstarRocA("rocA")}
              className="px-6 py-2 rounded-full inline-flex items-center bg-white text-black font-medium text-lg hover:bg-white/80 group"
            >
              ROC-A
            </button>
            <button
              onClick={handlePPL}
              className="px-6 py-2 rounded-full inline-flex items-center bg-white text-black font-medium text-lg hover:bg-white/80 group"
            >
              PPL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
