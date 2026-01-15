import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const cookieStore =  cookies();
    const supabase = createClient(cookieStore);
    
    await supabase.auth.signOut();
    
    return NextResponse.json(
        { message: 'Logged out successfully' },
        { status: 200 }
    );
}