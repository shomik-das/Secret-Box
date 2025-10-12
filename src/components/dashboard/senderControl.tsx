"use client"

import { toast } from "sonner"
import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

const CardSkeleton = () => (
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

const SenderControl = () => {
  const [isLoading, setIsLoading] = useState(true) 
  const [isSwitchLoading, setIsSwitchLoading] = useState(false) 
  const [acceptMessages, setAcceptMessages] = useState(true)

  const fetchAcceptMessages = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/accept-messages", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
      const data = await res.json()
      if (!data.success) {
        toast.error(data.message || "Failed to fetch settings")
        return
      }
      setAcceptMessages(data.isAcceptingMessages)
    } catch (err) {
      console.error("Error fetching accept messages", err)
      toast.error((err as Error).message || "Error fetching messages settings")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleAcceptMessageChange = async (checked: boolean) => {
    try {
      setIsSwitchLoading(true)
      const res = await fetch("/api/accept-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acceptMessages: checked })
      })
      const data = await res.json()
      if (!data.success) {
        toast.error(data.message)
        return
      }
      setAcceptMessages(checked)
      toast.success(data.message)
    } catch (err) {
      toast.error("Error updating message settings")
    } finally {
      setIsSwitchLoading(false)
    }
  }

  useEffect(() => {
    fetchAcceptMessages()
  }, [fetchAcceptMessages])

  if (isLoading) {
    return <CardSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy & sender controls</CardTitle>
        <CardDescription>
          Decide who can send and how messages are handled.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-md border p-3">
          <div className="space-y-1">
            <Label htmlFor="accept-messages">Allow anonymous sends</Label>
            <p className="text-sm text-muted-foreground">
              Anyone with your link can send messages without identity.
            </p>
          </div>
          <Switch
            id="accept-messages"
            checked={acceptMessages}
            onCheckedChange={handleAcceptMessageChange}
            disabled={isSwitchLoading}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default SenderControl
