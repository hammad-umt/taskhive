import { supabaseAdmin } from '@/app/utils/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, status, priority, assignee, dueDate } = body;

    console.log('Update task request:', { id, title, status, priority });

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('tasks')
      .update({
        title,
        description,
        status,
        priority,
        assigned_to: assignee || null,
        due_date: dueDate || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*');

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('Task updated successfully:', data);

    return NextResponse.json({
      message: 'Task updated successfully',
      data: data?.[0] || null,
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
