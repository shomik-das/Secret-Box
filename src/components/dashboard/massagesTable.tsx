"use client"

import { useMemo, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Star, Trash2, RefreshCcw, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ClientMessage as Message } from "@/types/ClientMessage"


type MessagesTableProps = {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean
  fetchMessages: (refresh?: boolean) => Promise<void>
}


const  MessagesTable =( {messages, setMessages, isLoading, fetchMessages}: MessagesTableProps)=> {

  const [query, setQuery] = useState("")
  const [tab, setTab] = useState<"all" | "unread" | "starred">("all") // removed "hidden"
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Message | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState<Message | null>(null)

  const filtered = useMemo(() => {
    let list = messages
    if (tab === "unread") list = list.filter((m: Message) => !m.read)
    if (tab === "starred") list = list.filter((m: Message) => m.starred)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((m: Message) => m.content.toLowerCase().includes(q))
    }
    return list
  },[ messages, tab, query])

  const optimisticUpdate = (id: string, patch: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m._id ===id) {
          return { ...m, ...patch }
        }
        return m
      })
    )
}


  const  onToggleStar = async(m: Message) => {
    const oldStarred = m.starred
    optimisticUpdate(m._id, { starred: !m.starred })
    try {
        const res = await fetch(`/api/toggle-star`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({id: m._id}),
        })
        const data = await res.json()
        if(!data.success){
            optimisticUpdate(m._id, { starred: oldStarred })
            toast.error("Failed to toggle star")
            return
        }
        toast.success("Star toggled successfully")
    }
    catch (err) {
        optimisticUpdate(m._id, { starred: oldStarred })
        console.error("Error toggling star: ", err)
        toast.error("Something went wrong")
    }
  }

  function requestDelete(m: Message) {
    setToDelete(m)
    setConfirmOpen(true)
  }

  const onDelete = async (m: Message) => {
    const prevMessages = [...messages]
    setMessages((prev) => prev.filter((mes) => mes._id !== m._id))
    try {
      const res = await fetch(`/api/message-delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: m._id }),
      })
      const data = await res.json()
      if (!data.success) {
        setMessages(prevMessages)
        toast.error("Failed to delete message")
        return
      }
      toast.success("Message deleted successfully")
    } 
    catch (err) {
      setMessages(prevMessages)
      console.error("Error deleting message: ", err)
      toast.error("Something went wrong")
    }
  }

  const openMessage = async (m: Message) =>{
    setSelected(m)
    setOpen(true)
    if(!m.read){
        optimisticUpdate(m._id, { read: true })
        try{
            const res = await fetch(`/api/mark-as-read`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id: m._id}),
            })
            const data = await res.json()
            if(!data.success){
                toast.error("Failed to mark message as read")
                optimisticUpdate(m._id, { read: false })
                return
            }
        }
        catch(err){
            console.error("Error marking message as read: ",err);
            toast.error("Something went wrong")
        }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:justify-between">
        <Tabs value={tab} onValueChange={(v: any) => setTab(v as typeof tab)} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex w-full items-center gap-2 md:w-80">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search messages"
              aria-label="Search messages"
              className="pl-8"
            />
          </div>
          <Button variant="secondary" aria-label="Refresh messages" onClick={() => fetchMessages(true)}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className={cn("rounded-md border", isLoading && "opacity-60")}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Status</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="hidden md:table-cell">Received</TableHead>
              <TableHead className="text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(filtered ?? []).map((m: Message) => (
              <TableRow
                key={m._id}
                role="button"
                tabIndex={0}
                onClick={() => openMessage(m)}
                onKeyDown={(e: any) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    openMessage(m)
                  }
                }}
                className={cn(m.read && "bg-accent/50", "cursor-pointer")}
              >
                <TableCell className="align-top">
                  <div className="flex flex-col items-center justify-center">
                    {!m.read && (
                      <Badge className="w-fit" variant="default">
                        Unread
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="align-top">
                  <p className="text-pretty line-clamp-2">{m.content}</p>
                </TableCell>
                <TableCell className="hidden align-top text-sm text-muted-foreground md:table-cell">
                  {new Date(m.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="align-top">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={m.starred ? "Unstar" : "Star"}
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleStar(m)
                      }}
                    >
                      {m.starred ? <Star className="h-4 w-4 fill-current" /> : <Star className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Delete"
                      onClick={(e) => {
                        e.stopPropagation()
                        requestDelete(m)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered && filtered.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                  No messages to show.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-balance">Message</DialogTitle>
            <DialogDescription>{selected ? new Date(selected.createdAt).toLocaleString() : ""}</DialogDescription>
          </DialogHeader>

          <div className="mt-2 rounded-md border bg-background p-4">
            <p className="whitespace-pre-wrap text-pretty">{selected?.content}</p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => selected && onToggleStar(selected)}
              aria-label={selected?.starred ? "Unstar" : "Star"}
            >
              {selected?.starred ? <Star className="mr-2 h-4 w-4 fill-current" /> : <Star className="mr-2 h-4 w-4" />}
              {selected?.starred ? "Unstar" : "Star"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (selected) requestDelete(selected)
              }}
              aria-label="Delete message"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button size="sm" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* todo: need study open and onOpenChange */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The message will be permanently removed from your inbox.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (toDelete) {
                  onDelete(toDelete)
                  setToDelete(null)
                }
                setConfirmOpen(false)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


export default MessagesTable;