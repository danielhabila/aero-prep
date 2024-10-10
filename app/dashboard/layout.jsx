import { getSession } from "@auth0/nextjs-auth0";
import SideNavigation from "@/components/SideNavigation";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const session = await getSession();

  if (!session) {
    redirect("/api/auth/login");
  }

  return (
    <div className="flex h-screen">
      <SideNavigation />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
