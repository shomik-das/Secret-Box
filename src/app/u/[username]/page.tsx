"use client"
import {MessageForm}  from "@/components/send-message/message-form"
import {UserProfile} from "@/components/send-message/user-profile"
import { useEffect, useState } from "react"
import { useParams, useRouter } from 'next/navigation';
import { toast } from "sonner"
import {User} from "@/model/User";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import UserProfileSkeleton from "@/components/send-message/skeletons/userProfileSkeleton";
import MessageFormSkeleton from "@/components/send-message/skeletons/messageFormSkeleton";


const page = () =>{
    const params = useParams<{ username: string }>();
    const username = params.username;
    const [userData, setUserData] = useState<User>();
    const [isLoading, setIsLoading] = useState(true); 
    const fetchUserData = async()=>{
        try{
            setIsLoading(true);
            const res = await fetch(`/api/get-user?username=${username}`);
            const data = await res.json();
            if(!data.success){
                toast.error(data.message);
                return;
            }
            else{
                setUserData(data.user);
                setIsLoading(false);
            }
        }
        catch(err){
            console.log(err, "Error fetching user data");
            return null;
        }
        // finally{
        //     setIsLoading(false);
        // }
    }
    useEffect(()=>{
        fetchUserData();
    },[])

  return (
    <>
    <Navbar/>
    <div className="min-h-[calc(100vh-4rem)] max-w-7xl mx-auto pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="space-y-12">
          {isLoading? (
            <>
            <UserProfileSkeleton/>
            <MessageFormSkeleton/>
            </>
          ):
          (
            <>
            <UserProfile
            name={userData?.name || "John Doe"}
            photo={userData?.image}
            headline={userData?.headline}
            question={userData?.question || "What's something you've always wanted to tell me but never had the chance?"}
            />
            <MessageForm username={userData?.username}/>
            </>
          )}
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-muted-foreground">Want to receive anonymous messages too?</p>
            <Button asChild size="lg" className="font-semibold">
              <Link href="/auth/signin-signup">Create Your Own Link</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default page; 



