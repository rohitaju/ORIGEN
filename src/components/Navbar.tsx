import { Link, useLocation } from "react-router-dom";
import { User } from "../types";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Programs", href: "/programs" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-brand-dark/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tighter text-white">
                ORIGEN<span className="text-brand-green">.</span>
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "text-xs font-bold uppercase tracking-widest transition-colors hover:text-brand-green",
                    location.pathname === link.href
                      ? "text-brand-green"
                      : "text-white/60"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <div className="flex items-center gap-6 pl-6 border-l border-white/10">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/80 hover:text-white"
                  >
                    <UserIcon className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="rounded-full bg-brand-green px-8 py-2.5 text-xs font-black uppercase tracking-widest text-brand-dark transition-all hover:scale-105 hover:neon-glow active:scale-95"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/5 bg-brand-surface"
          >
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block rounded-xl px-3 py-3 text-xs font-black uppercase tracking-widest transition-colors",
                    location.pathname === link.href
                      ? "bg-brand-green/10 text-brand-green"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block rounded-xl px-3 py-3 text-xs font-black uppercase tracking-widest text-white/60 hover:bg-white/5 hover:text-white"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left rounded-xl px-3 py-3 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-3 py-3 text-xs font-black uppercase tracking-widest bg-brand-green text-brand-dark text-center mt-2 hover:neon-glow"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
