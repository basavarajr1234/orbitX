import React, { useState, useEffect } from 'react';
import { Scholarship, ScholarshipCategory } from '../types';
import { api } from '../api';
import { ScholarshipCard } from '../components/ScholarshipCard';
import { useAuth } from '../context/AuthContext';
import {
  Award,
  Filter,
  Search,
  CheckCircle,
  HelpCircle,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  RotateCcw,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface ScholarshipPortalPageProps {
  initialFilter?: {
    classLevel?: string;
    board?: string;
    state?: string;
    categorySlug?: string;
  };
}

export const ScholarshipPortalPage: React.FC<ScholarshipPortalPageProps> = ({ initialFilter }) => {
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [categories, setCategories] = useState<ScholarshipCategory[]>([]);
  const [savedScholarshipIds, setSavedScholarshipIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialFilter?.categorySlug || 'all');
  const [selectedClass, setSelectedClass] = useState(initialFilter?.classLevel || 'all');
  const [selectedBoard, setSelectedBoard] = useState(initialFilter?.board || 'all');
  const [selectedState, setSelectedState] = useState(initialFilter?.state || 'all');

  // Eligibility Matcher state
  const [matcherOpen, setMatcherOpen] = useState(false);
  const [matchCriteria, setMatchCriteria] = useState({
    currentClass: '2nd PUC',
    board: 'Karnataka State Board',
    state: 'Karnataka',
    socialCategory: 'OBC',
    annualIncome: 200000,
    marksPercentage: 82,
    gender: 'All',
    hasDisability: false
  });
  const [matchResults, setMatchResults] = useState<any[] | null>(null);
  const [matchingLoading, setMatchingLoading] = useState(false);

  // Sync initial filter props
  useEffect(() => {
    if (initialFilter?.categorySlug) setSelectedCategory(initialFilter.categorySlug);
    if (initialFilter?.classLevel) setSelectedClass(initialFilter.classLevel);
    if (initialFilter?.board) setSelectedBoard(initialFilter.board);
    if (initialFilter?.state) setSelectedState(initialFilter.state);
  }, [initialFilter]);

  // Load user saved scholarships
  useEffect(() => {
    if (user) {
      api.getSavedScholarships().then(res => {
        setSavedScholarshipIds(res.map(s => s.id));
      }).catch(() => {});
    }
  }, [user]);

  // Load Categories & Scholarships
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, schRes] = await Promise.all([
          api.getCategories(),
          api.getScholarships({
            search: search.trim(),
            categorySlug: selectedCategory !== 'all' ? selectedCategory : '',
            classLevel: selectedClass !== 'all' ? selectedClass : '',
            board: selectedBoard !== 'all' ? selectedBoard : '',
            state: selectedState !== 'all' ? selectedState : ''
          })
        ]);
        setCategories(catRes);
        setScholarships(schRes.scholarships);
      } catch (e) {
        console.error('Failed to load scholarships', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search, selectedCategory, selectedClass, selectedBoard, selectedState]);

  const handleToggleSave = async (scholarship: Scholarship) => {
    if (!user) {
      alert('Please sign in with Google to bookmark and track upcoming scholarship deadlines.');
      return;
    }
    const isSaved = savedScholarshipIds.includes(scholarship.id);
    if (isSaved) {
      await api.removeSavedScholarship(scholarship.id);
      setSavedScholarshipIds(prev => prev.filter(id => id !== scholarship.id));
    } else {
      await api.saveScholarship(scholarship.id);
      setSavedScholarshipIds(prev => [...prev, scholarship.id]);
    }
  };

  const runEligibilityMatcher = async (e: React.FormEvent) => {
    e.preventDefault();
    setMatchingLoading(true);
    try {
      const res = await api.matchScholarships(matchCriteria);
      setMatchResults(res.matches);
    } catch (e) {
      console.error('Matching failed', e);
    } finally {
      setMatchingLoading(false);
    }
  };

  const resetAllFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedClass('all');
    setSelectedBoard('all');
    setSelectedState('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-800/40 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold uppercase">
              <Award className="w-3.5 h-3.5" /> 24 Verified Scholarship Categories
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Verified Scholarships Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Find transparent, authenticated financial aid for Karnataka SSLC, 2nd PUC, CBSE Class 10 & 12, Engineering, and Medical degree courses. Every opportunity has direct official links and verified criteria.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setMatcherOpen(!matcherOpen)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{matcherOpen ? 'Hide Matcher Tool' : 'Find Matching Scholarships'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Scholarship Eligibility Matching Engine (Section 12) */}
      {matcherOpen && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-400">
                <Sparkles className="w-5 h-5" />
                <h2 className="text-xl font-bold text-white">Rule-Based Scholarship Eligibility Matcher</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Enter your academic and family criteria to instantly calculate matching schemes with verified eligibility explanations.
              </p>
            </div>
          </div>

          <form onSubmit={runEligibilityMatcher} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Current Academic Level</label>
              <select
                value={matchCriteria.currentClass}
                onChange={(e) => setMatchCriteria({ ...matchCriteria, currentClass: e.target.value })}
                className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700"
              >
                <option value="Class 10">Class 10 / SSLC</option>
                <option value="Class 11">Class 11 / 1st PUC</option>
                <option value="2nd PUC">2nd PUC / Class 12</option>
                <option value="Undergraduate">Undergraduate Degree</option>
                <option value="Engineering">Engineering (B.E / B.Tech)</option>
                <option value="Medical">Medical (MBBS / BDS)</option>
                <option value="Diploma">Polytechnic Diploma</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Education Board</label>
              <select
                value={matchCriteria.board}
                onChange={(e) => setMatchCriteria({ ...matchCriteria, board: e.target.value })}
                className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700"
              >
                <option value="Karnataka State Board">Karnataka State Board</option>
                <option value="CBSE">CBSE Board</option>
                <option value="All Boards">Other / Open School</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">State of Domicile</label>
              <select
                value={matchCriteria.state}
                onChange={(e) => setMatchCriteria({ ...matchCriteria, state: e.target.value })}
                className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700"
              >
                <option value="Karnataka">Karnataka</option>
                <option value="All India">Other Indian State</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Social Category</label>
              <select
                value={matchCriteria.socialCategory}
                onChange={(e) => setMatchCriteria({ ...matchCriteria, socialCategory: e.target.value })}
                className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700"
              >
                <option value="General">General Merit (GM)</option>
                <option value="OBC">OBC (Cat-1, 2A, 2B, 3A, 3B)</option>
                <option value="SC">Scheduled Caste (SC)</option>
                <option value="ST">Scheduled Tribe (ST)</option>
                <option value="Minority">Religious Minority</option>
                <option value="EWS">Economically Weaker Section (EWS)</option>
                <option value="Prefer Not to Say">Prefer Not to Say</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Annual Family Income (₹)</label>
              <input
                type="number"
                step="25000"
                value={matchCriteria.annualIncome}
                onChange={(e) => setMatchCriteria({ ...matchCriteria, annualIncome: Number(e.target.value) })}
                className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Academic Score / Percentage (%)</label>
              <input
                type="number"
                min="35"
                max="100"
                value={matchCriteria.marksPercentage}
                onChange={(e) => setMatchCriteria({ ...matchCriteria, marksPercentage: Number(e.target.value) })}
                className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Gender Eligibility</label>
              <select
                value={matchCriteria.gender}
                onChange={(e) => setMatchCriteria({ ...matchCriteria, gender: e.target.value })}
                className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700"
              >
                <option value="All">All / Male</option>
                <option value="Female">Female (Girl Student)</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={matchCriteria.hasDisability}
                  onChange={(e) => setMatchCriteria({ ...matchCriteria, hasDisability: e.target.checked })}
                  className="accent-emerald-500 w-4 h-4"
                />
                <span className="text-xs">Benchmark Disability (40%+)</span>
              </label>
            </div>

            <div className="sm:col-span-2 lg:col-span-4 pt-2">
              <button
                type="submit"
                disabled={matchingLoading}
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                {matchingLoading ? 'Analyzing Eligibility Criteria...' : 'Match My Scholarships Now'}
              </button>
            </div>
          </form>

          {/* Results display */}
          {matchResults && (
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center justify-between">
                <span>Matching Scholarships Results ({matchResults.filter(r => r.isEligible).length} Eligible)</span>
                <span className="text-xs text-slate-400 font-normal">Ranked by rule compliance score</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {matchResults.slice(0, 6).map((item, i) => (
                  <div
                    key={i}
                    className={`bg-slate-950/90 border rounded-2xl p-5 flex flex-col justify-between space-y-4 ${
                      item.isEligible ? 'border-emerald-500/50' : 'border-slate-800 opacity-70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                          item.isEligible ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.matchScore}% Match
                        </span>
                        <span className="text-xs font-bold text-emerald-400">
                          {item.scholarship.benefitAmount}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white leading-snug">
                        {item.scholarship.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">{item.scholarship.provider}</p>

                      <div className="mt-3 space-y-1 text-xs">
                        {item.reasons.map((r: string, idx: number) => (
                          <p key={idx} className="text-emerald-400/90 text-[11px] flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{r}</span>
                          </p>
                        ))}
                        {item.missingConditions.map((c: string, idx: number) => (
                          <p key={idx} className="text-amber-400/90 text-[11px] flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{c}</span>
                          </p>
                        ))}
                      </div>
                    </div>

                    <a
                      href={item.scholarship.officialApplyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs text-center shadow-sm"
                    >
                      Apply Officially &rarr;
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Category Pills & Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        {/* Search & Quick Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search scheme name, provider, or benefit amount..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 text-white placeholder-slate-500 pl-10 pr-3 py-2.5 rounded-xl border border-slate-700"
            />
          </div>

          <div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-slate-800 text-slate-300 p-2.5 rounded-xl border border-slate-700"
            >
              <option value="all">All Class Levels</option>
              <option value="Class 10">Class 10 / SSLC</option>
              <option value="Class 12">Class 12 / 2nd PUC</option>
              <option value="Undergraduate">Undergraduate Degree</option>
              <option value="Engineering">Engineering</option>
              <option value="Diploma">Diploma</option>
            </select>
          </div>

          <div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-slate-800 text-slate-300 p-2.5 rounded-xl border border-slate-700"
            >
              <option value="all">All India & Karnataka</option>
              <option value="Karnataka">Karnataka State Only</option>
              <option value="All India">All India Schemes</option>
            </select>
          </div>
        </div>

        {/* 24 Categories Ribbon */}
        <div className="pt-2">
          <p className="text-slate-400 font-mono text-[11px] uppercase mb-2">
            Filter by Category ({categories.length} Registered Categories):
          </p>
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedCategory === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  selectedCategory === cat.slug
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
          <span>Found <strong>{scholarships.length}</strong> verified opportunities</span>
          <button
            onClick={resetAllFilters}
            className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Scholarships Grid */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 text-sm">
          Loading verified scholarships...
        </div>
      ) : scholarships.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <Award className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No scholarships match your filters</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try choosing 'All Categories' or resetting state domicile filters.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 rounded-xl bg-slate-800 text-emerald-400 font-semibold text-xs border border-slate-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map((sch) => (
            <ScholarshipCard
              key={sch.id}
              scholarship={sch}
              isSaved={savedScholarshipIds.includes(sch.id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
};
