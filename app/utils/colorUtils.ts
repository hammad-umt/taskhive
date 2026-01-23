/**
 * Tag and Badge Color Utility
 * Provides consistent color schemes for status, priority, and role badges
 */

export const getStatusColor = (status: string): { bg: string; text: string; border: string; badgeVariant: 'default' | 'secondary' | 'outline' } => {
  const statusMap: { [key: string]: { bg: string; text: string; border: string; badgeVariant: 'default' | 'secondary' | 'outline' } } = {
    'completed': {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      badgeVariant: 'default'
    },
    'in-progress': {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      badgeVariant: 'secondary'
    },
    'pending': {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      badgeVariant: 'outline'
    },
    'on-hold': {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      badgeVariant: 'outline'
    },
  };

  return statusMap[status] || {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    badgeVariant: 'outline'
  };
};

export const getPriorityColor = (priority: string): { bg: string; text: string; border: string; badgeVariant: 'default' | 'secondary' | 'outline' } => {
  const priorityMap: { [key: string]: { bg: string; text: string; border: string; badgeVariant: 'default' | 'secondary' | 'outline' } } = {
    'high': {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      badgeVariant: 'default'
    },
    'medium': {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      badgeVariant: 'secondary'
    },
    'low': {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      badgeVariant: 'outline'
    },
  };

  return priorityMap[priority] || {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    badgeVariant: 'outline'
  };
};

export const getRoleColor = (role: string): { bg: string; text: string; border: string; badgeVariant: 'default' | 'secondary' | 'outline' } => {
  const roleMap: { [key: string]: { bg: string; text: string; border: string; badgeVariant: 'default' | 'secondary' | 'outline' } } = {
    'admin': {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      badgeVariant: 'default'
    },
    'user': {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      badgeVariant: 'outline'
    },
  };

  return roleMap[role] || {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    badgeVariant: 'outline'
  };
};

export const getStatusLabel = (status: string): string => {
  const labelMap: { [key: string]: string } = {
    'completed': 'Completed',
    'in-progress': 'In Progress',
    'pending': 'Pending',
    'on-hold': 'On Hold',
  };

  return labelMap[status] || status;
};

export const getPriorityLabel = (priority: string): string => {
  const labelMap: { [key: string]: string } = {
    'high': 'High',
    'medium': 'Medium',
    'low': 'Low',
  };

  return labelMap[priority] || priority;
};
