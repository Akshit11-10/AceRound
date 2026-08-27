import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import Footer from '../components/Footer';
import { questionApi } from '../services/interviewApi';
import { mockDriveApi } from '../services/mockDriveApi';
import { Loader2, ArrowRight, ListChecks, Code2, Mic } from 'lucide-react';

// Entry point #1 for the Mock Drive pipeline — pick a target role, then the
// system generates role-based MCQs, a DSA coding round, and a role-based AI
// interview. Kept on its own route/page (separate from resume upload) so
// each entry method can be explained clearly on its own.
const MockDriveRole = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('');
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await questionApi.roles();
        if (!cancelled) setRoles(data.roles || []);
      } catch {
        if (!cancelled) setRoles([]);
      } finally {
        if (!cancelled) setRolesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleStart = async () => {
    setError('');
    if (!selectedRole) {
      setError('Please select a role to continue.');
      return;
    }
    setStarting(true);
    try {
      const data = await mockDriveApi.start({ source: 'role', role: selectedRole });
      navigate(`/dashboard?driveId=${data.drive.id}`);
    } catch (err) {
      setError(err.message || 'Could not start the mock drive. Please try again.');
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 flex flex-col">
      <AppNavbar />
      <div className="h-16" />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            Start a Mock Drive — by Role
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Pick the role you're preparing for. We'll build the entire drive around it —
            role-based MCQs first, then a short DSA coding round, and finally a live AI
            interview that asks questions relevant to that role.
          </p>
        </div>

        {/* What happens next — 3 step preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 sm:mb-10">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <ListChecks className="h-5 w-5 text-blue-400 mb-2" />
            <p className="text-sm font-semibold text-white">1. MCQ Round</p>
            <p className="text-xs text-slate-400 mt-1">Role-based questions with a pass cutoff.</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <Code2 className="h-5 w-5 text-purple-400 mb-2" />
            <p className="text-sm font-semibold text-white">2. Coding Round</p>
            <p className="text-xs text-slate-400 mt-1">A few basic DSA problems (arrays/strings).</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <Mic className="h-5 w-5 text-pink-400 mb-2" />
            <p className="text-sm font-semibold text-white">3. AI Interview</p>
            <p className="text-xs text-slate-400 mt-1">A short live voice interview for this role.</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Select your target role</h2>
          {rolesLoading ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading roles...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roles.map((roleName) => (
                <button
                  type="button"
                  key={roleName}
                  onClick={() => setSelectedRole(roleName)}
                  className={`text-left px-4 py-3 rounded-xl border text-sm sm:text-base transition ${
                    selectedRole === roleName
                      ? 'border-blue-500 bg-blue-500/10 text-white'
                      : 'border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  {roleName}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleStart}
          disabled={starting}
          className="mt-6 sm:mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl transition"
        >
          {starting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
          Start Mock Drive
        </button>
      </main>

      <Footer />
    </div>
  );
};

export default MockDriveRole;
