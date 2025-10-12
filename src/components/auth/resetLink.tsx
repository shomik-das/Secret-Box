"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Spinner } from "../ui/spinner"

const  SendOtp = () => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await fetch("/api/reset-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const resData = await res.json()
      if (!resData.success) {
        toast.error(resData.message)
        return
      }
      setEmail("")
      toast.success(resData.message)
      router.push("/auth/signin-signup");
    }
    catch (err){
      console.error("Error sending reset password OTP: ", err)
      toast.error("Something went wrong")
    }
    finally{
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-2xl">
      <CardHeader className="space-y-2 pb-6">
        <div className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Reset Request</CardTitle>
          <CardDescription>Enter your email to receive a verification code</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full cursor-pointer" size="lg" disabled={isLoading}>
            {isLoading ? (<> <Spinner/> <span> Sending </span> </>) : (<> <span> Send Code  </span> </>)}
          </Button>
        </form>

        <Button variant="link" onClick={()=>{router.back()}} className=" w-full text-muted-foreground hover:text-foreground cursor-pointer">
          Back to Sign In
        </Button>
      </CardContent>
    </Card>
  )
}

export default SendOtp;

