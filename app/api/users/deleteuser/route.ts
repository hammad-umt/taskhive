import { supabaseAdmin } from "@/app/utils/supabase/admin";

export async function DELETE(request: Request) {
    try {
        const reqBody = await request.json();
        const { userId } = reqBody;
        if (!userId) {
            return new Response(
                JSON.stringify({ message: 'User ID is required' }), 
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        // supabaseAdmin.auth.admin;
        const { error } = await supabaseAdmin
            .from('users')
            .delete()
            .eq('id', userId);
        if (error) {
            return new Response(
                JSON.stringify({ message: 'Error deleting user', error }), 
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
        return new Response(
            JSON.stringify({ message: 'User deleted successfully' }), 
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Internal server error', error: error instanceof Error ? error.message : String(error) }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}