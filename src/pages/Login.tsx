import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { UserRole } from "../types";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "motion/react";
import { LogIn, Shield, GraduationCap, Briefcase, Mail, Lock, User as UserIcon, ArrowRight, Loader2 } from "lucide-react";

interface LoginProps {
  user: any | null;
}

export default function Login({ user }: LoginProps) {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("student");

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role,
            },
          },
        });
        if (signUpError) throw signUpError;
        alert("Check your email for the confirmation link!");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-brand-dark px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 glass-card p-8 sm:p-10 rounded-[40px]"
      >
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green mb-3">
            {isSignUp ? "Join the Force" : "Welcome Back"}
          </p>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
            {isSignUp ? "Create Account" : "Access Portal"}
          </h2>
          <p className="text-sm text-white/40">
            {isSignUp ? "Start your journey with ORIGEN." : "Manage your projects and growth."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="mt-8 space-y-5">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            {isSignUp && (
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-brand-green transition-colors" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/5 text-white text-sm focus:outline-none focus:border-brand-green/30 focus:bg-white/10 transition-all"
                  placeholder="Full Name"
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-brand-green transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/5 text-white text-sm focus:outline-none focus:border-brand-green/30 focus:bg-white/10 transition-all"
                placeholder="Email Address"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-brand-green transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/5 text-white text-sm focus:outline-none focus:border-brand-green/30 focus:bg-white/10 transition-all"
                placeholder="Password"
              />
            </div>

            {isSignUp && (
              <div className="space-y-3 pt-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 px-1">Select Your Role</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "student", label: "Student", icon: GraduationCap },
                    { id: "client", label: "Client", icon: Briefcase }
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id as UserRole)}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all text-xs font-black uppercase tracking-tighter ${
                        role === r.id 
                        ? "bg-brand-green border-brand-green text-brand-dark" 
                        : "bg-white/5 border-white/5 text-white/40 hover:border-white/10"
                      }`}
                    >
                      <r.icon className="h-3 w-3" />
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-brand-green px-6 py-4 text-sm font-black uppercase tracking-widest text-brand-dark transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="pt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-bold text-white/40 hover:text-white transition-colors"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Create one"}
          </button>
        </div>

        <div className="pt-8 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
          <span className="h-px w-8 bg-white/10"></span>
          <span>Secure Portal Access</span>
          <span className="h-px w-8 bg-white/10"></span>
        </div>
      </motion.div>
    </div>
  );
}

