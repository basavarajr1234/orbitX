import React, { useState } from 'react';
import { Compass, GraduationCap, Award, BookOpen, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const CareerGuidancePage: React.FC<{ navigate: (route: string) => void; openAIAssistant: () => void }> = ({
  navigate,
  openAIAssistant
}) => {
  const [activeTab, setActiveTab] = useState<'after-10' | 'after-12'>('after-10');

  const after10Paths = [
    {
      title: 'Science Stream (PUC / Class 11-12)',
      combos: 'PCMB, PCMC (Computer Science), PCME (Electronics)',
      leadTo: 'Engineering (KCET/JEE), Medicine (NEET), Biotechnology, Architecture, Pure Sciences (IISc/B.Sc).',
      scholarships: 'NMMS, Vidyasiri, HDFC Parivartan, Santoor Women Scheme.',
      actionRoute: '/karnataka/2nd-puc'
    },
    {
      title: 'Commerce Stream (PUC / Class 11-12)',
      combos: 'EBAC (Economics, Business, Accountancy, Computer), HEBA, MSBA',
      leadTo: 'Chartered Accountancy (CA), Company Secretary (CS), CMA, B.Com, Investment Banking, Corporate Law.',
      scholarships: 'SSP Post-Matric, Sitaram Jindal Foundation, Begum Hazrat Mahal.',
      actionRoute: '/karnataka/2nd-puc'
    },
    {
      title: 'Arts & Humanities (PUC / Class 11-12)',
      combos: 'HEPS (History, Economics, Political Sci, Sociology), Psychology',
      leadTo: 'Civil Services (UPSC/KPSC), 5-Year Integrated Law (CLAT - NLSIU Bengaluru), Journalism, Public Policy.',
      scholarships: 'SSP Karnataka, Central Sector Scholarship Scheme.',
      actionRoute: '/karnataka/2nd-puc'
    },
    {
      title: 'Polytechnic Engineering Diploma (3 Years)',
      combos: 'Mechanical, Computer Science, Civil, Electrical, AI & Robotics',
      leadTo: 'Direct Lateral Entry into 2nd Year B.E/B.Tech Engineering via Karnataka DCET (No KCET required!).',
      scholarships: 'AICTE Pragati, Saksham, Vidyasiri ePASS.',
      actionRoute: '/scholarships'
    },
    {
      title: 'ITI & Technical Vocational Training (1-2 Years)',
      combos: 'Electrician, Fitter, CNC Operator, Mechatronics, Solar Technician',
      leadTo: 'Direct employment in Karnataka industrial corridors (Peenya, Bommasandra, Bidadi) and PSU apprenticeships.',
      scholarships: 'Labour Welfare Board Education Grant, PM Yasasvi.',
      actionRoute: '/scholarships'
    },
    {
      title: 'Paramedical & Allied Health Diplomas',
      combos: 'Medical Lab Tech (DMLT), X-Ray Imaging, Ophthalmic, Dialysis Tech',
      leadTo: 'Immediate hospital clinical laboratory and diagnostic employment in Karnataka health systems.',
      scholarships: 'Vidyasiri, SSP Post-Matric SC/ST Schemes.',
      actionRoute: '/scholarships'
    }
  ];

  const after12Paths = [
    {
      title: 'Engineering & Technology (B.E / B.Tech / B.Arch)',
      exams: 'KCET (KEA), JEE Main, COMEDK UGET, NATA',
      careers: 'Software Engineering, AI/ML, Aerospace, Electronics, Biotechnology, Data Science.',
      topColleges: 'RVCE, BMSCE, MSRIT, PES University, NITK Surathkal, IIT Dharwad.',
      scholarships: 'AICTE Pragati, Kotak Kanya, Reliance Foundation, SSP Karnataka.',
      actionRoute: '/kcet'
    },
    {
      title: 'Medicine & Healthcare (MBBS, BDS, AYUSH, Nursing)',
      exams: 'NEET UG (National Testing Agency)',
      careers: 'MBBS Doctor, Dental Surgeon, Ayurvedic Physician, B.Sc Nursing, B.Pharm, Physiotherapy.',
      topColleges: 'BMCRI Bangalore, MMCRI Mysore, KIMS Hubli, St. John\'s Medical College.',
      scholarships: 'Kotak Kanya, Central Sector Scheme, SSP SC/ST Free Education.',
      actionRoute: '/neet'
    },
    {
      title: 'Chartered Accountancy & Finance (CA, CMA, CS)',
      exams: 'ICAI CA Foundation, CSEET, CMA Foundation',
      careers: 'Statutory Auditor, Tax Consultant, Chief Financial Officer (CFO), Investment Banker.',
      topColleges: 'Direct Professional Body Membership + B.Com at Christ/St. Joseph\'s.',
      scholarships: 'Jindal Foundation, HDFC Parivartan, Tata Capital Pankh.',
      actionRoute: '/scholarships'
    },
    {
      title: 'Legal Education (5-Year Integrated B.A. LL.B / BBA LL.B)',
      exams: 'CLAT (Common Law Admission Test), AILET',
      careers: 'Corporate Lawyer, High Court & Supreme Court Advocate, Judiciary, Corporate Legal Counsel.',
      topColleges: 'National Law School of India University (NLSIU Bengaluru), KSLU Hubli.',
      scholarships: 'Central Sector Scheme, EWS Fee Concessions.',
      actionRoute: '/scholarships'
    },
    {
      title: 'Defense & Armed Forces (Army, Navy, Air Force)',
      exams: 'NDA Exam (UPSC), Technical Entry Scheme (10+2 TES)',
      careers: 'Commissioned Officer in Indian Army, Flying Officer in IAF, Sub Lieutenant in Navy.',
      topColleges: 'National Defence Academy (Khadakwasla, Pune), Indian Naval Academy (Ezhimala).',
      scholarships: 'Full Govt Sponsorship + Monthly Cadet Stipend.',
      actionRoute: '/scholarships'
    },
    {
      title: 'Pure Sciences & Scientific Research (B.S / M.S / Integrated Ph.D)',
      exams: 'IAT (IISER Aptitude Test), NEST, JEE Advanced',
      careers: 'Research Scientist at ISRO, DRDO, BARC, IISc, CSIR Laboratories or Academia.',
      topColleges: 'IISc Bengaluru, IISER (Pune/Bhopal/Mohali), NISER Bhubaneswar.',
      scholarships: 'INSPIRE Scholarship for Higher Education (SHE), KVPY.',
      actionRoute: '/scholarships'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-800/40 rounded-3xl p-6 sm:p-10">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold uppercase">
            <Compass className="w-3.5 h-3.5" /> Orbit X Academic Roadmaps
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Career Guidance & Future Pathways
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Make informed decisions about your academic trajectory after Class 10 and Class 12. Compare stream choices, national and state entrance exams, top Karnataka colleges, and eligible scholarships.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('after-10')}
              className={`px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'after-10'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              After Class 10 / SSLC Roadmaps
            </button>
            <button
              onClick={() => setActiveTab('after-12')}
              className={`px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'after-12'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              After Class 12 / 2nd PUC Roadmaps
            </button>
          </div>
        </div>

        {/* AI Career Counsellor Callout */}
        <div className="mt-8 pt-6 border-t border-indigo-900/40 bg-indigo-950/30 rounded-2xl p-5 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">Orbit X AI Career Counsellor & Higher Education Navigator</h3>
            </div>
            <p className="text-xs text-slate-300">
              Not sure which stream or degree fits your marks, budget, and work style? Ask our AI assistant for conversational profiling and a personalized 30-day, 6-month, and 1-year roadmap!
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => navigate('/ai-assistant?mode=career')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Personalized Roadmap</span>
            </button>

            <button
              onClick={() => navigate('/ai-assistant?mode=college')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Compare Colleges</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(activeTab === 'after-10' ? after10Paths : after12Paths).map((p: any, idx: number) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-5 hover:border-slate-700 hover:shadow-xl transition-all"
          >
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/40">
                Option {idx + 1}
              </span>

              <h3 className="text-lg font-bold text-white leading-snug">
                {p.title}
              </h3>

              {p.combos && (
                <div className="text-xs">
                  <p className="text-slate-400 font-mono text-[11px]">Popular Combinations:</p>
                  <p className="text-slate-200 font-medium">{p.combos}</p>
                </div>
              )}

              {p.exams && (
                <div className="text-xs">
                  <p className="text-slate-400 font-mono text-[11px]">Entrance Examinations:</p>
                  <p className="text-amber-400 font-semibold">{p.exams}</p>
                </div>
              )}

              <div className="text-xs">
                <p className="text-slate-400 font-mono text-[11px]">Key Career Outcomes:</p>
                <p className="text-slate-300 leading-relaxed">{p.leadTo || p.careers}</p>
              </div>

              {p.topColleges && (
                <div className="text-xs">
                  <p className="text-slate-400 font-mono text-[11px]">Prominent Karnataka Institutes:</p>
                  <p className="text-slate-300 font-medium">{p.topColleges}</p>
                </div>
              )}

              <div className="text-xs pt-1">
                <p className="text-emerald-400 font-mono text-[11px] font-bold">Eligible Scholarships:</p>
                <p className="text-slate-400">{p.scholarships}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => navigate(p.actionRoute)}
                className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>View Study Materials</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={openAIAssistant}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <Sparkles className="w-3 h-3" />
                <span>Ask AI Mentor</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
