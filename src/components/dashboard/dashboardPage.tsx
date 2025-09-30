"use client"
import { use, useCallback, useEffect } from "react"
import MessageTable from "./massagesTable"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { toast } from "sonner"
import { useSession} from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { acceptMessageSchema } from "@/schema/acceptMessageSchema"
import { User } from "next-auth"
import ShareLink from "./shareLink"
import { ClientMessage } from "@/types/ClientMessage"

const dashboard = () =>{
    const [messages, setMessages] = useState<ClientMessage[]>([])
    const [isMessageLoading, setIsMessageLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const {data: session} = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    const {register, handleSubmit, formState: {errors}, reset, watch, setValue} = form 

    const acceptMessages = watch("acceptMessages"); //todo: why use watch here?


    const fetchAcceptMessages = useCallback(async() =>{ //todo: why useCallback here?
        try{
            setIsSwitchLoading(true)
            const res = await fetch("/api/accept-messages", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json()
            if(!data.success){
                
            }
            setValue("acceptMessages", data.isAcceptingMessages) //todo: study setValue
        }
        catch(err){
            console.log(err, "Error fetching accept messages");
            toast.error((err as Error).message || "Error fetching messages settings")
        }
        finally{
            setIsSwitchLoading(false)
        }

    }, [setValue])

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
            if(!data.success){
                toast.error(data.message)
                setMessages([])
                return
            }
            if(refresh){
                toast.success("Showing latest messages")
            }
            setMessages(data.messages)
        }
        catch(err){
            console.log(err, "Error fetching messages");
            toast.error("Error getting messages")
        }
        finally{
            setIsMessageLoading(false)
        }
        
    },[setIsMessageLoading, setMessages])

    const handleAcceptMessageChange = async() =>{
        try{
            setIsSwitchLoading(true)
            const res = await fetch("/api/accept-messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    acceptMessages: !acceptMessages
                })
            })
            const data = await res.json();
            if(!data.success){
                toast.error(data.message)
                return
            }
            toast.success(data.message)
            setValue("acceptMessages", data.isAcceptingMessages)
        }
        catch(err){
            toast.error("Error updating message settings")
        }
        finally{
            setIsSwitchLoading(false)
        }
    }

    useEffect(() =>{
        if(!session || !session.user){
            return;
        }
        fetchAcceptMessages()
        fetchMessages()
    },[fetchAcceptMessages, fetchMessages])


    if(!session || !session.user){
        return <div>Please sign in to view your dashboard</div>
    }
    return(
        <>
            <ShareLink/>
            <MessageTable messages={messages} setMessages={setMessages} isLoading={isMessageLoading} fetchMessages={fetchMessages}/>
        </>
    )
}

export default dashboard