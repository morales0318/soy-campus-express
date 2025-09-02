-- Fix the foreign key constraint issue in orders table
-- The orders table should reference auth.users, not the custom users table
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- Add proper foreign key constraint to auth.users
ALTER TABLE public.orders 
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create admin credentials table for custom admin login
CREATE TABLE public.admin_credentials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on admin_credentials
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

-- Only allow system access to admin credentials (no user access)
CREATE POLICY "System only access to admin credentials" 
ON public.admin_credentials 
FOR ALL 
USING (false);

-- Insert the admin credentials (password will be hashed in the application)
INSERT INTO public.admin_credentials (username, password_hash)
VALUES ('technoAdmin', '$2a$10$rJ8qZ9FvF1YQJKv5X2Hv9eO3gF6bC8dE1nM4pL7qS0tU9wV3xY5zA'); -- This is a placeholder, will be updated by app

-- Update the is_admin function to also check for admin credentials
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if current user is the specified admin email OR has admin session
  RETURN (
    (SELECT auth.jwt() ->> 'email') = 'dionalshayn18@gmail.com' OR
    (SELECT current_setting('app.admin_session', true)) = 'true'
  );
END;
$function$;