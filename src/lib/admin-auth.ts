import { supabase } from "@/integrations/supabase/client";

export interface AdminCredentials {
  username: string;
  password: string;
}

export const adminLogin = async (credentials: AdminCredentials): Promise<{ success: boolean; error?: string }> => {
  const { username, password } = credentials;
  
  // Check against our specific admin credentials
  if (username === 'technoAdmin' && password === 'adminAccess1234567890') {
    // Set admin session in localStorage for persistence
    localStorage.setItem('admin_session', 'true');
    localStorage.setItem('admin_username', username);
    return { success: true };
  }
  
  return { success: false, error: 'Invalid admin credentials' };
};

export const adminLogout = () => {
  localStorage.removeItem('admin_session');
  localStorage.removeItem('admin_username');
};

export const isAdminLoggedIn = (): boolean => {
  return localStorage.getItem('admin_session') === 'true';
};

export const getAdminUsername = (): string | null => {
  return localStorage.getItem('admin_username');
};