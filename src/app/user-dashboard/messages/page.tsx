"use client"

import { useState, useEffect, useCallback } from "react"
import MessagesTable from "@/components/dashboard/massagesTable"
import { MessageHeader } from "@/components/ui/message-header"
import { toast } from "sonner"
import { ClientMessage as Message } from "@/types/ClientMessage"

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchMessages = useCallback(async (refresh = false) => {
    try {
      if (refresh) setIsRefreshing(true)
      setIsLoading(true)
      const res = await fetch("/api/get-messages")
      const data = await res.json()

      if (!data.success) {
        toast.error(data.message || "Failed to fetch messages")
        setMessages([])
        return
      }

      setMessages(data.data)
      if (refresh) toast.success("Showing latest messages")
    } catch (err) {
      console.error(err)
      toast.error("Error fetching messages")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  return (
    <>
      <MessageHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={() => fetchMessages(true)}
        isRefreshing={isRefreshing}
      />

      <div className="min-h-[calc(100vh-4rem)] px-2 sm:px-4 lg:px-6 py-12">
        <MessagesTable
          messages={messages}
          setMessages={setMessages}
          isLoading={isLoading}
          searchQuery={searchQuery}
        />
      </div>
    </>
  )
}

export default Page
