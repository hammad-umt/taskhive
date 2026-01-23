import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all tasks with issues (overdue, unassigned, pending for more than 7 days)
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { message: 'Failed to fetch tasks' },
        { status: 500 }
      );
    }

    const now = new Date();
    const notifications: Array<{
      id: string;
      title: string;
      description: string;
      type: 'overdue' | 'unassigned' | 'pending' | 'urgent';
      taskId: string;
      priority: string;
    }> = [];

    tasks?.forEach((item) => {
      const task = item as {
        due_date?: string;
        status?: string;
        priority?: string;
        assigned_to?: string;
        id: string;
        title: string;
        created_at?: string;
      };
      // Check for overdue tasks
      if (task.due_date && task.status !== 'completed') {
        const dueDate = new Date(task.due_date);
        if (dueDate < now) {
          notifications.push({
            id: `overdue-${task.id}`,
            title: `Overdue: ${task.title}`,
            description: `Task is overdue since ${dueDate.toLocaleDateString()}`,
            type: 'overdue',
            taskId: task.id,
            priority: task.priority || 'medium',
          });
        }
      }

      // Check for unassigned high-priority tasks
      if (!task.assigned_to && task.priority === 'high') {
        notifications.push({
          id: `unassigned-${task.id}`,
          title: `Unassigned: ${task.title}`,
          description: 'High-priority task needs to be assigned',
          type: 'unassigned',
          taskId: task.id,
          priority: task.priority,
        });
      }

      // Check for pending tasks older than 7 days
      if (task.status === 'pending' && task.created_at) {
        const createdDate = new Date(task.created_at);
        const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff > 7) {
          notifications.push({
            id: `pending-${task.id}`,
            title: `Pending: ${task.title}`,
            description: `Task has been pending for ${daysDiff} days`,
            type: 'pending',
            taskId: task.id,
            priority: task.priority || 'medium',
          });
        }
      }

      // Check for urgent tasks
      if (task.priority === 'high' && task.status === 'pending') {
        notifications.push({
          id: `urgent-${task.id}`,
          title: `Urgent: ${task.title}`,
          description: 'High-priority task is still pending',
          type: 'urgent',
          taskId: task.id,
          priority: task.priority,
        });
      }
    });

    // Remove duplicates and limit to top 10
    const uniqueNotifications = Array.from(
      new Map(notifications.map(n => [n.taskId, n])).values()
    ).slice(0, 10);

    return NextResponse.json(
      { notifications: uniqueNotifications, count: uniqueNotifications.length },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
