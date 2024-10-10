"use client";

import { usePathname } from "next/navigation";
import { fetchUsers } from "@/app/(auth)/actions/fetchUsers";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function LayoutProvider({ children }) {
  const pathname = usePathname();
  const isPublicRoute = ["sign-in", "sign-up"].includes(pathname.split("/")[1]);
  const isDashboardRoute = pathname.includes("/dashboard");

  const getNavbar = () => {
    if (isPublicRoute || isDashboardRoute) return null;
    return <Navbar />;
  };

  const getFooter = () => {
    if (isPublicRoute || isDashboardRoute) return null;
    return <Footer />;
  };

  const getContent = () => {
    // if (isPublicRoute) return null;
    return <>{children}</>;
  };

  const getCurrentUser = async () => {
    try {
      const response = await fetchUsers();
      if (response.error) throw new Error(response.error.message);
    } catch (error) {
      console.log(error);
    } finally {
      return;
    }
  };

  useEffect(() => {
    if (!isPublicRoute) getCurrentUser();
  }, []);

  return (
    <div className="min-h-screen flex flexCol justify-between">
      {getNavbar()}
      {getContent()}
      {getFooter()}
    </div>
  );
}

export default LayoutProvider;
