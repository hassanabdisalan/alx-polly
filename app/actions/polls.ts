'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidateTag } from 'next/cache';

export async function updatePollVote(pollId: string, optionId: string) {
    const supabase = createClient();
    
    try {
        // Record the vote
        const { data, error } = await supabase
            .from('poll_votes')
            .insert({
                poll_id: pollId,
                option_id: optionId,
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        // Revalidate cache to update UI
        revalidateTag(`poll-${pollId}`);
        
        return { success: true, data };
    } catch (error) {
        console.error('Vote error:', error);
        return { success: false, error: error.message };
    }
}