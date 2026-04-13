import { supabase } from './supabaseClient';
import { UserRole } from '../types';

export const authService = {
  async getCurrentProfile() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    return profile;
  },

  async getProfiles(role?: UserRole) {
    let query = supabase.from('profiles').select('*');
    if (role) {
      query = query.eq('role', role);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async updateProfile(updates: any) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', session.user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
