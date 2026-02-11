-- Fix 42P17 infinite recursion: group_members policies reference group_members in subqueries,
-- causing circular evaluation. Use SECURITY DEFINER functions to bypass RLS for the lookup.

-- Helper: get group_ids the current user is a member of (bypasses RLS)
CREATE OR REPLACE FUNCTION public.user_group_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT group_id FROM public.group_members WHERE user_id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.user_group_ids() TO anon, authenticated;

-- Helper: get group_ids where current user is admin (bypasses RLS)
CREATE OR REPLACE FUNCTION public.user_admin_group_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT group_id FROM public.group_members WHERE user_id = auth.uid() AND role = 'admin';
$$;

GRANT EXECUTE ON FUNCTION public.user_admin_group_ids() TO anon, authenticated;

-- Drop and recreate group_members policies to use the helpers
DROP POLICY IF EXISTS "Members can view group members" ON public.group_members;
CREATE POLICY "Members can view group members" ON public.group_members
  FOR SELECT USING (
    group_id IN (SELECT public.user_group_ids())
    OR group_id IN (SELECT id FROM public.groups WHERE visibility = 'public')
  );

DROP POLICY IF EXISTS "Admins can update members" ON public.group_members;
CREATE POLICY "Admins can update members" ON public.group_members
  FOR UPDATE USING (group_id IN (SELECT public.user_admin_group_ids()));

DROP POLICY IF EXISTS "Users can leave or admins can remove" ON public.group_members;
CREATE POLICY "Users can leave or admins can remove" ON public.group_members
  FOR DELETE USING (
    auth.uid() = user_id OR
    group_id IN (SELECT public.user_admin_group_ids())
  );

-- Fix groups policies too (they reference group_members, which could contribute to cycles)
DROP POLICY IF EXISTS "Public groups are viewable by everyone" ON public.groups;
CREATE POLICY "Public groups are viewable by everyone" ON public.groups
  FOR SELECT USING (
    visibility = 'public' OR id IN (SELECT public.user_group_ids())
  );

DROP POLICY IF EXISTS "Group admins can update groups" ON public.groups;
CREATE POLICY "Group admins can update groups" ON public.groups
  FOR UPDATE USING (id IN (SELECT public.user_admin_group_ids()));

-- Fix events policies: use helpers to avoid recursion via group_members
DROP POLICY IF EXISTS "Published events in public groups are viewable" ON public.events;
CREATE POLICY "Published events in public groups are viewable" ON public.events
  FOR SELECT USING (
    group_id IN (SELECT id FROM public.groups WHERE visibility = 'public')
    OR group_id IN (SELECT public.user_group_ids())
  );

DROP POLICY IF EXISTS "Group members can create events" ON public.events;
CREATE POLICY "Group members can create events" ON public.events
  FOR INSERT WITH CHECK (
    auth.uid() = created_by AND
    group_id IN (SELECT public.user_group_ids())
  );

DROP POLICY IF EXISTS "Event creators and group admins can update events" ON public.events;
CREATE POLICY "Event creators and group admins can update events" ON public.events
  FOR UPDATE USING (
    auth.uid() = created_by OR
    group_id IN (SELECT public.user_admin_group_ids())
  );

DROP POLICY IF EXISTS "Event creators and group admins can delete events" ON public.events;
CREATE POLICY "Event creators and group admins can delete events" ON public.events
  FOR DELETE USING (
    auth.uid() = created_by OR
    group_id IN (SELECT public.user_admin_group_ids())
  );

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
