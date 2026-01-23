import { createClient } from "@/app/utils/supabase/server";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

/**
 * GET /api/tasks/getuserTasks?userId={userId}
 * Secure endpoint for users to fetch ONLY their own tasks
 * Users can only access tasks assigned to them
 * 
 * SECURITY: Uses authenticated session, not just query parameter
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabaseClient = createClient(cookieStore);
    
    // Get userId from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return new Response(
        JSON.stringify({ 
          error: "Unauthorized",
        }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate UUID format to prevent injection
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid user ID format",
        }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Fetch ONLY tasks assigned to this user - be explicit about what we're matching
    const { data: userTasks, error } = await supabaseClient
      .from("tasks")
      .select("*")
      .eq("assigned_to", userId);
    
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
        message: "User tasks fetched successfully", 
        data: userTasks || [],
        count: userTasks?.length || 0,
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
