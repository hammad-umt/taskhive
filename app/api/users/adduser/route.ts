import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    try {
        const reqBody = await request.json();
        const { 
            firstName, 
            lastName, 
            email, 
            phone, 
            password, 
            confirmPassword, 
            role, 
            department, 
            status 
        } = reqBody;

        // Validate inputs
        if (!firstName || !lastName || !email || !password) {
            return new Response(
                JSON.stringify({ message: 'Missing required fields' }), 
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (password !== confirmPassword) {
            return new Response(
                JSON.stringify({ message: 'Passwords do not match' }), 
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Hash password before storing
        const passwordHash = await bcrypt.hash(password, 10);

        // Use service role key for admin operations
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
            return new Response(
                JSON.stringify({ message: 'Missing environment variables' }), 
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const supabase = createClient(supabaseUrl, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });

        // Check if user already exists in the database
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return new Response(
                JSON.stringify({ 
                    message: 'Email already in use', 
                    error: 'A user with this email already exists' 
                }), 
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Create user using admin API
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm email
            user_metadata: {
                first_name: firstName,
                last_name: lastName,
            }
        });

        if (authError) {
            return new Response(
                JSON.stringify({ 
                    message: 'Failed to create user', 
                }), 
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (!authData.user?.id) {
            return new Response(
                JSON.stringify({ 
                    message: 'User created but no ID returned' 
                }), 
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Insert into users table with service role
        const { data, error } = await supabase.from('users').insert({
            id: authData.user.id,
            email,
            username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
            full_name: `${firstName} ${lastName}`,
            phone,
            role: role?.toLowerCase() || 'user',
            department: department || null,
            status: (status?.toLowerCase() || 'active'),
            password_hash: passwordHash,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }).select();

        if (error) {
            // Try to delete the auth user if profile creation fails
            try {
                await supabase.auth.admin.deleteUser(authData.user.id);
            } catch (deleteError) {
                // Failed to delete, but continue with error response
            }
            
            return new Response(
                JSON.stringify({ 
                    message: 'Error creating user profile', 
                }), 
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Insert into profiles table with foreign key reference to users
        const { data: profileData, error: profileError } = await supabase.from('profiles').insert({
            uuid: authData.user.id, // Foreign key to users table
            name: `${firstName} ${lastName}`,
            role: role?.toLowerCase() || 'user',
            created_at: new Date().toISOString(),
        }).select();

        if (profileError) {
            // Try to delete the user and auth user if profile creation fails
            try {
                await supabase.from('users').delete().eq('id', authData.user.id);
                await supabase.auth.admin.deleteUser(authData.user.id);
            } catch (deleteError) {
                // Failed to delete, but continue with error response
            }
            
            return new Response(
                JSON.stringify({ 
                    message: 'Error creating user profile record', 
                }), 
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ 
                message: 'User added successfully', 
                user: { 
                    id: authData.user.id,
                    email, 
                    full_name: `${firstName} ${lastName}`,
                    role,
                    department,
                    status
                } 
            }), 
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ 
                message: 'Error adding user', 
            }), 
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}