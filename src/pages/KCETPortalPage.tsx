import React, { useState, useEffect } from 'react';
import { Resource } from '../types';
import { api } from '../api';
import { PaperCard } from '../components/PaperCard';
import {
  Award,
  BookOpen,
  Calculator,
  Compass,
  ExternalLink,
  FileText,
  Sparkles,
  Timer,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

interface KCETPortalPageProps {
  onPreviewPaper: (resource: Resource) => void;
  navigate: (route: string) => void;
}

export const KCETPortalPage: React.FC<KCETPortalPageProps> = ({ onPreviewPaper, navigate }) => {
  const [papers, setPapers] = useState<Resource[]>([]);
  const [activeSubject, setActiveSubject] = useState<string>('all');
  const [pucMarks, setPucMarks] = useState<number>(270);
  const [cetMarks, setCetMarks] = useState<number>(135);
  const [estimatedScore, setEstimatedScore] = useState<number | null>(null);

  useEffect(() => {
    api.getResources({ query: 'KCET', limit: '20' }).then(res => {
      setPapers(res.resources);
    });
  }, []);

  const calculateKcetRankScore = (e: React.FormEvent) => {
    e.preventDefault();
    // KCET Engineering Merit Formula: (PUC PCM % / 2) + (CET PCM % / 2)
    // PUC PCM total = 300 marks; KCET PCM total = 180 marks
    const pucPercent = (pucMarks / 300) * 100;
    const cetPercent = (cetMarks / 180) * 100;
    const finalScore = (pucPercent + cetPercent) / 2;
    setEstimatedScore(parseFloat(finalScore.toFixed(2)));
  };

  const filteredPapers = papers.filter(p => {
    if (activeSubject === 'all') return true;
    return p.subject.toLowerCase().includes(activeSubject.toLowerCase()) || p.title.toLowerCase().includes(activeSubject.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-800/40 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold uppercase">
            Karnataka Examinations Authority (KEA)
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            KCET Engineering & Agriculture Prep Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Crack Karnataka Common Entrance Test with authentic previous 10-year question papers, speed problem-solving formulas, chapter weightage trends, and timed mock tests.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/mock-tests')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 cursor-pointer"
            >
              Start Timed KCET Mock Exam
            </button>
            <a
              href="https://cetonline.karnataka.gov.in/kea/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs sm:text-sm border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Official KEA Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-mono text-[11px] uppercase mr-1">Subject:</span>
        {['all', 'Mathematics', 'Physics', 'Chemistry', 'Biology'].map((sub) => (
          <button
            key={sub}
            onClick={() => setActiveSubject(sub)}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeSubject === sub
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {sub === 'all' ? 'All KCET Resources' : `KCET ${sub}`}
          </button>
        ))}
      </div>

      {/* Papers Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span>KCET Official Papers & Answer Keys</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPapers.map((paper) => (
            <PaperCard
              key={paper.id}
              resource={paper}
              onPreview={onPreviewPaper}
              onDownload={onPreviewPaper}
            />
          ))}
        </div>
      </div>

      {/* KCET Ranking Calculator & Speed Strategies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* Calculator */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Calculator className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">KCET Engineering Merit Calculator</h3>
          </div>
          <p className="text-xs text-slate-400">
            KEA calculates engineering ranks by combining 50% of your 2nd PUC PCM board percentage and 50% of your KCET PCM exam percentage.
          </p>

          <form onSubmit={calculateKcetRankScore} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                2nd PUC Board PCM Total (Out of 300)
              </label>
              <input
                type="number"
                min="100"
                max="300"
                value={pucMarks}
                onChange={(e) => setPucMarks(Number(e.target.value))}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                KCET PCM Exam Total (Out of 180: 60 Phys + 60 Chem + 60 Math)
              </label>
              <input
                type="number"
                min="20"
                max="180"
                value={cetMarks}
                onChange={(e) => setCetMarks(Number(e.target.value))}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20"
            >
              Calculate Composite Merit Score
            </button>
          </form>

          {estimatedScore !== null && (
            <div className="bg-amber-500/15 border border-amber-500/30 p-4 rounded-2xl text-center space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-amber-400 font-mono font-bold">
                Your Calculated KCET Composite Score
              </span>
              <p className="text-3xl font-black text-white">{estimatedScore} %</p>
              <p className="text-[11px] text-slate-300">
                {estimatedScore >= 85 ? 'Estimated Rank: Top 2,500 (Tier-1 Engineering Branches like RVCE/BMS/PES)' :
                 estimatedScore >= 70 ? 'Estimated Rank: 5,000 - 15,000 (Top State Govt & Aided Colleges)' :
                 'Eligible for reputable VTU affiliated and private colleges in Karnataka.'}
              </p>
            </div>
          )}
        </div>

        {/* Speed Exam Strategy Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <Timer className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">KCET 80-Minute Speed Strategy</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 space-y-1">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 1. First Pass (0 - 45 Mins):
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Answer all direct formula and memory-based questions immediately. Never spend more than 75 seconds on any single question in Round 1.
              </p>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 space-y-1">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 2. Option Elimination in Maths:
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Substitute options back into definite integrals or differential equations rather than performing long 2-page derivations.
              </p>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 space-y-1">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 3. No Negative Marking:
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Unlike JEE/NEET, KCET has zero negative marking. Always bubble every single question on the OMR sheet before time expires.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
