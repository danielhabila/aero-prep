import { getSession } from "@auth0/nextjs-auth0";
import SideNavigation from "@/components/SideNavigation";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";

export default async function DashboardLayout({ children }) {
  const session = await getSession();

  if (!session) {
    redirect("/api/auth/login");
  }

  return (
    <div className="flex h-screen">
      <SideNavigation />
      <main className="flex-1 overflow-y-auto">
        <DashboardHeader />
        <div className="py-4 px-6">{children}</div>
      </main>
    </div>
  );
}
