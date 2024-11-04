"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";

export default function ActiveSubscription() {
  const [subscription, setSubscription] = useState(null);
  const { user, isLoading } = useUser();

  useEffect(() => {
    const fetchSubscription = async () => {
      if (user && user.email) {
        try {
          const response = await axios.get("/api/check-subscription", {
            params: { email: user.email },
          });
          if (
            response.data.subscriptions &&
            response.data.subscriptions.length > 0
          ) {
            const paidSubscriptions = response.data.subscriptions.filter(
              (sub) => sub.type !== "pstar"
            );
            if (paidSubscriptions.length > 0) {
              setSubscription(paidSubscriptions[0]);
            }
          }
        } catch (error) {
          console.error("Error fetching subscription:", error);
        }
      }
    };

    if (!isLoading) {
      fetchSubscription();
    }
  }, [user, isLoading]);

  const calculateDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const daysRemaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return daysRemaining > 0 ? daysRemaining : 0;
  };

  const getSubscriptionName = (subscription) => {
    if (!subscription) return "";
    const name = subscription.type.toUpperCase();
    if (subscription.type === "pstar") return name;
    return `${name} (${subscription.duration} months)`;
  };

  return (
    <>
      {subscription && (
        <div className="mt-auto p-3 space-y-2 mb-10 ">
          <h1 className="text-white text-base font-semibold">
            Active Subscription
          </h1>
          <p className="text-gray-400 text-sm">
            Subscription: {getSubscriptionName(subscription)}
          </p>
          {subscription.type !== "pstar" && (
            <p className="text-gray-400 text-sm">
              Days remaining: {calculateDaysRemaining(subscription.endDate)}{" "}
              days
            </p>
          )}
        </div>
      )}
    </>
  );
}
