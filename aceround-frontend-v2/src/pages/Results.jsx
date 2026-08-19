import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Footer from '../components/Footer';
import { interviewApi } from '../services/interviewApi';
import {
  Trophy, CheckCircle, XCircle, TrendingUp, RotateCcw,
  ChevronDown, ChevronUp, Brain, ArrowLeft, FileText, Eye, Loader2,
} from 'lucide-react';

// Score badge style based on accuracy percentage
function getScoreBadge(pct) {
  if (pct >= 90) return { bg: 'bg-green-900/30', border: 'border-green-700' };
  if (pct >= 70) return { bg: 'bg-blue-900/30', border: 'border-blue-700' };
  if (pct >= 50) return { bg: 'bg-orange-900/30', border: 'border-orange-700' };
  return { bg: 'bg-red-900/30', border: 'border-red-700' };
}

// Reusable question card used in both current results and past reviews
function QuestionCard({ question, index, userAnswer, isExpanded, onToggle }) {
  const isAnswered = userAnswer !== undefined && userAnswer !== null;
  const isCorrect = isAnswered && userAnswer === question.correctAnswer;

  const cardBg = isAnswered
    ? (isCorrect ? 'border-green-800 bg-green-900/20' : 'border-red-800 bg-red-900/20')
    : 'border-slate-600 bg-slate-800/30';

  const iconBg = isAnswered
    ? (isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
    : 'bg-slate-600 text-white';

  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-300 hover:border-blue-500/50 ${cardBg}`}>
      <div className="p-4 flex items-start gap-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          {isAnswered
            ? (isCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />)
            : <span className="text-sm font-bold">{index + 1}</span>
          }
        </div>
        <div className="flex-1">
          <p className="text-white font-medium">{question.question}</p>
          {isAnswered && (
            <p className={`text-sm mt-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              Your answer: {question.options[userAnswer]}
            </p>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 pl-12">
        <button
          onClick={() => onToggle(question.id)}
          className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300 group"
        >
          <Brain className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
          {isExpanded ? 'Hide' : 'Show'} AI Answer
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {isExpanded && (
          <div className="mt-4 p-4 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl border border-blue-800/50 animate-fadeInUp">
            <p className="text-slate-200 mb-2">
              <span className="font-medium">Correct Option: </span>
              <span className="text-green-400 font-medium">{question.options[question.correctAnswer]}</span>
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Score summary box used in both the current-result view and past reviews
function ScoreSummary({ score, correct, total, showTrophy = false }) {
  const wrong = total - correct;
  const pct = Math.round((correct / total) * 100);
  const badge = showTrophy ? getScoreBadge(pct) : null;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="relative">
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
          <div className="text-center">
            <p className="text-4xl font-bold text-white">{score}%</p>
            <p className="text-sm text-blue-100">Score</p>
          </div>
        </div>
        {showTrophy && badge && (
          <div className={`absolute -bottom-2 -right-2 w-16 h-16 rounded-full ${badge.bg} flex items-center justify-center shadow-lg border ${badge.border}`}>
            <Trophy className="h-8 w-8 text-white" />
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6 text-center">
        <div className="p-4 bg-green-900/30 rounded-xl border border-green-800/50">
          <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{correct}</p>
          <p className="text-sm text-slate-400">Correct</p>
        </div>
        <div className="p-4 bg-red-900/30 rounded-xl border border-red-800/50">
          <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{wrong}</p>
          <p className="text-sm text-slate-400">Wrong</p>
        </div>
        <div className="p-4 bg-blue-900/30 rounded-xl border border-blue-800/50">
          <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{pct}%</p>
          <p className="text-sm text-slate-400">Accuracy</p>
        </div>
      </div>
    </div>
  );
}

const Results = () => {
  const location = useLocation();
  // location.state is the detailed result returned by POST /api/interviews/:id/submit
  const { role, questions, userAnswers: answers, timeSpent } = location.state || {};
  const { user } = useAuth();

  const [expandedCards, setExpandedCards] = useState({});
  const [expandedReviewCards, setExpandedReviewCards] = useState({});
  const [detailedResults, setDetailedResults] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewLoadingId, setReviewLoadingId] = useState(null);
  const [reviewError, setReviewError] = useState('');

  // Load this user's past completed interviews (summary list) from the backend.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await interviewApi.list();
        if (!cancelled) setDetailedResults(data.results || []);
      } catch (err) {
        console.error('Failed to load past results:', err);
      } finally {
        if (!cancelled) setLoadingReviews(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  // Fetch the full question/answer detail for one past interview on demand,
  // since the summary list above intentionally doesn't include it.
  const openReview = async (id) => {
    setReviewError('');
    setReviewLoadingId(id);
    try {
      const { result } = await interviewApi.get(id);
      setSelectedReview(result);
    } catch (err) {
      setReviewError(err.message || 'Failed to load that review.');
    } finally {
      setReviewLoadingId(null);
    }
  };

  // Show message if no interview data passed AND no past history at all.
  const hasJustCompleted = Boolean(questions && answers);
  if (!hasJustCompleted && !loadingReviews && detailedResults.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center py-12">
        <div className="text-center animate-fadeInUp">
          <h1 className="text-2xl font-bold text-white mb-4">No Interview Data Found</h1>
          <p className="text-slate-400 mb-6">Complete an interview first to see your results.</p>
          <Link to="/interview" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Start Interview
          </Link>
        </div>
      </div>
    );
  }

  // Count correct answers (ScoreSummary derives "wrong" as total - correct itself)
  // Only meaningful when we actually have a just-completed interview in state.
  let correctCount = 0;
  if (hasJustCompleted) {
    questions.forEach((q) => {
      const answer = answers[q.id];
      if (answer !== undefined && answer !== '' && answer === q.correctAnswer) correctCount++;
    });
  }

  const accuracy = hasJustCompleted ? Math.round((correctCount / questions.length) * 100) : 0;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const toggleCard = (id) => setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleReviewCard = (id) => setExpandedReviewCards((prev) => ({ ...prev, [id]: !prev[id] }));

  // Detailed past review view
  if (selectedReview) {
    const reviewCorrect = selectedReview.questions.reduce((count, q) => {
      return selectedReview.userAnswers[q.id] === q.correctAnswer ? count + 1 : count;
    }, 0);

    return (
      <div className="min-h-screen bg-[#0f172a] py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-8 animate-fadeInUp">
            <button onClick={() => setSelectedReview(null)} className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" /> Back to Results
            </button>
            <h1 className="text-3xl font-bold text-white">Detailed Review</h1>
            <p className="text-slate-400 mt-2">{selectedReview.role} • {selectedReview.date}</p>
          </div>

          <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-slate-700 animate-fadeInUp stagger-1">
            <ScoreSummary
              score={selectedReview.score}
              correct={reviewCorrect}
              total={selectedReview.questions.length}
            />
          </div>

          <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-slate-700 animate-fadeInUp stagger-2">
            <h2 className="text-2xl font-bold text-white mb-6">Question Analysis</h2>
            <div className="space-y-4">
              {selectedReview.questions.map((q, index) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={index}
                  userAnswer={selectedReview.userAnswers[q.id]}
                  isExpanded={expandedReviewCards[q.id]}
                  onToggle={toggleReviewCard}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-center animate-fadeInUp stagger-3">
            <button onClick={() => setSelectedReview(null)} className="flex items-center gap-2 px-8 py-4 bg-[#111827] text-white font-semibold rounded-xl shadow-md hover:shadow-lg border border-slate-700 hover:border-blue-500 transition-all">
              <ArrowLeft className="h-5 w-5" /> Back to Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main results view
  return (
    <div className="min-h-screen bg-[#0f172a] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8 animate-fadeInUp">
          <Link to={hasJustCompleted ? "/interview" : "/dashboard"} className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" /> {hasJustCompleted ? 'Back to Interview' : 'Back to Dashboard'}
          </Link>
          <h1 className="text-3xl font-bold text-white">{hasJustCompleted ? 'Interview Results' : 'Your Interview History'}</h1>
          {hasJustCompleted && <p className="text-slate-400 mt-2">{role} • {formatTime(timeSpent || 300)}</p>}
        </div>

        {hasJustCompleted && (
          <>
            <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-slate-700/50 animate-fadeInUp stagger-1">
              <ScoreSummary score={accuracy} correct={correctCount} total={questions.length} showTrophy />
            </div>

            <div className="bg-[#111827] rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-slate-700/50 animate-fadeInUp stagger-2 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6">Question Analysis</h2>
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    index={index}
                    userAnswer={answers[q.id]}
                    isExpanded={expandedCards[q.id]}
                    onToggle={toggleCard}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {(loadingReviews || detailedResults.length > 0) && (
          <div className="bg-[#111827] rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-slate-700 animate-fadeInUp stagger-3">
            <h2 className="text-2xl font-bold text-white mb-6">Previous Result Reviews</h2>

            {reviewError && (
              <div className="mb-4 bg-red-900/30 border border-red-800 rounded-xl p-4 text-sm text-red-300">
                {reviewError}
              </div>
            )}

            {loadingReviews ? (
              <div className="text-center py-8 text-slate-400">Loading past interviews...</div>
            ) : (
              <div className="space-y-4">
                {detailedResults.map((review) => (
                  <div key={review.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{review.role}</h3>
                        <p className="text-sm text-slate-400">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">{review.score}%</p>
                        <p className="text-xs text-slate-500">Score</p>
                      </div>
                      <button
                        onClick={() => openReview(review.id)}
                        disabled={reviewLoadingId === review.id}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
                      >
                        {reviewLoadingId === review.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        View Detailed Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp stagger-4">
          <Link to="/interview" className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 group">
            <RotateCcw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
            Try Another Interview
          </Link>
          <Link to="/dashboard" className="flex items-center justify-center gap-2 px-8 py-4 bg-[#111827] text-white font-semibold rounded-xl shadow-md hover:shadow-lg border border-slate-700 hover:border-blue-500 transition-all duration-300">
            Go to Dashboard
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Results;