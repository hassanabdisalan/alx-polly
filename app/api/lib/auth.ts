import { createClient } from '@/lib/supabase/server';

export async function validateRegistration(data: {
    username: string;
    email: string;
    password: string;
}) {
    const errors = [];

    if (!data.username?.trim()) {
        errors.push('Username is required');
    }

    if (!data.email?.trim()) {
        errors.push('Email is required');
    }

    if (!data.password || data.password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}