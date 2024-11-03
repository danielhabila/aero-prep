"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeedbackButton from "@/components/FeedbackButton";
import Loader from "@/components/Loader";

export default function LayoutProvider({ children }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname.includes("/dashboard");
  const isSuccessPage = pathname === "/success";
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {!isDashboardRoute && !isSuccessPage && <Navbar user={user} />}
      {children}
      {!isDashboardRoute && !isSuccessPage && <Footer />}
      <FeedbackButton />
    </>
  );
}
