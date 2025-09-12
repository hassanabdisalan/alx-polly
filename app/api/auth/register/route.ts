import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const { username, email, password } = await request.json();
        const supabase = createClient();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username
                }
            }
        });

        if (error) throw error;

        return NextResponse.json({
            success: true,
            user: data.user
        });

    } catch (error) {
        return NextResponse.json(
            { 
                success: false, 
                error: error.message 
            },
            { status: 400 }
        );
    }
}