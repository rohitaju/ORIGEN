import { supabase } from './supabaseClient';
import { Program } from '../types';

export const programService = {
  async getActivePrograms(): Promise<Program[]> {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('status', 'active');
      
    if (error) throw error;
    return data as Program[];
  },

  async getProgramById(id: string): Promise<Program | null> {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Program;
  },

  async createProgram(programData: Omit<Program, 'id'>) {
    const { data, error } = await supabase
      .from('programs')
      .insert(programData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
