import { supabaseAdmin } from "@/app/utils/supabase/admin";
export async function GET(request: Request)
{
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (userId) {
        const { data, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            return new Response(JSON.stringify({ message: 'Error fetching user', error }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify({ user: data }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const {data,error} = await supabaseAdmin.from('users').select('*');
    if(error)
    {
        return new Response(JSON.stringify({message:'Error fetching users',error}),{status:500,headers:{'Content-Type':'application/json'}});
    }
    return new Response(JSON.stringify({users:data}),{status:200,headers:{'Content-Type':'application/json'}});
}