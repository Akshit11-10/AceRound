import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import Footer from '../components/Footer';
import { mockDriveApi } from '../services/mockDriveApi';
import { Loader2, CheckCircle2, XCircle, ArrowRight, RotateCcw, Clock } from 'lucide-react';

// Round 1 of the Mock Drive pipeline. Generates MCQs based on the drive's
// source (role or resume), lets the user answer them, then submits for a
// pass/fail result against a cutoff. On pass, the drive unlocks the coding
// round (Phase 3 — not built yet, so we show a "coming soon" state for now).
const MockDriveMcq = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { score, passed, correctCount, totalQuestions }
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const hasSubmittedRef = useRef(false);
  const answersRef = useRef({});

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const submitAnswers = useCallback(async (finalAnswers) => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    clearInterval(timerRef.current);
    setSubmitting(true);
    setError('');
    try {
      const data = await mockDriveApi.submitMcq(id, finalAnswers);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Could not submit your answers.');
      hasSubmittedRef.current = false;
    } finally {
      setSubmitting(false);
    }
  }, [id]);

  const loadQuestions = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    setAnswers({});
    hasSubmittedRef.current = false;
    clearInterval(timerRef.current);
    try {
      const data = await mockDriveApi.startMcq(id);
      setQuestions(data.questions || []);
      setTimeLeft(data.timeLimitSeconds || (data.questions || []).length * 30);
    } catch (err) {
      setError(err.message || 'Could not load MCQ questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Countdown timer — auto-submits whatever is answered when time runs out.
  useEffect(() => {
    if (loading || result || questions.length === 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          submitAnswers(answersRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, result, questions.length]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const selectAnswer = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 flex flex-col">
      <AppNavbar />
      <div className="h-16" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14">
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">MCQ Round</h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Answer all questions, then submit. You need 70% or higher to unlock the coding round.
            </p>
          </div>
          {!loading && !result && questions.length > 0 && (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold shrink-0 ${
                timeLeft <= 60
                  ? 'border-red-500/50 bg-red-500/10 text-red-300'
                  : 'border-slate-700 bg-slate-900/60 text-slate-200'
              }`}
            >
              <Clock className="h-4 w-4" />
              {formatTime(timeLeft)}
            </div>
          )}
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 py-16 justify-center">
            <Loader2 className="h-5 w-5 animate-spin" /> Generating your questions...
          </div>
        )}

        {error && !loading && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {!loading && !result && questions.length > 0 && (
          <>
            <div className="space-y-5">
              {questions.map((q, qIndex) => (
                <div key={q.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6">
                  <p className="text-sm sm:text-base font-medium text-white mb-4">
                    {qIndex + 1}. {q.question}
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, optIndex) => (
                      <button
                        type="button"
                        key={optIndex}
                        onClick={() => selectAnswer(q.id, optIndex)}
                        className={`text-left px-4 py-2.5 rounded-xl border text-sm transition ${
                          answers[q.id] === optIndex
                            ? 'border-blue-500 bg-blue-500/10 text-white'
                            : 'border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => submitAnswers(answers)}
              disabled={!allAnswered || submitting}
              className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl transition"
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
              Submit Answers
            </button>
            {!allAnswered && (
              <p className="text-xs text-slate-500 mt-2">Answer every question to enable submit.</p>
            )}
          </>
        )}

        {result && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center">
            {result.passed ? (
              <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
            ) : (
              <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            )}
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
              {result.passed ? 'Round Passed!' : 'Not Quite — Try Again'}
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              You scored {result.score}% ({result.correctCount}/{result.totalQuestions} correct).
              Pass mark is {result.passMark}%.
            </p>

            {result.passed ? (
              <button
                type="button"
                onClick={() => navigate(`/mock-drive/${id}/coding`)}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-medium px-6 py-3 rounded-xl transition"
              >
                <ArrowRight className="h-4 w-4" />
                Continue to Coding Round
              </button>
            ) : (
              <button
                type="button"
                onClick={loadQuestions}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition"
              >
                <RotateCcw className="h-4 w-4" />
                Retry MCQ Round
              </button>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MockDriveMcq;
