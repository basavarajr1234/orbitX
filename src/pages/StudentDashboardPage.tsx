import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Resource, Scholarship, StudentPreference, TestAttempt } from '../types';
import { api } from '../api';
import { PaperCard } from '../components/PaperCard';
import { ScholarshipCard } from '../components/ScholarshipCard';
import {
  User,
  Bookmark,
  Award,
  BookOpen,
  Calendar,
  LogOut,
  Save,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Layers,
  Building2,
  GraduationCap,
  Compass
} from 'lucide-react';

interface StudentDashboardPageProps {
  navigate: (route: string) => void;
  onPreviewPaper: (resource: Resource) => void;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({ navigate, onPreviewPaper }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'saved-papers' | 'saved-scholarships' | 'test-history' | 'preferences'>('saved-papers');

  const [savedPapers, setSavedPapers] = useState<Resource[]>([]);
  const [savedScholarships, setSavedScholarships] = useState<Scholarship[]>([]);
  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([]);
  const [preferences, setPreferences] = useState<StudentPreference | null>(null);
  const [prefSaved, setPrefSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // If not logged in
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <User className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Student Dashboard Access</h2>
        <p className="text-xs text-slate-400">
          Please sign in with your Google account to access your saved papers, track scholarship deadlines, and review mock test scores.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [papers, scholarships, profile, history] = await Promise.all([
        api.getSavedPapers(),
        api.getSavedScholarships(),
        api.getStudentProfile(),
        api.getTestHistory()
      ]);
      setSavedPapers(papers);
      setSavedScholarships(scholarships);
      setPreferences(profile.preferences);
      setTestAttempts(history);
    } catch (e) {
      console.error('Failed to load student dashboard', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRemovePaper = async (id: string) => {
    await api.removeSavedPaper(id);
    setSavedPapers(prev => prev.filter(p => p.id !== id));
  };

  const handleRemoveScholarship = async (id: string) => {
    await api.removeSavedScholarship(id);
    setSavedScholarships(prev => prev.filter(s => s.id !== id));
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferences) return;
    try {
      await api.updateStudentProfile({ preferences });
      setPrefSaved(true);
      setTimeout(() => setPrefSaved(false), 2500);
    } catch (e) {
      console.error('Failed to update preferences', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{user.name}</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Google Account Authenticated • Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {(user.role === 'admin' || user.role === 'super_admin' || user.role === 'content_manager') && (
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Open Admin Console &rarr;
            </button>
          )}

          <button
            onClick={() => { logout(); navigate('/'); }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-semibold text-xs border border-slate-700 flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Orbit X AI Study Assistant Hub on Student Dashboard */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-emerald-950/50 border border-indigo-500/30 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-300 animate-pulse" />
              </span>
              <h2 className="text-base font-bold text-white">Orbit X AI Study Assistant & Career Navigator</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Search Grounded
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              Solve Karnataka 2nd PUC model papers, get NCERT concept clarity, verify real-time entrance examination dates (KCET, NEET, COMEDK), compare colleges in Bengaluru, and build personalized higher education roadmaps.
            </p>
          </div>

          <button
            onClick={() => navigate('/ai-assistant')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Open AI Assistant Studio</span>
          </button>
        </div>

        {/* Quick Launch Action Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-5 pt-4 border-t border-slate-800">
          <button
            onClick={() => navigate('/ai-assistant?mode=study')}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-left border border-slate-700/60 hover:border-emerald-500/40 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs mb-0.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Study Help</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">Concept doubts & formulas</p>
          </button>

          <button
            onClick={() => navigate('/ai-assistant?mode=exam')}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-left border border-slate-700/60 hover:border-amber-500/40 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs mb-0.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Exam Prep</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">2nd PUC Paper Solver</p>
          </button>

          <button
            onClick={() => navigate('/ai-assistant?mode=career')}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-left border border-slate-700/60 hover:border-indigo-500/40 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs mb-0.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Career Guide</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">Roadmaps after 10th & 12th</p>
          </button>

          <button
            onClick={() => navigate('/ai-assistant?mode=course')}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-left border border-slate-700/60 hover:border-blue-500/40 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs mb-0.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Course Finder</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">Fees, eligibility & routes</p>
          </button>

          <button
            onClick={() => navigate('/ai-assistant?mode=college')}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-left border border-slate-700/60 hover:border-purple-500/40 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-purple-400 font-bold text-xs mb-0.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>College Finder</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">Bengaluru colleges</p>
          </button>

          <button
            onClick={() => navigate('/ai-assistant?mode=scholarship')}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-left border border-slate-700/60 hover:border-teal-500/40 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-teal-400 font-bold text-xs mb-0.5">
              <Award className="w-3.5 h-3.5" />
              <span>Scholarships</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">SSP & Vidyasiri advice</p>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('saved-papers')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'saved-papers'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Saved Papers ({savedPapers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved-scholarships')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'saved-scholarships'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Tracked Scholarships ({savedScholarships.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('test-history')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'test-history'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Mock Test History ({testAttempts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'preferences'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Academic Profile & Preferences</span>
        </button>
      </div>

      {/* Tab 1: Saved Papers */}
      {activeTab === 'saved-papers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>You have bookmarked {savedPapers.length} question papers</span>
            <button onClick={() => navigate('/papers')} className="text-emerald-400 hover:underline">
              Browse More Papers &rarr;
            </button>
          </div>

          {savedPapers.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
              <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No saved question papers yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Click the bookmark icon on any paper card in the library to save it here for fast revision.
              </p>
              <button
                onClick={() => navigate('/papers')}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Explore Question Papers
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedPapers.map((paper) => (
                <div key={paper.id} className="relative group">
                  <PaperCard
                    resource={paper}
                    onPreview={onPreviewPaper}
                    onDownload={onPreviewPaper}
                    isSaved={true}
                    onToggleSave={() => handleRemovePaper(paper.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Tracked Scholarships */}
      {activeTab === 'saved-scholarships' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tracking deadlines for {savedScholarships.length} scholarships</span>
            <button onClick={() => navigate('/scholarships')} className="text-emerald-400 hover:underline">
              Find More Schemes &rarr;
            </button>
          </div>

          {savedScholarships.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
              <Award className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No scholarships tracked yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Save scholarships from the portal to receive deadline reminders and direct application links.
              </p>
              <button
                onClick={() => navigate('/scholarships')}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Browse Scholarships
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedScholarships.map((sch) => (
                <ScholarshipCard
                  key={sch.id}
                  scholarship={sch}
                  isSaved={true}
                  onToggleSave={() => handleRemoveScholarship(sch.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Mock Test History */}
      {activeTab === 'test-history' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Your Examination Attempt Record</h3>
            <button onClick={() => navigate('/mock-tests')} className="text-xs text-emerald-400 font-bold hover:underline">
              Take New Mock Test &rarr;
            </button>
          </div>

          {testAttempts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <Clock className="w-10 h-10 text-slate-600 mx-auto" />
              <p>You haven't attempted any timed mock tests yet.</p>
              <button
                onClick={() => navigate('/mock-tests')}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Try KCET / NEET Mock Test
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono">
                    <th className="py-3 px-3">Test Title</th>
                    <th className="py-3 px-3">Score</th>
                    <th className="py-3 px-3">Accuracy</th>
                    <th className="py-3 px-3">Duration</th>
                    <th className="py-3 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {testAttempts.map((att) => (
                    <tr key={att.id}>
                      <td className="py-3 px-3 font-semibold text-white">{att.testTitle}</td>
                      <td className="py-3 px-3 font-mono">{att.score} / {att.totalMarks}</td>
                      <td className="py-3 px-3 font-bold text-emerald-400">
                        {Math.round((att.score / att.totalMarks) * 100)}%
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400">
                        {Math.floor(att.timeSpentSeconds / 60)}m {att.timeSpentSeconds % 60}s
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {new Date(att.completedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Preferences Editor */}
      {activeTab === 'preferences' && preferences && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">Academic Details & Scholarship Profiling</h3>
            <p className="text-xs text-slate-400 mt-1">
              Saving your academic preferences automatically filters relevant question papers and flags matching scholarship schemes.
            </p>
          </div>

          <form onSubmit={handleSavePreferences} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Current Class</label>
              <select
                value={preferences.currentClass}
                onChange={(e) => setPreferences({ ...preferences, currentClass: e.target.value })}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
              >
                <option value="Class 10">Class 10 / SSLC</option>
                <option value="1st PUC">1st PUC / Class 11</option>
                <option value="2nd PUC">2nd PUC / Class 12</option>
                <option value="Undergraduate">Undergraduate Degree</option>
                <option value="Engineering">Engineering (B.E / B.Tech)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Education Board</label>
              <select
                value={preferences.board}
                onChange={(e) => setPreferences({ ...preferences, board: e.target.value })}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
              >
                <option value="Karnataka State Board">Karnataka State Board</option>
                <option value="CBSE">CBSE Board</option>
                <option value="ICSE">ICSE Board</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Stream</label>
              <select
                value={preferences.stream}
                onChange={(e) => setPreferences({ ...preferences, stream: e.target.value })}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
              >
                <option value="Science">Science (PCMB/PCMC)</option>
                <option value="Commerce">Commerce</option>
                <option value="Arts">Arts / Humanities</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Social Category</label>
              <select
                value={preferences.socialCategory}
                onChange={(e) => setPreferences({ ...preferences, socialCategory: e.target.value })}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
              >
                <option value="General">General Merit (GM)</option>
                <option value="OBC">OBC (Cat-1, 2A, 2B, 3A, 3B)</option>
                <option value="SC">Scheduled Caste (SC)</option>
                <option value="ST">Scheduled Tribe (ST)</option>
                <option value="Minority">Minority</option>
                <option value="EWS">EWS</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Annual Family Income Range</label>
              <select
                value={preferences.annualIncomeRange}
                onChange={(e) => setPreferences({ ...preferences, annualIncomeRange: e.target.value })}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
              >
                <option value="Under ₹1,00,000">Under ₹1,00,000</option>
                <option value="Under ₹2,50,000">Under ₹2,50,000 (SSP Eligible)</option>
                <option value="₹2,50,000 - ₹5,00,000">₹2,50,000 - ₹5,00,000</option>
                <option value="Above ₹5,00,000">Above ₹5,00,000</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Latest Percentage / Marks (%)</label>
              <input
                type="number"
                min="35"
                max="100"
                value={preferences.marksPercentage}
                onChange={(e) => setPreferences({ ...preferences, marksPercentage: Number(e.target.value) })}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-between pt-4 border-t border-slate-800">
              {prefSaved ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Academic profile saved successfully!
                </span>
              ) : (
                <span className="text-slate-500 text-[11px]">Last updated {new Date(preferences.updatedAt).toLocaleDateString()}</span>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
