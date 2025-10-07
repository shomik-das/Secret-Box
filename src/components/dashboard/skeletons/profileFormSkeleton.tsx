import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ProfileSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-72 mt-2" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar + user info */}
        <div className="flex items-start gap-6">
          <Skeleton className="h-32 w-32 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-60" />
            <Skeleton className="h-8 w-24 mt-3" />
          </div>
        </div>

        {/* Input fields */}
        <div className="grid gap-4 md:grid-cols-2 pt-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-24 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
