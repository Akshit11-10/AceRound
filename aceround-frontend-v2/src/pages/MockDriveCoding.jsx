import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import Footer from '../components/Footer';
import { mockDriveApi } from '../services/mockDriveApi';
import { Loader2, CheckCircle2, XCircle, PlayCircle, ArrowRight } from 'lucide-react';

// Round 2 of the Mock Drive pipeline — a fixed set of basic DSA (Array/String)
// problems, same for every drive regardless of role or resume. Code runs on
// the backend via Judge0. Needs 2+ solved (out of the total) to unlock the
// AI Interview round.
const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript (Node.js)' },
  { value: 'python', label: 'Python 3' },
];

const MockDriveCoding = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  const [passCount, setPassCount] = useState(2);
  const [activeIndex, setActiveIndex] = useState(0);
  const [language, setLanguage] = useState('javascript');
  const [codeByProblem, setCodeByProblem] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await mockDriveApi.getCoding(id);
        if (cancelled) return;
        setProblems(data.problems || []);
        setPassCount(data.passCount ?? 2);
        const initialCode = {};
        (data.problems || []).forEach((p) => {
          initialCode[p.id] = p.starterCode?.javascript || '';
        });
        setCodeByProblem(initialCode);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load coding problems.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // When switching language, swap in that language's starter code for any
  // problem the user hasn't already edited away from the previous starter.
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCodeByProblem((prev) => {
      const next = { ...prev };
      problems.forEach((p) => {
        const wasDefaultForOtherLang = Object.values(p.starterCode || {}).includes(prev[p.id]);
        if (wasDefaultForOtherLang) {
          next[p.id] = p.starterCode?.[newLang] || '';
        }
      });
      return next;
    });
  };

  const updateCode = (problemId, value) => {
    setCodeByProblem((prev) => ({ ...prev, [problemId]: value }));
  };

  const handleSubmitAll = async () => {
    setSubmitting(true);
    setError('');
    try {
      const submissions = problems.map((p) => ({
        problemId: p.id,
        language,
        sourceCode: codeByProblem[p.id] || '',
      }));
      const data = await mockDriveApi.submitCoding(id, submissions);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Could not run/submit your code.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] text-slate-100 flex flex-col">
        <AppNavbar />
        <div className="h-16" />
        <div className="flex-1 flex items-center justify-center gap-2 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading coding problems...
        </div>
        <Footer />
      </div>
    );
  }

  const activeProblem = problems[activeIndex];

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 flex flex-col">
      <AppNavbar />
      <div className="h-16" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14">
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Coding Round</h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Solve at least {passCount} of {problems.length} problems to unlock the AI interview.
              Read input from stdin, print your answer to stdout.
            </p>
          </div>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {!result && (
          <>
            {/* Problem tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {problems.map((p, index) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setActiveIndex(index)}
                  className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeIndex === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {index + 1}. {p.title}
                </button>
              ))}
            </div>

            {activeProblem && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6">
                  <h2 className="text-lg font-bold text-white mb-3">{activeProblem.title}</h2>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {activeProblem.description}
                  </p>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs font-mono">
                    <p className="text-slate-500 mb-1">Example input:</p>
                    <pre className="text-slate-300 whitespace-pre-wrap mb-2">
                      {activeProblem.example?.input}
                    </pre>
                    <p className="text-slate-500 mb-1">Example output:</p>
                    <pre className="text-slate-300 whitespace-pre-wrap">
                      {activeProblem.example?.output}
                    </pre>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 sm:p-4">
                  <textarea
                    value={codeByProblem[activeProblem.id] || ''}
                    onChange={(e) => updateCode(activeProblem.id, e.target.value)}
                    spellCheck={false}
                    className="w-full h-64 sm:h-80 bg-slate-950 text-slate-100 font-mono text-sm rounded-lg p-4 border border-slate-800 focus:outline-none focus:border-blue-500 resize-y"
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmitAll}
              disabled={submitting}
              className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl transition"
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <PlayCircle className="h-5 w-5" />}
              Run &amp; Submit All
            </button>
            <p className="text-xs text-slate-500 mt-2">
              This runs all {problems.length} problems' code against hidden test cases at once.
            </p>
          </>
        )}

        {result && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="text-center mb-6">
              {result.passed ? (
                <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
              ) : (
                <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              )}
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                {result.passed ? 'Round Passed!' : 'Not Quite — Try Again'}
              </h2>
              <p className="text-slate-400 text-sm">
                Solved {result.solvedCount}/{result.totalCount} (need {result.passCount}+).
              </p>
            </div>

            <div className="space-y-2 mb-6">
              {result.results.map((r) => {
                const problem = problems.find((p) => p.id === r.problemId);
                return (
                  <div
                    key={r.problemId}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm ${
                      r.solved
                        ? 'border-green-500/30 bg-green-500/5 text-green-300'
                        : 'border-red-500/30 bg-red-500/5 text-red-300'
                    }`}
                  >
                    <span>{problem?.title || r.problemId}</span>
                    {r.solved ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {result.passed ? (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-5 py-3 bg-green-500/10 border border-green-500/30 text-green-300 rounded-xl text-sm">
                  AI Interview round is unlocked — this screen will connect to it soon.
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setResult(null)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition"
              >
                <ArrowRight className="h-4 w-4" />
                Back to Problems
              </button>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MockDriveCoding;
