import { useState, useEffect } from "react";
import { User, StudentProfile, Task, Application } from "../../types";
import { 
  DUMMY_PROJECTS, 
  DUMMY_PROGRAMS, 
  DUMMY_COURSES,
  DUMMY_JOBS,
  DUMMY_ASSESSMENTS
} from "../../constants";
import { authService } from "../../services/authService";
import { projectService } from "../../services/projectService";
import { applicationService } from "../../services/applicationService";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  BookOpen, 
  Briefcase, 
  User as UserIcon, 
  FileSearch, 
  MessageSquare, 
  Trophy,
  Send,
  ArrowRight,
  Upload,
  Star,
  Search,
  Loader2
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";

interface DashboardProps {
  user: User;
}

type StudentTab = "profile" | "learning" | "ats" | "jobs" | "mock" | "assessment";

export default function StudentDashboard({ user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<StudentTab>("learning");
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
    { id: "learning", name: "Learning", icon: BookOpen },
    { id: "ats", name: "ATS Checker", icon: FileSearch },
    { id: "jobs", name: "Job Applying", icon: Briefcase },
    { id: "mock", name: "Mock Interview", icon: MessageSquare },
    { id: "assessment", name: "Skill Assessment", icon: Trophy },
  ];

  return (
    <DashboardLayout
      user={user}
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      portalName="Student Portal"
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
          {activeTab === "learning" && <LearningSection user={user} />}
          {activeTab === "ats" && <ATSSection />}
          {activeTab === "jobs" && <JobsSection user={user} />}
          {activeTab === "mock" && <MockInterviewSection />}
          {activeTab === "assessment" && <AssessmentSection user={user} />}
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
      full_name: formData.get("fullName") as string,
      bio: formData.get("bio") as string,
      education: formData.get("education") as string,
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
        <h2 className="text-4xl font-black uppercase tracking-tight text-white">Your Profile</h2>
        <p className="mt-2 text-white/40">Manage your personal information and professional details.</p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <form className="glass-card p-10 rounded-[40px]" onSubmit={handleUpdate}>
            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-8">Personal Details</h3>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Full Name</label>
                <input name="fullName" type="text" defaultValue={profile?.full_name || user.name} className="block w-full rounded-2xl border-white/5 bg-white/5 px-4 py-4 text-white focus:ring-2 focus:ring-brand-green sm:text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Email</label>
                <input type="email" defaultValue={profile?.email || user.email} disabled className="block w-full rounded-2xl border-white/5 bg-white/5 px-4 py-4 text-white opacity-50 sm:text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Bio</label>
                <textarea name="bio" rows={4} defaultValue={profile?.bio} className="block w-full rounded-2xl border-white/5 bg-white/5 px-4 py-4 text-white focus:ring-2 focus:ring-brand-green sm:text-sm" />
              </div>
            </div>
            
            {successMsg && (
              <p className="mt-4 text-xs font-bold text-brand-green">{successMsg}</p>
            )}

            <button disabled={updating} type="submit" className="mt-10 rounded-full bg-brand-green px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-dark hover:neon-glow transition-all flex items-center gap-2 disabled:opacity-50 inline-flex">
              {updating && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </button>
          </form>

          <div className="glass-card p-10 rounded-[40px]">
            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-8">Skills & Education</h3>
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Skills</label>
                <div className="flex flex-wrap gap-3">
                  {(profile?.skills || []).map((skill: string) => (
                    <span key={skill} className="px-4 py-2 rounded-xl bg-brand-green/10 text-brand-green text-[10px] font-black uppercase tracking-widest border border-brand-green/20">
                      {skill}
                    </span>
                  ))}
                  <button className="px-4 py-2 rounded-xl bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest border border-white/5 hover:text-white transition-colors">
                    + Add Skill
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Education</label>
                <input type="text" defaultValue={profile?.education} className="block w-full rounded-2xl border-white/5 bg-white/5 px-4 py-4 text-white focus:ring-2 focus:ring-brand-green sm:text-sm" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-10 rounded-[40px] text-center">
            <div className="relative inline-block mb-6">
              <div className="h-32 w-32 rounded-[40px] bg-brand-green/10 flex items-center justify-center text-brand-green text-4xl font-black uppercase">
                {user.name.charAt(0)}
              </div>
              <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-brand-dark border-4 border-brand-surface flex items-center justify-center text-brand-green">
                <Upload className="h-4 w-4" />
              </div>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white">{user.name}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-2">Profile Completion</p>
            <div className="mt-6">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">
                <span>Progress</span>
                <span className="text-brand-green">{profile?.completionPercentage || 0}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-brand-green shadow-[0_0_10px_rgba(163,255,71,0.5)]" style={{ width: `${profile?.completionPercentage || 0}%` }} />
              </div>
            </div>
          </div>

          <div className="glass-card p-10 rounded-[40px]">
            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-6">Resume</h3>
            <div className="p-8 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center group hover:border-brand-green/30 transition-all cursor-pointer">
              <Upload className="h-8 w-8 text-white/20 group-hover:text-brand-green transition-colors mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Upload New Resume</p>
              <p className="text-[8px] text-white/10 mt-2">PDF, DOCX up to 5MB</p>
            </div>
            {profile?.resumeUrl && (
              <div className="mt-6 p-4 rounded-2xl bg-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-white/60 truncate max-w-[150px]">current_resume.pdf</span>
                <button className="text-[10px] font-black uppercase tracking-widest text-brand-green hover:text-white transition-colors">View</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LearningSection({ user }: { user: User }) {
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await projectService.getMyTasks();
        setMyTasks(tasks || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const myCourses = DUMMY_COURSES.filter(c => c.enrolledStudents.includes(user.id));

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
        <h2 className="text-4xl font-black uppercase tracking-tight text-white">Learning Center</h2>
        <p className="mt-2 text-white/40">Track your courses, modules, and learning progress.</p>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-8">Enrolled Courses</h3>
            <div className="grid grid-cols-1 gap-8">
              {myCourses.map(course => (
                <div key={course.id} className="glass-card p-10 rounded-[40px] flex flex-col md:flex-row gap-10">
                  <img src={course.thumbnail} alt={course.title} className="w-full md:w-48 aspect-video rounded-3xl object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <h4 className="text-2xl font-black uppercase tracking-tight text-white">{course.title}</h4>
                    <p className="mt-2 text-sm text-white/40 leading-relaxed">{course.description}</p>
                    <div className="mt-8 flex items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                          <span>Progress</span>
                          <span className="text-brand-green">60%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full bg-brand-green" style={{ width: '60%' }} />
                        </div>
                      </div>
                      <button className="rounded-full bg-white/5 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-8">Learning Tasks</h3>
            <div className="glass-card rounded-[40px] overflow-hidden">
              <ul className="divide-y divide-white/5">
                {myTasks.length > 0 ? myTasks.map(task => (
                  <li key={task.id} className="p-8 hover:bg-white/5 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        {task.status === "done" ? <CheckCircle2 className="h-6 w-6 text-brand-green" /> : <Circle className="h-6 w-6 text-white/20" />}
                        <div>
                          <p className={`text-lg font-bold uppercase tracking-tight ${task.status === "done" ? "text-white/20 line-through" : "text-white"}`}>{task.title}</p>
                          <p className="text-xs text-white/40 mt-1">{task.description}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${task.status === "done" ? "bg-brand-green/10 text-brand-green" : "bg-white/5 text-white/40"}`}>
                        {task.status}
                      </span>
                    </div>
                  </li>
                )) : (
                  <li className="p-8 text-center text-white/40 text-sm font-bold">No tasks assigned yet.</li>
                )}
              </ul>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-10 rounded-[40px]">
            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-6">Course Modules</h3>
            <div className="space-y-4">
              {myCourses[0]?.modules?.map((module: any, i: number) => (
                <div key={module.id} className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-4 group hover:border-brand-green/30 transition-all cursor-pointer">
                  <div className="h-10 w-10 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green text-xs font-black">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white group-hover:text-brand-green transition-colors">{module.title}</p>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">{module.tasks?.length || 0} Tasks</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ATSSection() {
  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-4xl font-black uppercase tracking-tight text-white">Resume ATS Checker</h2>
        <p className="mt-2 text-white/40">Optimize your resume for Applicant Tracking Systems.</p>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="glass-card p-12 rounded-[40px] flex flex-col items-center justify-center text-center border-2 border-dashed border-white/10 hover:border-brand-green/30 transition-all cursor-pointer">
          <FileSearch className="h-16 w-16 text-brand-green mb-8" />
          <h3 className="text-2xl font-black uppercase tracking-tight text-white">Upload Your Resume</h3>
          <p className="mt-4 text-white/40 max-w-xs mx-auto">We'll analyze your resume against common industry keywords and standards.</p>
          <button className="mt-10 rounded-full bg-brand-green px-10 py-5 text-[10px] font-black uppercase tracking-widest text-brand-dark hover:neon-glow transition-all">
            Select File
          </button>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-10 rounded-[40px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Analysis Result</h3>
              <span className="text-4xl font-black text-brand-green">75%</span>
            </div>
            <div className="h-4 w-full rounded-full bg-white/5 overflow-hidden mb-12">
              <div className="h-full bg-brand-green shadow-[0_0_15px_rgba(163,255,71,0.5)]" style={{ width: '75%' }} />
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Suggestions</h4>
              {[
                "Add more keywords related to 'Cloud Computing'",
                "Quantify your achievements in your experience section",
                "Ensure your contact information is clearly visible"
              ].map((s, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <Star className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                  <p className="text-sm text-white/60 leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobsSection({ user }: { user: User }) {
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const apps = await applicationService.getMyApplications();
        setMyApplications(apps || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
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
          <h2 className="text-4xl font-black uppercase tracking-tight text-white">Job Board</h2>
          <p className="mt-2 text-white/40">Find and apply for the latest opportunities.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
            <input type="text" placeholder="Search jobs..." className="pl-12 pr-6 py-4 rounded-full bg-white/5 border border-white/5 text-white text-xs font-bold focus:ring-2 focus:ring-brand-green w-full sm:w-64" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {DUMMY_JOBS.map(job => (
            <div key={job.id} className="glass-card p-10 rounded-[40px] border border-white/5 hover:border-brand-green/30 transition-all group">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white group-hover:text-brand-green transition-colors">{job.title}</h3>
                  <p className="text-brand-green text-sm font-bold mt-2">{job.company}</p>
                  <div className="flex flex-wrap gap-3 mt-6">
                    {job.skills.map(skill => (
                      <span key={skill} className="px-3 py-1.5 rounded-lg bg-white/5 text-white/40 text-[8px] font-black uppercase tracking-widest border border-white/5">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-white">{job.salary}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-2">Deadline: {job.deadline}</p>
                </div>
              </div>
              <p className="mt-8 text-sm text-white/50 leading-relaxed line-clamp-2">{job.description}</p>
              <div className="mt-10 flex items-center justify-between pt-8 border-t border-white/5">
                <button className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">View Details</button>
                <button className="rounded-full bg-brand-green px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-dark hover:neon-glow transition-all">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          <h3 className="text-xl font-black uppercase tracking-tight text-white">Application Status</h3>
          <div className="space-y-6">
            {myApplications.length > 0 ? myApplications.map((app: any) => {
              const program = app.program; // since applicationService maps it
              return (
                <div key={app.id} className="glass-card p-8 rounded-[32px]">
                  <h4 className="text-lg font-black uppercase tracking-tight text-white">{program?.title || 'Unknown Program'}</h4>
                  <p className="text-xs text-brand-green font-bold mt-1">Origen Setup</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      app.status === "approved" ? "bg-brand-green/10 text-brand-green" : 
                      app.status === "pending" ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-6">
                <p className="text-white/40 text-xs">No applications found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MockInterviewSection() {
  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-4xl font-black uppercase tracking-tight text-white">Mock Interview</h2>
        <p className="mt-2 text-white/40">Practice your interview skills with AI-driven mock sessions.</p>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="glass-card p-12 rounded-[40px] text-center">
          <MessageSquare className="h-16 w-16 text-brand-green mx-auto mb-8" />
          <h3 className="text-2xl font-black uppercase tracking-tight text-white">Start Practice Session</h3>
          <p className="mt-4 text-white/40 max-w-xs mx-auto">Choose a role and difficulty level to begin your practice interview.</p>
          
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <select className="block w-full rounded-2xl border-white/5 bg-white/5 px-4 py-4 text-white focus:ring-2 focus:ring-brand-green sm:text-sm">
              <option className="bg-brand-dark">Frontend Developer</option>
              <option className="bg-brand-dark">UI/UX Designer</option>
              <option className="bg-brand-dark">Product Manager</option>
            </select>
            <select className="block w-full rounded-2xl border-white/5 bg-white/5 px-4 py-4 text-white focus:ring-2 focus:ring-brand-green sm:text-sm">
              <option className="bg-brand-dark">Entry Level</option>
              <option className="bg-brand-dark">Intermediate</option>
              <option className="bg-brand-dark">Senior</option>
            </select>
          </div>

          <button className="mt-10 w-full rounded-full bg-brand-green px-10 py-5 text-[10px] font-black uppercase tracking-widest text-brand-dark hover:neon-glow transition-all">
            Begin Interview
          </button>
        </div>

        <div className="glass-card p-10 rounded-[40px]">
          <h3 className="text-xl font-black uppercase tracking-tight text-white mb-8">Recent Performance</h3>
          <div className="space-y-8">
            {[
              { role: "Frontend Developer", score: 85, date: "2024-04-12" },
              { role: "UI/UX Designer", score: 92, date: "2024-04-05" }
            ].map((session, i) => (
              <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5">
                <div>
                  <p className="text-sm font-bold text-white">{session.role}</p>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">{session.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-brand-green">{session.score}%</p>
                  <button className="text-[8px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors mt-1">View Feedback</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AssessmentSection({ user }: { user: User }) {
  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-4xl font-black uppercase tracking-tight text-white">Skill Assessment</h2>
        <p className="mt-2 text-white/40">Validate your skills through industry-standard tests.</p>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {DUMMY_ASSESSMENTS.map(test => (
            <div key={test.id} className="glass-card p-10 rounded-[40px] border border-white/5 hover:border-brand-green/30 transition-all">
              <div className="flex items-center justify-between mb-8">
                <span className="px-4 py-1.5 rounded-full bg-brand-green/10 text-brand-green text-[10px] font-black uppercase tracking-widest">{test.type}</span>
                <Trophy className="h-6 w-6 text-white/20" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-white">{test.title}</h3>
              <p className="mt-4 text-sm text-white/40 leading-relaxed">Test your knowledge of {test.title} with this {test.questions.length}-question assessment.</p>
              <button className="mt-10 w-full rounded-full bg-white/5 py-4 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                Start Test
              </button>
            </div>
          ))}
        </div>

        <div className="glass-card p-10 rounded-[40px]">
          <h3 className="text-xl font-black uppercase tracking-tight text-white mb-8">Your Scores</h3>
          <div className="space-y-6">
            {[
              { title: "JavaScript Fundamentals", score: 95 },
              { title: "HTML/CSS Basics", score: 100 },
              { title: "React Core", score: 88 }
            ].map((score, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">
                  <span>{score.title}</span>
                  <span className="text-brand-green">{score.score}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-brand-green" style={{ width: `${score.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
