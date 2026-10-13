import React, { useState, useEffect } from 'react';
import { Resource } from '../types';
import { api } from '../api';
import { PaperCard } from '../components/PaperCard';
import { PucModelPapersSection } from '../components/PucModelPapersSection';
import {
  GraduationCap,
  BookOpen,
  Filter,
  Search,
  Download,
  FileText,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Layers,
  Award
} from 'lucide-react';

interface KarnatakaBoardPageProps {
  initialClass?: 'SSLC' | '2nd PUC';
  initialView?: 'all' | 'model-papers';
  onPreviewPaper: (resource: Resource) => void;
  navigate: (route: string) => void;
}

export const KarnatakaBoardPage: React.FC<KarnatakaBoardPageProps> = ({
  initialClass = 'SSLC',
  initialView = 'model-papers',
  onPreviewPaper,
  navigate
}) => {
  const [activeClass, setActiveClass] = useState<'SSLC' | '2nd PUC'>(initialClass);
  const [pucView, setPucView] = useState<'model-papers' | 'all'>(initialView);
  const [activeStream, setActiveStream] = useState<string>('all');
  const [activeSubject, setActiveSubject] = useState<string>('all');
  const [paperType, setPaperType] = useState<string>('all');
  const [language, setLanguage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [papers, setPapers] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveClass(initialClass);
  }, [initialClass]);

  const loadPapers = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        board: 'Karnataka',
        classLevel: activeClass,
        limit: '50'
      };
      if (activeStream !== 'all') params.stream = activeStream;
      if (activeSubject !== 'all') params.subject = activeSubject;
      if (paperType !== 'all') params.paperType = paperType;
      if (language !== 'all') params.language = language;
      if (searchQuery.trim()) params.query = searchQuery.trim();

      const res = await api.getResources(params);
      setPapers(res.resources);
    } catch (e) {
      console.error('Error fetching Karnataka papers', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPapers();
  }, [activeClass, activeStream, activeSubject, paperType, language]);

  const sslcSubjects = ['Mathematics', 'Science', 'Social Science', 'Kannada', 'English'];
  const pucSubjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Accountancy', 'Business Studies', 'Economics', 'Computer Science', 'English'];

  const currentSubjects = activeClass === 'SSLC' ? sslcSubjects : pucSubjects;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold uppercase">
              Karnataka School Examination and Assessment Board (KSEAB) & DPUE
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Karnataka State Board Academic Repository
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Access authentic SSLC (Class 10) and 2nd PUC (Class 12) board examination papers, official model question papers, scoring keys, and blueprints in English and Kannada mediums.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/scholarships/karnataka')}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
            >
              Karnataka SSP Scholarships &rarr;
            </button>
          </div>
        </div>

        {/* Primary Class Tabs */}
        <div className="mt-8 flex items-center gap-3 border-t border-slate-800 pt-6">
          <button
            onClick={() => { setActiveClass('SSLC'); setActiveSubject('all'); setActiveStream('all'); }}
            className={`px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeClass === 'SSLC'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Karnataka SSLC (Class 10)</span>
          </button>

          <button
            onClick={() => { setActiveClass('2nd PUC'); setActiveSubject('all'); }}
            className={`px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeClass === '2nd PUC'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Karnataka 2nd PUC (Class 12)</span>
          </button>
        </div>

        {/* 2nd PUC Specific Sub-view Switcher */}
        {activeClass === '2nd PUC' && (
          <div className="mt-5 flex items-center gap-2 pt-4 border-t border-slate-800/80">
            <span className="text-slate-400 font-mono text-[11px] uppercase mr-2">Section:</span>
            <button
              onClick={() => setPucView('model-papers')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                pucView === 'model-papers'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Official Model Papers (6 Subjects)</span>
            </button>

            <button
              onClick={() => setPucView('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                pucView === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All 2nd PUC Papers & Question Banks</span>
            </button>
          </div>
        )}
      </div>

      {/* Render 2nd PUC Model Papers Section */}
      {activeClass === '2nd PUC' && pucView === 'model-papers' && (
        <PucModelPapersSection onPreviewPaper={onPreviewPaper} navigate={navigate} />
      )}

      {/* Filter Toolbar (Rendered for SSLC or when 2nd PUC All Papers view is active) */}
      {(activeClass === 'SSLC' || pucView === 'all') && (
        <>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            {/* Stream Pills (if 2nd PUC) */}
            {activeClass === '2nd PUC' && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-slate-400 font-mono text-[11px] uppercase mr-1">Stream:</span>
                {['all', 'Science', 'Commerce', 'Arts'].map((stream) => (
                  <button
                    key={stream}
                    onClick={() => setActiveStream(stream)}
                    className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
                      activeStream === stream
                        ? 'bg-slate-700 text-white font-bold'
                        : 'bg-slate-800/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    {stream === 'all' ? 'All Streams' : stream}
                  </button>
                ))}
              </div>
            )}

        {/* Subjects bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-slate-400 font-mono text-[11px] uppercase mr-1">Subject:</span>
          <button
            onClick={() => setActiveSubject('all')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap ${
              activeSubject === 'all' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'bg-slate-800/60 text-slate-400'
            }`}
          >
            All Subjects
          </button>
          {currentSubjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap ${
                activeSubject === sub ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Secondary filters row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by chapter, keyword or year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadPapers()}
              className="w-full bg-slate-800/90 text-white placeholder-slate-500 pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <select
              value={paperType}
              onChange={(e) => setPaperType(e.target.value)}
              className="w-full bg-slate-800 text-slate-300 px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none"
            >
              <option value="all">All Paper Types</option>
              <option value="Previous-Year Paper">Previous-Year Papers</option>
              <option value="Official Model Paper">Official Model Papers</option>
              <option value="Question Bank">Question Banks</option>
              <option value="Important Questions">Important Questions</option>
            </select>
          </div>

          <div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-800 text-slate-300 px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none"
            >
              <option value="all">All Mediums</option>
              <option value="English">English Medium</option>
              <option value="Kannada">Kannada Medium</option>
              <option value="Both">Both Mediums</option>
            </select>
          </div>
        </div>
      </div>

      {/* Question Papers Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Found <strong className="text-white">{papers.length}</strong> official question papers & materials</span>
          <span className="font-mono">KSEAB Blueprint Compliant</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            Loading Karnataka Board papers...
          </div>
        ) : papers.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <FileText className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No question papers match the selected criteria</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try resetting subject or paper type filters, or explore our complete question paper library.
            </p>
            <button
              onClick={() => { setActiveSubject('all'); setActiveStream('all'); setPaperType('all'); setLanguage('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-amber-400 font-semibold text-xs border border-slate-700"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {papers.map((paper) => (
              <PaperCard
                key={paper.id}
                resource={paper}
                onPreview={onPreviewPaper}
                onDownload={onPreviewPaper}
              />
            ))}
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
};
