-- Fix security definer functions by setting search_path
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if current user is admin (hardcoded admin or has admin role)
  RETURN (
    (SELECT auth.jwt() ->> 'email') = 'admin@admin.com' OR
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, contact, facebook, campus)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    NEW.raw_user_meta_data ->> 'contact',
    NEW.raw_user_meta_data ->> 'facebook',
    NEW.raw_user_meta_data ->> 'campus'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;