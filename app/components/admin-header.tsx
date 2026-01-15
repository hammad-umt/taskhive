'use client';

import React, { useState } from 'react';
import { Bell, Settings, LogOut, User, Moon, Sun, Search } from 'lucide-react';
import Link from 'next/link';

export function AdminHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationCount] = useState(3);

  return (
    <header className="admin-header">
      <div className="header-container">
        {/* Left Section - Breadcrumb/Title */}
        <div className="header-left">
          <div className="breadcrumb">
            <span className="breadcrumb-item">Dashboard</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Overview</span>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="header-center">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search users, tasks..."
              className="search-input"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="header-right">
          {/* Notifications */}
          <div className="header-action">
            <button className="action-button notification-button" title="Notifications">
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </button>
          </div>

          {/* Theme Toggle */}
          <div className="header-action">
            <button
              className="action-button theme-toggle"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Toggle theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* User Profile Dropdown */}
          <div className="header-action profile-dropdown-wrapper">
            <button
              className="profile-button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="profile-avatar">
                <User size={20} />
              </div>
              <div className="profile-text">
                <p className="profile-name">Admin User</p>
                <p className="profile-role">Administrator</p>
              </div>
              <span className={`dropdown-arrow ${isProfileOpen ? 'open' : ''}`}>
                ▼
              </span>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="dropdown-menu">
                <Link href="/profile" className="dropdown-item">
                  <User size={16} />
                  <span>My Profile</span>
                </Link>
                <Link href="/settings" className="dropdown-item">
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-item">
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
