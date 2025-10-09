"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { AdminSidebar } from "@/components/ui/admin-sidebar";
import { useSelectedLayoutSegment } from "next/navigation"

export default function layout({children,}: Readonly<{children: React.ReactNode;}>) {
  const selectedLayoutSegment = useSelectedLayoutSegment();

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        {selectedLayoutSegment !== "messages" && <DashboardHeader />}
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
