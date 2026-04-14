import { supabase } from './supabaseClient';
import { Project, Task } from '../types';

const mapProject = (p: any): Project => ({
  id: p.id,
  title: p.title,
  description: p.description,
  clientId: p.client_id,
  assignedStudents: p.assigned_student_id ? [p.assigned_student_id] : [],
  status: p.status,
  progress: p.progress ?? 0,
  deadline: p.deadline,
  startDate: p.created_at,
});

const mapTask = (t: any): Task => ({
  id: t.id,
  projectId: t.project_id,
  assignedTo: t.assigned_to,
  title: t.title,
  description: t.description,
  status: t.status,
});

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*');

    if (error) throw error;
    return (data || []).map(mapProject) as Project[];
  },

  async getProjectById(projectId: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw error;
    return data ? mapProject(data) : null;
  },

  async createProject(projectData: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: projectData.title,
        description: projectData.description,
        client_id: projectData.clientId,
        deadline: projectData.deadline,
        status: projectData.status ?? 'pending',
        progress: projectData.progress ?? 0
      })
      .select()
      .single();

    if (error) throw error;
    return mapProject(data);
  },

  async assignStudentToProject(projectId: string, studentId: string) {
    const { data, error } = await supabase
      .from('projects')
      .update({
        assigned_student_id: studentId,
        status: 'in-progress'
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;

    await projectService.createDefaultTasks(projectId, studentId);
    return mapProject(data);
  },

  async createDefaultTasks(projectId: string, assignedTo: string, tasks = [
    { title: 'Kickoff & requirements', description: 'Review project scope and confirm deliverables' },
    { title: 'Design & planning', description: 'Create wireframes, mockups, and project plan' },
    { title: 'Development', description: 'Build features and complete implementation' },
    { title: 'Review & delivery', description: 'Test, refine, and hand over final output' }
  ]) {
    const payload = tasks.map((task) => ({
      project_id: projectId,
      assigned_to: assignedTo,
      title: task.title,
      description: task.description,
      status: 'todo'
    }));

    const { error } = await supabase.from('tasks').insert(payload);
    if (error) throw error;
    return payload;
  },

  async getTasksForProject(projectId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId);

    if (error) throw error;
    return (data || []).map(mapTask) as Task[];
  },

  async getMyTasks(): Promise<Task[]> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('assigned_to', session.user.id);

    if (error) throw error;
    return (data || []).map(mapTask) as Task[];
  },

  async updateTaskStatus(taskId: string, status: 'todo' | 'in-progress' | 'done') {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return mapTask(data);
  }
};
