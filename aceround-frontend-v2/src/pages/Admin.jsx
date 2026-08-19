import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Footer from '../components/Footer';
import AppNavbar from '../components/AppNavbar';
import { adminApi } from '../services/interviewApi';
import { Users, ClipboardList, TrendingUp, UserPlus, Loader2, ShieldAlert, Sparkles } from 'lucide-react';

function StatBox({ icon: Icon, label, value, color }) {
  const colorMap = {
    blue: 'bg-blue-900/30 border-blue-800/50 text-blue-400',
    purple: 'bg-purple-900/30 border-purple-800/50 text-purple-400',
    green: 'bg-green-900/30 border-green-800/50 text-green-400',
    orange: 'bg-orange-900/30 border-orange-800/50 text-orange-400',
  };
  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${colorMap[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400 mt-1">{label}</p>
    </div>
  );
}

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    let cancelled = false;
    (async () => {
      try {
        const [statsData, usersData] = await Promise.all([adminApi.stats(), adminApi.users(1, 10)]);
        if (cancelled) return;
        setStats(statsData.stats);
        setUsers(usersData.users);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load admin data.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  // Non-admins never see this page's content.
  if (user && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] py-12">
      <AppNavbar />
      <div className="h-16" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
            <ShieldAlert className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400">Platform-wide usage and performance overview.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-slate-400 py-12 justify-center">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading admin data...
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-800 rounded-xl p-4 text-sm text-red-300">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatBox icon={Users} label="Total Users" value={stats.totalUsers} color="blue" />
              <StatBox icon={ClipboardList} label="Completed Interviews" value={stats.totalInterviews} color="purple" />
              <StatBox icon={TrendingUp} label="Platform Avg Score" value={`${stats.avgScore}%`} color="green" />
              <StatBox icon={UserPlus} label="New Users (7d)" value={stats.newUsersThisWeek} color="orange" />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Role breakdown */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10">
                <h2 className="text-lg font-semibold text-white mb-5">Most Practiced Roles</h2>
                {stats.roleBreakdown.length === 0 ? (
                  <p className="text-sm text-slate-400">No completed interviews yet.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.roleBreakdown.map((r) => (
                      <div key={r.role} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{r.role}</span>
                        <span className="text-slate-400">{r.count} attempts · <span className="text-white font-medium">{r.avgScore}% avg</span></span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Question source breakdown */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10">
                <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-400" /> AI vs Static Question Source
                </h2>
                {stats.sourceBreakdown.length === 0 ? (
                  <p className="text-sm text-slate-400">No completed interviews yet.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.sourceBreakdown.map((s) => (
                      <div key={s.source} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300 capitalize">{s.source === 'ai' ? 'AI-generated' : 'Static fallback bank'}</span>
                        <span className="text-white font-medium">{s.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent users */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/10 mt-8">
              <h2 className="text-lg font-semibold text-white mb-5">Recent Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b border-white/10">
                      <th className="pb-3 pr-4">Name</th>
                      <th className="pb-3 pr-4">Email</th>
                      <th className="pb-3 pr-4">Signed up via</th>
                      <th className="pb-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-white/5">
                        <td className="py-3 pr-4 text-white">{u.name}</td>
                        <td className="py-3 pr-4 text-slate-400">{u.email}</td>
                        <td className="py-3 pr-4 text-slate-400 capitalize">{u.authProvider}</td>
                        <td className="py-3 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
