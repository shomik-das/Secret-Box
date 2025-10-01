"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, LinkIcon, Check } from "lucide-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { User } from "next-auth"

const shareLink = () => {
  const [copied, setCopied] = useState(false)
  const {data: session} = useSession();
  if(!session || !session.user){
    return null;
  }
  const {username} = session?.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const link = `${baseUrl}/u/${username}`

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
          {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </CardContent>
    </Card>
  )
}

export default shareLink
