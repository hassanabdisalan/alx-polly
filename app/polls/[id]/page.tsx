import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import PollVoting from '@/app/components/PollVoting';

export default async function PollPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    
    const { data: poll } = await supabase
        .from('polls')
        .select(`
            *,
            options:poll_options(*)
        `)
        .eq('id', params.id)
        .single();

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">{poll.title}</h1>
            <p className="text-gray-600 mb-6">{poll.description}</p>
            
            <Suspense fallback={<div>Loading votes...</div>}>
                <PollVoting pollId={poll.id} options={poll.options} />
            </Suspense>
        </div>
    );
}