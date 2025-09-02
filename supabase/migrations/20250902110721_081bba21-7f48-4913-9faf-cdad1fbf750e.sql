-- Update admin function to use the new admin email
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if current user is the specified admin
  RETURN (
    (SELECT auth.jwt() ->> 'email') = 'dionalshayn18@gmail.com'
  );
END;
$$;

-- Create announcements table for admin to manage site announcements
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Create policies for announcements
CREATE POLICY "Everyone can view active announcements" 
ON public.announcements 
FOR SELECT 
USING (active = true);

CREATE POLICY "Admins can manage announcements" 
ON public.announcements 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Add delivery_option and delivery_fee to orders table
ALTER TABLE public.orders 
ADD COLUMN delivery_option TEXT DEFAULT 'pickup' CHECK (delivery_option IN ('pickup', 'delivery')),
ADD COLUMN delivery_fee NUMERIC DEFAULT 0,
ADD COLUMN total_amount NUMERIC DEFAULT 0;

-- Update all products to have uniform pricing of 25
UPDATE public.products SET price = 25;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for announcements
CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON public.announcements
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();