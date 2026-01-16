'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Calendar, User } from 'lucide-react';
import Link from 'next/link';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
import { HeaderSkeleton, TableSkeleton } from '@/app/components/skeleton-loaders';


interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_to: string;
  due_date: string;
}

interface User {
  id: string;
  full_name: string;
}

export default function TasksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch tasks and users on mount
  useEffect(() => {
    const fetchData = async () => {
      console.log('Starting fetch data...');
      try {
        let tasksRes, usersRes;
        let retryCount = 0;
        const maxRetries = 3;
        
        // Retry logic for fetching
        while (retryCount < maxRetries) {
          try {
            console.log(`Fetching attempt ${retryCount + 1}/${maxRetries}`);
            [tasksRes, usersRes] = await Promise.all([
              fetch('/api/tasks/gettask', { 
                cache: 'no-store',
                headers: { 'Cache-Control': 'no-cache' }
              }),
              fetch('/api/users/getusers', {
                cache: 'no-store',
                headers: { 'Cache-Control': 'no-cache' }
              }),
            ]);
            
            if (tasksRes.ok && usersRes.ok) {
              break; // Success, exit retry loop
            }
            retryCount++;
            if (retryCount < maxRetries) {
              console.warn(`Fetch failed, retrying... (${retryCount}/${maxRetries})`);
              await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
            }
          } catch (err) {
            retryCount++;
            if (retryCount < maxRetries) {
              console.warn(`Fetch error, retrying... (${retryCount}/${maxRetries})`, err);
              await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
              throw err;
            }
          }
        }
        
        console.log('Responses received');
        console.log('Tasks Response Status:', tasksRes!.status);
        console.log('Users Response Status:', usersRes!.status);
        
        const tasksData = await tasksRes!.json();
        const usersData = await usersRes!.json();
        
        console.log('Raw Tasks Response:', tasksData);
        console.log('Raw Users Response:', usersData);
        
        const tasksArray = tasksData.data || [];
        const usersArray = usersData.users || [];
        
        console.log(`Parsed Tasks: ${tasksArray.length} tasks found`);
        console.log('Tasks array:', tasksArray);
        console.log(`Parsed Users: ${usersArray.length} users found`);
        console.log('Users array:', usersArray);
        
        setTasks(tasksArray);
        setUsers(usersArray);
        
        console.log('State updated with tasks and users');
      } catch (error) {
        console.error('Error fetching data:', error);
        setTasks([]);
        setUsers([]);
      } finally {
        setIsLoading(false);
        console.log('Loading complete');
      }
    };
    fetchData();
  }, []);

  // Function to get assignee name by ID
  const getAssigneeName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.full_name || 'Unassigned';
  };
  
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Log when tasks change
  useEffect(() => {
    console.log('📊 Tasks state updated:', tasks);
    console.log('📊 Filtered tasks:', filteredTasks);
  }, [tasks, filteredTasks]);

  // Status badge color
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

  // Priority badge color
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

  const handleDelete = (taskId: string) => {
    setSelectedTaskId(taskId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedTaskId === null) return;

    setIsDeleting(true);
    const loadingToast = toast.loading('Deleting task...');

    try {
      console.log('Deleting task:', selectedTaskId);
      
      const response = await fetch(`/api/tasks/deletetask?id=${selectedTaskId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      console.log('Delete response:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete task');
      }

      // Remove from local state
      setTasks(tasks.filter(t => t.id !== selectedTaskId));
      console.log('Task deleted successfully');
      
      toast.dismiss(loadingToast);
      toast.success('Task deleted successfully!');
      setDeleteDialogOpen(false);
      setSelectedTaskId(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to delete task. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <>
          <HeaderSkeleton />
          <TableSkeleton />
        </>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
              <p className="text-gray-500">Manage and track all tasks</p>
            </div>
            <Link href="/admin/tasks/new">
              <Button className="gap-2">
                <Plus size={20} />
                New Task
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search tasks</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by title or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks List</CardTitle>
          <CardDescription>
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}{' '}
            found
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
                  <TableHead>Assignee</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-gray-500">Loading tasks...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => {
                    console.log('Rendering task:', task);
                    return (
                      <TableRow key={task.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-gray-500">
                              {task.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(task.status)}
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
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-gray-400" />
                            {getAssigneeName(task.assigned_to)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" />
                            {new Date(task.due_date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/tasks/${task.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye size={16} />
                              </Button>
                            </Link>
                            <Link href={`/admin/tasks/${task.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit2 size={16} />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(task.id)}
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div>
                        <p className="text-gray-500 font-medium">No tasks found</p>
                        <p className="text-sm text-gray-400 mt-2">
                          {isLoading 
                            ? 'Loading...' 
                            : `Tasks: ${tasks.length} | Filtered: ${filteredTasks.length} | Status: ${statusFilter} | Priority: ${priorityFilter}`}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
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
