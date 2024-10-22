"use client";

import { usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import MobileNavigation from "./MobileNavigation";

export default function DashboardHeader() {
  const pathname = usePathname();
  const title = pathname.split("/").pop();
  const { user } = useUser();

  // Convert to sentence case
  const sentenceCaseTitle =
    title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

  return (
    <div className="flex justify-between h-16 shrink-0 items-center border-b border-gray-600 my-4 px-6">
      <div className="flex items-center">
        <div className="lg:hidden mr-4">
          <MobileNavigation />
        </div>
        <h1 className="md:text-2xl text-xl font-bold">{sentenceCaseTitle}</h1>
      </div>
      <div className="ml-4 text-sm md:text-base text-gray-400">
        @{user.nickname}
      </div>
    </div>
  );
}
