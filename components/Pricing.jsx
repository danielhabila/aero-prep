"use client";

import { useState, useEffect } from "react";
import { Radio, RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const frequencies = [
  { value: "6months", label: "6 Months", priceSuffix: "/6 months" },
  { value: "12months", label: "12 Months", priceSuffix: "/12 months" },
];
const tiers = [
  {
    name: "PSTAR",
    id: "pStar",
    href: "#",
    price: { "6months": "FREE", "12months": "FREE" },
    description:
      "Comprehensive set of practice questions covering all topics required for the exam, including air regulations, flight rules, weather, and safety procedures.",
    features: [
      "200 Questions",
      "Explanations Provided",
      "Progress Tracking & Stats",
      "Unlimited Access",
    ],
    mostPopular: false,
  },
  {
    name: "PPL (PPAER)",
    id: "ppl",
    href: "#",
    price: { "6months": "$60", "12months": "$100" },
    description:
      "Comprehensive set of practice questions covering all essential subjects, including navigation, meteorology, general knowledge, and air law.",
    features: [
      "500+ Questions",
      "Progress Tracking & Stats",
      "Unlimited Access",
      "Subject-specific Quizzes",
      "Complete Exam Simulation",
      "Customer Support",
    ],
    mostPopular: true,
  },
];

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const PurchaseButton = ({ price, disabled, user, frequency }) => {
  const handleClick = async () => {
    if (!user) {
      localStorage.setItem("pendingSubscriptionDuration", frequency);
      window.location.href = `/api/auth/login?returnTo=/api/direct-checkout?duration=${frequency}`;
      return;
    }

    try {
      const stripe = await stripePromise;
      const response = await axios.post("/api/create-checkout-session", {
        duration: frequency,
        email: user.email,
      });
      const { sessionId } = response.data;
      if (!sessionId) {
        throw new Error("Failed to create checkout session");
      }
      const result = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });
      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Error in checkout process:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={classNames(
        disabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500",
        "mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 w-full"
      )}
    >
      {disabled ? "Subscribed" : user ? "Purchase" : "Login to Purchase"}
    </button>
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Pricing() {
  const [frequency, setFrequency] = useState(frequencies[0]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const { user } = useUser();

  const handleQuizSelection = async (quizType, userEmail) => {
    try {
      const response = await axios.post("/api/updateSubscription", {
        email: userEmail,
        quizType,
      });
      if (response.status === 200 || response.status === 201) {
        fetchUserSubscriptions();
        return true; // Return true if subscription was successful
      } else {
        console.error("Failed to update subscription");
        return false;
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      return false;
    }
  };

  const fetchUserSubscriptions = async () => {
    if (user) {
      try {
        const response = await axios.get("/api/check-subscription", {
          params: { email: user.email },
        });
        setUserSubscriptions(response.data.subscriptions);
      } catch (error) {
        console.error("Error fetching user subscriptions:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserSubscriptions();
  }, [user]);

  const isPstarSubscribed = userSubscriptions.some(
    (sub) => sub.type === "pstar"
  );
  const isPplSubscribed = userSubscriptions.some((sub) => sub.type === "ppl");

  return (
    <div id="pricing" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* <h2 className="text-base font-semibold leading-7 text-indigo-400">
            Pricing
          </h2> */}
          <p className="mt-2 text-3xl font-bold tracking-tight text-indigo-400 sm:text-4xl">
            Practice Exams
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300">
          We offer Transport Canada tailored practice exams to help you
          confidently prepare for your PSTAR and PPL exams. Our question bank
          covers all key topics ensuring you’re fully equipped to succeed in no
          time.
        </p>
        <div className="mt-16 flex justify-center">
          <fieldset aria-label="Payment frequency">
            <RadioGroup
              value={frequency}
              onChange={setFrequency}
              className="grid grid-cols-2 gap-x-1 rounded-full bg-white/5 p-1 text-center text-lg font-semibold leading-5 text-white"
            >
              {frequencies.map((option) => (
                <Radio
                  key={option.value}
                  value={option}
                  className="cursor-pointer rounded-full px-3 py-1.5 data-[checked]:bg-indigo-500"
                >
                  {option.label}
                </Radio>
              ))}
            </RadioGroup>
          </fieldset>
        </div>
        <div className="mx-auto max-w-7xl lg:px-8 mt-10">
          <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="ring-1 ring-white/10 rounded-3xl p-6 sm:p-8 xl:p-10  duration-300 hover:shadow-2xl hover:ring-blue-500 "
              >
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={tier.id}
                    className="text-lg font-semibold leading-8 text-white"
                  >
                    {tier.name}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-300">
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-white">
                    {tier.price[frequency.value]}
                  </span>
                  {tier.price[frequency.value] !== "FREE" && (
                    <span className="text-sm font-semibold leading-6 text-gray-300">
                      {frequency.priceSuffix}
                    </span>
                  )}
                </p>
                {tier.id === "pStar" ? (
                  <button
                    onClick={async () => {
                      if (!user) {
                        window.location.href =
                          "/api/auth/login?returnTo=/dashboard/subscriptions";
                        return;
                      }

                      try {
                        const response = await axios.post(
                          "/api/updateSubscription",
                          {
                            email: user.email,
                            quizType: "pstar",
                          }
                        );

                        if (
                          response.status === 200 ||
                          response.status === 409
                        ) {
                          window.location.href = "/dashboard/subscriptions";
                        }
                      } catch (error) {
                        console.error("Error updating subscription:", error);
                      }
                    }}
                    className={classNames(
                      isPstarSubscribed
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-white text-black hover:bg-white/80 focus-visible:outline-white",
                      "mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 w-full"
                    )}
                    disabled={isPstarSubscribed}
                  >
                    {isPstarSubscribed
                      ? "Subscribed"
                      : user
                        ? "Start"
                        : "Login to Start"}
                  </button>
                ) : (
                  <PurchaseButton
                    price={parseFloat(
                      tier.price[frequency.value].replace("$", "")
                    )}
                    disabled={isPplSubscribed}
                    user={user}
                    frequency={frequency.value}
                  />
                )}
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10"
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon
                        aria-hidden="true"
                        className="h-6 w-5 flex-none text-white"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
