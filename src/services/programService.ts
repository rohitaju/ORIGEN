import { supabase } from './supabaseClient';
import { Program } from '../types';

const mapProgram = (row: any): Program => ({
  id: row.id,
  title: row.title,
  description: row.description,
  duration: row.duration,
  status: row.status === 'active' ? 'open' : 'closed',
  image: row.image,
  mode: row.mode,
});

export const programService = {
  async getActivePrograms(): Promise<Program[]> {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;
    return (data || []).map(mapProgram) as Program[];
  },

  async getProgramById(id: string): Promise<Program | null> {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? mapProgram(data) : null;
  },

  async getAllPrograms(): Promise<Program[]> {
    const { data, error } = await supabase
      .from('programs')
      .select('*');

    if (error) throw error;
    return (data || []).map(mapProgram) as Program[];
  },

  async createProgram(programData: {
    title: string;
    description?: string;
    duration?: string;
    mode?: string;
    status?: 'active' | 'inactive';
    image?: string;
  }) {
    const dbPayload = {
      title: programData.title,
      description: programData.description,
      duration: programData.duration,
      mode: programData.mode,
      status: programData.status ?? 'active',
      image: programData.image,
    };

    const { data, error } = await supabase
      .from('programs')
      .insert(dbPayload)
      .select()
      .single();

    if (error) throw error;
    return mapProgram(data);
  }
};
