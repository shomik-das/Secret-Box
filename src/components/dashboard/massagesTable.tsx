"use client"

import { useMemo, useState, useCallback, useEffect} from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Star, Trash2, RefreshCcw, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
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
  searchQuery: string
}


const  MessagesTable =({messages, setMessages, isLoading, searchQuery} : MessagesTableProps)=> {
  const [tab, setTab] = useState<"all" | "unread" | "starred">("all") // removed "hidden"
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Message | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState<Message | null>(null)

  const filtered = useMemo(() => { //todo why to user user memo here
    let list = messages
    if (tab === "unread") list = list.filter((m: Message) => !m.read)
    if (tab === "starred") list = list.filter((m: Message) => m.starred)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter((m: Message) => m.content.toLowerCase().includes(q))
    }
    return list
  },[ messages, tab, searchQuery])

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
        // toast.success("Star toggled successfully")
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
    setOpen(false)
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
        <Tabs value={tab} onValueChange={(v) => setTab(v as "all" | "unread" | "starred")} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className={cn("rounded-md border")}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90px] text-center">Status</TableHead>
              <TableHead className="flex-1">Message</TableHead>
              <TableHead className="w-[180px] text-sm text-muted-foreground hidden md:table-cell">Received</TableHead>
              <TableHead className="w-[120px] text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="w-[90px]">
                  <Skeleton className="h-5 w-16 mx-auto" />
                </TableCell>
                <TableCell className="flex-1">
                  <Skeleton className="h-5 w-full" />
                </TableCell>
                <TableCell className="hidden w-[180px] md:table-cell">
                  <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell className="w-[120px]">
                  <div className="flex items-center justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
              ))
            ):
            filtered && filtered.length > 0 ? (filtered.map((m: Message) => (
              <TableRow
                key={m._id}
                role="button"
                tabIndex={0}
                onClick={() => openMessage(m)}
                onKeyDown={(e: React.KeyboardEvent<HTMLTableRowElement>) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    openMessage(m)
                  }
                }}
                className={cn(m.read && "bg-accent/50", "cursor-pointer")}
              >
                <TableCell className="w-[90px] text-center">
                  <div className="flex flex-col items-center justify-center">
                    {!m.read && (
                      <Badge className="w-fit" variant="default">
                        Unread
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="flex-1 truncate">
                  <p className="text-pretty line-clamp-2">{m.content}</p>
                </TableCell>
                <TableCell className="hidden md:table-cell w-[180px] text-sm text-muted-foreground">
                  {new Date(m.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className=" w-[120px]">
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
            ))):
            (
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
              onClick={() => {
                if(selected){
                  onToggleStar(selected)
                  setSelected({ ...selected, starred: !selected.starred })
                }
              }}
              aria-label={selected?.starred ? "Unstar" : "Star"}
            >
              {selected?.starred ? <Star className=" fill-current" /> : <Star/>}
              {selected?.starred ? "Unstar" : "Star"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (selected) requestDelete(selected)
              }}
              aria-label="Delete message"
            >
              <Trash2/>
              Delete
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