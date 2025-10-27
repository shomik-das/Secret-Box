
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SenderControlSkeleton = () => {
    return(
        <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" /> {/* Title */}
              <Skeleton className="h-4 w-72" />       {/* Description */}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />  {/* Label */}
                  <Skeleton className="h-3 w-64" />  {/* Subtext */}
                </div>
                <Skeleton className="h-6 w-12 rounded-full" /> {/* Switch */}
              </div>
            </CardContent>
          </Card>
    )
}

export default SenderControlSkeleton;