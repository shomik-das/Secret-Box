"use client"
import { use } from "react"
import MessageCard from "./messageCard"
import { Message, useForm } from "react-hook-form"
import { useState } from "react"
import { toast } from "sonner"
import { useSession, signIn, signOut} from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { acceptMessageSchema } from "@/schema/acceptMessageSchema"

const dashboard = () =>{
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const {data: session} = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    const {register, handleSubmit, formState: {errors}, reset} = form 

    const handleDeleteMessage = async(id: string) =>{
        try{
    
        }
        catch(err){
            toast.error("Error deleting message")
        }
    }
    return(
        <>
        dashboard
        <MessageCard/>
        </>
    )
}

export default dashboard