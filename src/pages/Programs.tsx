import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Clock, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { programService } from "../services/programService";
import { applicationService } from "../services/applicationService";
import { authService } from "../services/authService";
import { Program, User } from "../types";

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [applying, setApplying] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const [data, profile] = await Promise.all([
          programService.getActivePrograms(),
          authService.getCurrentProfile(),
        ]);
        setPrograms(data);

        if (profile) {
          setUser({
            id: profile.id,
            name: profile.full_name || profile.email || 'Student',
            email: profile.email || '',
            role: profile.role || 'student',
          });
        }
      } catch (err) {
        console.error("Error fetching programs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const handleApply = async (programId: string, title: string) => {
    if (!user) {
      setMessage('Please sign in to apply for a program.');
      return;
    }

    if (user.role !== 'student') {
      setMessage('Only students can apply to programs.');
      return;
    }

    setApplying(programId);
    setMessage(null);

    try {
      await applicationService.applyToProgram(programId, `Applying for ${title}`);
      setMessage('Your application was submitted successfully.');
    } catch (err: any) {
      console.error(err);
      setMessage(err?.message || 'Unable to submit application.');
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="bg-brand-dark py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-24">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green mb-4">Programs</p>
          <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl uppercase leading-[0.95]">
            Launch your career with Origen
          </h2>
          <p className="mt-6 text-lg leading-8 text-white/60">
            Our internship and training programs are designed to give you real-world experience and build your professional network.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {loading ? (
            <div className="col-span-1 lg:col-span-3 flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-brand-green" />
            </div>
          ) : programs.length === 0 ? (
            <div className="col-span-1 lg:col-span-3 text-center py-20">
              <p className="text-white/60">No active programs available at the moment.</p>
            </div>
          ) : programs.map((program, index) => (
            <motion.article
              key={program.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-start overflow-hidden rounded-[40px] bg-brand-surface border border-white/5 transition-all hover:border-brand-green/30"
            >
              <div className="relative w-full aspect-video">
                <img
                  src={program.image}
                  alt={program.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 right-6">
                  <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${
                    program.status === "open" ? "bg-brand-green text-brand-dark" : "bg-red-500 text-white"
                  }`}>
                    {program.status === "open" ? "Open Now" : "Closed"}
                  </span>
                </div>
              </div>
              <div className="p-10">
                <div className="flex items-center gap-x-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                  <span className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-brand-green" />
                    {program.duration}
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-black uppercase tracking-tight text-white">
                  {program.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/50 line-clamp-3">
                  {program.description}
                </p>
                <div className="mt-8">
                  {user?.role === 'student' ? (
                    <button
                      type="button"
                      onClick={() => handleApply(program.id, program.title)}
                      disabled={program.status !== 'open' || applying === program.id}
                      className={`inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-colors ${
                        program.status === 'open' ? 'text-brand-green hover:text-white' : 'text-white/20 cursor-not-allowed'
                      }`}
                    >
                      {program.status === 'open' ? (applying === program.id ? 'Applying...' : 'Apply Now') : 'Applications Closed'}
                      {program.status === 'open' && <ArrowRight className="h-4 w-4" />}
                    </button>
                  ) : (
                    <Link
                      to="/contact"
                      className={`inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-colors ${
                        program.status === 'open' ? 'text-brand-green hover:text-white' : 'text-white/20 cursor-not-allowed'
                      }`}
                    >
                      {program.status === 'open' ? 'Contact to Apply' : 'Applications Closed'}
                      {program.status === 'open' && <ArrowRight className="h-4 w-4" />}
                    </Link>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        {message && (
          <div className="mt-8 rounded-3xl bg-brand-green/10 border border-brand-green/20 p-4 text-sm font-black uppercase tracking-widest text-brand-green">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
