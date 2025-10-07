import React from "react";
import { Skeleton } from "@/components/ui/skeleton";



const UserProfileSkeleton = () => {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      {/* Avatar */}
      <div className="h-28 w-28 rounded-full ring-4 ring-primary/20 shadow-xl overflow-hidden">
        <Skeleton className="h-full w-full rounded-full" />
      </div>

      {/* Name & Headline */}
      <div className="space-y-2 w-full max-w-md">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>

      {/* Question section */}
      <div className="mt-8 pt-6 border-t border-border/50 w-full max-w-2xl space-y-3">
        <Skeleton className="h-3 w-24 mx-auto" />
        <Skeleton className="h-5 w-80 mx-auto" />
      </div>
    </div>
  );
};

export default UserProfileSkeleton;
