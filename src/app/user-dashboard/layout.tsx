'use client';

import { useState } from 'react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Users, Activity, DollarSign, Eye } from 'lucide-react';
import { DashboardCard } from '@/components/ui/dashboard-card';
import { DashboardHeader } from '@/components/ui/dashboard-header';
import { AdminSidebar } from '@/components/ui/admin-sidebar';

// Dashboard stats data
const stats = [
  {
    title: 'Total Users',
    value: '12,345',
    change: '+12%',
    changeType: 'positive' as const,
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Revenue',
    value: '$45,678',
    change: '+8.2%',
    changeType: 'positive' as const,
    icon: DollarSign,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    title: 'Active Sessions',
    value: '2,456',
    change: '+15%',
    changeType: 'positive' as const,
    icon: Activity,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    title: 'Page Views',
    value: '34,567',
    change: '-2.4%',
    changeType: 'negative' as const,
    icon: Eye,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
];

export default function layout ({children} : Readonly<{
  children: React.ReactNode;
}>){
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleExport = () => {
    console.log('Exporting data...');
  };


  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <DashboardHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={handleRefresh}
          onExport={handleExport}
          isRefreshing={isRefreshing}
        />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
