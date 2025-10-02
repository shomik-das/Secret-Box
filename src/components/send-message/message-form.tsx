"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Send } from "lucide-react"
import { LoaderIcon, LoaderCircle } from "lucide-react"


export function MessageForm({ username }: { username?: string }) {
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try{
        setIsSubmitting(true);
        const res = await fetch("/api/send-message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                content: message,
            }),
        })
        const data = await res.json();
        if(!data.success){
            toast.error(data.message);
            return;
        }
        toast.success(data.message);
        setMessage("");
        return;
    }
    catch(err){
        console.log(err, "Error sending message");
        toast.error("Something went wrong");
        return;
    }
    finally{
        setIsSubmitting(false);
    }
  }

  const characterCount = message.length
  const maxCharacters = 500

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Type your message here... Be honest, be kind."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[200px] resize-none text-base bg-background/60 backdrop-blur-sm border-2 focus:border-primary shadow-lg"
            maxLength={maxCharacters}
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground px-1">
            <span>Your message is anonymous and secure</span>
            <span>
              {characterCount}/{maxCharacters}
            </span>
          </div>
        </div>

        <Button type="submit" className="w-full shadow-lg" size="lg" disabled={isSubmitting || !message.trim()}>
          {isSubmitting ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              <span className="animate-pulse">Sending...</span>
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
