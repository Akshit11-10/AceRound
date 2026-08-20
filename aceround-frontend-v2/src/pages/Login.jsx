import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Eye, EyeOff, Sparkles, Brain, TrendingUp, ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import OAuthButtons from "../components/OAuthButtons";

const SHOWCASE_SLIDES = [
  { icon: Brain, title: 'AI-generated questions', text: 'Fresh, role-specific interview questions every single time — never the same set twice.' },
  { icon: TrendingUp, title: 'Track your growth', text: 'See your score trend, weak topics, and per-role performance at a glance.' },
  { icon: ShieldCheck, title: 'Practice with confidence', text: 'Timed mock interviews that mirror the real thing, with instant detailed feedback.' },
];

const OAUTH_ERROR_MESSAGES = {
  google_not_configured: "Google sign-in isn't set up yet. Please use email/password.",
  github_not_configured: "GitHub sign-in isn't set up yet. Please use email/password.",
  google_login_failed: "Google sign-in failed. Please try again or use email/password.",
  github_login_failed: "GitHub sign-in failed. Please try again or use email/password.",
  oauth_state_mismatch: "Sign-in was interrupted (often caused by switching between mobile/desktop site mid-login). Please try again without switching modes.",
};

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Surface a friendly message if we were redirected back here after a failed OAuth attempt.
  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) setError(OAUTH_ERROR_MESSAGES[oauthError] || "Sign-in failed. Please try again.");
  }, [searchParams]);

  // Rotate the showcase panel every few seconds — purely presentational.
  useEffect(() => {
    const id = setInterval(() => setSlideIndex((i) => (i + 1) % SHOWCASE_SLIDES.length), 2500);
    return () => clearInterval(id);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background decorative blobs — same style used across the app */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative w-full max-w-4xl grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl animate-fadeInUp">

        {/* Left showcase panel — hidden on mobile, adds life without changing the app's palette */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-700/40 via-slate-800/60 to-violet-800/40 backdrop-blur-xl border border-slate-700/50 border-r-0 rounded-l-2xl p-10 relative overflow-hidden">
          <div className="absolute top-10 right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl animate-float" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-indigo-300 font-medium mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              AceRound
            </div>
            <h2 className="text-3xl font-bold text-white leading-tight mb-3">
              Ace your next<br />technical interview
            </h2>
            <p className="text-slate-400 text-sm">Practice smarter with AI-powered mock interviews.</p>
          </div>

          {/* Rotating feature showcase */}
          <div className="relative min-h-[140px]">
            {SHOWCASE_SLIDES.map((slide, i) => {
              const Icon = slide.icon;
              return (
                <div
                  key={i}
                  className={`absolute inset-0 transition-all duration-700 ${
                    i === slideIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
                  }`}
                >
                  <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-indigo-300" />
                  </div>
                  <h3 className="text-white font-semibold mb-1.5">{slide.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{slide.text}</p>
                </div>
              );
            })}
          </div>

          <div className="relative flex gap-1.5">
            {SHOWCASE_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                aria-label={`Show slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === slideIndex ? 'w-8 bg-indigo-400' : 'w-1.5 bg-white/20 hover:bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right form panel */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl lg:rounded-l-none p-8 sm:p-10">
          <div className="mb-8 text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-600/20 border border-indigo-500/30 mb-4">
              <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to continue your journey</p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 animate-fadeInUp">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10A8 8 0 1 1 2 10a8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-slate-900/60 border border-slate-600/50 text-white placeholder-slate-500 rounded-lg pl-10 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition"
                />
                {formData.email.length > 0 && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {emailLooksValid ? (
                      <svg className="w-4 h-4 text-green-400 animate-scaleIn" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600 block" />
                    )}
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/60 border border-slate-600/50 text-white placeholder-slate-500 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-4 py-2.5 text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40 hover:scale-[1.02] group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-700/50" />
            <span className="text-xs text-slate-500">or continue with</span>
            <div className="flex-1 h-px bg-slate-700/50" />
          </div>

          <OAuthButtons />

          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}