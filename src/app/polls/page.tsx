"use client"

import { useState } from "react";
import { PollCard } from "@/components/polls/poll-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Sample data - replace with actual API calls
const samplePolls = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "Let's see which programming language is most popular among developers",
    options: [
      { id: "1-1", text: "JavaScript", votes: 45 },
      { id: "1-2", text: "Python", votes: 38 },
      { id: "1-3", text: "TypeScript", votes: 32 },
      { id: "1-4", text: "Rust", votes: 15 }
    ],
    totalVotes: 130,
    createdAt: "2024-01-15T10:00:00Z",
    createdBy: "John Doe"
  },
  {
    id: "2",
    title: "Best framework for building web apps?",
    description: "Which framework do you prefer for modern web development?",
    options: [
      { id: "2-1", text: "React", votes: 52 },
      { id: "2-2", text: "Vue", votes: 28 },
      { id: "2-3", text: "Angular", votes: 20 },
      { id: "2-4", text: "Svelte", votes: 12 }
    ],
    totalVotes: 112,
    createdAt: "2024-01-14T15:30:00Z",
    createdBy: "Jane Smith"
  },
  {
    id: "3",
    title: "Coffee or Tea?",
    description: "The age-old question: which hot beverage do you prefer?",
    options: [
      { id: "3-1", text: "Coffee", votes: 67 },
      { id: "3-2", text: "Tea", votes: 43 },
      { id: "3-3", text: "Neither", votes: 8 }
    ],
    totalVotes: 118,
    createdAt: "2024-01-13T09:15:00Z",
    createdBy: "Coffee Lover"
  }
];

export default function PollsPage() {
  const [polls, setPolls] = useState(samplePolls);

  const handleVote = (pollId: string, optionId: string) => {
    // TODO: Implement actual voting logic with API call
    console.log(`Voting for poll ${pollId}, option ${optionId}`);
    
    // Update local state for demo
    setPolls(prevPolls => 
      prevPolls.map(poll => {
        if (poll.id === pollId) {
          return {
            ...poll,
            options: poll.options.map(option => 
              option.id === optionId 
                ? { ...option, votes: option.votes + 1 }
                : option
            ),
            totalVotes: poll.totalVotes + 1
          };
        }
        return poll;
      })
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Active Polls</h1>
          <p className="text-muted-foreground">
            Browse and vote on polls created by the community
          </p>
        </div>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      {polls.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No polls available</h3>
          <p className="text-muted-foreground mb-4">
            Be the first to create a poll!
          </p>
          <Link href="/polls/create">
            <Button>Create Your First Poll</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <PollCard 
              key={poll.id} 
              poll={poll} 
              onVote={handleVote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
