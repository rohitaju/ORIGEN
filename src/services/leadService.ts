import { supabase } from './supabaseClient';
import { Lead } from '../types';

export const leadService = {
  async submitLead(leadData: { name: string; email: string; company?: string; service_type: string; message: string }) {
    const { data, error } = await supabase
      .from('leads')
      .insert({
        name: leadData.name,
        email: leadData.email,
        company: leadData.company,
        service_type: leadData.service_type,
        message: leadData.message,
        status: 'new'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAllLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map((l: any) => ({
      id: l.id,
      name: l.name,
      email: l.email,
      company: l.company,
      service: l.service_type,
      message: l.message,
      status: l.status,
      createdAt: l.created_at
    })) as Lead[];
  },

  async updateLeadStatus(id: string, status: 'new' | 'contacted' | 'closed') {
    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
