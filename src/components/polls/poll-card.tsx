"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * The poll option type.
 */
interface PollOption {
  id: string
  text: string
  votes: number
}

/**
 * The poll type.
 */
interface Poll {
  id: string
  title: string
  description: string
  options: PollOption[]
  totalVotes: number
  createdAt: string
  createdBy: string
}

/**
 * The properties for the poll card component.
 */
interface PollCardProps {
  poll: Poll
  onVote?: (pollId: string, optionId: string) => void
}

/**
 * Renders a poll card component.
 *
 * @param poll - The poll to render.
 * @param onVote - The function to call when the user votes.
 * @returns The poll card component.
 */
export function PollCard({ poll, onVote }: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)

  /**
   * Handles the vote button click.
   */
  const handleVote = () => {
    if (selectedOption && onVote) {
      onVote(poll.id, selectedOption)
      setHasVoted(true)
    }
  }

  /**
   * Gets the percentage of votes for an option.
   *
   * @param votes - The number of votes for the option.
   * @returns The percentage of votes.
   */
  const getPercentage = (votes: number) => {
    return poll.totalVotes > 0 ? Math.round((votes / poll.totalVotes) * 100) : 0
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{poll.title}</CardTitle>
        <CardDescription>{poll.description}</CardDescription>
        <div className="text-sm text-muted-foreground">
          Created by {poll.createdBy} • {new Date(poll.createdAt).toLocaleDateString()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {poll.options.map((option) => (
            <div key={option.id} className="space-y-1">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={option.id}
                  name={`poll-${poll.id}`}
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  disabled={hasVoted}
                  className="rounded"
                />
                <label htmlFor={option.id} className="text-sm font-medium">
                  {option.text}
                </label>
                {hasVoted && (
                  <span className="text-sm text-muted-foreground">
                    ({option.votes} votes • {getPercentage(option.votes)}%)
                  </span>
                )}
              </div>
              {hasVoted && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${getPercentage(option.votes)}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {!hasVoted && selectedOption && (
          <Button onClick={handleVote} className="w-full">
            Vote
          </Button>
        )}
        
        {hasVoted && (
          <div className="text-sm text-muted-foreground text-center">
            Total votes: {poll.totalVotes}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
