import { createClient } from '@/lib/supabase/server';

interface PollResponse {
  id: string;
  title: string;
  description: string;
  created_at: string;
  user_id: string;
  options: PollOption[];
}

interface PollOption {
  id: string;
  text: string;
  poll_id: string;
}

interface PaginatedResponse {
  data: PollResponse[];
  total: number;
  skip: number;
  limit: number;
}

interface VoteRequest {
  pollId: string;
  optionId: string;
}

interface VoteResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface PollResults {
  pollId: string;
  totalVotes: number;
  options: {
    id: string;
    text: string;
    votes: number;
    percentage: number;
  }[];
}

/**
 * Casts a vote for a specific option in a poll
 * @param pollId - Unique identifier of the poll
 * @param optionId - ID of the selected option
 * @returns Promise with vote confirmation or error
 */
export async function castVote({ pollId, optionId }: VoteRequest): Promise<VoteResponse> {
  const supabase = createClient();

  try {
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

    return {
      success: true,
      message: 'Vote recorded successfully'
    };

  } catch (error) {
    console.error('Error casting vote:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Retrieves current results for a poll
 * @param pollId - Unique identifier of the poll
 * @returns Promise with poll results including vote counts and percentages
 */
export async function getPollResults(pollId: string): Promise<PollResults | null> {
  const supabase = createClient();

  try {
    // Get poll options with vote counts
    const { data: options, error } = await supabase
      .from('poll_options')
      .select(`
        id,
        text,
        votes:poll_votes(count)
      `)
      .eq('poll_id', pollId);

    if (error) throw error;

    // Calculate total votes and percentages
    const totalVotes = options.reduce((sum, option) => 
      sum + (option.votes?.[0]?.count || 0), 0
    );

    const formattedOptions = options.map(option => ({
      id: option.id,
      text: option.text,
      votes: option.votes[0]?.count || 0,
      percentage: totalVotes ? 
        ((option.votes[0]?.count || 0) / totalVotes) * 100 : 0
    }));

    return {
      pollId,
      totalVotes,
      options: formattedOptions
    };

  } catch (error) {
    console.error('Error fetching poll results:', error);
    return null;
  }
}

/**
 * Fetches paginated polls from the server
 * @param skip - Number of polls to skip (for pagination)
 * @param limit - Maximum number of polls to return
 * @returns Promise with paginated poll data
 */
export async function fetchPaginatedPolls(
  skip: number = 0,
  limit: number = 10
): Promise<PaginatedResponse> {
  const supabase = createClient();

  try {
    // Get total count
    const { count } = await supabase
      .from('polls')
      .select('*', { count: 'exact', head: true });

    // Get paginated polls with their options
    const { data: polls, error } = await supabase
      .from('polls')
      .select(`
        *,
        options:poll_options(*)
      `)
      .range(skip, skip + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      data: polls || [],
      total: count || 0,
      skip,
      limit
    };
  } catch (error) {
    console.error('Error fetching polls:', error);
    throw error;
  }
}

// Example usage:
/*
async function example() {
  // Cast a vote
  const voteResult = await castVote({
    pollId: "123",
    optionId: "456"
  });
  console.log(voteResult);

  // Get results
  const pollResults = await getPollResults("123");
  console.log(pollResults);
}
*/