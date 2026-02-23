import { supabaseAdmin } from '@/app/utils/supabase/admin';

interface UpdateUserPayload {
  id?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  status?: string;
}

export async function PUT(request: Request) {
  try {
    const body: UpdateUserPayload = await request.json();
    const { id, full_name, email, phone, role, department, status } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ message: 'User id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!full_name || !email) {
      return new Response(
        JSON.stringify({ message: 'Name and email are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const username = full_name
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .join('.');

    const updatePayload = {
      full_name,
      username,
      email,
      phone: phone || null,
      role: role || null,
      department: department || null,
      status: status || 'Active',
      updated_at: new Date().toISOString(),
    };

    const { data: updatedUser, error: userError } = await supabaseAdmin
      .from('users')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (userError) {
      return new Response(
        JSON.stringify({ message: 'Failed to update user', error: userError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await supabaseAdmin
      .from('profiles')
      .update({
        name: full_name,
        role: role || null,
      })
      .eq('uuid', id);

    return new Response(
      JSON.stringify({ message: 'User updated successfully', user: updatedUser }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ message: 'Error updating user' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
