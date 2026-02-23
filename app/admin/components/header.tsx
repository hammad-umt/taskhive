'use client';

import React, { useState } from 'react';
import { Bell, Settings, LogOut, User, Moon, Sun, Search, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTheme } from '@/app/providers/theme-provider';
import AdminNotifications from '@/app/components/admin-notifications';

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'overdue' | 'unassigned' | 'pending' | 'urgent';
  taskId: string;
  priority: string;
}

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const notificationCount = notifications.length;

  const fetchWithRetry = async (url: string, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      } catch (error) {
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 300));
        } else {
          throw error;
        }
      }
    }
  };

  const fetchNotifications = async () => {
    try {
      setNotificationsLoading(true);

      const [notifRes, deletionsRes] = await Promise.all([
        fetchWithRetry('/api/admin/notifications'),
        fetchWithRetry('/api/admin/task-deletions'),
      ]);

      const allNotifications: Notification[] = [...(notifRes.notifications || [])];

      if (deletionsRes.deletions && deletionsRes.deletions.length > 0) {
        deletionsRes.deletions.forEach((deletion: { id?: string; task_id: string; task_title: string; deleted_by_user_email: string; task_priority?: string }) => {
          allNotifications.unshift({
            id: `deletion-${deletion.id || deletion.task_id}`,
            title: `Task Deleted: ${deletion.task_title}`,
            description: `Deleted by ${deletion.deleted_by_user_email}`,
            type: 'urgent',
            taskId: deletion.task_id,
            priority: deletion.task_priority || 'medium',
          });
        });
      }

      setNotifications(allNotifications.slice(0, 10));
    } catch {
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleNotificationClick = async () => {
    const nextOpenState = !isNotificationOpen;
    setIsNotificationOpen(nextOpenState);
    setIsProfileOpen(false);

    if (nextOpenState) {
      await fetchNotifications();
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
      if (response.ok) {
        window.location.href = '/login';
      }
    } catch {
      // intentionally silent in UI logs
    }
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    }  else {
      setTheme('light');
    }
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-40 transition-all duration-300">
      {/* Desktop Layout */}
      <div className="hidden md:flex w-full px-6 py-4 items-center justify-between gap-4">
        {/* Left Section - Breadcrumb & Menu Toggle */}
        <div className="flex items-center gap-4 shrink-0">
          <SidebarTrigger className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Dashboard</span>
            <span className="text-gray-300 dark:text-gray-700">/</span>
            <span className="text-gray-900 dark:text-gray-100 font-semibold">Admin Panel</span>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search users, tasks..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={handleNotificationClick}
              className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition duration-200"
              title="Notifications"
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-95 z-50">
                <AdminNotifications
                  notifications={notifications}
                  isLoading={notificationsLoading}
                />
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition duration-200"
            title={`Theme: ${theme}. Click to change.`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition duration-200"
            >
              <div className="w-8 h-8 bg-linear-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white shrink-0">
                <User size={16} />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Admin User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 shrink-0 ${
                  isProfileOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
                <Link
                  href="/admin/profile"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition"
                >
                  <User size={16} />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>
                <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-sm transition"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout - Compact */}
      <div className="md:hidden w-full px-4 py-3 flex items-center justify-between gap-2 relative">
        {/* Left - Menu Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <SidebarTrigger className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" />
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Admin</span>
        </div>

        {/* Right - Essential Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Notification Bell */}
          <button
            onClick={handleNotificationClick}
            className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition duration-200"
            title="Notifications"
          >
            <Bell size={18} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Theme Toggle - Always visible */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition duration-200"
            title={`Theme: ${theme}`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User Profile - Icon only on mobile */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationOpen(false);
              }}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition duration-200"
              title="Profile"
            >
              <div className="w-6 h-6 bg-linear-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white">
                <User size={14} />
              </div>
            </button>

            {/* Mobile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
                <Link
                  href="/admin/profile"
                  className="flex items-center gap-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition"
                >
                  <User size={16} />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>
                <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-sm transition"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {isNotificationOpen && (
          <div className="absolute left-2 right-2 top-full mt-2 z-50">
            <AdminNotifications
              notifications={notifications}
              isLoading={notificationsLoading}
            />
          </div>
        )}
      </div>
    </header>
  );
}