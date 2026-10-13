import React, { useState, useEffect } from 'react';
import { Resource } from '../types';
import { api } from '../api';
import {
  FileText,
  Download,
  Eye,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  RefreshCw,
  FolderOpen,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

interface PucModelPapersSectionProps {
  onPreviewPaper: (resource: Resource) => void;
  navigate?: (route: string) => void;
  openAIAssistant?: (config?: any) => void;
}

export const PucModelPapersSection: React.FC<PucModelPapersSectionProps> = ({
  onPreviewPaper,
  navigate,
  openAIAssistant
}) => {
  const [modelPapersData, setModelPapersData] = useState<{
    board: string;
    classLevel: string;
    category: string;
    folderUrl: string;
    subjects: Record<string, { available: boolean; paper?: Resource; message?: string }>;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const requiredSubjects = [
    { name: 'Mathematics', code: '35', color: 'from-amber-500/20 to-amber-600/5 text-amber-300 border-amber-500/30' },
    { name: 'Physics', code: '33', color: 'from-blue-500/20 to-blue-600/5 text-blue-300 border-blue-500/30' },
    { name: 'Chemistry', code: '34', color: 'from-emerald-500/20 to-emerald-600/5 text-emerald-300 border-emerald-500/30' },
    { name: 'Biology', code: '36', color: 'from-teal-500/20 to-teal-600/5 text-teal-300 border-teal-500/30' },
    { name: 'English', code: '02', color: 'from-cyan-500/20 to-cyan-600/5 text-cyan-300 border-cyan-500/30' },
    { name: 'Kannada', code: '01', color: 'from-orange-500/20 to-orange-600/5 text-orange-300 border-orange-500/30' }
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getPucModelPapers();
      setModelPapersData(data);
    } catch (e) {
      console.error('Failed to load PUC model papers', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSyncDrive = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await api.syncPucDrivePapers();
      setSyncMessage(`Drive Folder Synced: ${res.totalCount} model papers verified & saved in database.`);
      await loadData();
    } catch (err: any) {
      setSyncMessage(`Sync status: ${err.message || 'Error syncing Drive folder'}`);
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(null), 4000);
    }
  };

  const handleDownload = async (paper: Resource) => {
    try {
      await api.recordDownload(paper.id);
      paper.downloadCount += 1;
    } catch (e) {
      // ignore
    }
    const downloadUrl = paper.downloadUrl || `https://drive.google.com/uc?export=download&id=${paper.gdriveFileId}`;
    window.open(downloadUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Header with Breadcrumb & Drive Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-1.5">
          {/* Breadcrumb Hierarchy */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 flex-wrap">
            <span className="text-amber-400 font-bold">Karnataka State Board</span>
            <span>&rarr;</span>
            <span className="text-white font-bold">2nd PUC</span>
            <span>&rarr;</span>
            <span className="text-emerald-400 font-bold">Subject</span>
            <span>&rarr;</span>
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
              Model Papers
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>2nd PUC Official Model Question Papers</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              DPUE & KSEAB
            </span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            Imported directly from the authorized Department of Pre-University Education Google Drive folder. Access the authentic model papers for Mathematics, Physics, Chemistry, Biology, English, and Kannada.
          </p>
        </div>

        {/* Drive Sync Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="https://drive.google.com/drive/folders/1FFcXAcWHhufn_9linIrA5XCKL6ns9XAl"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Drive Folder</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <button
            onClick={handleSyncDrive}
            disabled={syncing}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
            title="Inspect Google Drive folder and sync model papers"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync from Drive'}</span>
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* AI Model Paper Solver Callout Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-emerald-950/60 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-indigo-300 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Orbit X AI Model Paper Solver
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                Official DPUE MQP 1
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Have doubts on any Mathematics, Physics, Chemistry, Biology, English, or Kannada question? Ask our AI assistant to solve it step-by-step with formulas and blueprint marks weightage!
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (navigate) {
              navigate('/ai-assistant?mode=exam');
            } else if (openAIAssistant) {
              openAIAssistant({ mode: 'exam' });
            }
          }}
          className="whitespace-nowrap px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/30 cursor-pointer shrink-0 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
          <span>Solve Papers with AI</span>
        </button>
      </div>

      {/* Six Subject Sections */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs">
          Loading 2nd PUC Model Papers...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {requiredSubjects.map((subj) => {
            const subjectData = modelPapersData?.subjects[subj.name];
            const isAvailable = subjectData?.available && subjectData.paper;
            const paper = subjectData?.paper;

            return (
              <div
                key={subj.name}
                className={`bg-slate-950/80 border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:border-slate-700 hover:shadow-xl ${
                  isAvailable ? subj.color : 'border-slate-800 text-slate-400'
                }`}
              >
                <div>
                  {/* Subject Header & Hierarchy Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-mono text-xs font-bold text-slate-200 border border-slate-700">
                        {subj.code}
                      </span>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {subj.name}
                      </h3>
                    </div>

                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold bg-slate-900 border border-slate-800 text-slate-300">
                      Model Paper
                    </span>
                  </div>

                  {/* Breadcrumb display */}
                  <div className="text-[10px] font-mono text-slate-400 mb-3 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                    Karnataka Board &gt; 2nd PUC &gt; <span className="text-white font-semibold">{subj.name}</span> &gt; Model Papers
                  </div>

                  {/* Paper Content or Not Available State */}
                  {isAvailable && paper ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-mono font-bold text-emerald-300 break-all bg-slate-900/90 p-2.5 rounded-xl border border-emerald-500/20">
                          {paper.originalFilename || paper.title}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-900/40 p-2 rounded-xl border border-slate-800/60 font-mono">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Format & Size:</span>
                          <span className="text-white font-semibold">{paper.fileType} • {paper.fileSize}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Medium:</span>
                          <span className="text-white font-semibold">{paper.language}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 block text-[10px]">Google Drive File ID:</span>
                          <span className="text-emerald-400 text-[10px] truncate block" title={paper.gdriveFileId}>
                            {paper.gdriveFileId}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Original DPUE Official Model Paper Verified</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center space-y-2 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
                      <AlertCircle className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs font-bold text-slate-400">Paper not available</p>
                      <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                        This subject's model paper is not present or inaccessible in the Google Drive folder.
                      </p>
                    </div>
                  )}
                </div>

                {/* View / Download / AI Solver Actions */}
                <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-2">
                  {isAvailable && paper ? (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onPreviewPaper(paper)}
                          className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          <span>View PDF</span>
                        </button>

                        <button
                          onClick={() => handleDownload(paper)}
                          className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          if (navigate) {
                            navigate(`/ai-assistant?mode=exam&subject=${encodeURIComponent(paper.subject)}&filename=${encodeURIComponent(paper.originalFilename || '')}`);
                          } else if (openAIAssistant) {
                            openAIAssistant({
                              mode: 'exam',
                              paperContext: { subject: paper.subject, originalFilename: paper.originalFilename }
                            });
                          }
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 hover:text-white border border-indigo-700/60 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        title="Solve & explain questions from this paper with AI Assistant"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                        <span>Ask AI to Solve / Explain Questions</span>
                      </button>
                    </>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2 px-3 rounded-xl bg-slate-800/40 text-slate-400 font-semibold text-xs border border-slate-800 cursor-not-allowed"
                    >
                      Paper not available
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
