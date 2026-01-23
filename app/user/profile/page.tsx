'use client';

import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Calendar, LogOut, Edit2, Save, X, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  department?: string;
  role?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  avatar_url?: string;
}

export default function UserProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    department: '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        toast.error('Please login first');
        router.push('/login');
        return;
      }

      // For now, we'll create a profile from localStorage data
      // In production, you'd fetch this from an API endpoint
      const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
      const userRole = localStorage.getItem('userRole') || 'user';
      
      // Create a mock profile (in production, fetch from API)
      const mockProfile: UserProfile = {
        id: userId,
        email: userEmail,
        full_name: 'User Profile',
        first_name: 'User',
        last_name: 'Profile',
        phone: '+1 (555) 000-0000',
        department: 'Engineering',
        role: userRole,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setProfile(mockProfile);
      setFormData({
        full_name: mockProfile.full_name || '',
        phone: mockProfile.phone || '',
        department: mockProfile.department || '',
      });
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      // In production, this would make an API call to update the user profile
      // For now, we'll just update the local state
      setProfile(prev => prev ? {
        ...prev,
        full_name: formData.full_name,
        phone: formData.phone,
        department: formData.department,
        updated_at: new Date().toISOString(),
      } : null);
      
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      
      if (response.ok) {
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        toast.success('Logged out successfully');
        router.push('/login');
      }
    } catch {
      toast.error('Failed to logout');
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (passwordData.newPassword === passwordData.oldPassword) {
      toast.error('New password must be different from old password');
      return;
    }

    try {
      setPasswordLoading(true);

      // Call Supabase password change endpoint
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to change password');
      }

      toast.success('Password changed successfully');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordDialog(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600">Profile not found</h1>
        <Button onClick={() => router.push('/user')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-500 mt-1">Manage your account information</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white shadow-lg">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profile.full_name}</h2>
                <p className="text-gray-500">{profile.email}</p>
              </div>
            </div>
            <Badge variant={profile.status === 'active' ? 'default' : 'outline'}>
              {profile.status ? profile.status.charAt(0).toUpperCase() + profile.status.slice(1) : 'Active'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your personal and account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isEditing ? (
            // Edit Mode
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Full Name</label>
                <Input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Email</label>
                <Input
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Phone</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Department</label>
                <Input
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Enter your department"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      full_name: profile.full_name || '',
                      phone: profile.phone || '',
                      department: profile.department || '',
                    });
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </p>
                <p className="font-medium">{profile.email}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </p>
                <p className="font-medium">{profile.full_name || '-'}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </p>
                <p className="font-medium">{profile.phone || '-'}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium">{profile.department || '-'}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">Role</p>
                <Badge variant="outline">{profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'User'}</Badge>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">Status</p>
                <Badge variant={profile.status === 'active' ? 'default' : 'outline'}>
                  {profile.status ? profile.status.charAt(0).toUpperCase() + profile.status.slice(1) : 'Active'}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Account Created
              </p>
              <p className="font-medium mt-1">{formatDate(profile.created_at)}</p>
            </div>
            <div>
              <p className="text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Last Updated
              </p>
              <p className="font-medium mt-1">{formatDate(profile.updated_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-red-700 mb-2">Change Password</h4>
            <p className="text-sm text-red-600 mb-3">Update your password to secure your account</p>
            <Button
              onClick={() => setShowPasswordDialog(true)}
              variant="outline"
              className="border-red-300 hover:bg-red-100"
            >
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>
          <div className="border-t border-red-200 pt-4">
            <h4 className="text-sm font-semibold text-red-700 mb-2">Logout</h4>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Change Dialog */}
      <AlertDialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Change Password</AlertDialogTitle>
            <AlertDialogDescription>
              Enter your current password and choose a new one. Password must be at least 6 characters.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Current Password</label>
              <Input
                type="password"
                placeholder="Enter your current password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData(prev => ({
                  ...prev,
                  oldPassword: e.target.value
                }))}
                autoComplete="current-password"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">New Password</label>
              <Input
                type="password"
                placeholder="Enter your new password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({
                  ...prev,
                  newPassword: e.target.value
                }))}
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Confirm New Password</label>
              <Input
                type="password"
                placeholder="Confirm your new password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({
                  ...prev,
                  confirmPassword: e.target.value
                }))}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <AlertDialogCancel
              disabled={passwordLoading}
              onClick={() => {
                setPasswordData({
                  oldPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                });
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={passwordLoading}
              onClick={handleChangePassword}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {passwordLoading ? 'Updating...' : 'Change Password'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
