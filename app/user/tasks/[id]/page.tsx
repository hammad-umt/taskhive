'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, Calendar, AlertCircle, CheckCircle2, Edit2 } from 'lucide-react';
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

import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getStatusColor, getPriorityColor, getStatusLabel, getPriorityLabel } from '@/app/utils/colorUtils';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  assigned_to?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    fetchTaskDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tasks/gettaskbyid?id=${taskId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch task');
      }
      
      const data = await response.json();
      setTask(data.data);
      setStatus(data.data?.status || '');
    } catch {
      toast.error('Failed to load task details');
      router.push('/user/tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!task) return;
    
    try {
      setUpdating(true);
      const response = await fetch(`/api/tasks/updatetask`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: task.id,
          title: task.title,
          description: task.description,
          status: newStatus,
          priority: task.priority,
          dueDate: task.due_date,
          assignee: task.assigned_to,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      setStatus(newStatus);
      setTask({ ...task, status: newStatus });
      toast.success(`Task marked as ${newStatus}`);
    } catch {
      toast.error('Failed to update task status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = getStatusColor(status);
    const label = getStatusLabel(status);
    return (
      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
        {label}
      </div>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = getPriorityColor(priority);
    const label = getPriorityLabel(priority);
    return (
      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
        {label}
      </div>
    );
  };

  const formatDate = (date?: string) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    return due < now;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600">Task not found</h1>
        <Link href="/user/tasks">
          <Button className="mt-4">Back to Tasks</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Link href="/user/tasks">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{task.title}</h1>
          <p className="text-gray-500 mt-1">Task Details</p>
        </div>
      </div>

      {/* Main Task Details Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle>Task Information</CardTitle>
              <CardDescription>View and manage your task</CardDescription>
            </div>
            <div className="flex gap-2">
              {getStatusBadge(task.status)}
              {getPriorityBadge(task.priority)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
              {task.description || 'No description provided'}
            </p>
          </div>

          {/* Status and Priority Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status Section */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Status</label>
              <Select value={status} onValueChange={handleStatusUpdate} disabled={updating}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority Section */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Priority</label>
              <div className="flex items-center h-10 px-3 bg-gray-50 rounded-md border">
                <span className="capitalize">{getPriorityBadge(task.priority)}</span>
              </div>
            </div>
          </div>

          {/* Due Date Section */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Due Date
            </label>
            <div className={`flex items-center gap-2 p-3 bg-gray-50 rounded-md ${
              isOverdue(task.due_date) && task.status !== 'completed' ? 'border border-red-300' : ''
            }`}>
              <span>{formatDate(task.due_date)}</span>
              {isOverdue(task.due_date) && task.status !== 'completed' && (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {status !== 'completed' && (
              <Button
                onClick={() => handleStatusUpdate('in-progress')}
                disabled={updating}
                className="flex-1"
                variant={status === 'in-progress' ? 'default' : 'outline'}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                {status === 'in-progress' ? 'In Progress' : 'Start Work'}
              </Button>
            )}
            {status !== 'completed' && (
              <Button
                onClick={() => handleStatusUpdate('completed')}
                disabled={updating}
                className="flex-1"
                variant="default"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
            )}
            {status === 'completed' && (
              <Button disabled className="flex-1 opacity-50">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Completed
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metadata Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Created</p>
              <p className="font-medium">{formatDate(task.created_at)}</p>
            </div>
            <div>
              <p className="text-gray-600">Last Updated</p>
              <p className="font-medium">{formatDate(task.updated_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Back Button */}
      <div>
        <Link href="/user/tasks" className="w-full">
          <Button variant="outline" className="w-full">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to All Tasks
          </Button>
        </Link>
      </div>
    </div>
  );
}
