import { Lock, User } from "lucide-react";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";

export default function layout ({children}: {children: React.ReactNode}) {
  return (
    <>
    <div className="min-h-[calc(100vh-4rem)] from-background via-card/50 to-background flex items-center justify-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
      <div className="w-full grid lg:grid-cols-2 gap-8 items-center transition-height">
        {/* Left side - Welcome content */}
        <div className="hidden lg:flex flex-col justify-center space-y-6 px-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-balance leading-tight">
              Share Freely, Stay Anonymous
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Discover a privacy-first messaging platform where you can receive honest, anonymous messages safely and securely. Stay in control while giving others the freedom to express themselves.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">
                OTP-based secure login
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">
                Anonymous & personalized messaging
              </span>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="w-full max-w-md mx-auto ">
          {children}
        </div>
      </div>
    </div>
    </>
  );
}
