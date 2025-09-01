-- First, let's create a profiles table for user data and enable RLS on all tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  contact TEXT,
  facebook TEXT,
  campus TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if current user is admin (hardcoded admin or has admin role)
  RETURN (
    (SELECT auth.jwt() ->> 'email') = 'admin@admin.com' OR
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a system user for product ownership
DO $$
DECLARE
    system_user_id UUID;
BEGIN
    -- Insert a system user if it doesn't exist
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, role)
    VALUES (
        '00000000-0000-0000-0000-000000000000'::UUID,
        'system@soyastore.com',
        '$2a$10$dummy.encrypted.password.hash',
        NOW(),
        NOW(),
        NOW(),
        'authenticated'
    ) ON CONFLICT (id) DO NOTHING;
    
    system_user_id := '00000000-0000-0000-0000-000000000000'::UUID;
    
    -- Insert default products with system user as owner
    INSERT INTO public.products (name, price, image_url, available, stock, owner_id) VALUES
      ('Classic Soya', 20, NULL, true, 100, system_user_id),
      ('Mango Soya', 25, NULL, true, 100, system_user_id),
      ('Choco Soya', 25, NULL, true, 100, system_user_id),
      ('Strawberry Soya', 25, NULL, true, 100, system_user_id),
      ('Ube Soya', 25, NULL, true, 100, system_user_id),
      ('Coffee Soya', 25, NULL, true, 100, system_user_id),
      ('Banana Soya', 25, NULL, true, 100, system_user_id)
    ON CONFLICT DO NOTHING;
END $$;

-- Profiles table policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

-- Users table policies
CREATE POLICY "Users can view own record" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own record" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own record" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE USING (public.is_admin());

-- Orders table policies
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all orders" ON public.orders
  FOR UPDATE USING (public.is_admin());

-- Create trigger to auto-create profile when user signs up
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();