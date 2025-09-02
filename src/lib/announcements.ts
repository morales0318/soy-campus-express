import { supabase } from "@/integrations/supabase/client";

export interface Announcement {
  id: string;
  title: string;
  message: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const getActiveAnnouncements = async (): Promise<Announcement[]> => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }

  return data || [];
};

export const getAllAnnouncements = async (): Promise<Announcement[]> => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all announcements:', error);
    return [];
  }

  return data || [];
};

export const createAnnouncement = async (title: string, message: string) => {
  const { data, error } = await supabase
    .from('announcements')
    .insert([{ title, message, active: true }])
    .select()
    .single();

  if (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }

  return data;
};

export const updateAnnouncement = async (id: string, updates: Partial<Pick<Announcement, 'title' | 'message' | 'active'>>) => {
  const { error } = await supabase
    .from('announcements')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating announcement:', error);
    throw error;
  }
};

export const deleteAnnouncement = async (id: string) => {
  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
};