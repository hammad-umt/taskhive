'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Trash2,
  MessageSquare,
  Download,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: string;
  lastActive: string;
  location: string;
  avatar: string;
  bio: string;
}

interface Task {
  id: number;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id;

  // Sample user data - in a real app, fetch this from API
  const user: User = {
    id: parseInt(userId as string),
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    department: 'Backend Development',
    role: 'Senior Developer',
    status: 'active',
    joinDate: '2024-03-15',
    lastActive: '2026-01-15',
    location: 'San Francisco, CA',
    avatar: 'JD',
    bio: 'Passionate backend developer with 8+ years of experience in building scalable applications.',
  };

  // Sample tasks assigned to user
  const userTasks: Task[] = [
    {
      id: 1,
      title: 'Complete project documentation',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2026-01-20',
    },
    {
      id: 4,
      title: 'Database optimization',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2026-01-25',
    },
    {
      id: 6,
      title: 'API endpoint testing',
      status: 'pending',
      priority: 'medium',
      dueDate: '2026-01-28',
    },
  ];

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('User deleted:', userId);
      setDeleteDialogOpen(false);
      // In a real app, you would redirect here
      // redirect('/admin/users');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
            <p className="text-gray-500">View and manage user information</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link href={`/admin/users/${userId}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit2 size={18} />
              Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            className="gap-2"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 size={18} />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                    {user.avatar}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{user.name}</h2>
                      <p className="text-gray-600">{user.role}</p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(user.status)}
                    >
                      {user.status}
                    </Badge>
                  </div>

                  <div className="grid gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={16} />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} />
                      <span>{user.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <p className="text-gray-700">{user.bio}</p>
              </div>
            </CardContent>
          </Card>

          {/* User Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>User Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Department</p>
                  <p className="font-semibold">{user.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Role</p>
                  <p className="font-semibold">{user.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Joined</p>
                  <p className="font-semibold">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Last Active</p>
                  <p className="font-semibold">
                    {new Date(user.lastActive).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Assigned Tasks</CardTitle>
              <CardDescription>
                {userTasks.length} task{userTasks.length !== 1 ? 's' : ''}{' '}
                assigned to this user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userTasks.length > 0 ? (
                      userTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <p className="font-medium">{task.title}</p>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={getTaskStatusColor(task.status)}
                            >
                              {task.status.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={getPriorityColor(task.priority)}
                            >
                              {task.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/admin/tasks/${task.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                              >
                                View
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p className="text-gray-500">
                            No tasks assigned to this user
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full gap-2" variant="outline">
                <MessageSquare size={18} />
                Send Message
              </Button>
              <Button className="w-full gap-2" variant="outline">
                <Download size={18} />
                Export Profile
              </Button>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Current Status</p>
                <Badge
                  className={`${getStatusColor(user.status)} capitalize`}
                >
                  {user.status}
                </Badge>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-1">Tasks Completed</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-1">Tasks In Progress</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-1">Tasks Pending</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </CardContent>
          </Card>

          {/* Activity Card */}
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Last login</p>
                  <p className="text-gray-500">
                    {new Date(user.lastActive).toLocaleDateString()} at{' '}
                    {new Date(user.lastActive).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Last task update</p>
                  <p className="text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Profile updated</p>
                  <p className="text-gray-500">5 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {user.name}? This action cannot be
              undone and all associated data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
