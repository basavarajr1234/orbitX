import React, { useState } from 'react';
import { Resource } from '../types';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Download,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
  CheckCircle,
  Eye,
  Share2
} from 'lucide-react';

interface PaperPreviewModalProps {
  resource: Resource | null;
  onClose: () => void;
  onReportBrokenLink: (resource: Resource) => void;
  isSaved?: boolean;
  onToggleSave?: (resource: Resource) => void;
}

export const PaperPreviewModal: React.FC<PaperPreviewModalProps> = ({
  resource,
  onClose,
  onReportBrokenLink,
  isSaved = false,
  onToggleSave
}) => {
  if (!resource) return null;

  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Convert Google Drive share link into embedded preview URL if applicable
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    // Local upload
    if (url.startsWith('/uploads/')) return url;
    // Drive file /d/FILE_ID/view
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return url;
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await api.recordDownload(resource.id);
      resource.downloadCount += 1;
      const targetUrl = resource.downloadUrl || resource.driveUrl;
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.error('Download recording failed', e);
      window.open(resource.downloadUrl || resource.driveUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/papers?id=${resource.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const embedUrl = getEmbedUrl(resource.driveUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                resource.board === 'Karnataka' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
              }`}>
                {resource.board} • {resource.classLevel}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                {resource.paperType}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Year: {resource.examYear}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Medium: {resource.language}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
              {resource.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Source: <span className="text-slate-300 font-medium">{resource.sourcePublisher}</span>
              {resource.originalFilename && (
                <span className="ml-2 font-mono text-[11px] bg-slate-800 text-emerald-300 px-2 py-0.5 rounded">
                  File: {resource.originalFilename}
                </span>
              )}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body / PDF Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Metadata bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-xs">
            <div>
              <p className="text-slate-400 text-[11px]">Subject</p>
              <p className="font-semibold text-white truncate">{resource.subject}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[11px]">Format & Size</p>
              <p className="font-semibold text-white">{resource.fileType} • {resource.fileSize}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[11px]">Verified Status</p>
              <p className="font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Official Scheme
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-[11px]">Downloads & Views</p>
              <p className="font-semibold text-white">{resource.downloadCount} downloads • {resource.viewCount} views</p>
            </div>
          </div>

          {resource.description && (
            <div className="text-xs text-slate-300 bg-slate-800/30 p-3 rounded-xl border border-slate-800 leading-relaxed">
              {resource.description}
            </div>
          )}

          {/* Interactive Document Preview Container */}
          <div className="w-full h-96 sm:h-[450px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative flex flex-col items-center justify-center">
            {embedUrl && (embedUrl.includes('drive.google.com') || embedUrl.endsWith('.pdf')) ? (
              <iframe
                src={embedUrl}
                title={resource.title}
                className="w-full h-full border-0"
                allow="autoplay"
              />
            ) : (
              <div className="text-center p-8 max-w-md">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">Google Drive PDF Ready</h4>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  This examination document is stored on secure cloud storage. You can view it directly in Google Drive or download the official PDF.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <Download className="w-4 h-4" /> Download Official PDF
                  </button>
                  <a
                    href={resource.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-2 border border-slate-700 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" /> Open in Drive
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onReportBrokenLink(resource)}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-950/30 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Broken Link</span>
            </button>

            <button
              onClick={handleShare}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share Paper'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(resource)}
                className={`text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-400" /> : <Bookmark className="w-4 h-4" />}
                <span>{isSaved ? 'Saved in Library' : 'Save Paper'}</span>
              </button>
            )}

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Preparing...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
