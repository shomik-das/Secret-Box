
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


const ShareLinkSkeleton = () => {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" /> 
          <Skeleton className="h-4 w-60 mt-2" />
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </CardContent>
      </Card>
    )
}

export default ShareLinkSkeleton;