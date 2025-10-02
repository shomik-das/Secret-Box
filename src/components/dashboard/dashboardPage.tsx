"use client"
import { use, useCallback, useEffect } from "react"
import MessageTable from "./massagesTable"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { toast } from "sonner"
import { useSession} from "next-auth/react"
import ShareLink from "./shareLink"
import { ClientMessage } from "@/types/ClientMessage"
import SenderControl from "./senderControl"

const dashboard = () =>{
    const [messages, setMessages] = useState<ClientMessage[]>([])
    const [isMessageLoading, setIsMessageLoading] = useState(true)
    const {data: session} = useSession();

    

    const fetchMessages = useCallback(async(refresh: boolean = false) =>{
        try{
            setIsMessageLoading(true)
            const res = await fetch("/api/get-messages", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json()
            console.log("data: ", data.data)
            if(!data.success){
                toast.error(data.message)
                setMessages([])
                return
            }
            if(refresh){
                toast.success("Showing latest messages")
            }
            setMessages(data.data)
        }
        catch(err){
            console.log(err, "Error fetching messages");
            toast.error("Error getting messages")
        }
        finally{
            setIsMessageLoading(false)
        }
        
    },[setIsMessageLoading, setMessages])


    useEffect(() =>{    
        fetchMessages()
    },[ fetchMessages])


    return(
        <>
        <div className="flex flex-col gap-8 pt-12">
            <ShareLink/>
            <SenderControl/>
            <MessageTable 
            messages={messages} 
            setMessages={setMessages} 
            isLoading={isMessageLoading} 
            fetchMessages={fetchMessages}/>
        </div>
        </>
    )
}

export default dashboard