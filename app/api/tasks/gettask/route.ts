
import { supabaseAdmin } from "@/app/utils/supabase/admin";

export async function GET() {
  try {
    console.log("🔄 Starting task fetch...");
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("Service Role Key exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    const { data, error, status, statusText } = await supabaseAdmin
      .from("tasks")
      .select("*");
    
    console.log("✅ Query executed");
    console.log("Status:", status, statusText);
    console.log("Data received:", data?.length ?? 0, "tasks");
    console.log("Error:", error);
    
    if (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorObj = error as any;
      console.error("❌ Detailed error:", {
        message: error.message,
        code: error.code,
        details: errorObj.details,
        hint: errorObj.hint
      });
      if (errorObj.code === 'PGRST116') {
        console.error('RLS Policy issue - check table permissions');
      }
    }
      
    if (error) {    
        console.error("❌ Supabase select error:", error);
        return new Response(JSON.stringify({ 
          error: "Failed to fetch tasks",
          details: error.message,
          code: error.code
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    console.log(`✅ Successfully fetched ${data?.length || 0} tasks`);
    return new Response(JSON.stringify({ 
      message: "Tasks fetched successfully", 
      data: data || [],
      count: data?.length || 0
    }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to fetch tasks",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
    });
  }
}