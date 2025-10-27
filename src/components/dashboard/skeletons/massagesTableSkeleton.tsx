
"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

const MassagesTableSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Tabs skeleton */}
      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90px] text-center">Status</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="hidden md:table-cell w-[180px] text-sm text-muted-foreground">Received</TableHead>
              <TableHead className="w-[120px] text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="w-[90px] text-center">
                  <Skeleton className="mx-auto h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell className="flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-2/3" />
                </TableCell>
                <TableCell className="hidden md:table-cell w-[180px]">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="w-[120px]">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default MassagesTableSkeleton
