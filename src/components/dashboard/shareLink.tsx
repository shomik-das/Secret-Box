"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, LinkIcon, Check } from "lucide-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { User } from "next-auth"
import { Skeleton } from "@/components/ui/skeleton"

const shareLink = () => {
  const [copied, setCopied] = useState(false)
  const {data: session, status} = useSession();
  const [baseUrl, setBaseUrl] = useState("");

  const username = session?.user?.username;
  const link = `${baseUrl}/u/${username}`


  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }
  }, []);


  if (status === "loading") {
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
  else if (status === "unauthenticated") {
    return null
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
      toast.success("Link copied to clipboard")
    } catch {
      toast.error("Failed to copy link")
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Share your link</CardTitle>
        <CardDescription>Post this link to start receiving anonymous messages.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <LinkIcon className="h-4 w-4" />
        </span>
        <Input readOnly value={link} aria-label="Your Secret Box link" className="font-mono" />
        <Button onClick={onCopy} aria-label="Copy link">
          {copied ? <Check /> : <Copy/>}
          {copied ? "Copied" : "Copy"}
        </Button>
      </CardContent>
    </Card>
  )
}

export default shareLink
