import type { ReactNode } from "react";

import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/app/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#F8F8FD]">
      <DashboardHeader />
      <div className="flex pt-[72px]">
        <DashboardSidebar />
        <main className="flex-1 px-4 py-8">{children}</main>
      </div>
    </div>
  );
}
