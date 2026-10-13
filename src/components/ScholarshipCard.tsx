import React, { useState } from 'react';
import { Scholarship } from '../types';
import {
  Award,
  Calendar,
  Building2,
  CheckCircle,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  AlertCircle
} from 'lucide-react';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  isSaved?: boolean;
  onToggleSave?: (scholarship: Scholarship) => void;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  isSaved = false,
  onToggleSave
}) => {
  const [showDocs, setShowDocs] = useState(false);

  // Calculate days remaining
  const getDaysRemaining = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysLeft = getDaysRemaining(scholarship.lastDate);
  const isClosingSoon = daysLeft > 0 && daysLeft <= 30;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-slate-700 hover:shadow-xl hover:shadow-slate-950/40 transition-all duration-200">
      <div>
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {scholarship.categoryName}
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {scholarship.eligibleState}
            </span>

            {isClosingSoon ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 animate-pulse">
                <AlertCircle className="w-3 h-3" /> Closes in {daysLeft} Days
              </span>
            ) : daysLeft > 0 ? (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
                {daysLeft} Days Left
              </span>
            ) : (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-500">
                Application Closed
              </span>
            )}
          </div>

          {onToggleSave && (
            <button
              onClick={() => onToggleSave(scholarship)}
              className="text-slate-400 hover:text-emerald-400 p-1 rounded-lg transition-colors cursor-pointer"
              title={isSaved ? 'Remove from tracked' : 'Track scholarship'}
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5 text-emerald-400" /> : <Bookmark className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Title & Provider */}
        <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 leading-snug">
          {scholarship.title}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
          <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate">{scholarship.provider}</span>
        </div>

        {/* Benefit Amount Pill */}
        <div className="bg-gradient-to-r from-emerald-950/60 to-slate-800/80 p-3 rounded-xl border border-emerald-800/40 mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold">
              Scholarship Grant / Award
            </p>
            <p className="text-sm font-bold text-white mt-0.5">
              {scholarship.benefitAmount}
            </p>
          </div>
          <Award className="w-6 h-6 text-emerald-400/80" />
        </div>

        {/* Eligibility Criteria Grid */}
        <div className="space-y-2 mb-4 text-xs">
          <div className="grid grid-cols-2 gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
            <div>
              <p className="text-[11px] text-slate-400">Target Classes</p>
              <p className="font-semibold text-slate-200 truncate">
                {scholarship.eligibleClassLevels.join(', ')}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Boards</p>
              <p className="font-semibold text-slate-200 truncate">
                {scholarship.applicableBoards.join(', ')}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Max Family Income</p>
              <p className="font-semibold text-slate-200">
                {scholarship.maxFamilyIncome ? `₹${scholarship.maxFamilyIncome.toLocaleString('en-IN')}/yr` : 'No Limit'}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Min Academic Score</p>
              <p className="font-semibold text-slate-200">
                {scholarship.minMarksPercentage ? `${scholarship.minMarksPercentage}% Marks` : 'Passing Marks'}
              </p>
            </div>
          </div>

          {scholarship.genderEligibility !== 'All' && (
            <p className="text-[11px] text-amber-300 bg-amber-950/20 px-2.5 py-1 rounded-lg border border-amber-800/30">
              * Dedicated scheme for {scholarship.genderEligibility} students.
            </p>
          )}

          {scholarship.disabilityEligibility && (
            <p className="text-[11px] text-cyan-300 bg-cyan-950/20 px-2.5 py-1 rounded-lg border border-cyan-800/30">
              * Inclusive scheme for differently-abled students (40%+ benchmark).
            </p>
          )}

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pt-1">
            {scholarship.description}
          </p>
        </div>

        {/* Required documents expandable */}
        {scholarship.requiredDocuments && scholarship.requiredDocuments.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowDocs(!showDocs)}
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center justify-between w-full py-1 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                Required Documents Checklist ({scholarship.requiredDocuments.length})
              </span>
              {showDocs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDocs && (
              <ul className="mt-2 space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                {scholarship.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div>
        {/* Verification & Dates */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 mb-4">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <CheckCircle className="w-3.5 h-3.5" /> Verified by Orbit X Team
          </div>
          <div className="flex items-center gap-1 text-slate-400 font-mono">
            <Calendar className="w-3.5 h-3.5 text-slate-500" /> Deadline: {scholarship.lastDate}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={scholarship.officialGuidelinesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700/60 cursor-pointer"
          >
            <span>View Guidelines</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <a
            href={scholarship.officialApplyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <span>Apply Officially</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
