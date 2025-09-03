-- Remove unused admin_credentials table that was flagged by security scanner
-- The application uses a simpler localStorage-based admin auth system instead
DROP TABLE IF EXISTS public.admin_credentials;