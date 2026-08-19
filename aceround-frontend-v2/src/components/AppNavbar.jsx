import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Brain, LogOut, User, Menu, X, Settings as SettingsIcon, ShieldAlert } from "lucide-react";

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = (action = null) => {
    setMenuOpen(false);
    if (action) action();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1e]/80 backdrop-blur-xl border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight group-hover:text-blue-300 transition-colors duration-200">
            AceRound
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <>
              
              <Link to="/" className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-blue-800/60 rounded-lg transition-all duration-200">
                Home
              </Link>
              <Link to="/interview" className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-blue-800/60 rounded-lg transition-all duration-200">
                Interview
              </Link>
              <Link to="/dashboard" className="px-4 py-2 text-sm font-semibold text-white  hover:bg-blue-600/40  border-blue-500/30 rounded-lg transition-all duration-200">
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-purple-300 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 rounded-lg transition-all duration-200">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}
              <Link
                to="/settings"
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 border border-slate-700/50 rounded-lg hover:border-blue-500/40 hover:bg-slate-700/60 transition-all duration-200"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </div>
                <span className="text-slate-300 text-sm font-medium">{user.name}</span>
              </Link>
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
              <Link to="/" onClick={() => closeMenu()} className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 rounded-lg transition-all duration-200">
                Home
              </Link>
              <Link to="/dashboard" onClick={() => closeMenu()} className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 rounded-lg transition-all duration-200">
                Dashboard
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
              <Link to="/register" onClick={() => closeMenu()} className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg shadow-blue-600/25 transition-all duration-200">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
