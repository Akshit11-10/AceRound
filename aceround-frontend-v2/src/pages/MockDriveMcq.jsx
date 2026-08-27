import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import Footer from '../components/Footer';
import { mockDriveApi } from '../services/mockDriveApi';
import { Loader2, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

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

  const loadQuestions = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    setAnswers({});
    try {
      const data = await mockDriveApi.startMcq(id);
      setQuestions(data.questions || []);
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

  const selectAnswer = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id] !== undefined);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const data = await mockDriveApi.submitMcq(id, answers);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Could not submit your answers.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 flex flex-col">
      <AppNavbar />
      <div className="h-16" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">MCQ Round</h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Answer all questions, then submit. You need 60% or higher to unlock the coding round.
          </p>
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
              onClick={handleSubmit}
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
              <div className="inline-flex items-center gap-2 px-5 py-3 bg-green-500/10 border border-green-500/30 text-green-300 rounded-xl text-sm">
                Coding round is unlocked — this screen will connect to it soon.
              </div>
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
