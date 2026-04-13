import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-brand-dark py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-3xl font-black tracking-tighter text-white">
              ORIGEN
            </Link>
            <p className="mt-6 max-w-xs text-sm text-white/40 leading-relaxed">
              Connecting businesses, students, and organizations through technology, services, and community-driven initiatives.
            </p>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green mb-8">
              Platform
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/services" className="text-xs font-bold text-white/40 hover:text-brand-green transition-colors uppercase tracking-widest">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-xs font-bold text-white/40 hover:text-brand-green transition-colors uppercase tracking-widest">
                  Programs
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-xs font-bold text-white/40 hover:text-brand-green transition-colors uppercase tracking-widest">
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green mb-8">
              Company
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/contact" className="text-xs font-bold text-white/40 hover:text-brand-green transition-colors uppercase tracking-widest">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-xs font-bold text-white/40 hover:text-brand-green transition-colors uppercase tracking-widest">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
            © {new Date().getFullYear()} Origen. All rights reserved.
          </p>
          <div className="flex gap-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-brand-green cursor-pointer transition-colors">Twitter</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-brand-green cursor-pointer transition-colors">LinkedIn</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-brand-green cursor-pointer transition-colors">Instagram</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
