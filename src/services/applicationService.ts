import { supabase } from './supabaseClient';
import { Application } from '../types';

export const applicationService = {
  async applyToProgram(programId: string, motivationText?: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('applications')
      .insert({
        user_id: session.user.id,
        program_id: programId,
        motivation_text: motivationText,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getMyApplications(): Promise<Application[]> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];

    const { data, error } = await supabase
      .from('applications')
      .select('*, programs(*)')
      .eq('user_id', session.user.id);

    if (error) throw error;
    // Map to frontend type
    return data.map((app: any) => ({
      id: app.id,
      programId: app.program_id,
      studentId: app.user_id,
      status: app.status,
      appliedAt: app.created_at,
      program: app.programs // include program details
    })) as Application[];
  },

  async getAllApplications() {
    const { data, error } = await supabase
      .from('applications')
      .select('*, profiles(full_name, email), programs(title)');

    if (error) throw error;
    return data;
  },

  async updateApplicationStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
