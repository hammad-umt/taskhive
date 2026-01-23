'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Trash2, Eye, Search, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getStatusColor, getPriorityColor, getStatusLabel, getPriorityLabel } from '@/app/utils/colorUtils';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  assignedTo?: string;
  userId?: string;
  createdBy?: string;
}

const TableSkeleton = () => (
  <div className="space-y-2">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
    ))}
  </div>
);

export default function UserTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Debounced search
  const filteredAndSearchedTasks = useMemo(() => {
    let result = tasks.filter(task => {
      if (filter === 'all') return true;
      return task.status === filter;
    });

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [tasks, filter, searchQuery]);

  useEffect(() => {
    // Get user ID from session/localStorage
    const getUserId = async () => {
      try {
        // Try to get from localStorage first (set during login)
        const storedUserId = localStorage.getItem('userId');
        
        if (storedUserId) {
          await fetchUserTasks(storedUserId);
        } else {
          // If not in localStorage, fetch from API
          const userRes = await fetch('/api/auth/me');
          if (userRes.ok) {
            const userData = await userRes.json();
            await fetchUserTasks(userData.id);
          }
        }
      } catch {
        toast.error('Failed to get user information');
      }
    };

    getUserId();
  }, []);

  const fetchUserTasks = async (userIdParam: string) => {
    try {
      setLoading(true);
      // Use the secure user tasks endpoint
      // This ensures users can ONLY see their own tasks
      const response = await fetch(`/api/tasks/getuserTasks?userId=${userIdParam}`);
      
      if (!response.ok) throw new Error('Failed to fetch tasks');
      
      const apiData = await response.json();
      const userTasks = apiData.data || [];
      
      setTasks(userTasks);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setSelectedTaskId(taskId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedTaskId) return;

    try {
      setDeleting(true);
      
      // Find the task being deleted
      const taskBeingDeleted = tasks.find(t => t.id === selectedTaskId);
      
      const response = await fetch(`/api/tasks/deletetask/${selectedTaskId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Log the deletion to notify admin
        const userId = localStorage.getItem('userId');
        const userEmail = localStorage.getItem('userEmail');
        
        if (taskBeingDeleted && userId && userEmail) {
          try {
            await fetch('/api/tasks/log-deletion', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                taskId: selectedTaskId,
                taskTitle: taskBeingDeleted.title,
                userId,
                userEmail,
                taskPriority: taskBeingDeleted.priority,
                taskStatus: taskBeingDeleted.status,
              }),
            });
          } catch (logError) {
            console.error('Failed to log deletion:', logError);
          }
        }
        
        setTasks(tasks.filter(t => t.id !== selectedTaskId));
        toast.success('Task deleted successfully');
      } else {
        toast.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Error deleting task');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedTaskId(null);
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

  const renderPriorityBadge = (priority: string) => {
    const colors = getPriorityColor(priority);
    const label = getPriorityLabel(priority);
    return (
      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
        {label}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Tasks</h1>
            <p className="text-muted-foreground">View and manage all your assigned tasks</p>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Card>
          <CardContent className="pt-6">
            <TableSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <p className="text-muted-foreground">View and manage all your assigned tasks ({filteredAndSearchedTasks.length})</p>
        </div>
        <Link href="/user/tasks/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </Link>
      </div>

      {/* Search Box */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search tasks by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'in-progress', 'completed', 'on-hold'].map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            onClick={() => setFilter(status)}
            className="capitalize"
          >
            {status === 'in-progress' ? 'In Progress' : status === 'on-hold' ? 'On Hold' : status}
          </Button>
        ))}
      </div>

      {/* Tasks Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredAndSearchedTasks.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSearchedTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">
                        <Link href={`/user/tasks/${task.id}`} className="hover:underline">
                          {task.title}
                        </Link>
                      </TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell>{renderPriorityBadge(task.priority)}</TableCell>
                      <TableCell>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/user/tasks/${task.id}`}>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'No tasks match your search' : 'No tasks found'}
              </p>
              {!searchQuery && (
                <Link href="/user/tasks/new">
                  <Button>Create Your First Task</Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel disabled={deleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Deleting...' : 'Delete Task'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
