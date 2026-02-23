'use client';

import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { CheckSquare, Clock, BarChart3, Settings, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function UserSidebar() {
  const { isMobile, setOpenMobile } = useSidebar();
  const router = useRouter();

  const userMenuItems = [
    {
      title: 'Dashboard',
      url: '/user',
      icon: BarChart3,
    },
    {
      title: 'My Tasks',
      url: '/user/tasks',
      icon: CheckSquare,
    },
    {
      title: 'Calendar',
      url: '/user/calendar',
      icon: Clock,
    },
  ];

  const settingsMenuItems = [
    {
      title: 'Profile',
      url: '/user/profile',
      icon: User,
    },
    {
      title: 'Settings',
      url: '/user/settings',
      icon: Settings,
    },
  ];

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        toast.success('Logged out successfully');
        router.push('/login');
      }
    } catch {
      toast.error('Error logging out');
    }
  };

  return (
    <Sidebar>
      <SidebarContent className="flex flex-col h-full">
        {/* Header */}
        <div className="px-4 py-6 border-b">
          <h1 className="text-lg font-bold">TaskHive</h1>
          <p className="text-xs text-muted-foreground">User Dashboard</p>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild onClick={handleNavClick}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild onClick={handleNavClick}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <SidebarGroup className="border-t">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-destructive hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
