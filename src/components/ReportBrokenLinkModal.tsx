import React, { useState } from 'react';
import { Resource } from '../types';
import { api } from '../api';
import { X, AlertTriangle, CheckCircle, Send } from 'lucide-react';

interface ReportBrokenLinkModalProps {
  resource: Resource | null;
  onClose: () => void;
}

export const ReportBrokenLinkModal: React.FC<ReportBrokenLinkModalProps> = ({ resource, onClose }) => {
  const [reason, setReason] = useState('Google Drive file is inaccessible or requires access request');
  const [customNotes, setCustomNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const commonReasons = [
    'Google Drive file is inaccessible or requires access request',
    'Document has corrupt pages or blurry text',
    'Wrong subject or year mislabeled',
    'Official solutions/answer key missing from file',
    'Other issue / copyright inquiry'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const finalReason = customNotes ? `${reason}: ${customNotes}` : reason;

    try {
      await api.reportBrokenLink({
        resourceId: resource?.id || 'general-report',
        resourceTitle: resource?.title || 'General Website Resource Inquiry',
        reason: finalReason
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2200);
    } catch (err: any) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">Report Broken Link or Issue</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Report Logged Successfully</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Our academic moderators have received this ticket. We test and re-upload verified replacement links within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {resource && (
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 text-slate-300">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">Affected Resource</span>
                <p className="font-semibold text-white">{resource.title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{resource.board} • {resource.classLevel} • {resource.subject} ({resource.examYear})</p>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-2">Select Issue Reason</label>
              <div className="space-y-1.5">
                {commonReasons.map((r, i) => (
                  <label key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="reason"
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="accent-emerald-500"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Additional Details (Optional)</label>
              <textarea
                rows={3}
                placeholder="Describe what happened when you clicked the link..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-400"
              />
            </div>

            {error && <p className="text-rose-400 font-medium">{error}</p>}

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
