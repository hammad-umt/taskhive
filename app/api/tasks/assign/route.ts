import { supabaseAdmin } from '@/app/utils/supabase/admin';
import { NextResponse } from 'next/server';

/**
 * POST /api/tasks/assign
 * Assign a task to a team member
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { taskId, assignee, dueDate, notes } = body;

    // Validate required fields
    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    if (!assignee) {
      return NextResponse.json(
        { error: 'Assignee ID is required' },
        { status: 400 }
      );
    }

    // Update task with assignment
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .update({
        assigned_to: assignee,
        due_date: dueDate || null,
        status: 'in-progress',
        updated_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .select('*');

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to assign task' },
        { status: 400 }
      );
    }

    // Optionally log the assignment if notes provided
    if (notes) {
      await supabaseAdmin
        .from('task_notes')
        .insert({
          task_id: taskId,
          content: `Assigned to ${assignee}. Notes: ${notes}`,
          created_at: new Date().toISOString(),
        });
    }

    return NextResponse.json({
      message: 'Task assigned successfully',
      data: data?.[0] || null,
    });
  } catch (error) {
    console.error('Error assigning task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
