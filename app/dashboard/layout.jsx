import SideNavigation from "@/components/SideNavigation";
import DashboardHeader from "@/components/DashboardHeader";
import { getCurrentUserEmail } from "@/lib/session";
import { redirect } from "next/navigation";

export default function DashboardLayout({ children }) {
  const email = getCurrentUserEmail();
  if (!email) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen">
      <div className="hidden lg:flex">
        <SideNavigation />
      </div>

      <main className="flex-1 overflow-y-auto">
        <DashboardHeader email={email} />
        <div className="py-4">{children}</div>
      </main>
    </div>
  );
}
