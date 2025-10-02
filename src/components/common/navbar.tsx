"use client"

import React, { useId } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User } from "next-auth"
import UserMenu from "@/components/user-menu"
import Logo from "@/components/logo"
import NotificationMenu from "@//components/notification-menu"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export default function Navbar() {
  const { data: session } = useSession()
  const user: User = session?.user
  const id = useId()

  return (
    <header className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="group size-8 md:hidden" variant="ghost" size="icon">
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12H20" />
                  <path d="M4 6H20" />
                  <path d="M4 18H20" />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-2">
                  {navigationLinks.map((link, idx) => (
                    <NavigationMenuItem key={idx} className="w-full">
                      <NavigationMenuLink href={link.href} className="py-1.5">
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>

          {/* Logo */}
          <Link href="#" className="text-primary hover:text-primary/90">
            <Logo />
          </Link>

          {/* Desktop navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-4">
              {navigationLinks.map((link, idx) => (
                <NavigationMenuItem key={idx}>
                  <NavigationMenuLink
                    href={link.href}
                    className="text-muted-foreground hover:text-primary font-medium py-1.5"
                  >
                    {link.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <NotificationMenu />
          </div>

          {/* User / Login */}
            { !user ? (
                <Link href="/auth/signin-signup"> <Button>  Sign In</Button></Link>
            ) : (
              <>
              <div className="">
                <UserMenu user={user}/>
              </div>

              </>
            ) }
        </div>
      </div>
    </header>
  )
}
