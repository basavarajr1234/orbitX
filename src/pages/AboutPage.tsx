import React from 'react';
import { Award, BookOpen, GraduationCap, ShieldCheck, HeartHandshake, CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-400">
          About Orbit X
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          "Your Academic Journey. Your Future. One Platform."
        </h1>
        <p className="max-w-2xl mx-auto text-sm text-slate-400 leading-relaxed">
          Inspired by the seamless educational repository vision of vtucircle.com, Orbit X was created specifically to eliminate academic resource inequality for school, pre-university, and entrance exam students across Karnataka and CBSE boards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Authentic Previous Papers</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every question paper in our repository is verified directly from official board releases (KSEAB Bangalore, DPUE Karnataka, CBSE Academic, KEA, and NTA) with exact scoring schemes.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Verified Scholarships</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We bridge the information gap so that deserving students from low-income, rural, and backward category backgrounds never miss out on SSP, Vidyasiri, NMMS, or private foundation grants.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Free & Accessible</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Public academic resources remain 100% free for all students. No paywalls, no forced subscription traps, and zero deceptive download links.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 text-xs text-slate-300 leading-relaxed">
        <h3 className="text-lg font-bold text-white">Copyright & Ethical Educational Disclosure</h3>
        <p>
          Orbit X does not claim ownership of official state or central examination question papers, which are created and distributed under the authority of their respective boards (KSEAB, DPUE, CBSE, KEA, NTA). These papers are preserved and made searchable for public educational analysis and study practice pursuant to Indian educational fair-use principles.
        </p>
        <p>
          If you are an author or statutory representative requesting content clarification or link updates, please reach out via our contact page.
        </p>
      </div>
    </div>
  );
};
