
import { supabaseAdmin } from "@/app/utils/supabase/admin";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

/**
 * GET /api/tasks/gettask
 * Admin-only endpoint to fetch ALL tasks
 * 
 * SECURITY: 
 * - This endpoint is PROTECTED and only accessible by users with 'admin' role
 * - Regular users should use /api/tasks/getuserTasks?userId={userId} instead
 * - Validates user authentication and role from session
 * 
 * Column Reference:
 * - assigned_to: User ID this task is assigned to
 * - created_by: Admin ID who created the task
 * - status: Task status (pending, in-progress, completed)
 * - priority: Task priority (low, medium, high)
 */
export async function GET() {
  try {
    // SECURITY: Verify user is authenticated and has admin role
    const cookieStore = cookies();
    const supabaseClient = createClient(cookieStore);
    
    // Get current user from session
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }), 
        { 
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Fetch user role to verify admin access
    const { data: profile, error: profileError } = await supabaseClient
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    
    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }), 
        { 
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // SECURITY: Only allow admins
    if (profile.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: "Forbidden" }), 
        { 
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    // ADMIN ONLY: Fetch ALL tasks
    const { data, error } = await supabaseAdmin
      .from("tasks")
      .select("*");
    
    if (error) {
      return new Response(
        JSON.stringify({ 
          error: "Failed to fetch tasks",
        }), 
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        message: "Tasks fetched successfully", 
        data: data || [],
        count: data?.length || 0
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch {
    return new Response(
      JSON.stringify({ 
        error: "Failed to fetch tasks",
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}