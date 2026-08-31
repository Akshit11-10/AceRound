import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import Footer from '../components/Footer';
import { resumeApi } from '../services/interviewApi';
import { mockDriveApi } from '../services/mockDriveApi';
import { Upload, FileText, X as XIcon, Loader2, ArrowRight, ListChecks, Code2, Mic, BrainCircuit } from 'lucide-react';

// Entry point #2 for the Mock Drive pipeline — upload a resume instead of
// picking a role. The MCQ round and AI interview will then be based on the
// skills/projects found in the resume, rather than a generic role.
const MockDriveResume = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const fileInputRef = useRef(null);

  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setResumeText('');
    setError('');
    setExtracting(true);
    try {
      const data = await resumeApi.extract(selected);
      setResumeText(data.text || '');
    } catch (err) {
      setError(err.message || 'Could not read that resume.');
      setFile(null);
    } finally {
      setExtracting(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setResumeText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStart = async () => {
    setError('');
    if (!resumeText) {
      setError('Please upload a resume first.');
      return;
    }
    setStarting(true);
    try {
      const data = await mockDriveApi.start({ source: 'resume', resumeText });
      navigate(`/mock-drive/${data.drive.id}/aptitude`);
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
            Start a Mock Drive — with your Resume
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Upload your resume and we'll base the entire drive on it — MCQs on the skills and
            tools listed in your resume, a short DSA coding round, and finally a live AI
            interview that digs into your actual projects and experience.
          </p>
        </div>

        {/* What happens next — 4 step preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 sm:mb-10">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <BrainCircuit className="h-5 w-5 text-amber-400 mb-2" />
            <p className="text-sm font-semibold text-white">1. Aptitude</p>
            <p className="text-xs text-slate-400 mt-1">Quant, Reasoning &amp; Verbal mix.</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <ListChecks className="h-5 w-5 text-blue-400 mb-2" />
            <p className="text-sm font-semibold text-white">2. MCQ Round</p>
            <p className="text-xs text-slate-400 mt-1">Questions based on your resume's skills.</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <Code2 className="h-5 w-5 text-purple-400 mb-2" />
            <p className="text-sm font-semibold text-white">3. Coding Round</p>
            <p className="text-xs text-slate-400 mt-1">A few basic DSA problems (arrays/strings).</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <Mic className="h-5 w-5 text-pink-400 mb-2" />
            <p className="text-sm font-semibold text-white">4. AI Interview</p>
            <p className="text-xs text-slate-400 mt-1">Live voice interview about your projects.</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Upload your resume (PDF or .txt)</h2>
          {!file ? (
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-700 rounded-xl py-10 sm:py-12 cursor-pointer hover:border-slate-600 transition text-center px-4">
              <Upload className="h-8 w-8 text-slate-500" />
              <span className="text-slate-400 text-sm">Click to upload PDF or .txt resume</span>
              <span className="text-slate-600 text-xs">Nothing is stored — only used to tailor your questions</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800/60 rounded-xl gap-2">
              <div className="flex items-center gap-2 text-slate-200 text-sm min-w-0">
                <FileText className="h-5 w-5 text-blue-400 shrink-0" />
                <span className="truncate">{file.name}</span>
                {extracting && <Loader2 className="h-4 w-4 animate-spin ml-2 shrink-0" />}
              </div>
              <button type="button" onClick={clearFile} className="text-slate-500 hover:text-slate-300 shrink-0">
                <XIcon className="h-4 w-4" />
              </button>
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
          disabled={starting || extracting}
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

export default MockDriveResume;
