-- Event signups table
CREATE TABLE IF NOT EXISTS public.event_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  dependent_id UUID REFERENCES public.dependents(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'waitlisted', 'cancelled')),
  signed_up_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id, dependent_id)
);

-- Enable RLS
ALTER TABLE public.event_signups ENABLE ROW LEVEL SECURITY;

-- Signups policies
CREATE POLICY "Users can view signups for events they can see" ON public.event_signups
  FOR SELECT USING (
    event_id IN (SELECT id FROM public.events)
  );
CREATE POLICY "Users can sign up for events" ON public.event_signups
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own signups" ON public.event_signups
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can cancel own signups" ON public.event_signups
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_signups_event_id ON public.event_signups(event_id);
CREATE INDEX idx_signups_user_id ON public.event_signups(user_id);
