import {
  Brain,
  Heart,
  Shield,
  Zap,
  Globe,
  Link2,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { label: "Start Interview", to: "/interview" },
      { label: "Dashboard", to: "/dashboard" },
      { label: "Results", to: "/results" },
      { label: "Home", to: "/" },
    ],
    Company: [
      { label: "About", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Contact", href: "#" },
    ],
  };

  return (
    <footer className="relative bg-[#040810] border-t border-slate-800/60 overflow-hidden">
      <div className="h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-80" />

<div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-500/4 rounded-full blur-[140px] pointer-events-none animate-breathe" />
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-500/3 rounded-full blur-[120px] pointer-events-none animate-float" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 mb-14">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-5 w-fit">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-blue-500/20 hover:scale-110 hover:shadow-blue-500/40 transition-all duration-300">
                <Brain className="h-6 w-6 text-white" />
              </div>

              <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AceRound
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              Master your interviews with AI-powered practice sessions. Get
              instant feedback, track your progress, and ace your dream job with
              confidence.
            </p>

            <div className="flex items-center gap-3">
              {[
                { icon: Globe, label: "Twitter", href: "#" },
                { icon: Link2, label: "LinkedIn", href: "#" },
              ].map((s, i) => (
                <a key={i} href={s.href} aria-label={s.label} className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/50 hover:bg-slate-700 hover:scale-110 transition-all duration-300">
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([heading, items]) => (
            <div key={heading} className="lg:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 mb-5">
                {heading}
              </h4>

              <ul className="space-y-3">
                {items.map((item, i) => (
                  <li key={i}>
                    {item.to ? (
                      <Link to={item.to} className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group">
                        <span className="w-0 h-px bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-3 transition-all duration-300" />
                        {item.label}
                      </Link>
                    ) : (
                      <a href={item.href} className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group">
                        <span className="w-0 h-px bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-3 transition-all duration-300" />
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 mb-5">
              Why AceRound
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Zap, label: "Instant AI Feedback" },
                { icon: Shield, label: "1500+ Verified Qs" },
                { icon: Globe, label: "50+ Interview Roles" },
                { icon: Heart, label: "100% Free Forever" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-blue-500/30 hover:bg-slate-700/50 hover:scale-[1.02] transition-all duration-300">
                  <b.icon className="h-4 w-4 text-blue-400 shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} AceRound — All rights reserved.
          </p>

          <p className="text-xs text-slate-600 flex items-center">
            Build for developers
            <Heart className="inine h-3 w-3 text-red-500 mx-1" />
            Any time and Anywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;