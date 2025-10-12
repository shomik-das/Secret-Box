"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Mail } from "lucide-react"
import { OTPInput, SlotProps } from "input-otp"
import { InputOTP, InputOTPSlot} from "@/components/ui/input-otp"
import { useParams, useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import { Spinner } from "../ui/spinner"

export default function verifyOtp() {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(5)
  const params = useParams<{ username: string }>();
  
  const router = useRouter();

  const username = params.username;

  // Timer for resend OTP
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code")
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, code: otp }),
      })
      const resData = await res.json()
      if (!resData.success) {
        toast.error(resData.message)
        setOtp("")
        return
      }
      toast.success(resData.message)
      setOtp("")
      const signInRes = await signIn("credentials", {
        redirect: false,
        identifier: username,
        password: "otp-bypass",
      })
      if (signInRes?.error) {
        toast.error(signInRes.error)
        return
      }
      else if (signInRes?.ok) {
        router.push("/user-dashboard/messages")
      }
      router.push("/auth/signin-signup");
    } catch (error) {
      console.error("Error verifying email: ", error)
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    try {
        setIsResending(true)
        const res = await fetch("/api/resend-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username
          }),
        })
        const resData = await res.json();
        if (!resData.success) {
          toast.error(resData.message);
          return;
        }
        toast.success(resData.message);
        setOtp("");
    } 
    catch(error) {
      console.error("Error resending OTP: ", error)
      toast.error("Something went wrong")
    } finally {
      setIsResending(false)
      setTimeLeft(60)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Verification Code</CardTitle>
        <CardDescription>
          We've sent a 6-digit verification code to your email address
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <OTPInput
            maxLength={6}
            value={otp}
            onChange={setOtp}
            disabled={isLoading}
            render={({ slots }) => (
              <div className="flex gap-2">
                {slots.map((slot, i) => (
                  <Slot key={i} {...slot} />
                ))}
              </div>
            )}
          />
          {/* <InputOTP value={otp} onChange={setOtp} maxLength={6}>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
            </InputOTP> */}
        </div>

        <Button onClick={handleVerify} className="w-full cursor-pointer" disabled={isLoading || otp.length !== 6}>
          {isLoading ? <> <Spinner/> "Verifying" </> : "Verify Email"}
        </Button>

        <div className="text-center">
          <span className="text-sm text-muted-foreground">Didn't receive the code?</span>
          <Button
            variant="link"
            onClick={handleResendOTP}
            disabled={timeLeft > 0 || isResending}
            className=" pl-2 cursor-pointer"
          >
            {isResending ? (
              <>
                Sending...
              </>
            ) : timeLeft > 0 ? (
              `Resend in ${timeLeft}s`
            ) : (
              "Resend Code"
            )}
          </Button>
        </div>

        <Button
          variant="link"
          onClick={() => router.back()}
          className="w-full text-muted-foreground hover:text-foreground cursor-pointer"
        >
          Back to Sign In
        </Button>
      </CardContent>
    </Card>
  )
}

// Individual OTP Slot component
function Slot(props: SlotProps) {
  return (
    <div
      className={`w-12 h-12 flex items-center justify-center border rounded-md font-medium ${
        props.isActive ? "border-blue-500" : "border-gray-300"
      }`}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  )
}
