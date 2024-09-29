"use client";

import { usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutProvider({ children }) {
  const pathname = usePathname();
  const { user, isLoading } = useUser();

  const isDashboardRoute = pathname === "/dashboard";

  if (isDashboardRoute && !user && !isLoading) {
    // Redirect to login if not authenticated
    window.location.href = "/api/auth/login";
    return null;
  }

  return (
    <>
      {!isDashboardRoute && <Navbar />}
      {children}
      <Footer />
    </>
  );
}
