'use client';

import { memo } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Home, Inbox, Link2, Bell, Settings2, Quote, User as UserIcon, LogOutIcon } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { User } from "next-auth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Shield,
  Settings,
  Moon,
  Sun,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { usePathname } from 'next/navigation';

const menuItems = [
  { title: 'Overview', icon: Home, href: "/user-dashboard/overview" },
  { title: 'Messages', icon: Inbox, href: '/user-dashboard/messages' },
  { title: 'Share Link', icon: Link2, href: '/user-dashboard/share-link' },
  { title: 'Profile', icon: UserIcon, href: '/user-dashboard/profile' },
  { title: 'Settings', icon: Settings, href: '/user-dashboard/sender-control' },
];

export function SidebarHeaderSkeleton() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="flex items-center gap-3 p-3">
            <Skeleton className="h-12 w-12 rounded-md" />
            <div className="grid flex-1 text-left text-sm leading-tight gap-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}

export const AdminSidebar = memo(() => {
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession()
  const user: User = session?.user
  const pathname = usePathname();


  return (
    <Sidebar collapsible="icon">
      {status === 'loading'? <SidebarHeaderSkeleton /> : (
        <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
                <Avatar className='rounded-md overflow-hidden'>
                  <AvatarImage src={user?.image} alt="Profile image" className='rounded-md object-cover'/>
                  <AvatarFallback>'U'</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-sm">{user?.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    @{user?.username}
                  </span>
                </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      )}

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild className={isActive ? 'bg-[#f4f4f5]' : ''}>
                      <Link prefetch={false} href={item.href}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun /> : <Moon />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOutIcon/>
                <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
});

AdminSidebar.displayName = 'AdminSidebar';
