export interface PollOption {
  id: string;
  poll_id: string;
  text: string;
  created_at: string;
}

export interface Poll {
  id: string;
  title: string;
  description: string | null;
  created_by: string;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
}

export interface Vote {
  id: string;
  poll_id: string;
  option_id: string;
  user_id: string | null;
  voter_ip: string | null;
  created_at: string;
}

export interface CreatePollData {
  title: string;
  description?: string;
  options: { text: string }[];
  expires_at?: string;
}
