"use client";
//import { ProfileForm } from "@/components/dashboard/profile"
import { ProfileForm } from "@/components/dashboard/profileForm";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { useState } from "react";

const page = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showActions, setShowAction] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };
  return (
    <>
      <DashboardHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        showActions={showActions}
      />
      <div className="min-h-[calc(100vh-4rem)] px-2 sm:px-4 lg:px-6 py-12 ">
        <ProfileForm />
      </div>
    </>
  );
};

export default page;
