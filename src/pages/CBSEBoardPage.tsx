import React, { useState, useEffect } from 'react';
import { Resource } from '../types';
import { api } from '../api';
import { PaperCard } from '../components/PaperCard';
import {
  GraduationCap,
  BookOpen,
  Filter,
  Search,
  FileText,
  CheckCircle,
  HelpCircle,
  Award
} from 'lucide-react';

interface CBSEBoardPageProps {
  initialClass?: 'Class 10' | 'Class 12';
  onPreviewPaper: (resource: Resource) => void;
  navigate: (route: string) => void;
}

export const CBSEBoardPage: React.FC<CBSEBoardPageProps> = ({
  initialClass = 'Class 10',
  onPreviewPaper,
  navigate
}) => {
  const [activeClass, setActiveClass] = useState<'Class 10' | 'Class 12'>(initialClass);
  const [activeStream, setActiveStream] = useState<string>('all');
  const [activeSubject, setActiveSubject] = useState<string>('all');
  const [paperType, setPaperType] = useState<string>('all');
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
        board: 'CBSE',
        classLevel: activeClass,
        limit: '50'
      };
      if (activeStream !== 'all') params.stream = activeStream;
      if (activeSubject !== 'all') params.subject = activeSubject;
      if (paperType !== 'all') params.paperType = paperType;
      if (searchQuery.trim()) params.query = searchQuery.trim();

      const res = await api.getResources(params);
      setPapers(res.resources);
    } catch (e) {
      console.error('Error fetching CBSE papers', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPapers();
  }, [activeClass, activeStream, activeSubject, paperType]);

  const class10Subjects = ['Mathematics', 'Science', 'Social Science', 'English'];
  const class12Subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'Accountancy', 'Economics', 'English'];

  const currentSubjects = activeClass === 'Class 10' ? class10Subjects : class12Subjects;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold uppercase">
              Central Board of Secondary Education (CBSE Academic Unit)
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              CBSE Examination & Marking Scheme Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Official CBSE sample question papers (SQP), previous-year board exam sets, and verified step-by-step marking scheme rubrics for Class 10 and Class 12.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/scholarships/cbse')}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
            >
              CBSE Merit Scholarships &rarr;
            </button>
          </div>
        </div>

        {/* Primary Class Tabs */}
        <div className="mt-8 flex items-center gap-3 border-t border-slate-800 pt-6">
          <button
            onClick={() => { setActiveClass('Class 10'); setActiveSubject('all'); setActiveStream('all'); }}
            className={`px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeClass === 'Class 10'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>CBSE Class 10 (AISSE)</span>
          </button>

          <button
            onClick={() => { setActiveClass('Class 12'); setActiveSubject('all'); }}
            className={`px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeClass === 'Class 12'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>CBSE Class 12 (AISSCE)</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        {activeClass === 'Class 12' && (
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

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-slate-400 font-mono text-[11px] uppercase mr-1">Subject:</span>
          <button
            onClick={() => setActiveSubject('all')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap ${
              activeSubject === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'bg-slate-800/60 text-slate-400'
            }`}
          >
            All Subjects
          </button>
          {currentSubjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap ${
                activeSubject === sub ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search CBSE board papers, marking schemes, formulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadPapers()}
              className="w-full bg-slate-800/90 text-white placeholder-slate-500 pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
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
              <option value="Sample Paper">Official Sample Papers (SQP)</option>
              <option value="Official Model Paper">Model Papers</option>
              <option value="Question Bank">Question Banks</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Found <strong className="text-white">{papers.length}</strong> CBSE examination papers</span>
          <span className="font-mono">Includes Evaluator Guidelines</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            Loading CBSE examination repository...
          </div>
        ) : papers.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <FileText className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No papers match your filters</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your stream or subject selection.
            </p>
            <button
              onClick={() => { setActiveSubject('all'); setActiveStream('all'); setPaperType('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-cyan-400 font-semibold text-xs border border-slate-700"
            >
              Reset Filters
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
    </div>
  );
};
