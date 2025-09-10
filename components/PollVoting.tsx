'use client';

import { useTransition, useOptimistic } from 'react';
import { updatePollVote } from '@/app/actions/polls';

interface PollOption {
    id: string;
    text: string;
    votes: number;
}

interface Props {
    pollId: string;
    options: PollOption[];
}

export default function PollVoting({ pollId, options }: Props) {
    const [isPending, startTransition] = useTransition();
    const [optimisticOptions, addOptimisticOption] = useOptimistic(
        options,
        (state, optionId: string) =>
            state.map(option => ({
                ...option,
                votes: option.id === optionId ? option.votes + 1 : option.votes
            }))
    );

    const handleVote = async (optionId: string) => {
        startTransition(async () => {
            // Optimistically update UI
            addOptimisticOption(optionId);
            
            // Perform server action
            const result = await updatePollVote(pollId, optionId);
            
            if (!result.success) {
                // Handle error - could show toast notification
                console.error('Vote failed:', result.error);
            }
        });
    };

    return (
        <div className="space-y-4">
            {optimisticOptions.map((option) => (
                <button
                    key={option.id}
                    onClick={() => handleVote(option.id)}
                    disabled={isPending}
                    className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 
                             flex justify-between items-center"
                >
                    <span>{option.text}</span>
                    <span className="text-gray-500">
                        {option.votes} votes
                        {isPending && '...'}
                    </span>
                </button>
            ))}
        </div>
    );
}