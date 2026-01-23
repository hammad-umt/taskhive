import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../utils/supabase/admin"

/**
 * POST /api/login
 * Login endpoint that returns proper user ID for BOTH users and admins
 * 
 * SECURITY: Removes sensitive logging (emails, detailed errors)
 * 
 * Response structure:
 * - id: User's UUID (from auth.users table)
 * - user: Full user object from Supabase auth
 * - role: 'admin' or 'user' (from profiles table)
 */
export async function POST(request: Request) {
  const { email, password } = await request.json()
  
  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    )
  }

  // Use admin client to sign in
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }

  // Set the session cookies using server client
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  // This ensures the session is properly stored in cookies
  await supabase.auth.setSession({
    access_token: data.session?.access_token || '',
    refresh_token: data.session?.refresh_token || '',
  });

  // Get user role from profiles table
  const response = await supabaseAdmin.from('profiles').select('role').eq('id', data.user.id).single()
  const userRole = response.data?.role || 'user';
  
  return NextResponse.json({
    id: data.user.id,           // User's ID from auth.users
    userId: data.user.id,       // Also include as userId for clarity
    user: {
      id: data.user.id,
      email: data.user.email
    },
    role: userRole,
    message: 'Login successful'
  })
}