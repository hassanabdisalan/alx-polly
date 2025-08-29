export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  totalVotes: number;
  createdAt: string;
  createdBy: string;
  isActive?: boolean;
  expiresAt?: string;
}

export interface CreatePollData {
  title: string;
  description: string;
  options: string[];
}

export interface VoteData {
  pollId: string;
  optionId: string;
}
