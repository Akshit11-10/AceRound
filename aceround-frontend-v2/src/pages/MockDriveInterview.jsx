import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import Footer from '../components/Footer';
import { mockDriveApi } from '../services/mockDriveApi';
import { Loader2, Mic, MicOff, Send, Clock, Volume2, CheckCircle2 } from 'lucide-react';

// Round 3 of the Mock Drive pipeline — a live conversational AI interview.
// Uses the browser's built-in Web Speech API for both speech-to-text (mic
// input) and text-to-speech (the AI's questions are read aloud). Falls back
// gracefully to a typed text input if the browser doesn't support speech
// recognition (e.g. Firefox, Safari on some versions).
const MockDriveInterview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [transcript, setTranscript] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [interviewResult, setInterviewResult] = useState(null);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [sending, setSending] = useState(false);
  const [typedMessage, setTypedMessage] = useState('');
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const transcriptEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    finishedRef.current = isFinished;
  }, [isFinished]);

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTypedMessage(text);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setTypedMessage('');
      recognitionRef.current.start();
      setListening(true);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const existing = await mockDriveApi.getInterview(id);
        if (cancelled) return;
        setTimeLeft(existing.timeLimitSeconds || 20 * 60);

        if (existing.isFinished) {
          setIsFinished(true);
          setInterviewResult(existing.interviewResult);
          setTranscript(existing.transcript || []);
          return;
        }

        if (existing.transcript && existing.transcript.length > 0) {
          setTranscript(existing.transcript);
          speak(existing.transcript[existing.transcript.length - 1]?.text);
        } else {
          const started = await mockDriveApi.startInterview(id);
          if (cancelled) return;
          setTranscript(started.transcript || []);
          speak(started.transcript?.[0]?.text);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load the interview.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [transcript]);

  const handleFinish = useCallback(async () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearInterval(timerRef.current);
    window.speechSynthesis?.cancel();
    try {
      const data = await mockDriveApi.finishInterview(id);
      setInterviewResult(data.interviewResult);
      setIsFinished(true);
    } catch (err) {
      setError(err.message || 'Could not finish the interview.');
    }
  }, [id]);

  useEffect(() => {
    if (loading || isFinished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [loading, isFinished, handleFinish]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSend = async () => {
    const message = typedMessage.trim();
    if (!message || sending) return;
    setSending(true);
    setError('');
    setTranscript((prev) => [...prev, { role: 'user', text: message }]);
    setTypedMessage('');
    try {
      const data = await mockDriveApi.respondInterview(id, message);
      setTranscript(data.transcript || []);
      const lastAiMessage = [...data.transcript].reverse().find((t) => t.role === 'ai');
      if (lastAiMessage) speak(lastAiMessage.text);
      if (data.isFinished) {
        setInterviewResult(data.interviewResult);
        setIsFinished(true);
        clearInterval(timerRef.current);
      }
    } catch (err) {
      setError(err.message || 'Could not send your answer.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] text-slate-100 flex flex-col">
        <AppNavbar />
        <div className="h-16" />
        <div className="flex-1 flex items-center justify-center gap-2 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" /> Connecting to your interviewer...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 flex flex-col">
      <AppNavbar />
      <div className="h-16" />

      <div className="sticky top-16 z-30 px-4 sm:px-6 py-3 bg-[#0a0f1e]/95 backdrop-blur-xl border-b border-slate-800/60 flex items-center justify-between">
        <span className="text-sm text-slate-400 flex items-center gap-1.5">
          <Volume2 className="h-4 w-4" /> AI Interview
        </span>
        {!isFinished && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold shrink-0 ${
              timeLeft <= 120
                ? 'border-red-500/50 bg-red-500/10 text-red-300'
                : 'border-slate-700 bg-slate-900/60 text-slate-200'
            }`}
          >
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col">
        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {!speechSupported && !isFinished && (
          <div className="mb-4 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2">
            Your browser doesn't support voice input — type your answers below instead. (Chrome supports voice input.)
          </div>
        )}

        {isFinished ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Interview Complete!</h2>
            <p className="text-3xl font-bold text-blue-400 mb-4">{interviewResult?.score ?? '-'}/100</p>
            <p className="text-slate-300 text-sm leading-relaxed max-w-lg mx-auto mb-6">
              {interviewResult?.feedback}
            </p>
            <button
              type="button"
              onClick={() => navigate(`/mock-drive/${id}/report`)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition text-sm"
            >
              View Full Report
            </button>
          </div>
        ) : (
          <>
            <div
              ref={messagesContainerRef}
              className="space-y-4 mb-4 overflow-y-auto"
              style={{ maxHeight: 'calc(100vh - 320px)' }}
            >
              {transcript.map((t, i) => (
                <div key={i} className={`flex ${t.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      t.role === 'ai'
                        ? 'bg-slate-900/80 border border-slate-800 text-slate-200'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {t.text}
                  </div>
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>

            <div className="sticky bottom-4 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 sm:p-4">
              <div className="flex items-end gap-2">
                <textarea
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={listening ? 'Listening...' : 'Type your answer, or use the mic...'}
                  rows={2}
                  className="flex-1 bg-slate-950 text-slate-100 text-sm rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-blue-500 resize-none"
                />
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`shrink-0 p-3 rounded-xl transition ${
                      listening ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={sending || !typedMessage.trim()}
                  className="shrink-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-3 rounded-xl transition text-sm"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MockDriveInterview;
