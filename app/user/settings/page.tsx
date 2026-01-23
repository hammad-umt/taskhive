'use client';

import React, { useState } from 'react';
import { Bell, Lock, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function UserSettingsPage() {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    taskReminders: true,
    weeklyDigest: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    showOnlineStatus: true,
  });

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof notifications],
    }));
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  const handleChangePassword = () => {
    toast.info('Password change feature coming soon');
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        toast.success('Logged out successfully');
        window.location.href = '/login';
      }
    } catch {
      toast.error('Error logging out');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and account settings</p>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </CardTitle>
          <CardDescription>Control how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label className="font-medium">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.emailNotifications}
              onChange={() => handleNotificationChange('emailNotifications')}
              className="h-5 w-5 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label className="font-medium">Task Reminders</Label>
              <p className="text-sm text-muted-foreground">Get reminders about upcoming tasks</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.taskReminders}
              onChange={() => handleNotificationChange('taskReminders')}
              className="h-5 w-5 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label className="font-medium">Weekly Digest</Label>
              <p className="text-sm text-muted-foreground">Receive a weekly summary of your tasks</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.weeklyDigest}
              onChange={() => handleNotificationChange('weeklyDigest')}
              className="h-5 w-5 rounded"
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Privacy & Security
          </CardTitle>
          <CardDescription>Control your privacy settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 border rounded-lg">
            <Label className="font-medium">Profile Visibility</Label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={privacy.profileVisibility === 'private'}
                  onChange={() => setPrivacy(prev => ({ ...prev, profileVisibility: 'private' }))}
                />
                <span>Private</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={privacy.profileVisibility === 'friends'}
                  onChange={() => setPrivacy(prev => ({ ...prev, profileVisibility: 'friends' }))}
                />
                <span>Friends Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={privacy.profileVisibility === 'public'}
                  onChange={() => setPrivacy(prev => ({ ...prev, profileVisibility: 'public' }))}
                />
                <span>Public</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label className="font-medium">Show Online Status</Label>
              <p className="text-sm text-muted-foreground">Let others see when you&apos;re online</p>
            </div>
            <input
              type="checkbox"
              checked={privacy.showOnlineStatus}
              onChange={() => setPrivacy(prev => ({ ...prev, showOnlineStatus: !prev.showOnlineStatus }))}
              className="h-5 w-5 rounded"
            />
          </div>

          <Button onClick={handleChangePassword} variant="outline" className="w-full">
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex gap-2">
        <Button onClick={handleSaveSettings} className="flex-1">
          Save Settings
        </Button>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
