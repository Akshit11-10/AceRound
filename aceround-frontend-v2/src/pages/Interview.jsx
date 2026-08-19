import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { questionApi, interviewApi, resumeApi } from '../services/interviewApi';

import {
  Clock, ChevronLeft, ChevronRight, AlertTriangle,
  CheckCircle, Circle, Send, ArrowRight, Loader2,
  Code, Server, Layers, Atom, User, Building2,
  Upload, FileText, X as XIcon, Gauge,
} from 'lucide-react';

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy', hint: 'Fundamentals' },
  { value: 'medium', label: 'Medium', hint: '1-3 yrs level' },
  { value: 'hard', label: 'Hard', hint: 'Senior level' },
];

const QUESTION_COUNT_OPTIONS = [10, 15, 20, 25, 30];

const roleIcons = {
  'Frontend Developer': Code,
  'Backend Developer': Server,
  'Full Stack Developer': Layers,
  'React Developer': Atom,
  'HR Interview': User,
};

const getIcon = (roleName) => roleIcons[roleName] || Code;

// Card shown in role selection screen
function RoleCard({ role: roleName, isActive, onClick }) {
  const Icon = getIcon(roleName);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}
      className={`group relative flex flex-col p-5 rounded-xl border transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl magnetic-hover parallax-tilt card-glow
        ${isActive
          ? 'bg-blue-600/12 border-blue-500/55 shadow-lg shadow-blue-500/10'
          : 'bg-slate-800/50 border-white/10 hover:border-blue-500/40 hover:bg-slate-700/60'
        }`}
    >
      <div className="flex items-start gap-3">
        <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
          ${isActive
            ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-md shadow-blue-500/25'
            : 'bg-slate-700/80 group-hover:bg-gradient-to-br group-hover:from-blue-500/40 group-hover:to-purple-600/40'
          }`}
        >
          <Icon className={`h-5 w-5 transition-colors duration-300 group-hover:text-white ${isActive ? 'text-white' : 'text-slate-300'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold leading-tight transition-colors duration-300 group-hover:text-white ${isActive ? 'text-blue-300' : 'text-slate-200'}`}>
            {roleName}
          </h4>
          <p className={`text-xs mt-0.5 transition-colors duration-300 group-hover:text-slate-400 ${isActive ? 'text-blue-400/70' : 'text-slate-500'}`}>
            Choose {roleName}
          </p>
        </div>
      </div>

      {isActive && (
        <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 shadow-sm animate-scaleIn">
          <ArrowRight className="h-3 w-3 text-white -rotate-45" />
        </span>
      )}
    </div>
  );
}

// Role selection + interview details screen
function InterviewSetup({
  roles, rolesLoading, selectedRole, onSelectRole, onStart, starting, startError,
  difficulty, onSelectDifficulty,
  questionCount, onSelectQuestionCount,
  targetCompany, onTargetCompanyChange,
  resumeFile, onResumeChange, resumeStatus, resumeError,
}) {
  const durationMinutes = Math.round(questionCount * 1.0 * 10) / 10;

  return (
    <div className="min-h-screen bg-[#0f172a] py-12 relative overflow-hidden">
      <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-[#111827] rounded-2xl shadow-xl p-8 md:p-12 border border-slate-700 animate-fadeInUp">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Start Your Interview</h1>
            <p className="text-lg text-slate-300">
              Select a role and begin your mock interview. Questions are generated fresh for every attempt.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-4">Select Your Role</label>

              {rolesLoading ? (
                <div className="flex items-center justify-center gap-2 text-slate-400 py-10">
                  <Loader2 className="h-5 w-5 animate-spin" /> Loading roles...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roles.map((roleName, index) => (
                    <RoleCard
                      key={index}
                      role={roleName}
                      isActive={selectedRole === roleName}
                      onClick={() => onSelectRole(roleName)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Difficulty */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                <Gauge className="h-4 w-4 text-blue-400" /> Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {DIFFICULTY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onSelectDifficulty(opt.value)}
                    className={`px-4 py-3 rounded-xl border text-center transition-all duration-200 ${
                      difficulty === opt.value
                        ? 'bg-blue-600/15 border-blue-500/60 text-blue-300'
                        : 'bg-slate-800/50 border-white/10 text-slate-300 hover:border-blue-500/40'
                    }`}
                  >
                    <div className="font-semibold text-sm">{opt.label}</div>
                    <div className="text-xs opacity-70 mt-0.5">{opt.hint}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question count */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Number of Questions
              </label>
              <div className="flex flex-wrap gap-3">
                {QUESTION_COUNT_OPTIONS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => onSelectQuestionCount(n)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                      questionCount === n
                        ? 'bg-blue-600/15 border-blue-500/60 text-blue-300'
                        : 'bg-slate-800/50 border-white/10 text-slate-300 hover:border-blue-500/40'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Target company (optional) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                <Building2 className="h-4 w-4 text-blue-400" /> Target Company <span className="text-slate-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => onTargetCompanyChange(e.target.value)}
                placeholder="e.g. Google, Amazon, TCS..."
                maxLength={60}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-slate-500 mt-1.5">
                Questions will be styled after that company's interview patterns, tagged in brackets.
              </p>
            </div>

            {/* Resume upload (optional) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                <FileText className="h-4 w-4 text-blue-400" /> Resume <span className="text-slate-500 font-normal">(optional — PDF or .txt)</span>
              </label>

              {!resumeFile ? (
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-600 rounded-xl py-6 cursor-pointer hover:border-blue-500/50 hover:bg-slate-800/30 transition-all">
                  <Upload className="h-5 w-5 text-slate-400" />
                  <span className="text-sm text-slate-400">Click to upload your resume</span>
                  <input
                    type="file"
                    accept=".pdf,.txt,application/pdf,text/plain"
                    className="hidden"
                    onChange={(e) => onResumeChange(e.target.files?.[0] || null)}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-blue-400 shrink-0" />
                    <span className="text-sm text-slate-300 truncate">{resumeFile.name}</span>
                    {resumeStatus === 'uploading' && <Loader2 className="h-4 w-4 animate-spin text-slate-400 shrink-0" />}
                    {resumeStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />}
                  </div>
                  <button type="button" onClick={() => onResumeChange(null)} className="text-slate-400 hover:text-red-400 transition-colors shrink-0">
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
              {resumeError && <p className="text-xs text-red-400 mt-1.5">{resumeError}</p>}
              {resumeStatus === 'success' && (
                <p className="text-xs text-green-400 mt-1.5">Resume processed — questions will be tailored to it.</p>
              )}
            </div>

            <div className="bg-blue-900/30 border border-blue-800 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-3">Interview Details:</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" /> Duration: {durationMinutes} minutes ({questionCount} questions)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-400" /> Questions generated dynamically for {selectedRole || 'your role'}
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-blue-400" /> Auto-submits when time runs out
                </li>
              </ul>
            </div>

            {startError && (
              <div className="bg-red-900/30 border border-red-800 rounded-xl p-4 text-sm text-red-300">
                {startError}
              </div>
            )}

            <button
              onClick={onStart}
              disabled={!selectedRole || starting || resumeStatus === 'uploading'}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
            >
              {starting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating your questions...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  Start Interview
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Active interview screen with timer and questions
function InterviewPlayer({ role, questions, timeLimitSeconds, interviewId, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(timeLimitSeconds);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const timerRef = useRef(null);
  const hasFinishedRef = useRef(false);
  const navigate = useNavigate();

  // Submits answers to the backend for server-side scoring, then hands the
  // detailed result up to the parent for the Results page.
  const finishInterview = useCallback(async (finalAnswers, timeSpent) => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    clearInterval(timerRef.current);
    setSubmitting(true);
    setSubmitError('');
    try {
      const { result } = await interviewApi.submit(interviewId, finalAnswers, timeSpent);
      onFinish(result);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit interview. Please try again.');
      hasFinishedRef.current = false;
      setSubmitting(false);
    }
  }, [interviewId, onFinish]);

  // Start countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Show warning at 2 minutes left
  useEffect(() => {
    if (timeLeft === 120) setShowWarning(true);
  }, [timeLeft]);

  // --- Exit guard: prevent leaving mid-interview ---
  // 1) Tab close / refresh: native browser "leave site?" prompt.
  // 2) Browser back/forward button: trapped via a dummy history entry;
  //    pressing back re-pushes the same entry and shows our own confirm
  //    modal instead of actually navigating away.
  // Both are disarmed once the interview has finished submitting.
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasFinishedRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    };

    const handlePopState = () => {
      if (hasFinishedRef.current) return;
      // Re-trap: push the dummy entry back so the URL/history doesn't actually change.
      window.history.pushState(null, '', window.location.href);
      setShowLeaveConfirm(true);
    };

    // Add one dummy entry so the first "back" press is caught by popstate
    // instead of leaving the page immediately.
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const confirmLeaveInterview = () => {
    hasFinishedRef.current = true; // disarm the guard
    navigate('/dashboard', { replace: true });
  };

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (timeLeft === 0) {
      const currentAnswer = selectedOption !== null ? { ...answers, [questions[currentIndex].id]: selectedOption } : answers;
      finishInterview(currentAnswer, timeLimitSeconds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // Save the currently selected option to answers
  const saveCurrentAnswer = () => {
    if (selectedOption !== null) {
      setAnswers((prev) => ({ ...prev, [questions[currentIndex].id]: selectedOption }));
    }
  };

  const handleSubmit = () => {
    const finalAnswers = selectedOption !== null
      ? { ...answers, [questions[currentIndex].id]: selectedOption }
      : answers;
    finishInterview(finalAnswers, timeLimitSeconds - timeLeft);
  };

  // Go to a specific question index and load its saved answer
  const goToQuestion = (index) => {
    saveCurrentAnswer();
    const savedAnswer = answers[questions[index].id];
    setSelectedOption(savedAnswer !== undefined ? savedAnswer : null);
    setCurrentIndex(index);
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) goToQuestion(currentIndex + 1);
  };

  const goPrev = () => {
    if (currentIndex > 0) goToQuestion(currentIndex - 1);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  // Timer color based on time left
  const timerStyle =
    timeLeft <= 120 ? 'bg-red-900/50 text-red-300 border-red-800 animate-timerPulse'
    : timeLeft <= 300 ? 'bg-orange-900/30 text-orange-300 border-orange-800'
    : 'bg-blue-900/30 text-blue-300 border-blue-800';

  return (
    <div className="min-h-screen bg-[#0f172a]">

      {submitting && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl px-8 py-6 flex items-center gap-3 text-white">
            <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
            Scoring your interview...
          </div>
        </div>
      )}

      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6 max-w-sm w-full animate-scaleIn">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="h-6 w-6 text-orange-400 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-white">Leave this interview?</h3>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              Your progress won't be saved and this interview will remain incomplete. You'll need to start a new one to try again.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="flex-1 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors font-medium"
              >
                Stay
              </button>
              <button
                onClick={confirmLeaveInterview}
                className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors font-medium"
              >
                Leave anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {showWarning && timeLeft <= 120 && (
        <div className="bg-red-900/50 border-b border-red-800 px-4 py-3 flex items-center justify-center gap-2 animate-fadeInUp">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <span className="text-red-300 font-medium">Warning: Only {formatTime(timeLeft)} remaining!</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {submitError && (
          <div className="mb-6 bg-red-900/30 border border-red-800 rounded-xl p-4 text-sm text-red-300">
            {submitError}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 animate-fadeInUp">
          <div>
            <h1 className="text-2xl font-bold text-white">{role} Interview</h1>
            <p className="text-sm text-slate-400">Question {currentIndex + 1} of {questions.length}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${timerStyle}`}>
              <Clock className="h-5 w-5" />
              <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
            </div>
            <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-60">
              Submit
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Question area */}
          <div className="lg:col-span-2">
            <div className="bg-[#111827] rounded-xl shadow-md p-6 md:p-8 border border-slate-700 animate-fadeInUp stagger-1">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-blue-900/50 text-blue-300 text-sm font-medium rounded-full mb-4">
                  Multiple Choice
                </span>
                <h2 className="text-xl md:text-2xl font-semibold text-white leading-relaxed">
                  {currentQ.question}
                </h2>
              </div>

              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedOption(index)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 card-hover ${
                      selectedOption === index
                        ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                        : 'border-slate-600 hover:border-blue-500 hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                        selectedOption === index ? 'bg-blue-500 text-white scale-110' : 'bg-slate-600 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </span>
                  </button>
                ))}
              </div>

              {/* Prev / Next buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700">
                <button
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" /> Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button onClick={goNext} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all">
                    Next <ChevronRight className="h-5 w-5" />
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-60">
                    Submit Interview <Send className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Progress bar */}
            <div className="bg-[#111827] rounded-xl shadow-md p-6 border border-slate-700 animate-fadeInUp stagger-2">
              <h3 className="font-semibold text-white mb-4">Progress</h3>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Answered</span>
                <span className="font-medium text-white">{answeredCount}/{questions.length}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question palette */}
            <div className="bg-[#111827] rounded-xl shadow-md p-6 border border-slate-700 animate-fadeInUp stagger-3">
              <h3 className="font-semibold text-white mb-4">Question Palette</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(index)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                      index === currentIndex ? 'bg-blue-600 text-white scale-105'
                      : answers[q.id] !== undefined ? 'bg-green-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-600" /> Current</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-600" /> Answered</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-slate-800" /> Unanswered</div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl shadow-md p-6 border border-blue-800/50 animate-fadeInUp stagger-4">
              <h3 className="font-semibold text-white mb-3">Quick Tips</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {[
                  'Read questions carefully before answering',
                  'Keep an eye on the timer',
                  'You can navigate between questions',
                  'Review answers before submitting',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Circle className="h-3 w-3 text-blue-400 mt-1 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function Interview() {
  const [searchParams] = useSearchParams();
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(searchParams.get('role') || '');
  const [session, setSession] = useState(null); // { interviewId, role, questions, timeLimitSeconds }
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState('');
  const [redirect, setRedirect] = useState(null);

  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(20);
  const [targetCompany, setTargetCompany] = useState('');

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [resumeStatus, setResumeStatus] = useState('idle'); // idle | uploading | success | error
  const [resumeError, setResumeError] = useState('');

  // Load the list of available roles from the backend on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await questionApi.roles();
        if (cancelled) return;
        setRoles(data.roles);
        if (!selectedRole && data.roles.length > 0) setSelectedRole(data.roles[0]);
      } catch {
        if (!cancelled) setRoles(['Frontend Developer', 'Backend Developer', 'Full Stack Developer']);
      } finally {
        if (!cancelled) setRolesLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle resume selection: upload immediately so any error shows before
  // the user hits "Start Interview".
  const handleResumeChange = async (file) => {
    if (!file) {
      setResumeFile(null);
      setResumeText('');
      setResumeStatus('idle');
      setResumeError('');
      return;
    }
    setResumeFile(file);
    setResumeStatus('uploading');
    setResumeError('');
    try {
      const data = await resumeApi.extract(file);
      setResumeText(data.text);
      setResumeStatus('success');
    } catch (err) {
      setResumeStatus('error');
      setResumeError(err.message || 'Failed to process that file.');
    }
  };

  const startInterview = async () => {
    if (!selectedRole) return;
    setStarting(true);
    setStartError('');
    try {
      const data = await interviewApi.start(selectedRole, {
        count: questionCount,
        difficulty,
        targetCompany: targetCompany.trim() || undefined,
        resumeText: resumeText || undefined,
      });
      setSession({
        interviewId: data.interviewId,
        role: data.role,
        questions: data.questions,
        timeLimitSeconds: data.timeLimitSeconds,
      });
    } catch (err) {
      setStartError(err.message || 'Failed to start interview. Please try again.');
    } finally {
      setStarting(false);
    }
  };

  const finishInterview = (result) => {
    setRedirect(result);
  };

  if (redirect) return <Navigate to="/results" state={redirect} replace />;

  if (!session) {
    return (
      <InterviewSetup
        roles={roles}
        rolesLoading={rolesLoading}
        selectedRole={selectedRole}
        onSelectRole={setSelectedRole}
        onStart={startInterview}
        starting={starting}
        startError={startError}
        difficulty={difficulty}
        onSelectDifficulty={setDifficulty}
        questionCount={questionCount}
        onSelectQuestionCount={setQuestionCount}
        targetCompany={targetCompany}
        onTargetCompanyChange={setTargetCompany}
        resumeFile={resumeFile}
        onResumeChange={handleResumeChange}
        resumeStatus={resumeStatus}
        resumeError={resumeError}
      />
    );
  }

  return (
    <InterviewPlayer
      role={session.role}
      questions={session.questions}
      timeLimitSeconds={session.timeLimitSeconds}
      interviewId={session.interviewId}
      onFinish={finishInterview}
    />
  );
}
