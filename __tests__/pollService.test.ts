import { castVote, getPollResults } from '@/app/services/pollService';

describe('Poll Service', () => {
  it('should cast a vote successfully', async () => {
    const result = await castVote({
      pollId: 'test-poll',
      optionId: 'test-option'
    });
    
    expect(result.success).toBe(true);
  });

  it('should retrieve poll results', async () => {
    const results = await getPollResults('test-poll');
    
    expect(results).toHaveProperty('totalVotes');
    expect(results?.options).toBeInstanceOf(Array);
  });
});