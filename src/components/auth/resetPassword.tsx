"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff } from "lucide-react"
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { toast } from "sonner"
import { Spinner } from "../ui/spinner"




const  ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({    //todo need to study this 
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const params = useParams<{ username: string }>();
  const username = params.username;
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match")
            return
    }
    try {
        setIsLoading(true)
        const res = await fetch("/api/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, newPassword: formData.password, token: token}),
        })
        const resData = await res.json()
        if (!resData.success) {
            toast.error(resData.message)
            return
        }
        toast.success(resData.message)
        router.push("/auth/signin-signup");
    }
    catch (err){
      console.error("Error resetting password: ", err)
      toast.error("Something went wrong")
    }
    finally{
      setIsLoading(false)
    }
  }
  const isMatch = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword

  return (
    <Card className="border-0 shadow-2xl">
      <CardHeader className="space-y-2 pb-6">
        <div className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>Create a new password for your account</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="new-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="pl-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {formData.confirmPassword.length > 0 && (
                <p className={`text-sm mt-1 ${isMatch ? "text-green-500" : "text-red-500"}`}>
                    {isMatch ? "Password match": "Password do not match"}
                </p>
            )}
          </div>
          <Button type="submit" className="w-full cursor-pointer" size="lg" disabled={isLoading}>
            {isLoading ? <> <Spinner/> <span> Updating </span> </> : <span> Update Password </span>}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
export default ResetPassword