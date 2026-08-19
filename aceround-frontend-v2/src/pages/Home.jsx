import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Brain, ChevronRight, Play, BarChart3, Users, Clock,
  TrendingUp, Briefcase, Lightbulb, Quote, Sparkles,
  Zap, Star, LogOut, User, Menu, X, Settings as SettingsIcon,
  ShieldAlert,
} from "lucide-react";
import StatCard from "../components/StatCard";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";

const testimonials = [
  { name: "Sachin Patel",  role: "Frontend Dev @ Google",    avatar: "SC", text: "AceRound's AI feedback pointed out gaps I'd never noticed." },
  { name: "Sanjay Singh",  role: "Backend Dev @ Amazon",     avatar: "MJ", text: "The timed quizzes made my prep much more targeted." },
  { name: "Priya Sharma",  role: "Full Stack Dev @ Microsoft",avatar: "PS", text: "AceRound's analytics showed me exactly where to improve." },
];

const features = [
  { icon: Brain,    title: "AI-Powered Analysis",     description: "Get personalized feedback on your answers with advanced AI that understands context and provides actionable insights." },
  { icon: Clock,    title: "Timed Practice",           description: "Simulate real interview conditions with 15-minute timed sessions that help you manage pressure effectively." },
  { icon: BarChart3,title: "Progress Tracking",        description: "Track your improvement over time with detailed analytics and performance metrics across multiple roles." },
  { icon: Briefcase,title: "Role-Specific Questions",  description: "Practice with questions tailored for Frontend, Backend, Full Stack, React, and HR interviews." },
];

const stats = [
  { icon: Users,     value: "10K+",  label: "Active Users" },
  { icon: TrendingUp,value: "95%",   label: "Success Rate" },
  { icon: Briefcase, value: "500+",  label: "Companies" },
  { icon: Clock,     value: "15min", label: "Per Session" },
];

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // If logged in go to dashboard, otherwise go to login
  const handleStartInterview = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  // Close mobile menu and also run an optional action (like logout)
  const closeMenu = (action = null) => {
    setMenuOpen(false);
    if (action) action();
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] relative overflow-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1e]/80 backdrop-blur-xl border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight group-hover:text-blue-300 transition-colors duration-200">
              AceRound
            </span>
          </Link>

          {/* Desktop buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 border border-slate-700/50 rounded-lg hover:border-blue-500/40 hover:bg-slate-700/60 transition-all duration-200"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-slate-300 text-sm font-medium">{user.name}</span>
                </Link>
                <Link to="/dashboard" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 rounded-lg transition-all duration-200">
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-purple-300 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 rounded-lg transition-all duration-200">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-red-500/20 border border-slate-700/50 hover:border-red-500/40 rounded-lg transition-all duration-200"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-5 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 rounded-lg transition-all duration-200">
                  Login
                </Link>
                <Link to="/register" className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 transition-all duration-200 hover:scale-[1.03]">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all duration-200"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="sm:hidden border-t border-slate-800/60 bg-[#0a0f1e]/95 backdrop-blur-xl px-4 py-4 flex flex-col gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-slate-300 text-sm font-medium">{user.name}</span>
                </div>
                <Link to="/dashboard" onClick={() => closeMenu()} className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 rounded-lg transition-all duration-200">
                  Dashboard
                </Link>
                <Link to="/" onClick={() => closeMenu()} className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 rounded-lg transition-all duration-200">
                  Home
                </Link>
                <Link to="/interview" onClick={() => closeMenu()} className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 rounded-lg transition-all duration-200">
                  Interview
                </Link>
                <Link to="/settings" onClick={() => closeMenu()} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 rounded-lg transition-all duration-200">
                  <SettingsIcon className="h-4 w-4" />
                  Settings
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => closeMenu()} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-purple-300 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 rounded-lg transition-all duration-200">
                    <ShieldAlert className="h-4 w-4" />
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => closeMenu(logout)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-red-500/20 border border-slate-700/50 hover:border-red-500/40 rounded-lg transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => closeMenu()} className="w-full text-center px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 rounded-lg transition-all duration-200">
                  Login
                </Link>
                <Link to="/register" onClick={() => closeMenu()} className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg shadow-lg shadow-blue-600/25 transition-all duration-200">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Background glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-20 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute top-1/2 -left-40 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-1/3 left-2/3 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Floating background icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Brain    className="absolute top-20 left-20 h-8 w-8 text-blue-500/20 animate-floatIcon"   style={{ animationDelay: '0s' }} />
        <Zap      className="absolute top-40 right-32 h-6 w-6 text-purple-500/20 animate-floatIcon" style={{ animationDelay: '1s' }} />
        <Star     className="absolute bottom-32 left-32 h-5 w-5 text-pink-500/20 animate-floatIcon" style={{ animationDelay: '2s' }} />
        <Sparkles className="absolute top-1/3 right-1/4 h-7 w-7 text-cyan-500/20 animate-floatIcon" style={{ animationDelay: '3s' }} />
        <BarChart3 className="absolute bottom-20 right-20 h-9 w-9 text-blue-500/15 animate-floatIcon" style={{ animationDelay: '4s' }} />
      </div>

      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0f1e] via-[#0f172a] to-[#0a0f1e] pt-44 pb-28 lg:pt-52 lg:pb-40">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-sm text-blue-300 font-medium mb-8 animate-fadeInUp">
              <Brain className="h-4 w-4 text-blue-400 animate-pulse" />
              AI-Powered Interview Prep
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-8 animate-fadeInUp stagger-1">
              Ace Every{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradientShift">
                Interview Question
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto animate-fadeInUp stagger-2 typewriter-effect">
              Practice with role-specific questions and get instant AI-powered feedback.
            </p>

            <div className="p-4 flex flex-col sm:flex-row gap-5 justify-center mb-20 animate-fadeInUp stagger-5">
              <button
                onClick={handleStartInterview}
                className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.35)] hover:scale-[1.03] hover:-translate-y-1 transition-all duration-500 flex items-center justify-center gap-3 ripple-btn magnetic-hover"
              >
                <Play className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                {user ? "Continue Interview Prep" : "Start Free Interview"}
                <ChevronRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </button>

              <Link
                to="/dashboard"
                className="px-10 py-5 bg-slate-800/70 backdrop-blur-md border border-slate-600/60 text-white font-bold text-lg rounded-2xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-500 flex items-center justify-center gap-2 group ripple-btn magnetic-hover"
              >
                <BarChart3 className="h-5 w-5 text-purple-400 group-hover:scale-90 group-hover:rotate-1 transition-all duration-300" />
                View Dashboard
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="py-20 bg-[#0a0f1e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} icon={stat.icon} value={stat.value} label={stat.label} delay={`stagger-${index + 1}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-24 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Why Choose AceRound?</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with proven interview techniques to help you succeed.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} delay={`stagger-${index + 1}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-24 bg-[#0a0f1e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Success Stories</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Join thousands of developers who landed their dream jobs with AceRound.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`bg-slate-800/50 rounded-xl shadow-lg p-8 border border-slate-700/50 animate-fadeInUp stagger-${index + 1} group cursor-pointer`}
              >
                <Quote className="h-8 w-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-slate-300 mb-6 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                    <span className="text-white font-bold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold group-hover:text-blue-300 transition-colors duration-300">{testimonial.name}</p>
                    <p className="text-slate-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-24 bg-gradient-to-br from-blue-900/30 to-purple-900/30 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-float" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <Lightbulb className="h-16 w-16 text-amber-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 animate-fadeInUp">
            Ready to Ace Your Interview?
          </h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto animate-fadeInUp stagger-1">
            Join thousands of developers who have transformed their interview skills with our AI-powered platform.
          </p>
          <button
            onClick={handleStartInterview}
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.35)] hover:scale-[1.03] hover:-translate-y-1 transition-all duration-500 animate-fadeInUp stagger-2 group"
          >
            <Play className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            {user ? "Continue Interview Prep" : "Start Your Free Interview"}
            <ChevronRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}