import React, { useState, useEffect } from 'react';
import { Resource } from '../types';
import { api } from '../api';
import { PaperCard } from '../components/PaperCard';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Filter,
  Layers,
  FileText,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

interface QuestionPaperLibraryPageProps {
  initialQuery?: string;
  onPreviewPaper: (resource: Resource) => void;
}

export const QuestionPaperLibraryPage: React.FC<QuestionPaperLibraryPageProps> = ({
  initialQuery = '',
  onPreviewPaper
}) => {
  const { user } = useAuth();
  const [query, setQuery] = useState(initialQuery);
  const [board, setBoard] = useState('all');
  const [classLevel, setClassLevel] = useState('all');
  const [stream, setStream] = useState('all');
  const [subject, setSubject] = useState('all');
  const [examYear, setExamYear] = useState('all');
  const [paperType, setPaperType] = useState('all');
  const [language, setLanguage] = useState('all');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [papers, setPapers] = useState<Resource[]>([]);
  const [savedPaperIds, setSavedPaperIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync initial query
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  // Load user saved papers
  useEffect(() => {
    if (user) {
      api.getSavedPapers().then(res => {
        setSavedPaperIds(res.map(r => r.id));
      }).catch(() => {});
    }
  }, [user]);

  const loadResources = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: '12',
        sort
      };
      if (query.trim()) params.query = query.trim();
      if (board !== 'all') params.board = board;
      if (classLevel !== 'all') params.classLevel = classLevel;
      if (stream !== 'all') params.stream = stream;
      if (subject !== 'all') params.subject = subject;
      if (examYear !== 'all') params.examYear = examYear;
      if (paperType !== 'all') params.paperType = paperType;
      if (language !== 'all') params.language = language;

      const res = await api.getResources(params);
      setPapers(res.resources);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.total || 0);
    } catch (e) {
      console.error('Failed to load papers library', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, [board, classLevel, stream, subject, examYear, paperType, language, sort, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadResources();
  };

  const handleToggleSave = async (resource: Resource) => {
    if (!user) {
      alert('Please log in with Google to save question papers to your personal dashboard.');
      return;
    }
    const isSaved = savedPaperIds.includes(resource.id);
    if (isSaved) {
      await api.removeSavedPaper(resource.id);
      setSavedPaperIds(prev => prev.filter(id => id !== resource.id));
    } else {
      await api.savePaper(resource.id);
      setSavedPaperIds(prev => [...prev, resource.id]);
    }
  };

  const resetFilters = () => {
    setQuery('');
    setBoard('all');
    setClassLevel('all');
    setStream('all');
    setSubject('all');
    setExamYear('all');
    setPaperType('all');
    setLanguage('all');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Master Question Paper & Resource Library
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Search, filter, preview, and download verified previous-year question papers, official model question papers, and question banks for Karnataka State Board & CBSE.
        </p>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
        {/* Search Row */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by topic, paper title, subject, or publisher..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-800 text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* 7-Point Multi-Filter Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 text-xs">
          {/* Board */}
          <div>
            <label className="text-slate-400 font-mono text-[11px] block mb-1">Board</label>
            <select
              value={board}
              onChange={(e) => { setBoard(e.target.value); setPage(1); }}
              className="w-full bg-slate-800 text-slate-200 p-2 rounded-xl border border-slate-700 focus:outline-none"
            >
              <option value="all">All Boards</option>
              <option value="Karnataka">Karnataka State Board</option>
              <option value="CBSE">CBSE Board</option>
            </select>
          </div>

          {/* Class */}
          <div>
            <label className="text-slate-400 font-mono text-[11px] block mb-1">Class / Level</label>
            <select
              value={classLevel}
              onChange={(e) => { setClassLevel(e.target.value); setPage(1); }}
              className="w-full bg-slate-800 text-slate-200 p-2 rounded-xl border border-slate-700 focus:outline-none"
            >
              <option value="all">All Classes</option>
              <option value="SSLC">Karnataka SSLC</option>
              <option value="2nd PUC">Karnataka 2nd PUC</option>
              <option value="Class 10">CBSE Class 10</option>
              <option value="Class 12">CBSE Class 12</option>
            </select>
          </div>

          {/* Stream */}
          <div>
            <label className="text-slate-400 font-mono text-[11px] block mb-1">Stream</label>
            <select
              value={stream}
              onChange={(e) => { setStream(e.target.value); setPage(1); }}
              className="w-full bg-slate-800 text-slate-200 p-2 rounded-xl border border-slate-700 focus:outline-none"
            >
              <option value="all">All Streams</option>
              <option value="Science">Science (PCMB/CS)</option>
              <option value="Commerce">Commerce</option>
              <option value="Arts">Arts / Humanities</option>
              <option value="General">General / Class 10</option>
            </select>
          </div>

          {/* Paper Type */}
          <div>
            <label className="text-slate-400 font-mono text-[11px] block mb-1">Paper Type</label>
            <select
              value={paperType}
              onChange={(e) => { setPaperType(e.target.value); setPage(1); }}
              className="w-full bg-slate-800 text-slate-200 p-2 rounded-xl border border-slate-700 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="Previous-Year Paper">Previous-Year Paper</option>
              <option value="Official Model Paper">Official Model Paper</option>
              <option value="Sample Paper">Sample Paper</option>
              <option value="Question Bank">Question Bank</option>
              <option value="Important Questions">Important Questions</option>
            </select>
          </div>

          {/* Exam Year */}
          <div>
            <label className="text-slate-400 font-mono text-[11px] block mb-1">Exam Year</label>
            <select
              value={examYear}
              onChange={(e) => { setExamYear(e.target.value); setPage(1); }}
              className="w-full bg-slate-800 text-slate-200 p-2 rounded-xl border border-slate-700 focus:outline-none"
            >
              <option value="all">All Years</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="text-slate-400 font-mono text-[11px] block mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => { setLanguage(e.target.value); setPage(1); }}
              className="w-full bg-slate-800 text-slate-200 p-2 rounded-xl border border-slate-700 focus:outline-none"
            >
              <option value="all">All Mediums</option>
              <option value="English">English</option>
              <option value="Kannada">Kannada</option>
              <option value="Both">Both (Bilingual)</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="text-slate-400 font-mono text-[11px] block mb-1">Sort By</label>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="w-full bg-slate-800 text-slate-200 p-2 rounded-xl border border-slate-700 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Viewed</option>
              <option value="downloads">Most Downloaded</option>
              <option value="year-asc">Year (Oldest First)</option>
            </select>
          </div>
        </div>

        {/* Reset Filters CTA */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span>Displaying <strong>{papers.length}</strong> of <strong>{totalCount}</strong> published resources</span>
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Papers Grid */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 text-sm">
          Loading library materials...
        </div>
      ) : papers.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <FileText className="w-14 h-14 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No resources match your filter criteria</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try expanding your search, changing the board selection, or clearing the language filter.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-emerald-400 font-bold text-xs border border-slate-700"
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
              isSaved={savedPaperIds.includes(paper.id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 border border-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-300 font-mono">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 border border-slate-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
