import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface TaskDeletionLog {
  id?: string;
  task_id: string;
  task_title: string;
  deleted_by_user_id: string;
  deleted_by_user_email: string;
  deletion_timestamp: string;
  task_priority?: string;
  task_status?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, taskTitle, userId, userEmail, taskPriority, taskStatus } = body;

    if (!taskId || !taskTitle || !userId || !userEmail) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Log the task deletion
    const deletionLog: TaskDeletionLog = {
      task_id: taskId,
      task_title: taskTitle,
      deleted_by_user_id: userId,
      deleted_by_user_email: userEmail,
      deletion_timestamp: new Date().toISOString(),
      task_priority: taskPriority,
      task_status: taskStatus,
    };

    // Try to insert into task_deletions table (create if doesn't exist)
    const { error: insertError } = await supabase
      .from('task_deletions')
      .insert([deletionLog]);

    if (insertError) {
      console.warn('Could not log task deletion:', insertError);
      // Don't fail the deletion if logging fails
    }

    return NextResponse.json(
      { message: 'Task deletion logged successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error logging task deletion:', error);
    // Don't fail - this is just for logging
    return NextResponse.json(
      { message: 'Error logging deletion, but task was deleted' },
      { status: 200 }
    );
  }
}
