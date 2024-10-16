"use client";

import { useState, useEffect } from "react";
import { Radio, RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";

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
    description: "The essentials to provide your best work for clients.",
    features: [
      "5 products",
      "Up to 1,000 subscribers",
      "Basic analytics",
      "48-hour support response time",
    ],
    mostPopular: false,
  },
  {
    name: "PPL (PPAER)",
    id: "ppl",
    href: "#",
    price: { "6months": "$60", "12months": "$100" },
    description: "A plan that scales with your rapidly growing business.",
    features: [
      "25 products",
      "Up to 10,000 subscribers",
      "Advanced analytics",
      "24-hour support response time",
      "Marketing automations",
    ],
    mostPopular: true,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Pricing() {
  const [frequency, setFrequency] = useState(frequencies[0]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const { user } = useUser();

  const handleQuizSelection = async (quizType, userEmail) => {
    console.log("userEmail", userEmail, "quizType", quizType);
    try {
      const response = await axios.post("/api/updateSubscription", {
        email: userEmail,
        quizType,
      });
      if (response.status === 200 || response.status === 409) {
        setUserSubscriptions([...userSubscriptions, quizType]);
      } else {
        console.error("Failed to update subscription");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  useEffect(() => {
    const fetchUserSubscriptions = async () => {
      if (user) {
        try {
          const response = await axios.get("/api/updateSubscription", {
            params: { email: user.email },
          });
          setUserSubscriptions(response.data.subscriptions);
        } catch (error) {
          console.error("Error fetching user subscriptions:", error);
        }
      }
    };

    fetchUserSubscriptions();
  }, [user]);

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Pricing plans for teams of&nbsp;all&nbsp;sizes
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300">
          Choose an affordable plan that’s packed with the best features for
          engaging your audience, creating customer loyalty, and driving sales.
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
        <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-10">
          <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="ring-1 ring-white/10 rounded-3xl p-8 xl:p-10 hover:bg-white/5 hover:ring-2 "
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
                  <Link
                    href={
                      userSubscriptions.includes("pstar") ? "#" : "/quiz/pstar"
                    }
                    aria-describedby={tier.id}
                    onClick={() =>
                      !userSubscriptions.includes("pstar") &&
                      handleQuizSelection("pstar", user.email)
                    }
                    className={classNames(
                      userSubscriptions.includes("pstar")
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-white/20 text-white hover:bg-white/30 focus-visible:outline-white",
                      "mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    )}
                    disabled={userSubscriptions.includes("pstar")}
                  >
                    {userSubscriptions.includes("pstar")
                      ? "Subscribed"
                      : "Start"}
                  </Link>
                ) : (
                  <Link
                    href={userSubscriptions.includes("ppl") ? "#" : "/quiz/ppl"}
                    aria-describedby={tier.id}
                    onClick={() =>
                      !userSubscriptions.includes("ppl") &&
                      handleQuizSelection("ppl", user.email)
                    }
                    className={classNames(
                      userSubscriptions.includes("ppl")
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : tier.mostPopular
                          ? "bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500"
                          : "bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white",
                      "mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    )}
                    disabled={userSubscriptions.includes("ppl")}
                  >
                    {userSubscriptions.includes("ppl")
                      ? "Subscribed"
                      : "Take PPL Quiz"}
                  </Link>
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
