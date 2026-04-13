import { useState } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "motion/react";
import { Lock, Loader2 } from "lucide-react";

export default function ResetPasswordModal({ onClose }: { onClose: () => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      alert("Password updated successfully!");
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md p-8 glass-card rounded-[40px] bg-brand-surface">
        <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2 text-center">Reset Password</h2>
        <p className="text-sm text-white/40 mb-8 text-center">Type in your new secure password.</p>
        
        <form onSubmit={handleUpdate} className="space-y-6">
          {error && <p className="text-xs text-red-500 text-center font-bold">{error}</p>}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-brand-green transition-colors" />
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/5 text-white text-sm focus:outline-none focus:border-brand-green/30" placeholder="New Password" minLength={6} />
          </div>
          <button disabled={loading} type="submit" className="w-full flex items-center justify-center gap-2 rounded-2xl bg-brand-green px-6 py-4 font-black uppercase tracking-widest text-brand-dark hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
