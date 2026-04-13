import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Palette, Users, Rocket } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col bg-brand-dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 sm:pt-48 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl font-black tracking-tight text-white sm:text-8xl uppercase leading-[0.9]">
                Bringing Your <br />
                Dream Into <span className="text-brand-green italic neon-text-glow">Reality</span>
              </h1>
              <p className="mx-auto mt-10 max-w-2xl text-lg leading-8 text-white/60">
                We increase revenue and ensure sustainable long-term growth for your business through powerful digital solutions.
              </p>
              <div className="mt-12 flex items-center justify-center gap-x-8">
                <Link
                  to="/contact"
                  className="rounded-full bg-brand-green px-10 py-4 text-xs font-black uppercase tracking-widest text-brand-dark shadow-lg transition-all hover:scale-105 hover:neon-glow active:scale-95"
                >
                  Book A Meeting
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Background Glow */}
        <div className="absolute top-1/4 left-1/2 -z-10 -translate-x-1/2 blur-[120px] opacity-20" aria-hidden="true">
          <div className="aspect-[1155/678] w-[72rem] bg-brand-green"></div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-y border-white/5 bg-brand-surface/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-8">
            Trusted by Amazing Brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-40 grayscale invert">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" alt="IBM" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg" alt="Slack" className="h-6" />
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-16 gap-y-16 lg:grid-cols-2 items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green mb-4">How We Work</p>
              <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl uppercase leading-[0.95]">
                Get a dedicated design team at fraction of the cost.
              </h2>
            </div>
            <div>
              <p className="text-lg text-white/60 leading-relaxed mb-8">
                Grow your brand with high-quality design for a flat monthly fee. Work with senior designers. Subscribe and make as many requests as you need — no limits.
              </p>
              <Link
                to="/services"
                className="rounded-full border border-brand-green/30 bg-brand-green/10 px-8 py-3 text-xs font-black uppercase tracking-widest text-brand-green hover:bg-brand-green hover:text-brand-dark transition-all"
              >
                See Pricing
              </Link>
            </div>
          </div>

          <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { step: "01", title: "Subscribe & get started", desc: "Submit as many design tasks as you need without worrying about individual project fees." },
              { step: "02", title: "Polished designs - on time", desc: "Our designers get to work to deliver your request. Receive your design within a few days." },
              { step: "03", title: "Revisions made simple", desc: "Custom designs, prompt replies and as many revisions as you need." }
            ].map((item, i) => (
              <div key={i} className="glass-card p-10 rounded-[40px] relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 text-8xl font-black text-white/5 group-hover:text-brand-green/10 transition-colors">
                  {item.step}
                </div>
                <div className="h-12 w-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green mb-8">
                  {i === 0 ? <Users className="h-6 w-6" /> : i === 1 ? <Palette className="h-6 w-6" /> : <Rocket className="h-6 w-6" />}
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white mb-4">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-24 sm:py-32 bg-white text-brand-dark">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tight sm:text-6xl">Our Beautiful Works</h2>
            <p className="mt-4 text-brand-dark/60">We help our clients grow their bottom-line with clear and professional websites.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-100">
                <img 
                  src={`https://picsum.photos/seed/origen-${i}/800/800`} 
                  alt="Work" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <button className="rounded-full border border-brand-dark/10 px-10 py-4 text-xs font-black uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all">
              Load More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
