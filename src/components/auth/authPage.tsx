"use client";

import { useState } from "react";
import Signin from "./signin";
import Signup from "./signup";
import VerifyPage from "./verifyOtp";
import { Button } from "@/components/ui/button";
import { Lock, User } from "lucide-react";

export function AuthPage() {
  const [isSignin, setIsSignin] = useState<boolean>(true);
  const [showVerifyPage, setShowVerifyPage] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/50 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Welcome content */}
        <div className="hidden lg:flex flex-col justify-center space-y-6 px-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-balance leading-tight">
              Welcome to our{" "}
              <span className="text-primary">modern platform</span>
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Join thousands of users who trust our secure and intuitive
              authentication system. Experience seamless access to your account
              with our modern design.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">
                Bank-level security
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">
                Personalized experience
              </span>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="w-full max-w-md mx-auto">
          {! showVerifyPage && (
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-1 bg-muted p-1 rounded-lg">
                <Button
                  variant={isSignin ? "default" : "ghost"}
                  onClick={() => setIsSignin(true)}
                  className="flex-1 transition-all duration-200"
                >
                  Login
                </Button>
                <Button
                  variant={!isSignin ? "default" : "ghost"}
                  onClick={() => setIsSignin(false)}
                  className="flex-1 transition-all duration-200"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          )}
          {showVerifyPage ? (
            <VerifyPage usernameProp={username} emailProp={email}  setShowVerifyPageProp={setShowVerifyPage}/>
          ) : isSignin ? (
            <Signin />
          ) : (
            <Signup setUsernameProp={setUsername} setShowVerifyPageProp={setShowVerifyPage} setEmailProp={setEmail} />
          )}
        </div>
      </div>
    </div>
  );
}
