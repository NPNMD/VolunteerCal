-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  goals TEXT,
  plan TEXT,
  accomplishments TEXT,
  location TEXT,
  virtual_link TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  recurrence TEXT DEFAULT 'one-time' CHECK (recurrence IN ('one-time', 'weekly', 'monthly')),
  max_capacity INTEGER,
  signup_deadline TIMESTAMPTZ,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Published events in public groups are viewable" ON public.events
  FOR SELECT USING (
    group_id IN (SELECT id FROM public.groups WHERE visibility = 'public')
    OR group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
  );
CREATE POLICY "Group members can create events" ON public.events
  FOR INSERT WITH CHECK (
    auth.uid() = created_by AND
    group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
  );
CREATE POLICY "Event creators and group admins can update events" ON public.events
  FOR UPDATE USING (
    auth.uid() = created_by OR
    group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Event creators and group admins can delete events" ON public.events
  FOR DELETE USING (
    auth.uid() = created_by OR
    group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Indexes
CREATE INDEX idx_events_group_id ON public.events(group_id);
CREATE INDEX idx_events_created_by ON public.events(created_by);
CREATE INDEX idx_events_start_time ON public.events(start_time);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_events_status ON public.events(status);

-- Enable pg_trgm for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_events_title_trgm ON public.events USING gin(title gin_trgm_ops);

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
