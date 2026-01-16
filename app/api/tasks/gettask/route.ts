
import { supabaseAdmin } from "@/app/utils/supabase/admin";
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("tasks")
      .select("*");
      
    if (error) {    
        console.error("Supabase select error:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch tasks" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
    return new Response(JSON.stringify({ message: "Tasks fetched successfully", data }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch tasks" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}