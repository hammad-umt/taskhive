import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get recent task deletions (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: deletions, error } = await supabase
      .from('task_deletions')
      .select('*')
      .gte('deletion_timestamp', oneDayAgo)
      .order('deletion_timestamp', { ascending: false })
      .limit(10);

    if (error) {
      // Table might not exist yet, return empty
      return NextResponse.json(
        { deletions: [], count: 0 },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        deletions: deletions || [],
        count: deletions?.length || 0 
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { deletions: [], count: 0 },
      { status: 200 }
    );
  }
}
