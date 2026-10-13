import React, { useState, useEffect } from 'react';
import { Resource } from '../types';
import { api } from '../api';
import { PaperCard } from '../components/PaperCard';
import {
  HeartPulse,
  BookOpen,
  Award,
  ExternalLink,
  Timer,
  CheckCircle2,
  AlertCircle,
  Calculator
} from 'lucide-react';

interface NEETPortalPageProps {
  onPreviewPaper: (resource: Resource) => void;
  navigate: (route: string) => void;
}

export const NEETPortalPage: React.FC<NEETPortalPageProps> = ({ onPreviewPaper, navigate }) => {
  const [papers, setPapers] = useState<Resource[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number>(140);
  const [incorrectAnswers, setIncorrectAnswers] = useState<number>(20);
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);

  useEffect(() => {
    api.getResources({ query: 'NEET', limit: '20' }).then(res => {
      setPapers(res.resources);
    });
  }, []);

  const handleScoreCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    // NEET Marking Scheme: +4 for correct, -1 for incorrect, 0 for unattempted
    const score = (correctAnswers * 4) - (incorrectAnswers * 1);
    setCalculatedScore(score);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-800/40 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold uppercase">
            National Testing Agency (NTA) Medical UG
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            NEET UG Medical Preparation Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Target 360/360 in NCERT Biology and master Physics & Chemistry with authentic previous year NTA papers, verified answer keys, and timed chapter mocks.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/mock-tests')}
              className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-500/20 cursor-pointer"
            >
              Start NEET High-Yield Biology Mock
            </button>
            <a
              href="https://exams.nta.ac.in/NEET/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs sm:text-sm border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Official NTA NEET Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Papers Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-rose-400" />
          <span>NEET UG Official Papers & Answer Keys</span>
        </h2>

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
      </div>

      {/* NEET Score & Negative Marking Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-rose-400">
            <Calculator className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">NEET 720 Score & Negative Marking Calculator</h3>
          </div>
          <p className="text-xs text-slate-400">
            Simulate your expected NEET score with the official +4 / -1 marking scheme across 180 questions (Total: 720 Marks).
          </p>

          <form onSubmit={handleScoreCalculate} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Correct Questions (+4 Marks each)
              </label>
              <input
                type="number"
                min="0"
                max="180"
                value={correctAnswers}
                onChange={(e) => setCorrectAnswers(Number(e.target.value))}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-rose-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Incorrect Questions (-1 Negative Mark each)
              </label>
              <input
                type="number"
                min="0"
                max="180"
                value={incorrectAnswers}
                onChange={(e) => setIncorrectAnswers(Number(e.target.value))}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-rose-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md shadow-rose-600/20"
            >
              Calculate Net NEET Score
            </button>
          </form>

          {calculatedScore !== null && (
            <div className="bg-rose-500/15 border border-rose-500/30 p-4 rounded-2xl text-center space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-rose-400 font-mono font-bold">
                Your Net Score
              </span>
              <p className="text-3xl font-black text-white">{calculatedScore} / 720</p>
              <p className="text-[11px] text-slate-300">
                {calculatedScore >= 640 ? 'Exceptional: Competitive for All India Quota (AIQ) & Top Govt Medical Colleges (BMCRI, MMCRI, AIIMS).' :
                 calculatedScore >= 550 ? 'Strong Score: High probability of securing State Quota MBBS seat in Karnataka Govt Medical Colleges.' :
                 'Eligible for BDS, BAMS, BHMS, and Private/Deemed university medical seats.'}
              </p>
            </div>
          )}
        </div>

        {/* NCERT High Yield Rules */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400">
            <HeartPulse className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">NCERT High-Yield Blueprint</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 space-y-1">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Biology (360/720 Marks):
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Over 95% of questions are literal quotes from NCERT Class 11 & 12 textbooks, diagrams, footnotes, and scientist bios. Treat NCERT as your bible.
              </p>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 space-y-1">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Chemistry (180/720 Marks):
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Direct NCERT tables in Inorganic Chemistry. Memorize reaction conditions and reagents in Organic Chemistry conversions.
              </p>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 space-y-1">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Physics (180/720 Marks):
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Avoid over-complex JEE Advanced problems. Practice direct formula applications, dimensional analysis, and standard circuit numericals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
