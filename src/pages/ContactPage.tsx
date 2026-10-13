import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, MessageSquare, AlertTriangle } from 'lucide-react';

export const ContactPage: React.FC<{ openReportModal: () => void }> = ({ openReportModal }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Academic Inquiry');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSent(false);
    }, 3500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Contact Orbit X Academic Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Have an inquiry about an upcoming examination blueprint, question paper submission, or scholarship verification? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4 text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
            <Mail className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-white text-sm">Academic Editorial</h4>
            <p className="text-slate-400">editorial@orbitx.edu</p>
            <p className="text-slate-400">support@orbitx.edu</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-white text-sm">Location</h4>
            <p className="text-slate-400">Bengaluru Academic Hub</p>
            <p className="text-slate-400">Karnataka, India</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h4 className="font-bold text-white text-sm">Found a Broken Paper Link?</h4>
            <p className="text-slate-400 leading-relaxed">
              Use our dedicated broken link reporting tool for immediate priority triage.
            </p>
            <button
              onClick={openReportModal}
              className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
            >
              Report Broken Link
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
          {sent ? (
            <div className="py-16 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Message Dispatched</h3>
              <p className="text-xs text-slate-400">
                Thank you for contacting Orbit X. Our academic coordinator will respond within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Your Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. student@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Inquiry Topic</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none"
                >
                  <option value="General Academic Inquiry">General Academic Inquiry</option>
                  <option value="Question Paper Contribution">Submitting Question Papers</option>
                  <option value="Scholarship Verification Request">Scholarship Verification Request</option>
                  <option value="Bug / Website Technical Support">Bug / Technical Issue</option>
                  <option value="Copyright & Fair Use">Copyright Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Message / Request</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can our educational team assist you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Transmit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
