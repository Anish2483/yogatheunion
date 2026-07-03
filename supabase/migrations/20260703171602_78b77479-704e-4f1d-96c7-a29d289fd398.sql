
-- 1. profiles: restrict SELECT to owner
DROP POLICY IF EXISTS "Authenticated users can read all profiles" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- 2. action_items: replace permissive update policy
DROP POLICY IF EXISTS "Authenticated can update action_items" ON public.action_items;
CREATE POLICY "Creator or owner can update action_items" ON public.action_items
  FOR UPDATE TO authenticated
  USING (created_by = auth.uid() OR owner_id = auth.uid())
  WITH CHECK (created_by = auth.uid() OR owner_id = auth.uid());

-- 3. response_comments: restrict SELECT to author or retro participants/creator
DROP POLICY IF EXISTS "Authenticated can select comments" ON public.response_comments;
CREATE POLICY "Participants can select comments" ON public.response_comments
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.responses r
      JOIN public.retros rt ON rt.id = r.retro_id
      WHERE r.id = response_comments.response_id
        AND (
          rt.created_by = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.retro_participants rp
            WHERE rp.retro_id = rt.id AND rp.user_id = auth.uid()
          )
        )
    )
  );

-- 4. leads: replace public insert with tighter rule
DROP POLICY IF EXISTS "leads insert anyone" ON public.leads;
CREATE POLICY "leads insert authenticated self" ON public.leads
  FOR INSERT TO authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- 5. user_roles: explicit admin-only write policies
CREATE POLICY "Only admins can insert user_roles" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update user_roles" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete user_roles" ON public.user_roles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 6. Revoke EXECUTE on SECURITY DEFINER functions from anon/authenticated.
-- Trigger functions don't need direct execute grants; has_role is called from RLS
-- (runs as table owner) so RLS still works after revoke.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recalc_listing_rating() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_retro_format() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_sentiment() FROM PUBLIC, anon, authenticated;
