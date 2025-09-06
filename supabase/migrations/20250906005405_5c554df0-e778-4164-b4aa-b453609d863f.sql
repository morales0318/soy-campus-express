-- Remove unused users table that was flagged by security scanner
-- The application uses Supabase's built-in auth.users table and profiles table instead
-- This eliminates the security risk of conflicting RLS policies on sensitive user data

DROP TABLE IF EXISTS public.users CASCADE;