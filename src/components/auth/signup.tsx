"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import { useDebounceCallback } from "usehooks-ts"
import { toast } from "sonner"
import { signUpSchema } from "@/schema/signUpSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2, User, Mail, Lock, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa"; 
import { signIn } from "next-auth/react"

const signup = ({ setUsernameProp, setShowVerifyPageProp, setEmailProp }: { setUsernameProp: Function; setShowVerifyPageProp: Function, setEmailProp: Function}) => {
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUsername, 400)

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    const checkUsername = async () => {
      if (!username) {
        setUsernameMessage("")
        return
      }
      if (username.length < 3) {
        setUsernameMessage("Username must be at least 3 characters")
        return
      }
      try {
        setIsCheckingUsername(true)
        setUsernameMessage("")
        const res = await fetch(`/api/check-username?username=${username}`)
        const data = await res.json()
        if (!data.success) {
          setUsernameMessage(data.message)
        } else {
          setUsernameMessage(data.message)
        }
      } catch (err) {
        console.error("Error checking username: ", err)
      } finally {
        setIsCheckingUsername(false)
      }
    }
    checkUsername()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      setIsSubmitting(true)
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      const resData = await res.json()
      if (!resData.success) {
        toast.error(resData.message)
        return
      }
      toast.success(resData.message)
      setUsernameProp(data.username)
      setEmailProp(data.email)
      setShowVerifyPageProp(true)
    } catch (err) {
      console.error("Error signing up: ", err)
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-0 shadow-2xl">
      <CardHeader className="space-y-2 pb-6">
        <div className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Sign up to start your journey</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      className="pl-10"
                      placeholder="Enter your username"
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                    />
                  </div>
                  <FormMessage />
                  {!form.formState.errors.username && (
                    <>
                      {isCheckingUsername && <Loader2 className="animate-spin h-4 w-4" />}
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
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input {...field} className="pl-10" placeholder="Enter your email" />
                  </div>
                  <p className="text-gray-400 text-sm">We will send you a verification code</p>
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
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      {...field}
                      className="pl-10"
                      placeholder="Enter your password"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>
                  Sign Up
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="w-full bg-transparent" onClick={() => signIn("google")}> 
            <FcGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button variant="outline" className="w-full bg-transparent" onClick={() => signIn("github")}>
            <FaGithub className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default signup