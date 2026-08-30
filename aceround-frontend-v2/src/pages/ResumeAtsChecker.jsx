import { useState, useRef } from 'react';
import AppNavbar from '../components/AppNavbar';
import Footer from '../components/Footer';
import { resumeApi } from '../services/interviewApi';
import { atsApi } from '../services/atsApi';
import { Upload, FileText, X as XIcon, Loader2, ArrowRight, AlertTriangle, Lightbulb, Search } from 'lucide-react';

// Standalone feature — independent of the Mock Drive pipeline. Can be used
// any time, any number of times, to check a resume's ATS-friendliness and
// (optionally) how well it matches a specific job description.
const ResumeAtsChecker = () => {
  const [file, setFile] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const fileInputRef = useRef(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setResumeText('');
    setResult(null);
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
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    setError('');
    if (!resumeText) {
      setError('Please upload a resume first.');
      return;
    }
    setAnalyzing(true);
    setResult(null);
    try {
      const data = await atsApi.analyze({ resumeText, jobDescription: jobDescription.trim() || undefined });
      setResult(data);
    } catch (err) {
      setError(err.message || 'Could not analyze the resume. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const scoreColor = (score) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 flex flex-col">
      <AppNavbar />
      <div className="h-16" />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">Resume ATS Checker</h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Upload your resume to get an ATS-friendliness score, missing keywords, formatting
            issues, and specific suggestions to improve it. Add a job description for a more
            targeted match score — completely optional.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Upload your resume (PDF or .txt)</h2>
          {!file ? (
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-700 rounded-xl py-10 cursor-pointer hover:border-slate-600 transition text-center px-4">
              <Upload className="h-8 w-8 text-slate-500" />
              <span className="text-slate-400 text-sm">Click to upload PDF or .txt resume</span>
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

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-2">Job description (optional)</h2>
          <p className="text-slate-500 text-xs mb-3">
            Paste the job you're applying for to get a match score against it specifically.
          </p>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description here..."
            rows={5}
            className="w-full bg-slate-950 text-slate-100 text-sm rounded-xl p-4 border border-slate-800 focus:outline-none focus:border-blue-500 resize-y"
          />
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={analyzing || extracting}
          className="mb-8 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl transition"
        >
          {analyzing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          Analyze Resume
        </button>

        {result && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center">
              <p className="text-sm text-slate-400 mb-1">ATS Score</p>
              <p className={`text-5xl font-bold ${scoreColor(result.score)}`}>{result.score}</p>
              <p className="text-slate-500 text-xs mt-1">out of 100</p>
            </div>

            {result.missingKeywords.length > 0 && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-400" /> Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded-full text-xs"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.formattingIssues.length > 0 && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" /> Formatting Issues
                </h3>
                <ul className="space-y-2">
                  {result.formattingIssues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <ArrowRight className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.suggestions.length > 0 && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-green-400" /> Suggestions
                </h3>
                <ul className="space-y-2">
                  {result.suggestions.map((sug, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <ArrowRight className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                      {sug}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ResumeAtsChecker;
