import React from 'react';
import { Resource } from '../types';
import { FileText, Download, Eye, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';

interface PaperCardProps {
  resource: Resource;
  onPreview: (resource: Resource) => void;
  onDownload: (resource: Resource) => void;
  isSaved?: boolean;
  onToggleSave?: (resource: Resource) => void;
}

export const PaperCard: React.FC<PaperCardProps> = ({
  resource,
  onPreview,
  onDownload,
  isSaved = false,
  onToggleSave
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-slate-700 hover:shadow-xl hover:shadow-slate-950/40 transition-all duration-200 group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
              resource.board === 'Karnataka'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
            }`}>
              {resource.board} • {resource.classLevel}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {resource.examYear}
            </span>
          </div>

          {onToggleSave && (
            <button
              onClick={() => onToggleSave(resource)}
              className="text-slate-400 hover:text-emerald-400 p-1 rounded-lg transition-colors cursor-pointer"
              title={isSaved ? 'Remove from saved' : 'Save paper'}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-400" /> : <Bookmark className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => onPreview(resource)}
          className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-400 transition-colors cursor-pointer line-clamp-2 leading-snug mb-2"
        >
          {resource.title}
        </h3>

        {/* Subject & Type info */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 flex-wrap">
          <span className="text-slate-300 font-medium">{resource.subject}</span>
          <span>•</span>
          <span className="text-emerald-400/90 font-medium">{resource.paperType}</span>
          <span>•</span>
          <span className="text-slate-500">{resource.language} Medium</span>
        </div>

        {resource.originalFilename && (
          <p className="text-[10px] font-mono bg-slate-800 text-emerald-300 px-2 py-1 rounded-lg border border-slate-700/80 truncate mb-2.5" title={resource.originalFilename}>
            📄 {resource.originalFilename}
          </p>
        )}

        {/* Description snippet */}
        {resource.description && (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {resource.description}
          </p>
        )}
      </div>

      <div>
        {/* Stats & Format */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 mb-3.5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-500" /> {resource.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5 text-slate-500" /> {resource.downloadCount}
            </span>
          </div>
          <span className="font-mono bg-slate-800/80 px-2 py-0.5 rounded text-slate-300">
            {resource.fileType} • {resource.fileSize}
          </span>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onPreview(resource)}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700/60 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>Preview</span>
          </button>

          <button
            onClick={() => onDownload(resource)}
            className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};
