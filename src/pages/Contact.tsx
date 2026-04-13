import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { leadService } from "../services/leadService";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      service_type: formData.get("service") as string,
      message: formData.get("message") as string,
    };

    try {
      await leadService.submitLead(data);
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError("Failed to submit message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-dark py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-16 gap-y-16 lg:grid-cols-2">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green mb-4">Contact Us</p>
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl uppercase leading-[0.95]">
              Get in touch
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/60">
              Have a project in mind or want to join our programs? We'd love to hear from you. Fill out the form and our team will get back to you as soon as possible.
            </p>
            
            <dl className="mt-12 space-y-8 text-base leading-7 text-white/60">
              <div className="flex gap-x-6 items-center">
                <div className="h-12 w-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <Mail className="h-6 w-6" />
                </div>
                <dd>
                  <a className="hover:text-brand-green transition-colors font-bold" href="mailto:contact@origen.com">
                    contact@origen.com
                  </a>
                </dd>
              </div>
              <div className="flex gap-x-6 items-center">
                <div className="h-12 w-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <Phone className="h-6 w-6" />
                </div>
                <dd>
                  <a className="hover:text-brand-green transition-colors font-bold" href="tel:+1 (555) 234-5678">
                    +1 (555) 234-5678
                  </a>
                </dd>
              </div>
              <div className="flex gap-x-6 items-center">
                <div className="h-12 w-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <MapPin className="h-6 w-6" />
                </div>
                <dd className="font-bold">
                  123 Innovation Way, Tech City, TC 12345
                </dd>
              </div>
            </dl>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 sm:p-12 rounded-[40px]"
          >
            {submitted ? (
              <div className="text-center py-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10">
                  <Send className="h-8 w-8 text-brand-green" />
                </div>
                <h3 className="mt-6 text-2xl font-black uppercase tracking-tight text-white">Message Sent!</h3>
                <p className="mt-2 text-white/50">Thank you for reaching out. We'll be in touch soon.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-xs font-black uppercase tracking-widest text-brand-green hover:text-white transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="block w-full rounded-2xl border-white/5 bg-white/5 px-4 py-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-brand-green sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="block w-full rounded-2xl border-white/5 bg-white/5 px-4 py-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-brand-green sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="service" className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                    Interested In
                  </label>
                  <select
                    id="service"
                    name="service"
                    className="block w-full rounded-2xl border-white/5 bg-white/5 px-4 py-4 text-white focus:ring-2 focus:ring-brand-green sm:text-sm"
                  >
                    <option className="bg-brand-dark">Web Development</option>
                    <option className="bg-brand-dark">Branding & Design</option>
                    <option className="bg-brand-dark">Internship Programs</option>
                    <option className="bg-brand-dark">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    required
                    className="block w-full rounded-2xl border-white/5 bg-white/5 px-4 py-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-brand-green sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-green px-10 py-5 text-center text-xs font-black uppercase tracking-widest text-brand-dark shadow-lg transition-all hover:scale-[1.02] hover:neon-glow active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Message"}
                </button>
              </form>
            )}
            {error && (
              <div className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
                {error}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
