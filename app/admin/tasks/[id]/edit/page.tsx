'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Trash2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { FormSkeleton } from '@/app/components/skeleton-loaders';
import { toastNotifications } from '@/app/utils/toast-notifications';

interface TaskFormData {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
}

interface User {
  id: string;
  full_name: string;
}

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id;

  const emptyTaskData: TaskFormData = {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    assignee: '',
    dueDate: '',
  };

  const [formData, setFormData] = useState<TaskFormData>(emptyTaskData);
  const [initialTaskData, setInitialTaskData] = useState<TaskFormData>(emptyTaskData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  // Fetch task data and users on mount
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
          const data = taskData.data;
          const fetchedTaskData = {
            title: data.title || '',
            description: data.description || '',
            status: data.status || 'pending',
            priority: data.priority || 'medium',
            assignee: data.assigned_to || '',
            dueDate: data.due_date || '',
          };
          setFormData(fetchedTaskData);
          setInitialTaskData(fetchedTaskData);
          console.log('Form data set successfully');
        } else {
          throw new Error('Failed to fetch task data');
        }

        if (usersRes.ok && usersData.users) {
          setUsers(usersData.users);
          console.log('Users loaded:', usersData.users.length);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toastNotifications.error.fetchFailed('task details');
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId) {
      fetchData();
    }
  }, [taskId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsDirty(true);
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsDirty(true);
    // Clear error when user selects
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Task description is required';
    }
    if (!formData.assignee) {
      newErrors.assignee = 'Please select an assignee';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toastNotifications.error.validation('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toastNotifications.info.processing('Saving task...');

    try {
      console.log('Submitting task update:', { id: taskId, ...formData });
      
      const response = await fetch(`/api/tasks/updatetask`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: taskId,
          ...formData,
        }),
      });

      const result = await response.json();
      console.log('Response received:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update task');
      }

      console.log('Task updated successfully');
      toast.dismiss(loadingToast);
      toastNotifications.success.updated('Task');
      
      setIsDirty(false);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/admin/tasks`);
      }, 1500);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.dismiss(loadingToast);
      toastNotifications.error.updateFailed('task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    const loadingToast = toastNotifications.info.processing('Deleting task...');

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
      toastNotifications.success.deleted('Task');
      
      setDeleteDialogOpen(false);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/tasks');
      }, 1500);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.dismiss(loadingToast);
      toastNotifications.error.deleteFailed('task');
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialTaskData);
    setIsDirty(false);
    setErrors({});
    toast.success('Form reset');
  };

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading && <FormSkeleton />}

      {!isLoading && (
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
                <h1 className="text-3xl font-bold tracking-tight">Edit Task</h1>
                <p className="text-gray-500">Update task information</p>
              </div>
            </div>
            {isDirty && (
              <div className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-md border border-amber-200 flex items-center gap-2">
                <AlertCircle size={16} />
                You have unsaved changes
              </div>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Form Card */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Task Details</CardTitle>
                  <CardDescription>
                    Modify the task information below
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Task Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Enter task title"
                        value={formData.title}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className={errors.title ? 'border-red-500' : ''}
                      />
                      {errors.title && (
                        <p className="text-sm text-red-500">{errors.title}</p>
                      )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Enter task description"
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className={`w-full px-3 py-2 border rounded-md border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                          errors.description ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500">{errors.description}</p>
                      )}
                    </div>

                    {/* Grid for smaller fields */}
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Status */}
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) =>
                            handleSelectChange('status', value)
                          }
                          disabled={isSubmitting}
                        >
                          <SelectTrigger id="status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Priority */}
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(value) =>
                            handleSelectChange('priority', value)
                          }
                          disabled={isSubmitting}
                        >
                          <SelectTrigger id="priority">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Assignee */}
                    <div className="space-y-2">
                      <Label htmlFor="assignee">Assign To</Label>
                      <Select
                        value={formData.assignee}
                        onValueChange={(value) =>
                          handleSelectChange('assignee', value)
                        }
                        disabled={isSubmitting}
                      >
                        <SelectTrigger id="assignee">
                          <SelectValue placeholder="Select an assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.assignee && (
                        <p className="text-sm text-red-500">{errors.assignee}</p>
                      )}
                    </div>

                    {/* Due Date */}
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                        <Input
                          id="dueDate"
                          name="dueDate"
                          type="date"
                          value={formData.dueDate}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className={`pl-10 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                            errors.dueDate ? 'border-red-500' : ''
                          }`}
                        />
                      </div>
                      {errors.dueDate && (
                        <p className="text-sm text-red-500">{errors.dueDate}</p>
                      )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Link href="/admin/tasks" className="flex-1">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                      </Link>
                      {isDirty && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleReset}
                          className="flex-1"
                          disabled={isSubmitting}
                        >
                          Reset
                        </Button>
                      )}
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isSubmitting || !isDirty}
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Task Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Task Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Task ID</p>
                    <p className="font-mono font-semibold text-blue-600">#{taskId}</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium capitalize">{formData.status?.replace('-', ' ')}</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500">Priority</p>
                    <p className="font-medium capitalize">{formData.priority}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Delete Card */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-900">Danger Zone</CardTitle>
                  <CardDescription className="text-red-700">
                    This action cannot be undone
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="destructive"
                    className="w-full gap-2"
                    onClick={() => setDeleteDialogOpen(true)}
                    disabled={isSubmitting}
                  >
                    <Trash2 size={16} />
                    Delete Task
                  </Button>
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
                  Are you sure you want to delete this task? This action cannot be
                  undone and all associated data will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex gap-3 justify-end">
                <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isSubmitting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
