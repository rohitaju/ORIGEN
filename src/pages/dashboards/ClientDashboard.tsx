import { useState, useEffect } from "react";
import { User, ClientProfile, Project } from "../../types";
import { authService } from "../../services/authService";
import { projectService } from "../../services/projectService";
import { motion, AnimatePresence } from "motion/react";
import { 
  Briefcase, 
  User as UserIcon, 
  Activity,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";

interface DashboardProps {
  user: User;
}

type ClientTab = "profile" | "projects" | "status";

export default function ClientDashboard({ user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<ClientTab>("projects");
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getCurrentProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const tabs = [
    { id: "profile", name: "Profile", icon: UserIcon },
    { id: "projects", name: "Projects", icon: Briefcase },
    { id: "status", name: "Project Status", icon: Activity },
  ];

  return (
    <DashboardLayout
      user={user}
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      portalName="Client Portal"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "profile" && <ProfileSection user={user} profile={profile} />}
          {activeTab === "projects" && <ProjectsSection user={user} />}
          {activeTab === "status" && <StatusSection user={user} />}
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
}

function ProfileSection({ user, profile }: { user: User, profile?: any }) {
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    setUpdating(true);
    setSuccessMsg("");

    const formData = new FormData(e.target);
    const updates = {
      company_name: formData.get("companyName") as string,
      contact_person: formData.get("contactPerson") as string,
      // phone and requirements are not currently in the Supabase schema, so they are omitted to prevent 400 Bad Request
    };

    try {
      await authService.updateProfile(updates);
      setSuccessMsg("Profile updated successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-4xl font-black uppercase tracking-tight text-white">Company Profile</h2>
        <p className="mt-2 text-white/40">Manage your company details and contact information.</p>
      </header>

      <form className="glass-card p-10 rounded-[40px] max-w-4xl" onSubmit={handleUpdate}>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Company Name</label>
            <input name="companyName" type="text" defaultValue={profile?.company_name} className="block w-full rounded-2xl border-white/5 bg-white/5 px-4 py-4 text-white focus:ring-2 focus:ring-brand-green sm:text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Contact Person</label>
            <input name="contactPerson" type="text" defaultValue={profile?.contact_person} className="block w-full rounded-2xl border-white/5 bg-white/5 px-4 py-4 text-white focus:ring-2 focus:ring-brand-green sm:text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Email</label>
            <input type="email" defaultValue={profile?.email || user.email} disabled className="block w-full rounded-2xl border-white/5 bg-white/5 px-4 py-4 text-white opacity-50 sm:text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Phone</label>
            <input name="phone" type="text" defaultValue={profile?.phone} className="block w-full rounded-2xl border-white/5 bg-white/5 px-4 py-4 text-white focus:ring-2 focus:ring-brand-green sm:text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Requirements</label>
            <textarea name="requirements" rows={4} defaultValue={profile?.requirements} className="block w-full rounded-2xl border-white/5 bg-white/5 px-4 py-4 text-white focus:ring-2 focus:ring-brand-green sm:text-sm" />
          </div>
        </div>

        {successMsg && (
          <p className="mt-4 text-xs font-bold text-brand-green">{successMsg}</p>
        )}

        <button disabled={updating} type="submit" className="mt-10 rounded-full bg-brand-green px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-dark hover:neon-glow transition-all flex items-center gap-2 disabled:opacity-50 inline-flex">
          {updating && <Loader2 className="h-4 w-4 animate-spin" />}
          Update Profile
        </button>
      </form>
    </div>
  );
}

function ProjectsSection({ user }: { user: User }) {
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setMyProjects(data || []);
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
      <header>
        <h2 className="text-4xl font-black uppercase tracking-tight text-white">Your Projects</h2>
        <p className="mt-2 text-white/40">View and manage all your ongoing digital projects.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {myProjects.length > 0 ? myProjects.map(project => (
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
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20">ID: {project.id?.substring(0, 8)}</span>
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tight text-white">{project.title}</h3>
                <p className="mt-4 text-sm text-white/40 leading-relaxed max-w-2xl">{project.description}</p>
                
                <div className="mt-8 flex flex-wrap gap-8">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-brand-green" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Team</p>
                      <p className="text-xs font-bold text-white mt-1">{project.assignedStudents?.length || 0} Students</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-brand-green" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Deadline</p>
                      <p className="text-xs font-bold text-white mt-1">{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full lg:w-72">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">
                  <span>Overall Progress</span>
                  <span className="text-brand-green">{project.progress}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-brand-green shadow-[0_0_10px_rgba(163,255,71,0.5)]" style={{ width: `${project.progress}%` }} />
                </div>
                <button className="mt-8 w-full rounded-full bg-white/5 py-4 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                  View Details
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 glass-card rounded-[40px]">
            <p className="text-white/40">No projects found. Submit a request to start a project.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusSection({ user }: { user: User }) {
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setMyProjects(data || []);
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
      <header>
        <h2 className="text-4xl font-black uppercase tracking-tight text-white">Project Status</h2>
        <p className="mt-2 text-white/40">Real-time tracking of your project milestones and delivery timeline.</p>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {myProjects.map(project => (
            <div key={project.id} className="glass-card p-10 rounded-[40px]">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black uppercase tracking-tight text-white">{project.title}</h3>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-brand-green" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Started: {new Date(project.startDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-white/5" />
                <div className="space-y-12">
                  {[
                    { name: "Project Initiation", status: "completed", date: new Date(project.startDate).toLocaleDateString() },
                    { name: "Design Phase", status: project.progress >= 25 ? "completed" : "in-progress", date: "..." },
                    { name: "Development", status: project.progress >= 50 ? "completed" : project.progress >= 25 ? "in-progress" : "pending", date: "..." },
                    { name: "Testing & QA", status: project.progress >= 100 ? "completed" : project.progress >= 75 ? "in-progress" : "pending", date: "..." }
                  ].map((milestone, i) => (
                    <div key={i} className="relative pl-12">
                      <div className={`absolute left-0 top-1 h-8 w-8 rounded-full border-4 border-brand-dark flex items-center justify-center z-10 ${
                        milestone.status === "completed" ? "bg-brand-green text-brand-dark" : 
                        milestone.status === "in-progress" ? "bg-blue-500 text-white" : "bg-white/10 text-white/20"
                      }`}>
                        {milestone.status === "completed" ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-current" />}
                      </div>
                      <div>
                        <p className={`text-sm font-bold uppercase tracking-tight ${milestone.status === "pending" ? "text-white/20" : "text-white"}`}>{milestone.name}</p>
                        <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">{milestone.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {myProjects.length === 0 && (
            <div className="text-center py-20 glass-card rounded-[40px]">
              <p className="text-white/40">No projects to show progress for.</p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="glass-card p-10 rounded-[40px]">
            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-8">Summary</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Projects</span>
                <span className="text-xl font-black text-white">{myProjects.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">In Progress</span>
                <span className="text-xl font-black text-blue-500">{myProjects.filter(p => p.status === "in-progress").length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Completed</span>
                <span className="text-xl font-black text-brand-green">{myProjects.filter(p => p.status === "completed").length}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-10 rounded-[40px] bg-brand-green/5 border-brand-green/20">
            <div className="flex items-center gap-4 mb-6">
              <AlertCircle className="h-6 w-6 text-brand-green" />
              <h3 className="text-lg font-black uppercase tracking-tight text-white">Next Delivery</h3>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">Your next major milestone relies on active project deadlines.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
