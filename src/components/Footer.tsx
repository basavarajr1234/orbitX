import React from 'react';
import { Award, BookOpen, GraduationCap, ShieldCheck, Mail, MapPin, ExternalLink } from 'lucide-react';

interface FooterProps {
  navigate: (route: string) => void;
  openReportModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate, openReportModal }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-6 h-6">
                  <ellipse cx="50" cy="50" rx="36" ry="16" fill="none" stroke="#38bdf8" strokeWidth="6" strokeDasharray="14 6" transform="rotate(-30 50 50)" />
                  <ellipse cx="50" cy="50" rx="36" ry="16" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="18 4" transform="rotate(30 50 50)" />
                  <circle cx="50" cy="50" r="8" fill="#10b981" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-black font-mono text-white tracking-tight">ORBIT</span>
                <span className="text-xl font-black text-emerald-400">X</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 font-medium">
              "Your Academic Journey. Your Future. One Platform."
            </p>
            <p className="text-slate-400 leading-relaxed pr-4">
              Orbit X is an independent, non-profit academic resource ecosystem built for Karnataka State Board (SSLC, 2nd PUC) and CBSE students. We curate verified previous-year question papers, model papers, KCET & NEET preparation modules, and legitimate state and central scholarship schemes.
            </p>

            <div className="pt-2 flex items-center gap-3 text-slate-400">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> Bengaluru, Karnataka</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-emerald-400" /> support@orbitx.edu</span>
            </div>
          </div>

          {/* Karnataka Board */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 font-mono uppercase tracking-wider text-emerald-400">
              Karnataka Board
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/karnataka/sslc')} className="hover:text-white transition-colors">
                  SSLC Class 10 Papers
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/karnataka/sslc')} className="hover:text-white transition-colors">
                  KSEAB Model Papers & Blueprints
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/karnataka/2nd-puc')} className="hover:text-white transition-colors">
                  2nd PUC Science Papers (PCMB)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/karnataka/2nd-puc')} className="hover:text-white transition-colors">
                  2nd PUC Commerce & Arts
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/karnataka/sslc')} className="hover:text-white transition-colors">
                  Kannada Medium Resources
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/kcet')} className="hover:text-white transition-colors font-medium text-amber-400">
                  KCET Engineering Papers
                </button>
              </li>
            </ul>
          </div>

          {/* CBSE & Entrance */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 font-mono uppercase tracking-wider text-cyan-400">
              CBSE & Competitive
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/cbse/class-10')} className="hover:text-white transition-colors">
                  CBSE Class 10 Board Papers
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/cbse/class-10')} className="hover:text-white transition-colors">
                  Class 10 Marking Schemes
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/cbse/class-12')} className="hover:text-white transition-colors">
                  CBSE Class 12 Physics & Chem
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/cbse/class-12')} className="hover:text-white transition-colors">
                  Class 12 Mathematics SQPs
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/neet')} className="hover:text-white transition-colors text-cyan-300 font-medium">
                  NEET UG Medical Papers & Keys
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/mock-tests')} className="hover:text-white transition-colors">
                  Online Timed Mock Tests
                </button>
              </li>
            </ul>
          </div>

          {/* Scholarships & Help */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 font-mono uppercase tracking-wider text-teal-400">
              Scholarships & Support
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/scholarships/karnataka')} className="hover:text-white transition-colors">
                  SSP Karnataka Post-Matric
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/scholarships/karnataka')} className="hover:text-white transition-colors">
                  Vidyasiri ePASS Scheme
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/scholarships/class-10')} className="hover:text-white transition-colors">
                  Class 10 Transition Grants
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/scholarships/class-12')} className="hover:text-white transition-colors">
                  Class 12 to Degree Scholarships
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/career-guidance')} className="hover:text-white transition-colors">
                  Career Guidance After 10th & 12th
                </button>
              </li>
              <li>
                <button onClick={openReportModal} className="text-rose-400 hover:text-rose-300 transition-colors font-medium">
                  Report Broken Link / Issue
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Orbit X Academic Platform. All examination papers and syllabi belong to their respective statutory boards (KSEAB, DPUE, CBSE, KEA, NTA). Curated for student non-commercial study purposes.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/about')} className="hover:text-slate-300">About Orbit X</button>
            <button onClick={() => navigate('/contact')} className="hover:text-slate-300">Contact</button>
            <button onClick={() => navigate('/about')} className="hover:text-slate-300">Privacy & Terms</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
