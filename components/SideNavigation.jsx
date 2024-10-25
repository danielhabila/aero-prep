"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RectangleStackIcon,
  ChartBarIcon,
  ArrowLeftEndOnRectangleIcon,
  FolderPlusIcon,
} from "@heroicons/react/24/outline";
import logo from "../public/images/prepMeWhite2.png";
import axios from "axios";
import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

const navigation = [
  {
    name: "Subscriptions",
    href: "/dashboard/subscriptions",
    icon: RectangleStackIcon,
  },
  { name: "Stats", href: "/dashboard/stats", icon: ChartBarIcon },
  { name: "Purchase", href: "/dashboard/purchase", icon: FolderPlusIcon },
];

export default function SideNavigation() {
  const pathname = usePathname();
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
            setSubscription(response.data.subscriptions[0]);
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

  const calculateDaysRemaining = (startDate, duration) => {
    if (!startDate || !duration) return null;
    const start = new Date(startDate);
    const end = new Date(start.setMonth(start.getMonth() + duration));
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
    <nav className="w-64 bg-gray-900 text-white p-4 border-r border-gray-600">
      <div className="flex h-16 shrink-0 items-center">
        <Link href={"/"}>
          <Image src={logo} alt="PrepMe" className="mx-2 w-10" />
        </Link>
      </div>
      <div className="flex flex-1 flex-col h-5/6 justify-between mt-10">
        <ul>
          {navigation.map((item) => (
            <li key={item.name} className="my-3">
              <Link
                href={item.href}
                className={`flex items-center p-2 rounded-lg ${
                  pathname === item.href
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <item.icon className="h-6 w-6 mr-3" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {subscription && (
          <>
            <div className="mt-auto p-3 space-y-2 mb-10 ">
              <h1 className="text-white text-base font-semibold">
                Active Subscription
              </h1>
              <p className="text-gray-400 text-sm">
                Subscription: {getSubscriptionName(subscription)}
              </p>
              {subscription.type !== "pstar" && (
                <p className="text-gray-400 text-sm">
                  Days remaining:{" "}
                  {calculateDaysRemaining(
                    subscription.startDate,
                    subscription.duration
                  )}{" "}
                  days
                </p>
              )}
            </div>
          </>
        )}

        <div>
          <a
            href="/api/auth/logout"
            className="flex items-center p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-red-400"
          >
            <ArrowLeftEndOnRectangleIcon className="h-6 w-6 mr-3" />
            Logout
          </a>
        </div>
      </div>
    </nav>
  );
}
