-- Groups table
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invite_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Group members join table
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Enable RLS
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Groups policies
CREATE POLICY "Public groups are viewable by everyone" ON public.groups
  FOR SELECT USING (visibility = 'public' OR id IN (
    SELECT group_id FROM public.group_members WHERE user_id = auth.uid()
  ));
CREATE POLICY "Authenticated users can create groups" ON public.groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Group admins can update groups" ON public.groups
  FOR UPDATE USING (id IN (
    SELECT group_id FROM public.group_members WHERE user_id = auth.uid() AND role = 'admin'
  ));
CREATE POLICY "Group admins can delete groups" ON public.groups
  FOR DELETE USING (created_by = auth.uid());

-- Group members policies
CREATE POLICY "Members can view group members" ON public.group_members
  FOR SELECT USING (group_id IN (
    SELECT group_id FROM public.group_members WHERE user_id = auth.uid()
  ) OR group_id IN (
    SELECT id FROM public.groups WHERE visibility = 'public'
  ));
CREATE POLICY "Users can join groups" ON public.group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update members" ON public.group_members
  FOR UPDATE USING (group_id IN (
    SELECT group_id FROM public.group_members WHERE user_id = auth.uid() AND role = 'admin'
  ));
CREATE POLICY "Users can leave or admins can remove" ON public.group_members
  FOR DELETE USING (
    auth.uid() = user_id OR
    group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Indexes
CREATE INDEX idx_groups_created_by ON public.groups(created_by);
CREATE INDEX idx_groups_visibility ON public.groups(visibility);
CREATE INDEX idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX idx_group_members_user_id ON public.group_members(user_id);

CREATE TRIGGER groups_updated_at
  BEFORE UPDATE ON public.groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
