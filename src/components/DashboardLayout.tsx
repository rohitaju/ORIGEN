import React from "react";
import { User } from "../types";
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface SidebarItem {
  id: string;
  name: string;
  icon: LucideIcon;
}

interface DashboardLayoutProps {
  user: User;
  tabs: SidebarItem[];
  activeTab: string;
  setActiveTab: (id: any) => void;
  children: React.ReactNode;
  portalName: string;
}

export default function DashboardLayout({ 
  user, 
  tabs, 
  activeTab, 
  setActiveTab, 
  children,
  portalName
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-brand-dark">
      {/* Sidebar */}
      <aside className="hidden w-72 border-r border-white/5 bg-brand-surface lg:block sticky top-0 h-screen overflow-y-auto">
        <div className="flex h-full flex-col">
          <div className="flex-1 py-12">
            <div className="px-8 mb-12">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green">{portalName}</p>
            </div>
            <nav className="space-y-2 px-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex w-full items-center gap-4 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id
                      ? "bg-brand-green text-brand-dark shadow-[0_0_20px_rgba(163,255,71,0.2)]"
                      : "text-white/40 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? "text-brand-dark" : "text-white/20 group-hover:text-brand-green"}`} />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
          <div className="border-t border-white/5 p-8 bg-black/20">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green font-black uppercase">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-xs font-black uppercase tracking-tight text-white">{user.name}</p>
                <p className="truncate text-[8px] text-white/20 uppercase tracking-[0.2em] mt-1">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-brand-surface/95 backdrop-blur-md border-t border-white/5">
        <nav className="flex items-center justify-around px-2 py-3 overflow-x-auto gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex min-w-[72px] flex-col items-center justify-center gap-1 rounded-2xl p-2 transition-all ${
                activeTab === tab.id
                  ? "bg-brand-green/10 text-brand-green"
                  : "text-white/40 hover:bg-white/5 hover:text-white"
              }`}
            >
              <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? "text-brand-green" : "text-white/40"}`} />
              <span className="text-[8px] font-black uppercase tracking-widest">{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
