import { useState, useEffect } from "react";
import { User, StudentProfile, ClientProfile, Project, Task, Lead, JobListing, Course, Application, Interview } from "../../types";
import { 
  DUMMY_USERS, 
  DUMMY_PROJECTS, 
  DUMMY_LEADS, 
  DUMMY_STUDENT_PROFILES, 
  DUMMY_CLIENT_PROFILES,
  DUMMY_COURSES,
  DUMMY_JOBS,
  DUMMY_APPLICATIONS,
  DUMMY_INTERVIEWS
} from "../../constants";
import { authService } from "../../services/authService";
import { projectService } from "../../services/projectService";
import { applicationService } from "../../services/applicationService";
import { leadService } from "../../services/leadService";

import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  Briefcase, 
  BookOpen, 
  Layout as LayoutIcon, 
  Settings, 
  Plus, 
  Search,
  Filter,
  Clock,
  Activity,
  Trophy,
  MessageSquare,
  BarChart3,
  Mail,
  MoreVertical,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";

interface DashboardProps {
  user: User;
}

type AdminTab = 
  | "overview" 
  | "students" 
  | "clients" 
  | "projects" 
  | "courses" 
  | "control" 
  | "jobs" 
  | "analytics" 
  | "smart" 
  | "interviews" 
  | "leads";

export default function AdminDashboard({ user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  const tabs = [
    { id: "overview", name: "Dashboard", icon: LayoutIcon },
    { id: "students", name: "Student Management", icon: Users },
    { id: "clients", name: "Client Management", icon: Briefcase },
    { id: "projects", name: "Projects", icon: Activity },
    { id: "courses", name: "Course Adding", icon: BookOpen },
    { id: "control", name: "Control Panel", icon: Settings },
    { id: "jobs", name: "Job Posting", icon: Plus },
    { id: "analytics", name: "Hiring Analytics", icon: BarChart3 },
    { id: "smart", name: "Smart Candidates", icon: Trophy },
    { id: "interviews", name: "Interview Management", icon: MessageSquare },
    { id: "leads", name: "Leads", icon: Mail },
  ];

  return (
    <DashboardLayout
      user={user}
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      portalName="Admin Portal"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && <OverviewSection />}
          {activeTab === "students" && <StudentManagementSection />}
          {activeTab === "clients" && <ClientManagementSection />}
          {activeTab === "projects" && <ProjectsSection />}
          {activeTab === "courses" && <CourseAddingSection />}
          {activeTab === "control" && <ControlPanelSection />}
          {activeTab === "jobs" && <JobPostingSection />}
          {activeTab === "analytics" && <HiringAnalyticsSection />}
          {activeTab === "smart" && <SmartCandidatesSection />}
          {activeTab === "interviews" && <InterviewManagementSection />}
          {activeTab === "leads" && <LeadsSection />}
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
}

function OverviewSection() {
  const [stats, setStats] = useState({ students: 0, clients: 0, activeProjects: 0, applications: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [students, clients, projects, apps] = await Promise.all([
          authService.getProfiles("student"),
          authService.getProfiles("client"),
          projectService.getProjects(),
          applicationService.getAllApplications()
        ]);
        setStats({
          students: students.length,
          clients: clients.length,
          activeProjects: projects.filter(p => p.status === "in-progress").length,
          applications: apps.length
        });
      } catch (err) {
        console.error("Failed to load overview data", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const statCards = [
    { label: "Total Students", value: stats.students, icon: Users, color: "text-brand-green" },
    { label: "Total Clients", value: stats.clients, icon: Briefcase, color: "text-blue-500" },
    { label: "Active Projects", value: stats.activeProjects, icon: Activity, color: "text-purple-500" },
    { label: "Applications", value: stats.applications, icon: Mail, color: "text-yellow-500" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-4xl font-black uppercase tracking-tight text-white">Dashboard Overview</h2>
        <p className="mt-2 text-white/40">Real-time platform metrics and activity summary.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <div key={i} className="glass-card p-8 rounded-[32px]">
            <div className="flex items-center gap-6">
              <div className={`rounded-2xl bg-white/5 p-4 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</p>
                <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="glass-card p-10 rounded-[40px]">
          <h3 className="text-xl font-black uppercase tracking-tight text-white mb-8">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="h-2 w-2 rounded-full bg-brand-green" />
                <p className="text-xs text-white/60 flex-1">New student <span className="text-white font-bold">Alex Johnson</span> joined the platform.</p>
                <span className="text-[8px] font-black uppercase tracking-widest text-white/20">2h ago</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-10 rounded-[40px]">
          <h3 className="text-xl font-black uppercase tracking-tight text-white mb-8">Project Distribution</h3>
          <div className="space-y-6">
            {[
              { label: "In Progress", value: 65, color: "bg-blue-500" },
              { label: "Completed", value: 25, color: "bg-brand-green" },
              { label: "Pending", value: 10, color: "bg-white/10" }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentManagementSection() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await authService.getProfiles("student");
        setStudents(data || []);
      } catch (err) {
        console.error("Failed to fetch students", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tight text-white">Student Management</h2>
          <p className="mt-2 text-white/40">Manage student accounts, courses, and platform access.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
            <input type="text" placeholder="Search students..." className="pl-12 pr-6 py-4 rounded-full bg-white/5 border border-white/5 text-white text-xs font-bold focus:ring-2 focus:ring-brand-green w-full sm:w-64" />
          </div>
        </div>
      </header>

      <div className="glass-card rounded-[40px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Student</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Role</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Education</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {students.map(student => {
              return (
                <tr key={student.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green font-black uppercase text-xs">
                        {(student.full_name || "U").charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{student.full_name || "Unknown User"}</p>
                        <p className="text-[10px] text-white/20 mt-1">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-white/60 capitalize">{student.role}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-white/60">{student.education || "Not specified"}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-brand-green/10 text-brand-green">
                      Active
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 rounded-xl hover:bg-white/10 text-white/20 hover:text-white transition-all">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ClientManagementSection() {
  const [clients, setClients] = useState<any[]>([]);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsData, projectsData] = await Promise.all([
          authService.getProfiles("client"),
          projectService.getProjects()
        ]);
        setClients(clientsData || []);
        setProjectsList(projectsData || []);
      } catch (err) {
        console.error("Failed to fetch clients", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tight text-white">Client Management</h2>
          <p className="mt-2 text-white/40">Manage client accounts and their associated projects.</p>
        </div>
        <button className="rounded-full bg-brand-green px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-dark hover:neon-glow transition-all flex items-center gap-3">
          <Plus className="h-4 w-4" /> Add New Client
        </button>
      </header>

      <div className="glass-card rounded-[40px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Company</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Contact Info</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Active Projects</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {clients.map(client => {
              const projects = projectsList.filter(p => p.clientId === client.id);
              return (
                <tr key={client.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-white">{client.company_name || client.full_name || "Unknown Company"}</p>
                    <p className="text-[10px] text-white/20 mt-1">{client.email}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-white/60">{client.contact_person || client.full_name || "Not specified"}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-white">{projects.length}</span>
                      <span className="text-[10px] text-white/20 uppercase tracking-widest">({projects.filter(p => p.status === "in-progress").length} In Progress)</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-brand-green/10 text-brand-green">
                      Active
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-[10px] font-black uppercase tracking-widest text-brand-green hover:text-white transition-colors">View Details</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProjectsSection() {
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setProjectsList(data || []);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tight text-white">Project Tracking</h2>
          <p className="mt-2 text-white/40">Global overview of all active and completed projects.</p>
        </div>
        <button className="rounded-full bg-brand-green px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-dark hover:neon-glow transition-all flex items-center gap-3">
          <Plus className="h-4 w-4" /> Create Project
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {projectsList.map(project => (
          <div key={project.id} className="glass-card p-10 rounded-[40px] border border-white/5 hover:border-brand-green/30 transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    project.status === "completed" ? "bg-brand-green/10 text-brand-green" : 
                    project.status === "in-progress" ? "bg-blue-500/10 text-blue-500" : "bg-white/5 text-white/40"
                  }`}>
                    {project.status}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">{project.title}</h3>
                <p className="mt-4 text-sm text-white/40 leading-relaxed max-w-2xl">{project.description}</p>
                
                <div className="mt-8 flex flex-wrap gap-8">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-brand-green" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Assigned Team</p>
                      <p className="text-xs font-bold text-white mt-1">{project.assignedStudents.length} Students</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-brand-green" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Client ID</p>
                      <p className="text-xs font-bold text-white mt-1">{project.clientId ? project.clientId.substring(0, 8) + '...' : 'None'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full lg:w-72">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">
                  <span>Progress</span>
                  <span className="text-brand-green">{project.progress}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-brand-green shadow-[0_0_10px_rgba(163,255,71,0.5)]" style={{ width: `${project.progress}%` }} />
                </div>
                <div className="mt-8 flex gap-4">
                  <button className="flex-1 rounded-full bg-white/5 py-4 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                    Edit
                  </button>
                  <button className="flex-1 rounded-full bg-red-500/10 py-4 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/20 transition-all">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {projectsList.length === 0 && (
          <div className="text-center py-10">
            <p className="text-white/60">No projects found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CourseAddingSection() {
  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-4xl font-black uppercase tracking-tight text-white">Course Management</h2>
        <p className="mt-2 text-white/40">Create and edit educational content for the platform.</p>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-10 rounded-[40px]">
            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-8">Create New Course</h3>
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Course Title</label>
                <input type="text" placeholder="e.g. Advanced React Patterns" className="block w-full rounded-2xl border-white/5 bg-white/5 px-4 py-4 text-white focus:ring-2 focus:ring-brand-green sm:text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Description</label>
                <textarea rows={4} placeholder="What will students learn?" className="block w-full rounded-2xl border-white/5 bg-white/5 px-4 py-4 text-white focus:ring-2 focus:ring-brand-green sm:text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Course Modules</label>
                <div className="space-y-4">
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green text-[10px] font-black">1</div>
                      <p className="text-sm font-bold text-white">Introduction to the Course</p>
                    </div>
                    <button className="text-red-500 hover:text-red-400 transition-colors"><XCircle className="h-4 w-4" /></button>
                  </div>
                  <button className="w-full p-6 rounded-3xl border-2 border-dashed border-white/10 text-[10px] font-black uppercase tracking-widest text-white/20 hover:border-brand-green/30 hover:text-brand-green transition-all">
                    + Add Module
                  </button>
                </div>
              </div>
            </div>
            <button className="mt-10 rounded-full bg-brand-green px-10 py-5 text-[10px] font-black uppercase tracking-widest text-brand-dark hover:neon-glow transition-all">
              Publish Course
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-xl font-black uppercase tracking-tight text-white">Active Courses</h3>
          <div className="space-y-6">
            {DUMMY_COURSES.map(course => (
              <div key={course.id} className="glass-card p-8 rounded-[32px] group">
                <img src={course.thumbnail} alt={course.title} className="w-full aspect-video rounded-2xl object-cover mb-6" referrerPolicy="no-referrer" />
                <h4 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-brand-green transition-colors">{course.title}</h4>
                <p className="text-[10px] text-white/20 uppercase tracking-widest mt-2">{course.modules.length} Modules • {course.enrolledStudents.length} Students</p>
                <div className="mt-6 flex gap-4">
                  <button className="flex-1 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Edit</button>
                  <button className="flex-1 text-[10px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-colors">Archive</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlPanelSection() {
  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-4xl font-black uppercase tracking-tight text-white">Control Panel</h2>
        <p className="mt-2 text-white/40">Monitor platform health and student engagement.</p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="glass-card p-10 rounded-[40px]">
          <h3 className="text-xl font-black uppercase tracking-tight text-white mb-8">Engagement Metrics</h3>
          <div className="space-y-8">
            {[
              { label: "Course Completion Rate", value: 42, color: "text-brand-green" },
              { label: "Active Daily Students", value: 156, color: "text-blue-500" },
              { label: "Avg. Task Progress", value: 68, color: "text-purple-500" }
            ].map((metric, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">
                  <span>{metric.label}</span>
                  <span className={metric.color}>{metric.value}{typeof metric.value === 'number' && metric.value <= 100 ? '%' : ''}</span>
                </div>
                {typeof metric.value === 'number' && metric.value <= 100 && (
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div className={`h-full ${metric.color.replace('text', 'bg')}`} style={{ width: `${metric.value}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 glass-card p-10 rounded-[40px]">
          <h3 className="text-xl font-black uppercase tracking-tight text-white mb-8">System Status</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[
              { name: "Database", status: "Operational", icon: CheckCircle2, color: "text-brand-green" },
              { name: "Auth Service", status: "Operational", icon: CheckCircle2, color: "text-brand-green" },
              { name: "Storage", status: "92% Full", icon: AlertCircle, color: "text-yellow-500" },
              { name: "API Gateway", status: "Operational", icon: CheckCircle2, color: "text-brand-green" }
            ].map((sys, i) => (
              <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-tight">{sys.name}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${sys.color}`}>{sys.status}</p>
                </div>
                <sys.icon className={`h-6 w-6 ${sys.color}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function JobPostingSection() {
  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-4xl font-black uppercase tracking-tight text-white">Job Posting</h2>
        <p className="mt-2 text-white/40">Create and manage career opportunities for students.</p>
      </header>

      <div className="glass-card p-10 rounded-[40px] max-w-4xl">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Job Title</label>
            <input type="text" placeholder="e.g. Junior Frontend Developer" className="block w-full rounded-2xl border-white/5 bg-white/5 px-4 py-4 text-white focus:ring-2 focus:ring-brand-green sm:text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Company</label>
            <input type="text" placeholder="e.g. Origen Tech" className="block w-full rounded-2xl border-white/5 bg-white/5 px-4 py-4 text-white focus:ring-2 focus:ring-brand-green sm:text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Deadline</label>
            <input type="date" className="block w-full rounded-2xl border-white/5 bg-white/5 px-4 py-4 text-white focus:ring-2 focus:ring-brand-green sm:text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Required Skills (Comma separated)</label>
            <input type="text" placeholder="React, TypeScript, Tailwind" className="block w-full rounded-2xl border-white/5 bg-white/5 px-4 py-4 text-white focus:ring-2 focus:ring-brand-green sm:text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Job Description</label>
            <textarea rows={6} className="block w-full rounded-2xl border-white/5 bg-white/5 px-4 py-4 text-white focus:ring-2 focus:ring-brand-green sm:text-sm" />
          </div>
        </div>
        <button className="mt-10 rounded-full bg-brand-green px-10 py-5 text-[10px] font-black uppercase tracking-widest text-brand-dark hover:neon-glow transition-all">
          Post Job Opportunity
        </button>
      </div>
    </div>
  );
}

function HiringAnalyticsSection() {
  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-4xl font-black uppercase tracking-tight text-white">Hiring Analytics</h2>
        <p className="mt-2 text-white/40">Track recruitment performance and candidate success rates.</p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="glass-card p-10 rounded-[40px] flex flex-col items-center justify-center text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-4">Overall Hiring Rate</p>
          <div className="relative h-48 w-48 flex items-center justify-center">
            <svg className="h-full w-full -rotate-90">
              <circle cx="96" cy="96" r="88" className="stroke-white/5 fill-none" strokeWidth="12" />
              <circle cx="96" cy="96" r="88" className="stroke-brand-green fill-none" strokeWidth="12" strokeDasharray="552" strokeDashoffset="138" strokeLinecap="round" />
            </svg>
            <span className="absolute text-5xl font-black text-white">75%</span>
          </div>
          <p className="mt-8 text-xs text-white/40 font-bold uppercase tracking-widest">+12% from last month</p>
        </div>

        <div className="lg:col-span-2 glass-card p-10 rounded-[40px]">
          <h3 className="text-xl font-black uppercase tracking-tight text-white mb-8">Applicants per Job</h3>
          <div className="space-y-8">
            {[
              { job: "Frontend Developer", count: 45, max: 60 },
              { job: "UI/UX Designer", count: 28, max: 60 },
              { job: "Product Manager", count: 12, max: 60 }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">
                  <span>{item.job}</span>
                  <span className="text-white">{item.count} Applicants</span>
                </div>
                <div className="h-4 w-full rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-brand-green/50" style={{ width: `${(item.count / item.max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SmartCandidatesSection() {
  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-4xl font-black uppercase tracking-tight text-white">Smart Candidates</h2>
        <p className="mt-2 text-white/40">AI-powered identification of top-performing students based on platform activity.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {[
          { name: "Student One", score: 98, reason: "Top 1% in React Assessment, 100% Course Completion" },
          { name: "Student Two", score: 94, reason: "Exceptional Project Delivery, High Peer Review Score" },
          { name: "Student Three", score: 91, reason: "Fastest Course Completion, Active Community Contributor" }
        ].map((candidate, i) => (
          <div key={i} className="glass-card p-10 rounded-[40px] flex flex-col md:flex-row items-center gap-10 border border-brand-green/10 hover:border-brand-green/30 transition-all">
            <div className="h-24 w-24 rounded-[32px] bg-brand-green/10 flex items-center justify-center text-brand-green text-3xl font-black">
              {candidate.name.charAt(0)}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">{candidate.name}</h3>
                <span className="px-4 py-1.5 rounded-full bg-brand-green/10 text-brand-green text-[10px] font-black uppercase tracking-widest">Score: {candidate.score}</span>
              </div>
              <p className="text-sm text-white/40 leading-relaxed">{candidate.reason}</p>
            </div>
            <button className="rounded-full bg-white/5 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
              View Full Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function InterviewManagementSection() {
  return (
    <div className="space-y-12">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tight text-white">Interview Management</h2>
          <p className="mt-2 text-white/40">Schedule and track candidate interviews.</p>
        </div>
        <button className="rounded-full bg-brand-green px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-dark hover:neon-glow transition-all flex items-center gap-3">
          <Clock className="h-4 w-4" /> Schedule Interview
        </button>
      </header>

      <div className="glass-card rounded-[40px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Candidate</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Job Role</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Date & Time</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {DUMMY_INTERVIEWS.map(interview => {
              const candidate = DUMMY_USERS.find(u => u.id === interview.candidateId);
              const job = DUMMY_JOBS.find(j => j.id === interview.jobId);
              return (
                <tr key={interview.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-white">{candidate?.name}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-white/60">{job?.title}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-white/60">{new Date(interview.scheduledAt).toLocaleString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      interview.status === "scheduled" ? "bg-blue-500/10 text-blue-500" : "bg-brand-green/10 text-brand-green"
                    }`}>
                      {interview.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-[10px] font-black uppercase tracking-widest text-brand-green hover:text-white transition-colors">Edit</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeadsSection() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await leadService.getAllLeads();
        setLeads(data || []);
      } catch (err) {
        console.error("Failed to fetch leads", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-4xl font-black uppercase tracking-tight text-white">Leads Management</h2>
        <p className="mt-2 text-white/40">Inquiries and potential clients from the public website.</p>
      </header>

      <div className="glass-card rounded-[40px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Lead Name</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Company</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Service</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {leads.length > 0 ? leads.map(lead => (
              <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-8 py-6">
                  <p className="text-sm font-bold text-white">{lead.name}</p>
                  <p className="text-[10px] text-white/20 mt-1">{lead.email}</p>
                </td>
                <td className="px-8 py-6">
                  <p className="text-xs font-bold text-white/60">{lead.company || "Not specified"}</p>
                </td>
                <td className="px-8 py-6">
                  <p className="text-xs font-bold text-white/60">{lead.service}</p>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    lead.status === "new" ? "bg-blue-500/10 text-blue-500" : "bg-brand-green/10 text-brand-green"
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="text-[10px] font-black uppercase tracking-widest text-brand-green hover:text-white transition-colors">Contact</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-8 py-10 text-center text-white/40">No leads found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
