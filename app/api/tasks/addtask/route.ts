import { supabaseAdmin } from "@/app/utils/supabase/admin";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

/**
 * POST /api/tasks/addtask
 * Admin-only endpoint to create new tasks
 * SECURITY: Validates admin role before allowing task creation
 */
export async function POST(request: Request) {
  try {
    // SECURITY: Verify admin role
    const cookieStore = cookies();
    const supabaseClient = createClient(cookieStore);
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    
    if (profile?.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: "Forbidden" }), 
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const reqBody = await request.json();
    const { title, description, status, priority, assignee, dueDate } = reqBody;
    
    if (!title || !assignee) {
      return new Response(
        JSON.stringify({ error: 'Title and assignee are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data, error } = await supabaseAdmin.from('tasks').insert([{
      title,
      description,
      status,
      priority,
      assigned_to: assignee,
      due_date: dueDate,
      created_by: user.id,
    }]);

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to add task' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Task added successfully', data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to add task' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}