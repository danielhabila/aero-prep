"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeedbackButton from "@/components/FeedbackButton";

export default function LayoutProvider({ children }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname.includes("/dashboard");

  return (
    <>
      {!isDashboardRoute && <Navbar />}
      {children}
      {!isDashboardRoute && <Footer />}
      <FeedbackButton />
    </>
  );
}
