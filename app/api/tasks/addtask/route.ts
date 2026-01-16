import { supabaseAdmin } from "@/app/utils/supabase/admin";

export async function POST(request: Request) {
  try {
    const reqBody = await request.json();
    console.log("Received task data:", reqBody);
    const {title, description, status, priority, assignee, dueDate} = reqBody;
    
    // Get the admin user (first user or specific admin)
    const { data: adminUser, error: adminError } = await supabaseAdmin
      .from('users')
      .select('id, full_name')
      .limit(1)
      .single();
    
    console.log('Admin user:', adminUser);

    if (adminError || !adminUser) {
      console.error('No admin user found');
      return new Response(
        JSON.stringify({ error: 'No admin user found' }),
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
      created_by: adminUser.id,
    }]);

    if (error) {
      console.error('Supabase insert error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to add task' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Task created with created_by:', adminUser.id);
    return new Response(
      JSON.stringify({ message: 'Task added successfully', data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error adding task:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to add task' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}