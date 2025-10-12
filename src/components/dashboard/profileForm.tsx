"use client"

import { use, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDebounceCallback } from "usehooks-ts"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2, Save, Camera } from "lucide-react"
import { useSession } from "next-auth/react"
import { User } from "next-auth"
import { Spinner } from "../ui/spinner"
import { profileSchema } from "@/schema/profileSchema"
import { ProfileSkeleton } from "./skeletons/profileFormSkeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


type ProfileFormType = z.infer<typeof profileSchema>

export function ProfileForm() {
  const [username, setUsername] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGettingUser, setIsGettingUser] = useState(false)
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const debounced = useDebounceCallback(setUsername, 400)
  const [user, setUser] = useState<User | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)


  const { data: session, status, update } = useSession()
  const SessionUsername = session?.user?.username;


  const form = useForm({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
  })

  const getUserDetails = async () => {
    try{
      setIsGettingUser(true)
      const res = await fetch(`/api/get-user?username=${SessionUsername}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await res.json()
      if(!data.success){
        toast.error(data.message)
        return
      }
      setUser(data.user)
      form.reset(data.user)
    }
    catch(err){
      console.log("Error getting user details: ", err)
      toast.error("Something went wrong")
    }
    finally{
      setIsGettingUser(false)
    }
  }
  // ---------- Username check ---------
  const checkUsername = async () => {
    console.log("Checking username: ", username);
    if (!username) {
      setUsernameMessage("")
      return
    }
    if (username.length < 3) {
      setUsernameMessage("Username must be at least 3 characters")
      return
    }
    if (username === user?.username) {
      setUsernameMessage("Username is available")
      return
    }
    try {
      setIsCheckingUsername(true)
      setUsernameMessage("")
      const res = await fetch(`/api/check-username?username=${username}`)
      const data = await res.json()
      setUsernameMessage(data.message)
    }
    catch(err) {
      console.error("Error checking username: ", err)
      setUsernameMessage("Error checking username")
    }
    finally {
      setIsCheckingUsername(false)
    }
  }

  // ---------- Image Upload ----------
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please select an image smaller than 5MB")
      return
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }
    setSelectedFile(file)
    const previewUrl = URL.createObjectURL(file)
    form.setValue("image", previewUrl, { shouldValidate: true , shouldDirty: true })
    setPreviewImage(previewUrl)
  }


  // ---------- Submit ----------
  const onSubmit = async (data: ProfileFormType) => {
    try {
      setIsLoading(true)
      if(selectedFile){
        const formData = new FormData()
        formData.append("image", selectedFile)
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        const result = await res.json()

        if(!result.success){
          toast.error(result.message)
          return
        }
        data.image = result.url
      }

      // update the user in the DB and the Session
      const res = await fetch("/api/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          id: user?._id,
        }),
      })
      const result = await res.json()
      if (!result.success) {
        toast.error(result.message)
        return
      }
      toast.success(result.message)
      form.reset(data)
      setIsEditing(false)
      setUser(result.user)

      //update the session
      await update({
        user: {
          ...session?.user,
          ...data,
        },
      },);
    }
    catch (err) {
      console.log("Error updating profile: ", err)
      toast.error("Something went wrong")
    } 
    finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if(SessionUsername){
      getUserDetails()
    }
  }, [SessionUsername])

  useEffect(() => {
    checkUsername()
  }, [username])


  if(isGettingUser || status === "loading"){
    return <ProfileSkeleton/>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your profile details and how others see you</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Avatar */}
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar className="h-32 w-32 cursor-pointer rounded-2xl ring-2 ring-offset-2 ring-primary">
                    <AvatarImage
                      src={
                        previewImage? previewImage: form.watch("image")
                        ? form.watch("image")?.replace("/upload/", "/upload/w_200,h_200,c_fill/")
                        : ""
                      }
                      alt="Profile"
                      className="h-full w-full object-cover"
                      />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  {isEditing && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{form.watch("name") || user?.name}</h3>
                  <p className="text-sm text-muted-foreground">@{ form.watch("username") || user?.username}</p>
                  <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
                  {!isEditing && (
                    <Button variant="outline" size="sm" className="mt-3 bg-transparent" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {/* Fields */}
              <div className="grid gap-4 md:grid-cols-2 pt-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <Input {...field} disabled={!isEditing} placeholder="Enter your full name" />
                        <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input {...field} disabled={true} />
                    {/* <p className="text-xs text-muted-foreground">A brief description of what you do</p> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
              <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        placeholder="Enter your username"
                        onChange={(e) => {
                          field.onChange(e.target.value)
                          debounced(e.target.value)
                        }}
                      />
                      <FormMessage />
                      {!form.formState.errors.username && (
                        <>
                          {isCheckingUsername && <Loader2 className="animate-spin h-4 w-4" />}
                          {!isCheckingUsername && usernameMessage && (
                            <p className={`text-sm ${usernameMessage === "Username is available"? "text-green-500": "text-red-500"}`}>
                              {usernameMessage}
                            </p>
                          )}
                        </>
                      )}
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline</FormLabel>
                    <Input {...field} disabled={!isEditing} placeholder="Your professional headline" />
                    <p className="text-xs text-muted-foreground">A brief description of what you do</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Question</FormLabel>
                    <Textarea {...field} disabled={!isEditing} rows={3} placeholder="A question you'd like to ask visitors" />
                    <p className="text-xs text-muted-foreground">Displayed on your public profile</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Buttons */}
              {isEditing && (
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button type="submit" disabled={isLoading || !form.formState.isValid}>
                    {isLoading ? (
                      <>
                        <Spinner/>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save/> Save
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => {
                      form.reset(user as ProfileFormType)
                      setIsEditing(false)
                      setPreviewImage(null)
                      setSelectedFile(null)
                      usernameMessage && setUsernameMessage("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
