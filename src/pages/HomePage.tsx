import React, { useState, useEffect } from 'react';
import { Resource, Scholarship, Announcement } from '../types';
import { api } from '../api';
import { PaperCard } from '../components/PaperCard';
import { ScholarshipCard } from '../components/ScholarshipCard';
import {
  Search,
  BookOpen,
  GraduationCap,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Compass,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
  Layers,
  ChevronRight
} from 'lucide-react';

interface HomePageProps {
  navigate: (route: string, params?: Record<string, string>) => void;
  onPreviewPaper: (resource: Resource) => void;
  openAIAssistant: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate, onPreviewPaper, openAIAssistant }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBoardFilter, setSelectedBoardFilter] = useState('all');
  const [recentPapers, setRecentPapers] = useState<Resource[]>([]);
  const [popularPapers, setPopularPapers] = useState<Resource[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recentRes, popRes, schRes, annRes] = await Promise.all([
          api.getResources({ limit: '6', sort: 'newest' }),
          api.getResources({ limit: '4', sort: 'popular' }),
          api.getScholarships({ limit: '4', featured: 'true' }),
          api.getAnnouncements()
        ]);
        setRecentPapers(recentRes.resources);
        setPopularPapers(popRes.resources);
        setScholarships(schRes.scholarships);
        setAnnouncements(annRes);
      } catch (e) {
        console.error('Error fetching homepage data', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate('/papers', { query: searchTerm.trim() });
    } else {
      navigate('/papers');
    }
  };

  const quickAccessCards = [
    {
      title: 'Karnataka SSLC',
      subtitle: 'Class 10 State Board',
      desc: 'Annual papers, KSEAB model question papers, blueprints, scoring keys & question banks.',
      badge: 'KSEAB Official',
      color: 'from-amber-500/20 to-amber-600/5 text-amber-300 border-amber-500/30 hover:border-amber-400',
      route: '/karnataka/sslc'
    },
    {
      title: 'Karnataka 2nd PUC',
      subtitle: 'Class 12 (Science / Comm / Arts)',
      desc: 'DPUE Physics, Chemistry, Maths, Biology, Accountancy & Economics board papers.',
      badge: 'NCERT Pattern',
      color: 'from-blue-500/20 to-blue-600/5 text-blue-300 border-blue-500/30 hover:border-blue-400',
      route: '/karnataka/2nd-puc'
    },
    {
      title: 'CBSE Class 10',
      subtitle: 'Secondary Examination',
      desc: 'Official CBSE sample question papers, marking scheme rubrics & chapter revision notes.',
      badge: 'CBSE Academic',
      color: 'from-emerald-500/20 to-emerald-600/5 text-emerald-300 border-emerald-500/30 hover:border-emerald-400',
      route: '/cbse/class-10'
    },
    {
      title: 'CBSE Class 12',
      subtitle: 'Senior School Certificate',
      desc: 'Previous-year board question papers with step-by-step solutions for PCMB & Commerce.',
      badge: 'Full Solutions',
      color: 'from-cyan-500/20 to-cyan-600/5 text-cyan-300 border-cyan-500/30 hover:border-cyan-400',
      route: '/cbse/class-12'
    },
    {
      title: 'KCET Preparation',
      subtitle: 'KEA Engineering & Agri',
      desc: 'Physics, Chemistry & Maths past papers, speed shortcuts, and chapter weightage.',
      badge: 'Top Ranks Guide',
      color: 'from-orange-500/20 to-orange-600/5 text-orange-300 border-orange-500/30 hover:border-orange-400',
      route: '/kcet'
    },
    {
      title: 'NEET Preparation',
      subtitle: 'NTA Medical UG Entrance',
      desc: 'NCERT line-by-line Biology MCQs, official NTA question papers & timed mock tests.',
      badge: '360/360 Bio Focus',
      color: 'from-rose-500/20 to-rose-600/5 text-rose-300 border-rose-500/30 hover:border-rose-400',
      route: '/neet'
    },
    {
      title: 'Verified Scholarships',
      subtitle: '24 Curated Categories',
      desc: 'SSP Karnataka, Vidyasiri ePASS, NMMS, HDFC Parivartan, Kotak Kanya & Girl Grants.',
      badge: 'Direct Official Link',
      color: 'from-teal-500/20 to-teal-600/5 text-teal-300 border-teal-500/30 hover:border-teal-400',
      route: '/scholarships'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Subtle grid background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-emerald-400 shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dedicated Karnataka State Board & CBSE Academic Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Everything You Need for Your <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Next Academic Step.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Orbit X brings verified previous-year question papers, official model papers, blueprints, KCET & NEET preparation modules, and legitimate state & central government scholarships together into one intuitive platform.
          </p>

          {/* Hero Global Search Form */}
          <form
            onSubmit={handleHeroSearch}
            className="max-w-2xl mx-auto bg-slate-800/90 p-2 sm:p-2.5 rounded-2xl border border-slate-700 shadow-2xl flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search subject, SSLC, 2nd PUC, KCET Physics, SSP Scholarship..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent pl-11 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedBoardFilter}
                onChange={(e) => setSelectedBoardFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
              >
                <option value="all">All Boards</option>
                <option value="Karnataka">Karnataka Board</option>
                <option value="CBSE">CBSE Board</option>
              </select>

              <button
                type="submit"
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer whitespace-nowrap"
              >
                Search Papers
              </button>
            </div>
          </form>

          {/* Quick Filter Tags */}
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-slate-400 pt-1">
            <span className="font-mono text-[11px] text-slate-500">Popular Searches:</span>
            {[
              { label: 'SSLC Maths 2024', route: '/karnataka/sslc' },
              { label: '2nd PUC Physics', route: '/karnataka/2nd-puc' },
              { label: 'KCET Maths Paper', route: '/kcet' },
              { label: 'NEET 2024 Key', route: '/neet' },
              { label: 'Vidyasiri ePASS', route: '/scholarships/karnataka' },
              { label: 'SSP Post-Matric', route: '/scholarships/karnataka' }
            ].map((tag, i) => (
              <button
                key={i}
                onClick={() => navigate(tag.route)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements Ticker / Alerts */}
      {announcements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold uppercase font-mono tracking-wider shrink-0">
                <AlertCircle className="w-3.5 h-3.5" /> Latest Notice
              </span>
              <div className="overflow-hidden flex-1">
                <p className="text-xs sm:text-sm text-slate-200 font-medium truncate">
                  <span className="font-bold text-white">{announcements[0].title}:</span> {announcements[0].content}
                </p>
              </div>
              {announcements[0].link && (
                <button
                  onClick={() => navigate(announcements[0].link!)}
                  className="text-xs text-emerald-400 font-bold hover:underline shrink-0"
                >
                  View Details &rarr;
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Quick-Access Academic Portals (Section 4) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Academic & Examination Portals
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select your academic stream to access chapter-wise question papers, blueprints, and preparation guides.
            </p>
          </div>
          <button
            onClick={() => navigate('/papers')}
            className="text-xs sm:text-sm text-emerald-400 font-bold hover:text-emerald-300 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Explore All 1,400+ Resources</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {quickAccessCards.map((c, idx) => (
            <div
              key={idx}
              onClick={() => navigate(c.route)}
              className={`bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between hover:scale-[1.02] transition-all duration-200 cursor-pointer group shadow-lg shadow-slate-950/20 ${c.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {c.badge}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-400 transition-all" />
                </div>
                <h3 className="text-base font-bold text-white mb-0.5 group-hover:text-emerald-300 transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium mb-2.5">
                  {c.subtitle}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">Open Resource Library</span>
                <span className="text-emerald-400">&rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Uploaded Question Papers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Recently Added Question Papers
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Latest official papers uploaded and verified by Orbit X academic moderators.
            </p>
          </div>
          <button
            onClick={() => navigate('/papers')}
            className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
          >
            View All Papers
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentPapers.map((paper) => (
            <PaperCard
              key={paper.id}
              resource={paper}
              onPreview={onPreviewPaper}
              onDownload={onPreviewPaper}
            />
          ))}
        </div>
      </section>

      {/* Verified Scholarships Highlights Banner (Section 12) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-900/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono">
                <Award className="w-3.5 h-3.5" /> Orbit X Verified Scholarship Portal
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Never Miss a Scholarship Opportunity Again.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Filter across 24 verified categories including Karnataka Government SSP, Vidyasiri, NMMS for Class 10, Central Sector Schemes, and CSR Foundation grants.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => navigate('/scholarships')}
                className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                Check My Eligibility
              </button>
              <button
                onClick={() => navigate('/scholarships/karnataka')}
                className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs sm:text-sm border border-slate-700 transition-colors"
              >
                Karnataka State Schemes
              </button>
            </div>
          </div>

          {/* Featured Scholarships Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {scholarships.slice(0, 3).map((sch) => (
              <ScholarshipCard key={sch.id} scholarship={sch} />
            ))}
          </div>
        </div>
      </section>

      {/* KCET & NEET Preparation Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* KCET Box */}
          <div className="bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-800/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-mono uppercase font-bold text-amber-400 bg-amber-500/15 px-2.5 py-1 rounded-md border border-amber-500/30">
                KEA Engineering & Agri Entrance
              </span>
              <h3 className="text-2xl font-bold text-white mt-3">
                KCET Complete Preparation Hub
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Physics, Chemistry & Mathematics previous 10 years papers, KEA syllabus breakdown, high-yield shortcut formulas, and branch cutoff estimation.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => navigate('/mock-tests')}
                className="text-xs text-amber-300 font-bold hover:underline"
              >
                Take KCET Mock Test &rarr;
              </button>
              <button
                onClick={() => navigate('/kcet')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Open KCET Portal
              </button>
            </div>
          </div>

          {/* NEET Box */}
          <div className="bg-gradient-to-br from-cyan-950/30 to-slate-900 border border-cyan-800/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-mono uppercase font-bold text-cyan-400 bg-cyan-500/15 px-2.5 py-1 rounded-md border border-cyan-500/30">
                NTA Medical UG Entrance
              </span>
              <h3 className="text-2xl font-bold text-white mt-3">
                NEET 2025 High-Yield Module
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                NCERT line-by-line Biology MCQ banks, past year official question papers with verified NTA answer keys, Physics formula sheets, and Chemistry organic mechanisms.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => navigate('/mock-tests')}
                className="text-xs text-cyan-300 font-bold hover:underline"
              >
                Take NEET Bio Mock &rarr;
              </button>
              <button
                onClick={() => navigate('/neet')}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Open NEET Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Career Guidance Roadmap Banner (Section 4 & 17) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-semibold">
              <Compass className="w-4 h-4" /> Career Guidance & Next Steps
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Unsure which path to choose after Class 10 or Class 12?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Explore stream roadmaps across Science, Commerce, Arts, Polytechnic Diplomas, ITI, CA Foundation, KCET Engineering, and NEET Medical careers.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/career-guidance')}
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-colors"
            >
              View Career Maps
            </button>
            <button
              onClick={openAIAssistant}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI Mentor</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
