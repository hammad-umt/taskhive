'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Calendar,
  Flag,
  Edit2,
  Trash2,
  MessageSquare,
  Download,
  Clock,
  CheckCircle2,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  dueDate: string;
  createdAt: string;
  createdBy: string;
  completedAt?: string;
  comments: number;
  attachments: number;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
  avatar: string;
}

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id;

  // Sample task data - in a real app, fetch this from API
  const task: Task = {
    id: parseInt(taskId as string),
    title: 'Complete project documentation',
    description: 'Write comprehensive docs for the API including endpoint documentation, authentication, and error handling. Should include code examples and usage guides for developers.',
    status: 'in-progress',
    priority: 'high',
    assignee: 'John Doe',
    dueDate: '2026-01-20',
    createdAt: '2026-01-10',
    createdBy: 'Sarah Wilson',
    comments: 3,
    attachments: 2,
  };

  // Sample comments
  const comments: Comment[] = [
    {
      id: 1,
      author: 'Jane Smith',
      content: 'Started working on the API documentation. Making good progress.',
      date: '2026-01-14',
      avatar: 'JS',
    },
    {
      id: 2,
      author: 'Mike Johnson',
      content: 'Please make sure to include error handling documentation.',
      date: '2026-01-13',
      avatar: 'MJ',
    },
    {
      id: 3,
      author: 'John Doe',
      content: 'Will add comprehensive examples for all endpoints by tomorrow.',
      date: '2026-01-12',
      avatar: 'JD',
    },
  ];

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Task deleted:', taskId);
      setDeleteDialogOpen(false);
      // In a real app, you would redirect here
      // redirect('/admin/tasks');
    } finally {
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
    task.status !== 'completed' &&
    new Date(task.dueDate) < new Date();

  return (
    <div className="space-y-6">
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
                      {task.assignee
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <p className="font-semibold">{task.assignee}</p>
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
                      {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Created</p>
                  <p className="font-semibold">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Created By</p>
                  <p className="font-semibold">{task.createdBy}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare size={20} />
                Comments ({comments.length})
              </CardTitle>
              <CardDescription>
                Team communication and task updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-b pb-4 last:border-b-0"
                  >
                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-sm flex-shrink-0">
                        {comment.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold">{comment.author}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(comment.date).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Comment */}
                <div className="pt-4 border-t">
                  <textarea
                    placeholder="Add a comment..."
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <Button className="mt-2">Post Comment</Button>
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
                    {new Date(task.createdAt).toLocaleDateString()} by{' '}
                    {task.createdBy}
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
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
              <CardDescription>{task.attachments} file(s)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="border rounded-lg p-3 flex items-center gap-3 hover:bg-gray-50">
                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center text-red-600 font-bold text-sm">
                  P
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">api_docs.pdf</p>
                  <p className="text-xs text-gray-500">2.4 MB</p>
                </div>
              </div>
              <div className="border rounded-lg p-3 flex items-center gap-3 hover:bg-gray-50">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 font-bold text-sm">
                  X
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    examples.xlsx
                  </p>
                  <p className="text-xs text-gray-500">856 KB</p>
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
              Are you sure you want to delete {task.title}? This action cannot
              be undone and all associated data will be permanently removed.
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
