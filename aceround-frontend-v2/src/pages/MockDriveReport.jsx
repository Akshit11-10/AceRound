import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import Footer from '../components/Footer';
import { mockDriveApi } from '../services/mockDriveApi';
import {
  Loader2, CheckCircle2, XCircle, ListChecks, Code2, Mic,
  TrendingUp, TrendingDown, Home,
} from 'lucide-react';

// Combined summary of all 3 rounds for one Mock Drive — MCQ, Coding, and
// AI Interview results in one place, plus an overall verdict and a short
// strengths/weaknesses read-out (computed from the stored results, no
// extra AI call needed).
const MockDriveReport = () => {
  const { id } = useParams();

  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await mockDriveApi.get(id);
        if (!cancelled) setDrive(data.drive);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load this report.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] text-slate-100 flex flex-col">
        <AppNavbar />
        <div className="h-16" />
        <div className="flex-1 flex items-center justify-center gap-2 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading report...
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !drive) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] text-slate-100 flex flex-col">
        <AppNavbar />
        <div className="h-16" />
        <div className="flex-1 flex items-center justify-center text-red-400 text-sm px-4 text-center">
          {error || 'Report not found.'}
        </div>
        <Footer />
      </div>
    );
  }

  const mcq = drive.mcqResult || {};
  const coding = drive.codingResult || {};
  const interview = drive.interviewResult || {};

  const roundsCleared = [mcq.passed, coding.passed, interview.score != null].filter(Boolean).length;
  const allCleared = mcq.passed && coding.passed && interview.score != null;

  const strengths = [];
  const weaknesses = [];

  if (mcq.passed) strengths.push(`Scored ${mcq.score}% in the MCQ round`);
  else if (mcq.score != null) weaknesses.push(`MCQ score was ${mcq.score}% (below the 70% pass mark)`);

  if (coding.passed) strengths.push(`Solved ${coding.solvedCount}/${coding.totalCount} coding problems`);
  else if (coding.solvedCount != null) weaknesses.push(`Only solved ${coding.solvedCount}/${coding.totalCount} coding problems`);

  if (interview.score != null) {
    if (interview.score >= 70) strengths.push(`Strong interview performance (${interview.score}/100)`);
    else weaknesses.push(`Interview score was ${interview.score}/100 — room to improve communication/depth`);
  }

  if (mcq.weakTopics && mcq.weakTopics.length > 0) {
    weaknesses.push(`Struggled with: ${mcq.weakTopics.slice(0, 2).join(', ')}`);
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 flex flex-col">
      <AppNavbar />
      <div className="h-16" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14">
        <div className="mb-8 text-center">
          {allCleared ? (
            <CheckCircle2 className="h-14 w-14 text-green-400 mx-auto mb-4" />
          ) : (
            <TrendingUp className="h-14 w-14 text-blue-400 mx-auto mb-4" />
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Drive Report Card</h1>
          <p className="text-slate-400 text-sm">
            {roundsCleared}/3 rounds cleared · {drive.source === 'resume' ? 'Resume-based' : `Role: ${drive.role}`}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ListChecks className="h-6 w-6 text-blue-400 shrink-0" />
              <div>
                <p className="font-semibold text-white">MCQ Round</p>
                <p className="text-xs text-slate-400">
                  {mcq.score != null ? `Score: ${mcq.score}%` : 'Not attempted'}
                </p>
              </div>
            </div>
            {mcq.passed ? (
              <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-slate-600 shrink-0" />
            )}
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Code2 className="h-6 w-6 text-purple-400 shrink-0" />
              <div>
                <p className="font-semibold text-white">Coding Round</p>
                <p className="text-xs text-slate-400">
                  {coding.solvedCount != null ? `Solved ${coding.solvedCount}/${coding.totalCount}` : 'Not attempted'}
                </p>
              </div>
            </div>
            {coding.passed ? (
              <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-slate-600 shrink-0" />
            )}
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Mic className="h-6 w-6 text-pink-400 shrink-0" />
              <div>
                <p className="font-semibold text-white">AI Interview</p>
                <p className="text-xs text-slate-400">
                  {interview.score != null ? `Score: ${interview.score}/100` : 'Not attempted'}
                </p>
              </div>
            </div>
            {interview.score != null ? (
              <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-slate-600 shrink-0" />
            )}
          </div>
        </div>

        {interview.feedback && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 mb-6">
            <p className="text-sm font-semibold text-white mb-2">Interview Feedback</p>
            <p className="text-sm text-slate-300 leading-relaxed">{interview.feedback}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {strengths.length > 0 && (
            <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5">
              <p className="text-sm font-semibold text-green-300 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Strengths
              </p>
              <ul className="space-y-1.5">
                {strengths.map((s, i) => (
                  <li key={i} className="text-xs text-slate-300">• {s}</li>
                ))}
              </ul>
            </div>
          )}
          {weaknesses.length > 0 && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
              <p className="text-sm font-semibold text-amber-300 mb-3 flex items-center gap-2">
                <TrendingDown className="h-4 w-4" /> Areas to Improve
              </p>
              <ul className="space-y-1.5">
                {weaknesses.map((w, i) => (
                  <li key={i} className="text-xs text-slate-300">• {w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition text-sm"
        >
          <Home className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </main>

      <Footer />
    </div>
  );
};

export default MockDriveReport;
