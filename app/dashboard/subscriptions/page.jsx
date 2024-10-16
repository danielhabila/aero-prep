"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Loader from "@/components/Loader";
import Image from "next/image";
import logo from "../../../public/images/prepMeWhite2.png";

export default function SubscriptionsPage() {
  const { user, isLoading } = useUser();
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (user && user.email) {
        try {
          const response = await axios.get("/api/updateSubscription", {
            params: { email: user.email },
          });
          setSubscriptions(response.data.subscriptions);
        } catch (error) {
          console.error("Error fetching subscriptions:", error);
        } finally {
          setIsLoadingSubscriptions(false);
        }
      }
    };

    if (!isLoading) {
      fetchSubscriptions();
    }
  }, [user, isLoading]);

  if (isLoading || isLoadingSubscriptions) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader />
      </div>
    );
  }

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold mb-4">No Active Subscriptions</h2>
        <p>You are not currently subscribed to any quizzes.</p>
        <Link
          href="/dashboard/purchase"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          Subscribe to a quiz
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:max-w-none items-start pb-6">
      {subscriptions.map((subscription) => (
        <div key={subscription} className="h-full flex flex-col">
          <div className="mb-4">
            <a
              className="block group overflow-hidden"
              href={`/quiz/${subscription}`}
            >
              <Image
                className="w-full aspect-[101/64] object-cover group-hover:scale-105 transition duration-700 ease-out"
                src={logo}
                width="202"
                height="128"
                alt="Item 01"
              />
            </a>
          </div>
          <div className="grow text-center">
            <a
              className="font-cabinet-grotesk font-bold text-gray-100 hover:text-blue-500 transition duration-150 ease-in-out"
              href="#0"
            >
              {subscription.toUpperCase()} Quiz
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
