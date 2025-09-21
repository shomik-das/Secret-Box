"use client"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link" // use of this
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schema/signUpSchema"
import { zodResolver } from "@hookform/resolvers/zod";
//import { apiResponse } from "@/types/apiResponse"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { set } from "mongoose"

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 400);
  const router = useRouter();
  
  // zod implementation
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })
  useEffect(() => {
    const checkUsername = async () => {
      if(!username) {
        setUsernameMessage("");
        return;
      }
      if(username.length < 3) {
        setUsernameMessage("Username must be at least 3 characters");
        return;
      }
      try {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        const res = await fetch(`/api/check-username?username=${username}`);
        const data = await res.json();
        if(!data.success) {
          setUsernameMessage(data.message);
        }
        else {
          setUsernameMessage(data.message);
        }
      }
      catch(err) {
        console.error("Error checking username: ", err);
        // const axiosError = err as FetchError<apiResponse>
      }
      finally {
        setIsCheckingUsername(false);
      }
    }
    checkUsername();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => { // todo why need to infer here and data print
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if(!resData.success) {
        toast.error(resData.message);
        return;
      }
      toast.success(resData.message);
      router.push(`/verify/${username}`);
    }
    catch(err) {
      console.error("Error signing up: ", err);
      toast.error("Something went wrong");
    }
    finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Secret Box
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                  <FormMessage />
                  {!form.formState.errors.username && (
                    <>
                      {isCheckingUsername && (<Loader2 className="animate-spin h-4 w-4" />)}
                      {!isCheckingUsername && usernameMessage && (
                        <p
                          className={`text-sm ${
                            usernameMessage === "Username is available"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {usernameMessage}
                        </p>
                      )}
                    </>
                  )}
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} />
                  <p className=' text-gray-400 text-sm'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page;