import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import Footer from '../components/Footer';
import { mockDriveApi } from '../services/mockDriveApi';
import { Loader2, CheckCircle2, XCircle, PlayCircle, Send, Clock } from 'lucide-react';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
];

// Round 2 of the Mock Drive pipeline — a fixed set of basic DSA (Array/String)
// problems, same for every drive. Each problem can be Run (quick check
// against the visible example) or Submitted (full grading, persisted)
// independently and in any order. Needs CODING_PASS_COUNT solved to unlock
// the AI Interview round. A single overall timer covers all problems.
const MockDriveCoding = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  const [passCount, setPassCount] = useState(2);
  const [activeIndex, setActiveIndex] = useState(0);
  const [languageByProblem, setLanguageByProblem] = useState({});
  const [codeByProblem, setCodeByProblem] = useState({});
  const [solvedByProblem, setSolvedByProblem] = useState({});
  const [runResultByProblem, setRunResultByProblem] = useState({});
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const timerRef = useRef(null);

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
        setTimeLeft(data.timeLimitSeconds || (data.problems || []).length * 1200);

        const initialLang = {};
        const initialCode = {};
        const initialSolved = {};
        (data.problems || []).forEach((p) => {
          initialLang[p.id] = 'javascript';
          initialCode[p.id] = p.starterCode?.javascript || '';
          if (data.progress?.[p.id]?.solved) initialSolved[p.id] = true;
        });
        setLanguageByProblem(initialLang);
        setCodeByProblem(initialCode);
        setSolvedByProblem(initialSolved);
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

  useEffect(() => {
    if (loading || timeUp || problems.length === 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [loading, timeUp, problems.length]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const activeProblem = problems[activeIndex];
  const activeLanguage = activeProblem ? languageByProblem[activeProblem.id] || 'javascript' : 'javascript';

  const handleLanguageChange = (problemId, newLang) => {
    setLanguageByProblem((prev) => ({ ...prev, [problemId]: newLang }));
    setCodeByProblem((prev) => {
      const problem = problems.find((p) => p.id === problemId);
      const wasStarter = Object.values(problem?.starterCode || {}).includes(prev[problemId]);
      if (wasStarter) {
        return { ...prev, [problemId]: problem?.starterCode?.[newLang] || '' };
      }
      return prev;
    });
  };

  const updateCode = (problemId, value) => {
    setCodeByProblem((prev) => ({ ...prev, [problemId]: value }));
  };

  const handleRun = useCallback(async () => {
    if (!activeProblem) return;
    setRunning(true);
    setError('');
    try {
      const data = await mockDriveApi.runCoding(id, {
        problemId: activeProblem.id,
        language: activeLanguage,
        sourceCode: codeByProblem[activeProblem.id] || '',
      });
      setRunResultByProblem((prev) => ({ ...prev, [activeProblem.id]: data }));
    } catch (err) {
      setError(err.message || 'Could not run your code.');
    } finally {
      setRunning(false);
    }
  }, [id, activeProblem, activeLanguage, codeByProblem]);

  const handleSubmit = useCallback(async () => {
    if (!activeProblem) return;
    setSubmitting(true);
    setError('');
    try {
      const data = await mockDriveApi.submitCoding(id, {
        problemId: activeProblem.id,
        language: activeLanguage,
        sourceCode: codeByProblem[activeProblem.id] || '',
      });
      setSolvedByProblem((prev) => ({ ...prev, [activeProblem.id]: data.passed }));
      setRunResultByProblem((prev) => ({
        ...prev,
        [activeProblem.id]: { passed: data.passed, lineResults: data.lineResults, error: data.error },
      }));
    } catch (err) {
      setError(err.message || 'Could not submit your code.');
    } finally {
      setSubmitting(false);
    }
  }, [id, activeProblem, activeLanguage, codeByProblem]);

  const solvedCount = Object.values(solvedByProblem).filter(Boolean).length;
  const roundPassed = solvedCount >= passCount;

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

  const activeRunResult = activeProblem ? runResultByProblem[activeProblem.id] : null;

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 flex flex-col">
      <AppNavbar />
      <div className="h-16" />

      <div className="sticky top-16 z-30 px-4 sm:px-6 py-3 bg-[#0a0f1e]/95 backdrop-blur-xl border-b border-slate-800/60 flex items-center justify-between max-w-5xl mx-auto w-full">
        <span className="text-sm text-slate-400">
          Solved {solvedCount}/{problems.length} · need {passCount}+ to pass
        </span>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold shrink-0 ${
            timeUp || timeLeft <= 120
              ? 'border-red-500/50 bg-red-500/10 text-red-300'
              : 'border-slate-700 bg-slate-900/60 text-slate-200'
          }`}
        >
          <Clock className="h-4 w-4" />
          {timeUp ? "Time's up" : formatTime(timeLeft)}
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Coding Round</h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Solve any problem in any order. Run to test against the example, Submit to grade for real.
          </p>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {roundPassed && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-green-500/10 border border-green-500/30 text-green-300 rounded-xl text-sm">
              <CheckCircle2 className="h-4 w-4" />
              Round passed! AI Interview round is unlocked — this screen will connect to it soon.
            </div>
          </div>
        )}

        {timeUp && !roundPassed && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-sm">
              Time's up — you solved {solvedCount}/{problems.length}. Start a new drive to try again.
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {problems.map((p, index) => (
            <button
              type="button"
              key={p.id}
              onClick={() => setActiveIndex(index)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeIndex === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {solvedByProblem[p.id] && <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />}
              {index + 1}. {p.title}
            </button>
          ))}
        </div>

        {activeProblem && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-white">{activeProblem.title}</h2>
                {solvedByProblem[activeProblem.id] && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-400 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Solved
                  </span>
                )}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">{activeProblem.description}</p>
              <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs font-mono">
                <p className="text-slate-500 mb-1">Example input:</p>
                <pre className="text-slate-300 whitespace-pre-wrap mb-2">{activeProblem.example?.input}</pre>
                <p className="text-slate-500 mb-1">Example output:</p>
                <pre className="text-slate-300 whitespace-pre-wrap">{activeProblem.example?.output}</pre>
              </div>

              {activeRunResult && (
                <div
                  className={`mt-4 rounded-lg border p-3 text-xs ${
                    activeRunResult.passed
                      ? 'border-green-500/30 bg-green-500/5 text-green-300'
                      : 'border-red-500/30 bg-red-500/5 text-red-300'
                  }`}
                >
                  <p className="font-semibold mb-1 flex items-center gap-1.5">
                    {activeRunResult.passed ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5" />
                    )}
                    {activeRunResult.passed ? 'All test cases passed' : 'Some test cases failed'}
                  </p>
                  {activeRunResult.error && (
                    <pre className="whitespace-pre-wrap text-red-300/90 mt-1">{activeRunResult.error}</pre>
                  )}
                  {!activeRunResult.error && activeRunResult.lineResults && (
                    <div className="space-y-1 mt-1 font-mono">
                      {activeRunResult.lineResults.map((r, i) => (
                        <div key={i} className={r.passed ? 'text-green-300' : 'text-red-300'}>
                          Case {i + 1}: expected {r.expected}, got {r.actual || '(nothing)'} {r.passed ? '✓' : '✗'}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 sm:p-4">
              <div className="flex items-center justify-end mb-2">
                <select
                  value={activeLanguage}
                  onChange={(e) => handleLanguageChange(activeProblem.id, e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-1.5"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                value={codeByProblem[activeProblem.id] || ''}
                onChange={(e) => updateCode(activeProblem.id, e.target.value)}
                spellCheck={false}
                disabled={timeUp}
                className="w-full h-64 sm:h-80 bg-slate-950 text-slate-100 font-mono text-sm rounded-lg p-4 border border-slate-800 focus:outline-none focus:border-blue-500 resize-y disabled:opacity-60"
              />

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleRun}
                  disabled={running || submitting || timeUp}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-xl transition text-sm"
                >
                  {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
                  Run
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={running || submitting || timeUp}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-xl transition text-sm"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MockDriveCoding;
