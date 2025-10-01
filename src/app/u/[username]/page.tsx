"use client"
import {MessageForm}  from "@/components/send-message/message-form"
import {UserProfile} from "@/components/send-message/user-profile"
import { useEffect, useState } from "react"
import { useParams, useRouter } from 'next/navigation';
import { toast } from "sonner"
import {User} from "@/model/User";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const page = () =>{
    const params = useParams<{ username: string }>();
    const username = params.username;
    const router = useRouter();
    const [userData, setUserData] = useState<User>();
    const fetchUserData = async()=>{
        try{
            const res = await fetch(`/api/get-user?username=${username}`);
            const data = await res.json();
            if(!data.success){
                toast.error(data.message);
                return;
            }
            setUserData(data.user);
        }
        catch(err){
            console.log(err, "Error fetching user data");
            return null;
        }
    }
    useEffect(()=>{
        fetchUserData();
    },[])

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-blue-950/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="space-y-12">
          <UserProfile
            name={userData?.name || "John Doe"}
            photo={userData?.image}
            headline={userData?.headline}
            question={userData?.question || "What's something you've always wanted to tell me but never had the chance?"}
          />
          <MessageForm username={userData?.username} />
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <p className="text-center text-muted-foreground">Want to receive anonymous messages too?</p>
            <Button asChild size="lg" className="font-semibold">
              <Link href="/signup">Create Your Own Link</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page; 



