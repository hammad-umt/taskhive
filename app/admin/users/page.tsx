'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye } from 'lucide-react';
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

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  lastActive: string;
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users/getusers');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : data.users || []);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMsg);
        toast.error('Failed to load users', { description: errorMsg });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    // Refresh users every 5 seconds to catch new additions
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter users based on search and filters
  const filteredUsers = Array.isArray(users)
    ? users.filter((user) => {
        const matchesSearch =
          (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
          (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
        const matchesRole = roleFilter === 'all' || user.role?.toLowerCase() === roleFilter.toLowerCase();
        const matchesStatus = statusFilter === 'all' || user.status?.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesRole && matchesStatus;
      })
    : [];

  const getRoleBadgeVariant = (role: string | undefined): 'destructive' | 'secondary' | 'default' | 'outline' => {
    switch (role) {
      case 'Administrator':
        return 'destructive';
      case 'Manager':
        return 'secondary';
      case 'Developer':
        return 'default';
      case 'Designer':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusBadgeVariant = (status: string | undefined): 'default' | 'outline' => {
    return status === 'Active' ? 'default' : 'outline';
  };

  const handleDeleteUser = (userId: number) => {
    setSelectedUserId(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedUserId) return;
    
    toast.loading('Deleting user...');
    fetch('/api/users/deleteuser', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedUserId }),
    }).then(async (res) => {
      if (res.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== selectedUserId));
        toast.dismiss();
        toast.success('User deleted successfully');
      } else {
        const data = await res.json();
        toast.dismiss();
        toast.error('Failed to delete user', { description: data.message || 'Unknown error' });
      }
    }).catch((err) => {
      toast.dismiss();
      toast.error('Error deleting user', { description: err.message });
    });

    setDeleteDialogOpen(false);
    setSelectedUserId(null);
  };

  const formatUsername = (username: string | undefined): string => {
    if (!username) return '-';
    return username
      .replace(/\./g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) return <div className="text-center py-12 px-4">Loading...</div>;
  if (error) return <div className="text-center py-12 px-4 text-destructive">{error}</div>;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground text-sm md:text-base mt-2">
            Manage team members and their roles
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/users/new">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-10 text-sm md:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Role Filter */}
            <div>
              <label className="text-xs md:text-sm font-medium mb-2 block">Filter by Role</label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-xs md:text-sm font-medium mb-2 block">Filter by Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Users List</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Total {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full md:min-w-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs md:text-sm">Name</TableHead>
                      <TableHead className="text-xs md:text-sm">Email</TableHead>
                      <TableHead className="text-xs md:text-sm">Role</TableHead>
                      <TableHead className="text-xs md:text-sm">Status</TableHead>
                      <TableHead className="text-xs md:text-sm">Join Date</TableHead>
                      <TableHead className="text-xs md:text-sm hidden lg:table-cell">Last Active</TableHead>
                      <TableHead className="text-xs md:text-sm text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium text-xs md:text-sm">{formatUsername(user.username)}</TableCell>
                        <TableCell className="text-xs md:text-sm">{user.email || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                            {user.role || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(user.status)} className="text-xs">
                            {user.status || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs md:text-sm text-muted-foreground">
                          {user.created_at.split('T')[0] || '-'}
                        </TableCell>
                        <TableCell className="text-xs md:text-sm text-muted-foreground hidden lg:table-cell">
                          {user.lastActive || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1 md:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              title="View user"
                              className="h-8 w-8 p-0"
                            >
                              <Link href={`/admin/users/${user.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              title="Edit user"
                              className="h-8 w-8 p-0"
                            >
                              <Link href={`/admin/users/${user.id}/edit`}>
                                <Edit2 className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              title="Delete user"
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="w-[90vw] max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
