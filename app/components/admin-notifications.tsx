import React from 'react';
import { AlertCircle, Clock, AlertTriangle, Unlink } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import Link from 'next/link';

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'overdue' | 'unassigned' | 'pending' | 'urgent';
  taskId: string;
  priority: string;
}

interface AdminNotificationsProps {
  notifications: Notification[];
  isLoading?: boolean;
}

export default function AdminNotifications({
  notifications,
  isLoading = false,
}: AdminNotificationsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'overdue':
        return <Clock className="h-5 w-5 text-red-600" />;
      case 'unassigned':
        return <Unlink className="h-5 w-5 text-yellow-600" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
      case 'urgent':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'overdue':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900';
      case 'unassigned':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-900';
      case 'pending':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900';
      case 'urgent':
        return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Loading notifications...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Task Alerts</CardTitle>
            <CardDescription>
              {notifications.length > 0
                ? `You have ${notifications.length} task${notifications.length !== 1 ? 's' : ''} that need attention`
                : 'All tasks are on track'}
            </CardDescription>
          </div>
          {notifications.length > 0 && (
            <div className="bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300 px-3 py-1 rounded-full text-sm font-semibold">
              {notifications.length}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Link
                key={notification.id}
                href={`/admin/tasks`}
                className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition"
              >
                <div className="flex gap-3">
                  <div className="shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="grow min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                        {notification.title}
                      </p>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded border whitespace-nowrap ${getTypeBadgeColor(
                          notification.type
                        )}`}
                      >
                        {notification.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {notification.description}
                    </p>
                    <div className="flex gap-2 items-center">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${getPriorityColor(
                          notification.priority
                        )}`}
                      >
                        {notification.priority}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Task ID: {notification.taskId.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Great! All tasks are on track.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
