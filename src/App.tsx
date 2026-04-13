import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { User } from "./types";
import { supabase } from "./lib/supabase";

import { authService } from "./services/authService";

// Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Programs from "./pages/Programs";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import ClientDashboard from "./pages/dashboards/ClientDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async (session: any) => {
      if (!session) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const profile = await authService.getCurrentProfile();
        if (profile) {
          setUser({
            id: session.user.id,
            name: profile.full_name || session.user.email?.split('@')[0] || "User",
            email: profile.email || session.user.email || "",
            role: profile.role || "student",
          });
        }
      } catch (err) {
        console.error("Error fetching profile", err);
        setUser(null);
      }
      setLoading(false);
    };

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchUser(session);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoading(true);
      fetchUser(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-dark">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-slate-900">
        <Navbar user={user} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login user={user} />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                user ? (
                  user.role === "student" ? <StudentDashboard user={user} /> :
                  user.role === "client" ? <ClientDashboard user={user} /> :
                  <AdminDashboard user={user} />
                ) : <Navigate to="/login" />
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

