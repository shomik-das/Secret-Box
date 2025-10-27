import {
  LogOutIcon,
  UserPenIcon,
} from "lucide-react"

import { Inbox, Link2, Settings} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "next-auth"
import { signOut } from "next-auth/react"
import { ChevronDownIcon } from "lucide-react"
import Link from "next/link"

export default function UserMenu({ user }: { user?: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 !hover:bg-transparent !bg-transparent focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 cursor-pointer">
          <Avatar>
            <AvatarImage src={user?.image} alt="Profile image" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <ChevronDownIcon size={16} className="opacity-60" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {user?.username}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {user?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/user-dashboard/messages">
            <DropdownMenuItem>
              <Inbox size={16} className="opacity-60" aria-hidden="true" />
              <span>Messages</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/user-dashboard/share-link">
            <DropdownMenuItem>
              <Link2 size={16} className="opacity-60" aria-hidden="true" />
              <span>Share Link</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/user-dashboard/profile">
            <DropdownMenuItem>
              <UserPenIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/user-dashboard/settings">
            <DropdownMenuItem>
              <Settings size={16} className="opacity-60" aria-hidden="true" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ redirect: false })}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true"  />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
