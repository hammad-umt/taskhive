import { supabaseAdmin } from "@/app/utils/supabase/admin";
export async function GET() 
{
   const {data,error} = await supabaseAdmin.from('users').select('*');
    if(error)
    {
        return new Response(JSON.stringify({message:'Error fetching users',error}),{status:500,headers:{'Content-Type':'application/json'}});
    }
    return new Response(JSON.stringify({users:data}),{status:200,headers:{'Content-Type':'application/json'}});
}