import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  BookOpen,
  GraduationCap,
  Award,
  Sparkles,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  FileText,
  Compass,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string, params?: Record<string, string>) => void;
  openAIAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, navigate, openAIAssistant }) => {
  const { user, logout, isContentManager, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [boardDropdownOpen, setBoardDropdownOpen] = useState(false);
  const [cbseDropdownOpen, setCbseDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate('/papers', { query: globalSearch.trim() });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-xs text-white py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-200 animate-pulse"></span>
        <span>Karnataka SSLC 2025, 2nd PUC & CBSE Model Papers Released • SSP & Vidyasiri Scholarship Window Active</span>
        <button
          onClick={() => navigate('/scholarships')}
          className="ml-2 underline font-bold hover:text-emerald-100 transition-colors"
        >
          Check Eligibility &rarr;
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo & Identity */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 border border-slate-700/80 flex items-center justify-center shadow-md group-hover:border-emerald-500 transition-all duration-300">
              {/* Custom Orbit X SVG Glyph */}
              <svg viewBox="0 0 100 100" className="w-7 h-7">
                <ellipse cx="50" cy="50" rx="36" ry="16" fill="none" stroke="#38bdf8" strokeWidth="6" strokeDasharray="14 6" transform="rotate(-30 50 50)" />
                <ellipse cx="50" cy="50" rx="36" ry="16" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="18 4" transform="rotate(30 50 50)" />
                <circle cx="50" cy="50" r="9" fill="#10b981" />
                <circle cx="50" cy="50" r="4" fill="#ffffff" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-white font-mono">ORBIT</span>
                <span className="text-2xl font-black text-emerald-400">X</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase hidden sm:block -mt-1">
                Karnataka & CBSE Education Hub
              </p>
            </div>
          </div>

          {/* Global Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md relative mx-2"
          >
            <input
              type="text"
              placeholder="Search question papers, subjects, KCET, NEET, scholarships..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full bg-slate-800/80 text-sm text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </form>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* AI Assistant Quick Trigger */}
            <button
              onClick={openAIAssistant}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/70 text-indigo-300 border border-indigo-800/60 hover:bg-indigo-900 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
              title="Open Gemini AI Study Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Study Mentor</span>
            </button>

            {/* Find Scholarships CTA */}
            <button
              onClick={() => navigate('/scholarships')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span>Find Scholarships</span>
            </button>

            {/* User Profile or Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer border border-slate-700/60"
                >
                  <img
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-600"
                  />
                  <div className="hidden xl:block text-left">
                    <p className="text-xs font-semibold text-slate-200 truncate max-w-[110px]">{user.name}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase font-bold ${
                      user.role === 'super_admin' ? 'bg-amber-500/20 text-amber-300' :
                      user.role === 'admin' ? 'bg-indigo-500/20 text-indigo-300' :
                      user.role === 'content_manager' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-slate-200">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 bg-slate-800 text-emerald-400 rounded">
                          Role: {user.role}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => { setUserMenuOpen(false); navigate('/dashboard'); }}
                      className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-emerald-400" />
                      <span>Student Dashboard</span>
                    </button>

                    {isContentManager && (
                      <button
                        onClick={() => { setUserMenuOpen(false); navigate('/admin/dashboard'); }}
                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-800 flex items-center gap-2.5 text-amber-300 cursor-pointer font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <div className="border-t border-slate-800 my-1 pt-1">
                      <p className="px-4 py-1 text-[10px] uppercase tracking-wider text-slate-500 font-mono font-semibold">
                        Role Switcher (Evaluation)
                      </p>
                      <div className="grid grid-cols-2 gap-1 px-3 py-1">
                        <button
                          onClick={() => { demoLogin('student'); setUserMenuOpen(false); }}
                          className="text-[10px] text-left px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300"
                        >
                          Student
                        </button>
                        <button
                          onClick={() => { demoLogin('content_manager'); setUserMenuOpen(false); }}
                          className="text-[10px] text-left px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-blue-300"
                        >
                          Content Mgr
                        </button>
                        <button
                          onClick={() => { demoLogin('admin'); setUserMenuOpen(false); }}
                          className="text-[10px] text-left px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-indigo-300"
                        >
                          Admin
                        </button>
                        <button
                          onClick={() => { demoLogin('super_admin'); setUserMenuOpen(false); }}
                          className="text-[10px] text-left px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-amber-300 font-bold"
                        >
                          Super Admin
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-slate-800 my-1">
                      <button
                        onClick={() => { setUserMenuOpen(false); logout(); }}
                        className="w-full text-left px-4 py-2.5 text-xs text-rose-400 hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs sm:text-sm border border-slate-700 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Primary Nav Ribbon (14 Categories as per Spec) */}
        <nav className="hidden lg:flex items-center justify-between py-2 border-t border-slate-800/80 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-1 xl:gap-2 flex-wrap">
            <button
              onClick={() => navigate('/')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${currentRoute === '/' ? 'text-emerald-400 bg-slate-800' : 'hover:text-white hover:bg-slate-800/50'}`}
            >
              Home
            </button>

            {/* Karnataka Board Dropdown */}
            <div className="relative group">
              <button
                onClick={() => navigate('/karnataka/sslc')}
                onMouseEnter={() => setBoardDropdownOpen(true)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${currentRoute.startsWith('/karnataka') ? 'text-emerald-400 bg-slate-800' : 'hover:text-white hover:bg-slate-800/50'}`}
              >
                <span>Karnataka Board</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {boardDropdownOpen && (
                <div
                  onMouseLeave={() => setBoardDropdownOpen(false)}
                  className="absolute left-0 mt-1 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-2 z-50 text-slate-200"
                >
                  <button
                    onClick={() => { setBoardDropdownOpen(false); navigate('/karnataka/sslc'); }}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-800 hover:text-emerald-400 flex items-center justify-between"
                  >
                    <span>SSLC (Class 10)</span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">KSEAB</span>
                  </button>
                  <button
                    onClick={() => { setBoardDropdownOpen(false); navigate('/karnataka/2nd-puc'); }}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-800 hover:text-emerald-400 flex items-center justify-between"
                  >
                    <span>2nd PUC (Class 12)</span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">DPUE</span>
                  </button>
                  <button
                    onClick={() => { setBoardDropdownOpen(false); navigate('/karnataka/2nd-puc/model-papers'); }}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-800 text-emerald-400 font-semibold flex items-center justify-between border-t border-slate-800"
                  >
                    <span>2nd PUC Model Papers</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 py-0.5 rounded">6 Subs</span>
                  </button>
                </div>
              )}
            </div>

            {/* CBSE Board Dropdown */}
            <div className="relative group">
              <button
                onClick={() => navigate('/cbse/class-10')}
                onMouseEnter={() => setCbseDropdownOpen(true)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${currentRoute.startsWith('/cbse') ? 'text-emerald-400 bg-slate-800' : 'hover:text-white hover:bg-slate-800/50'}`}
              >
                <span>CBSE Board</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {cbseDropdownOpen && (
                <div
                  onMouseLeave={() => setCbseDropdownOpen(false)}
                  className="absolute left-0 mt-1 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-2 z-50 text-slate-200"
                >
                  <button
                    onClick={() => { setCbseDropdownOpen(false); navigate('/cbse/class-10'); }}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-800 hover:text-emerald-400"
                  >
                    CBSE Class 10
                  </button>
                  <button
                    onClick={() => { setCbseDropdownOpen(false); navigate('/cbse/class-12'); }}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-800 hover:text-emerald-400"
                  >
                    CBSE Class 12
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/class-10')}
              className={`px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${currentRoute === '/class-10' ? 'text-emerald-400 bg-slate-800' : 'hover:text-white hover:bg-slate-800/50'}`}
            >
              Class 10
            </button>

            <button
              onClick={() => navigate('/class-12')}
              className={`px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${currentRoute === '/class-12' ? 'text-emerald-400 bg-slate-800' : 'hover:text-white hover:bg-slate-800/50'}`}
            >
              Class 12
            </button>

            <button
              onClick={() => navigate('/kcet')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors font-bold cursor-pointer ${currentRoute === '/kcet' ? 'text-amber-400 bg-slate-800' : 'text-amber-300 hover:text-white hover:bg-slate-800/50'}`}
            >
              KCET Prep
            </button>

            <button
              onClick={() => navigate('/neet')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors font-bold cursor-pointer ${currentRoute === '/neet' ? 'text-cyan-400 bg-slate-800' : 'text-cyan-300 hover:text-white hover:bg-slate-800/50'}`}
            >
              NEET Prep
            </button>

            <button
              onClick={() => navigate('/papers')}
              className={`px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${currentRoute === '/papers' ? 'text-emerald-400 bg-slate-800' : 'hover:text-white hover:bg-slate-800/50'}`}
            >
              Paper Library
            </button>

            <button
              onClick={() => navigate('/scholarships')}
              className={`px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${currentRoute.startsWith('/scholarships') ? 'text-emerald-400 bg-slate-800 font-bold' : 'hover:text-white hover:bg-slate-800/50'}`}
            >
              Scholarships
            </button>

            <button
              onClick={() => navigate('/study-notes')}
              className={`px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${currentRoute === '/study-notes' ? 'text-emerald-400 bg-slate-800' : 'hover:text-white hover:bg-slate-800/50'}`}
            >
              Study Notes
            </button>

            <button
              onClick={() => navigate('/mock-tests')}
              className={`px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${currentRoute === '/mock-tests' ? 'text-emerald-400 bg-slate-800' : 'hover:text-white hover:bg-slate-800/50'}`}
            >
              Mock Tests
            </button>

            <button
              onClick={() => navigate('/career-guidance')}
              className={`px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${currentRoute === '/career-guidance' ? 'text-emerald-400 bg-slate-800' : 'hover:text-white hover:bg-slate-800/50'}`}
            >
              Career Guidance
            </button>

            <button
              onClick={() => navigate('/ai-assistant')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
                currentRoute === '/ai-assistant' || currentRoute === '/chat'
                  ? 'bg-gradient-to-r from-indigo-600 to-emerald-600 text-white shadow-md'
                  : 'text-indigo-300 hover:text-white hover:bg-indigo-950/60 border border-indigo-500/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>AI Study Assistant</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/about')}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              About
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => navigate('/contact')}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              Contact
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-2">
          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search papers, KCET, scholarships..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full bg-slate-800 text-xs text-slate-100 placeholder-slate-400 pl-9 pr-3 py-2 rounded-xl border border-slate-700"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </form>

          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/'); }}
              className="p-2.5 rounded-lg bg-slate-800 text-left hover:text-emerald-400"
            >
              Home
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/karnataka/sslc'); }}
              className="p-2.5 rounded-lg bg-slate-800 text-left hover:text-emerald-400"
            >
              Karnataka SSLC
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/karnataka/2nd-puc'); }}
              className="p-2.5 rounded-lg bg-slate-800 text-left hover:text-emerald-400"
            >
              Karnataka 2nd PUC
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/cbse/class-10'); }}
              className="p-2.5 rounded-lg bg-slate-800 text-left hover:text-emerald-400"
            >
              CBSE Class 10
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/cbse/class-12'); }}
              className="p-2.5 rounded-lg bg-slate-800 text-left hover:text-emerald-400"
            >
              CBSE Class 12
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/kcet'); }}
              className="p-2.5 rounded-lg bg-amber-950/40 text-amber-300 text-left"
            >
              KCET Preparation
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/neet'); }}
              className="p-2.5 rounded-lg bg-cyan-950/40 text-cyan-300 text-left"
            >
              NEET Preparation
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/scholarships'); }}
              className="p-2.5 rounded-lg bg-emerald-950/40 text-emerald-300 font-bold text-left"
            >
              Scholarships Portal
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/papers'); }}
              className="p-2.5 rounded-lg bg-slate-800 text-left"
            >
              Question Papers
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/mock-tests'); }}
              className="p-2.5 rounded-lg bg-slate-800 text-left"
            >
              Mock Tests
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/study-notes'); }}
              className="p-2.5 rounded-lg bg-slate-800 text-left"
            >
              Study Notes
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/career-guidance'); }}
              className="p-2.5 rounded-lg bg-slate-800 text-left"
            >
              Career Guidance
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={() => { setMobileMenuOpen(false); openAIAssistant(); }}
              className="text-indigo-400 font-medium flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Study Mentor
            </button>
            {user ? (
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                className="text-emerald-400 font-bold"
              >
                My Dashboard &rarr;
              </button>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                className="text-slate-300 font-bold"
              >
                Student Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
