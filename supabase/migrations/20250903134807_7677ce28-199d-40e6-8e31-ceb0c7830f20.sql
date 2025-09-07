-- Remove overly permissive admin policy on users table
DROP POLICY IF EXISTS "admin full access" ON public.users;

-- Add proper admin access policy for users table
CREATE POLICY "Admins can manage users" 
ON public.users 
FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());