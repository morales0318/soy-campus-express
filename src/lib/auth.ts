import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { CAMPUS_OPTIONS } from "@/data/products";

export interface UserProfile {
  id: string;
  username: string;
  contact?: string;
  facebook?: string;
  campus?: typeof CAMPUS_OPTIONS[number];
  created_at?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  contact?: string;
  facebook?: string;
  campus?: typeof CAMPUS_OPTIONS[number];
  isAdmin: boolean;
}

export const signUp = async (
  email: string,
  password: string,
  username: string,
  contact: string,
  facebook: string,
  campus: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        username,
        contact,
        facebook,
        campus,
      },
    },
  });

  if (error) return { user: null, error };
  return { user: data.user, error: null };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { user: null, error };
  return { user: data.user, error: null };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  // Check if admin
  const isAdmin = user.email === 'admin@admin.com';

  // Get profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email!,
    username: profile?.username || '',
    contact: profile?.contact,
    facebook: profile?.facebook,
    campus: profile?.campus,
    isAdmin,
  };
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};