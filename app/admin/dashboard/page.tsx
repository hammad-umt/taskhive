'use client';

import React, { useEffect } from 'react';
import { Users, CheckSquare, Clock, TrendingUp } from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import AdminNotifications from '@/app/components/admin-notifications';
import { getStatusColor, getPriorityColor, getStatusLabel, getPriorityLabel } from '@/app/utils/colorUtils';

// Skeleton Components
const StatSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-10 rounded-lg" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-12 mb-2" />
      <Skeleton className="h-3 w-32" />
    </CardContent>
  </Card>
);

const ChartSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-32 mb-2" />
      <Skeleton className="h-4 w-48" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-80 w-full" />
    </CardContent>
  </Card>
);

const TableSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </CardContent>
  </Card>
);

// Counter component
const Counter = ({ value, duration = 1000 }: { value: number | string; duration?: number }) => {
  const [displayValue, setDisplayValue] = React.useState(0);
  const numValue = parseInt(value.toString());

  React.useEffect(() => {
    let start = 0;
    const increment = Math.ceil(numValue / (duration / 16));
    const interval = setInterval(() => {
      start += increment;
      if (start >= numValue) {
        setDisplayValue(numValue);
        clearInterval(interval);
      } else {
        setDisplayValue(start);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [numValue, duration]);

  return <>{displayValue}</>;
};

export default function DashboardPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [userTrend, setUserTrend] = React.useState('+12%');
  const [totalTasks, setTotalTasks] = React.useState(0);
  const [pendingTasks, setPendingTasks] = React.useState(0);
  const [completionRate, setCompletionRate] = React.useState(0);
  const [inProgressTasks, setInProgressTasks] = React.useState(0);
  const [completedTasks, setCompletedTasks] = React.useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recentTasks, setRecentTasks] = React.useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recentUsers, setRecentUsers] = React.useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [allUsers, setAllUsers] = React.useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [notifications, setNotifications] = React.useState<Array<{
    id: string;
    title: string;
    description: string;
    type: 'overdue' | 'unassigned' | 'pending' | 'urgent';
    taskId: string;
    priority: string;
  }>>([]);
  const [notificationsLoading, setNotificationsLoading] = React.useState(true);
  
  useEffect(() => {
    const fetchWithRetry = async (url: string, maxRetries = 3) => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();
          return data;
        } catch (error) {
          console.error(`Fetch attempt ${i + 1} failed for ${url}:`, error);
          if (i < maxRetries - 1) {
            // Exponential backoff: 500ms, 1000ms, 2000ms
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 500));
          } else {
            throw error;
          }
        }
      }
    };
    
    const fetchData = async () => {
      const users = await fetchWithRetry('/api/users/getusers');
      const tasks = await fetchWithRetry('/api/tasks/gettask');
      
      // Fetch notifications and task deletions
      try {
        setNotificationsLoading(true);
        const [notifRes, deletionsRes] = await Promise.all([
          fetchWithRetry('/api/admin/notifications'),
          fetchWithRetry('/api/admin/task-deletions'),
        ]);
        
        // Combine notifications with deletion alerts
        const allNotifications = [...(notifRes.notifications || [])];
        
        if (deletionsRes.deletions && deletionsRes.deletions.length > 0) {
          deletionsRes.deletions.forEach((deletion: { id?: string; task_id: string; task_title: string; deleted_by_user_email: string; task_priority?: string }) => {
            allNotifications.unshift({
              id: `deletion-${deletion.id || deletion.task_id}`,
              title: `Task Deleted: ${deletion.task_title}`,
              description: `Deleted by ${deletion.deleted_by_user_email}`,
              type: 'urgent',
              taskId: deletion.task_id,
              priority: deletion.task_priority || 'medium',
            });
          });
        }
        
        setNotifications(allNotifications.slice(0, 10));
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setNotifications([]);
      } finally {
        setNotificationsLoading(false);
      }
      
      console.log(tasks);
      console.log(users);
      const tasksCount = tasks.data.length;
      const userCount = users.users.length;
      setTotalUsers(userCount);
      setTotalTasks(tasksCount);
      setAllUsers(users.users);
      
      // Calculate trend based on user count
      const trend = userCount > 10 ? '+15%' : userCount > 5 ? '+12%' : '+8%';
      setUserTrend(trend);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pending = tasks.data.filter((task: any) => task.status === 'pending').length;
      setPendingTasks(pending);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const completed = tasks.data.filter((task: any) => task.status === 'completed').length;
      const completion = tasksCount > 0 ? Math.round((completed / tasksCount) * 100) : 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const inProgress = tasks.data.filter((task: any) => task.status === 'in-progress').length;
      setInProgressTasks(inProgress);
      setCompletedTasks(completed);
      setCompletionRate(completion);
      
      // Set recent tasks (last 4)
      const recent = tasks.data.slice(-4).reverse();
      setRecentTasks(recent);
      
      // Set recent users (last 3)
      const recentUsersList = users.users.slice(-3).reverse();
      setRecentUsers(recentUsersList);

      // Calculate performance trend - tasks completed per day of the week
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const performanceData = dayNames.map((day, index) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tasksOnDay = tasks.data.filter((task: any) => {
          if (!task.created_at) return false;
          const taskDate = new Date(task.created_at);
          return taskDate.getDay() === index;
        });
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const completedOnDay = tasksOnDay.filter((task: any) => task.status === 'completed').length;
        const totalOnDay = tasksOnDay.length;
        const completionRate = totalOnDay > 0 ? Math.round((completedOnDay / totalOnDay) * 100) : 0;
        
        return {
          name: day,
          completed: completedOnDay,
          total: totalOnDay,
          completionRate: completionRate
        };
      });
      
      setChartData(performanceData);
      
      console.log("Total Users:", userCount);
      console.log("User Trend:", trend);
      console.log("Recent Tasks:", recent);
      console.log("Recent Users:", recentUsersList);
      console.log("Performance Data:", performanceData);
      
      // Set loading to false when data is fetched
      setIsLoading(false);
    }
    
    fetchData().catch((error) => {
      console.error('Dashboard data fetch failed:', error);
      setIsLoading(false);
      // Show error to user
      toast.error('Failed to load dashboard data. Please refresh the page.');
    });
  },[]);
  
  // Function to get assignee name by ID
  const getAssigneeName = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId);
    return user?.full_name || 'Unassigned';
  };
  
  // Sample data
  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      icon: Users,
      trend: userTrend,
      color: 'bg-indigo-500',
    },
    {
      title: 'Active Tasks',
      value: totalTasks.toString(),
      icon: CheckSquare,
      trend: '+8%',
      color: 'bg-green-500',
    },
    {
      title: 'Pending Tasks',
      value: pendingTasks.toString(),
      icon: Clock,
      trend: '-5%',
      color: 'bg-yellow-500',
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      icon: TrendingUp,
      trend: '+3%',
      color: 'bg-purple-500',
    },
  ];

  // Removed old chartData - now using dynamic data from state

  const pieData = [
    { name: 'Completed', value: completedTasks },
    { name: 'In Progress', value: inProgressTasks },
    { name: 'Pending', value: pendingTasks },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  // const getStatusVariant = (status: string) => {
  //   switch (status) {
  //     case 'completed':
  //       return 'default';
  //     case 'in-progress':
  //       return 'secondary';
  //     case 'pending':
  //       return 'outline';
  //     default:
  //       return 'secondary';
  //   }
  // };

  // const getPriorityVariant = (priority: string) => {
  //   switch (priority) {
  //     case 'high':
  //       return 'destructive';
  //     case 'medium':
  //       return 'secondary';
  //     case 'low':
  //       return 'outline';
  //     default:
  //       return 'secondary';
  //   }
  // };

  const renderStatusBadge = (status: string) => {
    const colors = getStatusColor(status);
    return `${colors.bg} ${colors.text} border ${colors.border}`;
  };

  const renderPriorityBadge = (priority: string) => {
    const colors = getPriorityColor(priority);
    return `${colors.bg} ${colors.text} border ${colors.border}`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s what&apos;s happening with your tasks and team today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`${stat.color} rounded-lg p-2 text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <Counter value={stat.value} duration={1500} />
                    {stat.title === 'Completion Rate' && '%'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {stat.trend} from last month
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            {/* Task Distribution - Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Task Distribution</CardTitle>
                <CardDescription>Overview of task completion</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Trend - Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Tasks completed by day of week</CardDescription>
              </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                          <p className="font-semibold">{data.name}</p>
                          <p className="text-green-600">Completed: {data.completed}</p>
                          <p className="text-gray-600">Total: {data.total}</p>
                          <p className="text-indigo-600 font-bold">Rate: {data.completionRate}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} name="Completed" />
                <Bar dataKey="total" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Total Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Task Notifications & Alerts */}
      <AdminNotifications 
        notifications={notifications} 
        isLoading={notificationsLoading}
      />

      {/* Recent Tasks & Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <TableSkeleton />
            <TableSkeleton />
          </>
        ) : (
          <>
            {/* Recent Tasks */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Tasks</CardTitle>
                  <CardDescription>Latest tasks assigned</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/tasks">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                    </TableRow>
              </TableHeader>
              <TableBody>
                {recentTasks.length > 0 ? (
                  recentTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell className="text-sm">{getAssigneeName(task.assigned_to)}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${renderStatusBadge(task.status)}`}>
                          {getStatusLabel(task.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${renderPriorityBadge(task.priority)}`}>
                          {getPriorityLabel(task.priority)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                      No tasks found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Recent Users */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest team members</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/users">View All</Link>
                </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Join Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name || user.name}</TableCell>
                      <TableCell className="text-sm">{user.email}</TableCell>
                      <TableCell className="text-sm">{user.role || 'User'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}