import { supabase } from './supabaseClient';
import { Project, Task } from '../types';

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*');

    if (error) throw error;
    
    // Map database fields to frontend types if needed
    return data.map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      clientId: p.client_id,
      assignedStudents: p.assigned_student_id ? [p.assigned_student_id] : [],
      status: p.status,
      progress: p.progress,
      deadline: p.deadline,
      startDate: p.created_at
    })) as Project[];
  },

  async createProject(projectData: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: projectData.title,
        description: projectData.description,
        client_id: projectData.clientId,
        deadline: projectData.deadline,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getTasksForProject(projectId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId);

    if (error) throw error;
    return data.map((t: any) => ({
      id: t.id,
      projectId: t.project_id,
      assignedTo: t.assigned_to,
      title: t.title,
      description: t.description,
      status: t.status
    })) as Task[];
  },

  async getMyTasks(): Promise<Task[]> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('assigned_to', session.user.id);

    if (error) throw error;
    return data.map((t: any) => ({
      id: t.id,
      projectId: t.project_id,
      assignedTo: t.assigned_to,
      title: t.title,
      description: t.description,
      status: t.status
    })) as Task[];
  },

  async updateTaskStatus(taskId: string, status: 'todo' | 'in-progress' | 'done') {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
