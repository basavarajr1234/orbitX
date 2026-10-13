import React, { useState } from 'react';
import { BookOpen, Download, FileText, Sparkles, ExternalLink, ChevronRight } from 'lucide-react';

export const StudyNotesPage: React.FC<{ navigate: (route: string) => void }> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<'Karnataka' | 'CBSE'>('Karnataka');

  const notesList = [
    {
      title: 'Karnataka SSLC Science 1-Day Quick Revision Handout',
      board: 'Karnataka',
      class: 'SSLC',
      subject: 'Science',
      desc: 'All physics ray diagrams, chemical reaction balancing rules, and human anatomy diagrams condensed into a 24-page revision sheet.',
      pages: '24 Pages',
      size: '2.8 MB',
      driveUrl: 'https://drive.google.com/file/d/1SSLC-Sci-Notes/view'
    },
    {
      title: 'Karnataka SSLC Mathematics Formulas & Theorems Compendium',
      board: 'Karnataka',
      class: 'SSLC',
      subject: 'Mathematics',
      desc: 'Complete collection of 10 theorems (Thales, Pythagoras, Tangent properties) with proofs and quadratic formula tricks.',
      pages: '18 Pages',
      size: '1.9 MB',
      driveUrl: 'https://drive.google.com/file/d/1SSLC-Math-Theorems/view'
    },
    {
      title: '2nd PUC Physics High-Yield 5-Mark Derivations Handbook',
      board: 'Karnataka',
      class: '2nd PUC',
      subject: 'Physics',
      desc: 'Every single recurring 5-mark derivation (Cyclotron, Electric Field due to Dipole, Lens Maker formula, Transformer efficiency).',
      pages: '36 Pages',
      size: '4.1 MB',
      driveUrl: 'https://drive.google.com/file/d/1PUC2-Phy-Derivations/view'
    },
    {
      title: '2nd PUC Chemistry Organic Name Reactions & Conversions Chart',
      board: 'Karnataka',
      class: '2nd PUC',
      subject: 'Chemistry',
      desc: 'A-to-Z flowchart of Organic Chemistry reactions including Sandmeyer, Aldol, Cannizzaro, and Gabriel phthalimide.',
      pages: '16 Pages',
      size: '2.2 MB',
      driveUrl: 'https://drive.google.com/file/d/1PUC2-Chem-Reactions/view'
    },
    {
      title: 'CBSE Class 10 Science Chapter-wise NCERT Concept Maps',
      board: 'CBSE',
      class: 'Class 10',
      subject: 'Science',
      desc: 'Visual mind-maps for Life Processes, Light, Electricity, Magnetic Effects, and Carbon & its Compounds.',
      pages: '30 Pages',
      size: '3.5 MB',
      driveUrl: 'https://drive.google.com/file/d/1CBSE10-MindMaps/view'
    },
    {
      title: 'CBSE Class 12 Physics Formula & Important Graph Sheet',
      board: 'CBSE',
      class: 'Class 12',
      subject: 'Physics',
      desc: 'NCERT standard graphs, derivation outlines, and unit dimensional constants for quick revision.',
      pages: '22 Pages',
      size: '2.6 MB',
      driveUrl: 'https://drive.google.com/file/d/1CBSE12-Formulas/view'
    }
  ];

  const filteredNotes = notesList.filter(n => n.board === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-800/40 rounded-3xl p-6 sm:p-10">
        <div className="max-w-3xl space-y-3">
          <span className="text-[11px] font-mono uppercase font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
            Curated Study Notes
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Chapter Summaries, Formula Sheets & Mind Maps
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            High-yield revision materials designed by experienced Karnataka Board lecturers and CBSE examiners to save study time before board exams.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('Karnataka')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'Karnataka'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Karnataka Board Notes
            </button>
            <button
              onClick={() => setActiveTab('CBSE')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'CBSE'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              CBSE Academic Notes
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 hover:shadow-xl transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-mono text-emerald-400 font-bold bg-slate-800 px-2 py-0.5 rounded">
                  {note.class} • {note.subject}
                </span>
                <span className="text-slate-400 font-mono">
                  {note.pages} • {note.size}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2 leading-snug">
                {note.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {note.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <a
                href={note.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Download Study PDF</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
