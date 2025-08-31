-- Enable Row Level Security

-- Create tables with RLS policies
-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Polls table
CREATE TABLE IF NOT EXISTS public.polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true NOT NULL
);

-- Poll options table
CREATE TABLE IF NOT EXISTS public.poll_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Votes table
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  voter_ip TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(poll_id, user_id) -- Prevent duplicate votes from the same user
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_polls_created_by ON public.polls(created_by);
CREATE INDEX IF NOT EXISTS idx_poll_options_poll_id ON public.poll_options(poll_id);
CREATE INDEX IF NOT EXISTS idx_votes_poll_id ON public.votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_votes_option_id ON public.votes(option_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON public.votes(user_id);

-- Row Level Security Policies

-- Profiles table policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Polls table policies
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view polls" 
  ON public.polls FOR SELECT 
  USING (true);

CREATE POLICY "Users can create polls" 
  ON public.polls FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own polls" 
  ON public.polls FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own polls" 
  ON public.polls FOR DELETE 
  USING (auth.uid() = created_by);

-- Poll options table policies
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view poll options" 
  ON public.poll_options FOR SELECT 
  USING (true);

CREATE POLICY "Poll creators can manage poll options" 
  ON public.poll_options 
  USING (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = poll_options.poll_id 
      AND polls.created_by = auth.uid()
    )
  );

-- Votes table policies
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view votes" 
  ON public.votes FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can vote" 
  ON public.votes FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Anonymous users can vote if voter_ip is set" 
  ON public.votes FOR INSERT 
  WITH CHECK (auth.uid() IS NULL AND voter_ip IS NOT NULL);

-- Create functions for vote counting
CREATE OR REPLACE FUNCTION get_poll_results(poll_id UUID)
RETURNS TABLE (
  option_id UUID,
  option_text TEXT,
  vote_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    po.id,
    po.text,
    COUNT(v.id)::BIGINT
  FROM 
    public.poll_options po
  LEFT JOIN 
    public.votes v ON po.id = v.option_id
  WHERE 
    po.poll_id = get_poll_results.poll_id
  GROUP BY 
    po.id, po.text
  ORDER BY 
    COUNT(v.id) DESC;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update profiles on user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();