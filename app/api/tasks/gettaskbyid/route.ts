import { supabaseAdmin } from "@/app/utils/supabase/admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("id");
    if (!taskId) {
      return new Response(JSON.stringify({ error: "Task ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const { data, error } = await supabaseAdmin
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .single();
    if (error) {
      console.error("Supabase select error:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch task" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ message: "Task fetched successfully", data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch task" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}