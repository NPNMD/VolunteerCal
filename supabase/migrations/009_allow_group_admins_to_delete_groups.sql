-- Allow group admins (not just creator) to delete groups.
-- Previously: only created_by = auth.uid() could delete.
-- Now: creator OR any group admin can delete.
DROP POLICY IF EXISTS "Group admins can delete groups" ON public.groups;
CREATE POLICY "Group admins can delete groups" ON public.groups
  FOR DELETE USING (
    created_by = auth.uid() OR
    id IN (SELECT public.user_admin_group_ids())
  );
