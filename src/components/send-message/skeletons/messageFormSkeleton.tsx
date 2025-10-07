import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const MessageFormSkeleton = () => {
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="space-y-2">
        <Skeleton className="min-h-[200px] w-full rounded-md" />
        <div className="flex justify-between items-center px-1">
          <Skeleton className="h-3 w-36 rounded-full" />
          <Skeleton className="h-3 w-12 rounded-full" />
        </div>
      </div>

      <Skeleton className="h-12 w-full rounded-md" />
    </div>
  );
};

export default MessageFormSkeleton;
