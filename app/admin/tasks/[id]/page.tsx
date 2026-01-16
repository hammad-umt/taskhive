'use client';

import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  User,
  Calendar,
  Edit2,
  Trash2,
  Clock,
  MessageSquare,
  Download,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_to: string;
  due_date: string;
  created_at: string;
  created_by: string;
  completed_at?: string;
}

interface User {
  id: string;
  full_name: string;
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id;

  const [task, setTask] = useState<Task | null>(null);
  const [assigneeName, setAssigneeName] = useState<string>('');
  const [createdByName, setCreatedByName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch task data on mount
  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching task data for ID:', taskId);
      try {
        const [taskRes, usersRes] = await Promise.all([
          fetch(`/api/tasks/gettaskbyid?id=${taskId}`),
          fetch('/api/users/getusers'),
        ]);

        const taskData = await taskRes.json();
        const usersData = await usersRes.json();

        console.log('Task data received:', taskData);
        console.log('Users data received:', usersData);

        if (taskRes.ok && taskData.data) {
          setTask(taskData.data);
          console.log('Task loaded:', {
            assigned_to: taskData.data.assigned_to,
            created_by: taskData.data.created_by,
          });

          // Find assignee and creator names
          if (usersData.users) {
            const assignee = usersData.users.find((u: User) => u.id === taskData.data.assigned_to);
            const creator = usersData.users.find((u: User) => u.id === taskData.data.created_by);
            
            console.log('Found assignee:', assignee?.full_name);
            console.log('Found creator:', creator?.full_name);
            
            if (assignee) setAssigneeName(assignee.full_name);
            if (creator) setCreatedByName(creator.full_name);
          }
        } else {
          throw new Error('Failed to fetch task data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load task. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId) {
      fetchData();
    }
  }, [taskId]);

  const handleDelete = async () => {
    setIsDeleting(true);
    const loadingToast = toast.loading('Deleting task...');

    try {
      console.log('Deleting task:', taskId);
      
      const response = await fetch(`/api/tasks/deletetask?id=${taskId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      console.log('Delete response:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete task');
      }

      console.log('Task deleted successfully');
      toast.dismiss(loadingToast);
      toast.success('Task deleted successfully!');
      setDeleteDialogOpen(false);

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/tasks');
      }, 1500);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to delete task. Please try again.');
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
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

  const isOverdue =
    task && task.status !== 'completed' &&
    new Date(task.due_date) < new Date();

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <div className="inline-block">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 font-medium">Loading task details...</p>
          </div>
        </div>
      )}

      {!isLoading && !task && (
        <div className="text-center py-12">
          <p className="text-gray-600 font-medium">Task not found</p>
        </div>
      )}

      {!isLoading && task && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/tasks">
                <Button variant="ghost" size="icon">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Task Details</h1>
                <p className="text-gray-500">View and manage task information</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link href={`/admin/tasks/${taskId}/edit`}>
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
          {/* Task Header Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
                    <div className="flex gap-2">
                      <Badge
                        variant="secondary"
                        className={getStatusColor(task.status)}
                      >
                        {task.status.replace('-', ' ')}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={getPriorityColor(task.priority)}
                      >
                        {task.priority}
                      </Badge>
                      {isOverdue && (
                        <Badge variant="destructive">Overdue</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-gray-700 leading-relaxed">
                    {task.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Details Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Task Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                      {assigneeName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <p className="font-semibold">{assigneeName}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <p className="font-semibold capitalize">
                    {task.status.replace('-', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Priority</p>
                  <p className="font-semibold capitalize">{task.priority}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Due Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <p className="font-semibold">
                      {new Date(task.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Created</p>
                  <p className="font-semibold">
                    {new Date(task.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Created By</p>
                  <p className="font-semibold">{createdByName}</p>
                </div>
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
                Add Comment
              </Button>
              <Button className="w-full gap-2" variant="outline">
                <Download size={18} />
                Export Task
              </Button>
            </CardContent>
          </Card>

          {/* Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Status Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Current Status</p>
                <Badge
                  className={`${getStatusColor(task.status)} capitalize`}
                >
                  {task.status.replace('-', ' ')}
                </Badge>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-1">Priority Level</p>
                <Badge
                  className={`${getPriorityColor(task.priority)} capitalize`}
                >
                  {task.priority}
                </Badge>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-2">Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      task.status === 'completed'
                        ? 'bg-green-500'
                        : task.status === 'in-progress'
                          ? 'bg-blue-500 w-2/3'
                          : 'bg-yellow-500 w-1/3'
                    }`}
                    style={{
                      width:
                        task.status === 'completed'
                          ? '100%'
                          : task.status === 'in-progress'
                            ? '66%'
                            : '33%',
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-gray-500">
                    {new Date(task.created_at).toLocaleDateString()} by{' '}
                    {createdByName}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">In Progress</p>
                  <p className="text-gray-500">Started 3 days ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="text-gray-400" size={16} />
                <div>
                  <p className="font-medium">Due Date</p>
                  <p className="text-gray-500">
                    {new Date(task.due_date).toLocaleDateString()}
                  </p>
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
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {task?.title}? This action cannot
              be undone and all associated data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
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
        </>
      )}
    </div>
  );
}
