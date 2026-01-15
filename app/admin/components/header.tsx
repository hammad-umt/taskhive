'use client';

import React, { useState } from 'react';
import { Bell, Settings, LogOut, User, Moon, Sun, Search, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationCount] = useState(3);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
      if (response.ok) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40 transition-all duration-300">
      <div className="w-full px-6 py-4 flex items-center justify-between gap-4">
        {/* Left Section - Breadcrumb & Menu Toggle */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <SidebarTrigger className="text-gray-600 hover:bg-gray-100" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 font-medium">Dashboard</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-semibold">Admin Panel</span>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users, tasks..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Notification Bell */}
          <button
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition duration-200"
            title="Notifications"
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition duration-200"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200"></div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                <User size={16} />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                  isProfileOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                <Link
                  href="/admin/profile"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 text-sm transition"
                >
                  <User size={16} />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 text-sm transition"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>
                <div className="h-px bg-gray-200"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 text-sm transition"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}