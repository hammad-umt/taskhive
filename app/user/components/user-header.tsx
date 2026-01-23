'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Search, Moon, Sun, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/components/ui/sidebar';
import { toast } from 'sonner';

export default function UserHeader() {
  const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') || 'dark' : 'dark';
  const [isDark, setIsDark] = useState(savedTheme === 'dark');
  const router = useRouter();
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    const isDarkMode = localStorage.getItem('theme') === 'dark' || !localStorage.getItem('theme');
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    
    const html = document.documentElement;
    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        toast.success('Logged out successfully');
        router.push('/login');
      } else {
        toast.error('Failed to logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  return (
    <header className={`flex h-16 items-center justify-between gap-4 border-b px-6 ${
      isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center gap-2 flex-1">
        {/* Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleSidebar()}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search Bar */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'
        } flex-1 max-w-md`}>
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tasks..." 
            className="border-0 bg-transparent outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
          title="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full relative"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="rounded-full text-destructive hover:text-destructive"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}

