"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Loader2, Save } from "lucide-react"
import { toast } from "sonner"

interface UserProfile {
  name: string
  username: string
  email: string
  headline: string
  question: string
  image: string
  isAcceptingMessages: boolean
}

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    username: "johndoe",
    email: "john.doe@example.com",
    headline: "Full Stack Developer & Designer",
    question: "What inspires you to create?",
    image: "/professional-headshot.png",
    isAcceptingMessages: true,
  })

  const [formData, setFormData] = useState<UserProfile>(profile)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setProfile(formData)
    setIsEditing(false)
    setIsLoading(false)
    toast.success("Your profile has been successfully updated.")
  }

  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Please select an image smaller than 5MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your profile details and how others see you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="h-32 w-32 rounded-xl border-2 border-border overflow-hidden bg-muted">
                {formData.image ? (
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt={formData.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-3xl font-semibold text-muted-foreground">
                    {getInitials(formData.name)}
                  </div>
                )}
              </div>
              {isEditing && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    aria-label="Upload profile picture"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full shadow-md"
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                  >
                    <Camera className="h-5 w-5" />
                    <span className="sr-only">Change avatar</span>
                  </Button>
                </>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{profile.name}</h3>
              <p className="text-sm text-muted-foreground">@{profile.username}</p>
              <p className="text-sm text-muted-foreground mt-1">{profile.email}</p>
              {!isEditing && (
                <Button variant="outline" size="sm" className="mt-3 bg-transparent" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                name="headline"
                value={formData.headline}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Your professional headline"
              />
              <p className="text-xs text-muted-foreground">A brief description of what you do</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">Personal Question</Label>
              <Textarea
                id="question"
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="A question you'd like to ask visitors"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">This will be displayed on your public profile</p>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button onClick={handleSave} disabled={isLoading} className="min-w-[120px]">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account preferences and security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-foreground">Email Verified</p>
              <p className="text-sm text-muted-foreground">Your email address is verified</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground">Verified</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-foreground">Accepting Messages</p>
              <p className="text-sm text-muted-foreground">
                {profile.isAcceptingMessages
                  ? "You are currently accepting messages from others"
                  : "You are not accepting messages at this time"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${profile.isAcceptingMessages ? "bg-green-500" : "bg-gray-400"}`} />
              <span className="text-sm font-medium text-foreground">
                {profile.isAcceptingMessages ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-foreground">Account Created</p>
              <p className="text-sm text-muted-foreground">Member since January 2024</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
