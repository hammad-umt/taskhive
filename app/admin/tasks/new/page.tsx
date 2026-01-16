'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
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

export default function NewTaskPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    assignee: '',
    dueDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAssignees, setIsLoadingAssignees] = useState(true);
  const [assignees, setAssignees] = useState<Array<{
    full_name: ReactNode; id: number; name: string 
}>>([]);

  // Fetch assignees on mount
  useEffect(() => {
    const fetchAssignees = async () => {
      try {
        setIsLoadingAssignees(true);
        const response = await fetch('/api/users/getusers');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        console.log('Fetched assignees:', data);
        setAssignees(data.users || []);
      } catch (error) {
        console.error('Failed to fetch assignees:', error);
        toastNotifications.error.fetchFailed('team members');
        setAssignees([]);
      } finally {
        setIsLoadingAssignees(false);
      }
    };
    fetchAssignees();
  }, []);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    // if (!formData.assignee) {
    //   newErrors.assignee = 'Please select an assignee';
    // }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toastNotifications.error.validation('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toastNotifications.info.processing('Creating task...');

    try {
      const response = await fetch('/api/tasks/addtask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      console.log('Task created:', formData);
      toast.dismiss(loadingToast);
      toastNotifications.success.created('Task');
      
      // Clear form data
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        assignee: '',
        dueDate: '',
      });
      setErrors({});

      // Redirect to tasks page after 1 second
      setTimeout(() => {
        router.push('/admin/tasks');
      }, 1000);
    } catch (error) {
      console.error('Error creating task:', error);
      toast.dismiss(loadingToast);
      toastNotifications.error.createFailed('task');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingAssignees) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/tasks">
            <Button variant="ghost" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Task</h1>
            <p className="text-gray-500">Add a new task to the system</p>
          </div>
        </div>
        <FormSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/tasks">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Task</h1>
          <p className="text-gray-500">Add a new task to the system</p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>
            Fill in the task information below
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
                className={`w-full px-3 py-2 border rounded-md border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
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
              >
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Select an assignee" />
                </SelectTrigger>
                <SelectContent>
                  {assignees.map((assignee) => (
                    <SelectItem key={assignee.id} value={assignee.id.toString()}>
                      {assignee?.full_name}
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
                  className={`pl-10 ${
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
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
