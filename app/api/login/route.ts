import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../utils/supabase/admin"

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
      { error: error.message },
      { status: 400 }
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

  // Get user role
  const response = await supabaseAdmin.from('profiles').select('role').eq('id', data.user.id).single()
  
  return NextResponse.json({
    user: data.user,
    role: response.data?.role || 'user'
  })
}