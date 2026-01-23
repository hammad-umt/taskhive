import { supabaseAdmin } from '@/app/utils/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const { error, data } = await supabaseAdmin
      .from('tasks')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      return NextResponse.json({ error: 'Failed to delete task' }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Task deleted successfully',
      data: data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
