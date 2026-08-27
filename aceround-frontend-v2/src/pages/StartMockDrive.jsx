// aceround-frontend-v2/src/pages/StartMockDrive.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import Footer from '../components/Footer';
import { questionApi, resumeApi } from '../services/interviewApi';
import { mockDriveApi } from '../services/mockDriveApi';
import { Upload, FileText, X as XIcon, Loader2, ArrowRight } from 'lucide-react';

const StartMockDrive = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState('role');

  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('');

  const [file, setFile] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const fileInputRef = useRef(null);

  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await questionApi.roles();
        if (!cancelled) setRoles(data.roles || []);
      } catch {
        if (!cancelled) setRoles([]);
      } finally {
        if (!cancelled) setRolesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

    if (tab === 'role' && !selectedRole) {
      setError('Please select a role to continue.');
      return;
    }
    if (tab === 'resume' && !resumeText) {
      setError('Please upload a resume first.');
      return;
    }

    setStarting(true);
    try {
      const payload =
        tab === 'role'
          ? { source: 'role', role: selectedRole }
          : { source: 'resume', resumeText };

      const data = await mockDriveApi.start(payload);
      navigate(`/dashboard?driveId=${data.drive.id}`);
    } catch (err) {
      setError(err.message || 'Could not start the mock drive. Please try again.');
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <AppNavbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Start a Mock Drive</h1>
        <p className="text-slate-400 mb-8">
          Choose a role, or upload your resume so questions match your background — then work
          through the MCQ, coding, and AI interview rounds.
        </p>

        <div className="flex gap-2 mb-6 bg-slate-900 border border-slate-800 rounded-xl p-1 w-fit">
          <button
            type="button"
            onClick={() => setTab('role')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === 'role' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Select Role
          </button>
          <button
            type="button"
            onClick={() => setTab('resume')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === 'resume' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload Resume
          </button>
        </div>

        {tab === 'role' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            {rolesLoading ? (
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading roles...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roles.map((roleName) => (
                  <button
                    type="button"
                    key={roleName}
                    onClick={() => setSelectedRole(roleName)}
                    className={`text-left px-4 py-3 rounded-xl border transition ${
                      selectedRole === roleName
                        ? 'border-blue-500 bg-blue-500/10 text-white'
                        : 'border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    {roleName}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'resume' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            {!file ? (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-700 rounded-xl py-10 cursor-pointer hover:border-slate-600 transition">
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
              <div className="flex items-center justify-between px-4 py-3 bg-slate-800/60 rounded-xl">
                <div className="flex items-center gap-2 text-slate-200 text-sm">
                  <FileText className="h-5 w-5 text-blue-400" />
                  {file.name}
                  {extracting && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                </div>
                <button type="button" onClick={clearFile} className="text-slate-500 hover:text-slate-300">
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleStart}
          disabled={starting || extracting}
          className="mt-8 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl transition"
        >
          {starting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
          Start Mock Drive
        </button>
      </main>

      <Footer />
    </div>
  );
};

export default StartMockDrive;