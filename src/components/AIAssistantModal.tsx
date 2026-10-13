import React, { useState, useRef, useEffect } from 'react';
import { api } from '../api';
import {
  ChatMessage,
  AIChatMode,
  ChatCitation,
  OrbitXResourceLink
} from '../types';
import {
  Sparkles,
  X,
  Send,
  BookOpen,
  GraduationCap,
  Award,
  Compass,
  Layers,
  Building2,
  Languages,
  Maximize2,
  Copy,
  Check,
  Search,
  ExternalLink,
  Download,
  Eye,
  FileText,
  RotateCcw
} from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigate?: (route: string) => void;
  initialMode?: AIChatMode;
  initialPaperContext?: { subject: string; originalFilename?: string };
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  navigate,
  initialMode = 'study',
  initialPaperContext
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<AIChatMode>(initialMode);
  const [language, setLanguage] = useState<'en' | 'kn'>('en');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: `Hello! I am the **Orbit X AI Study Assistant**.

I provide real-time guidance across:
- 📂 **Karnataka 2nd PUC Model Papers:** Solving & explanations for Mathematics, Physics, Chemistry, Biology, English & Kannada.
- 🎯 **Exam Prep:** KSEAB/DPUE blueprints, KCET & NEET high-yield pointers.
- 🧭 **Career & College Navigator:** Pathways after SSLC & 12th, courses, fees, and Bengaluru colleges.
- 🏆 **Scholarships:** Eligibility and documents for Karnataka SSP, Vidyasiri, and NSP.

How can I help you today?`,
      mode: initialMode,
      source: 'Orbit X Academic Engine',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const modesConfig: Array<{ id: AIChatMode; label: string; icon: any }> = [
    { id: 'study', label: 'Study', icon: BookOpen },
    { id: 'exam', label: 'Exam Prep', icon: Layers },
    { id: 'career', label: 'Career', icon: Compass },
    { id: 'course', label: 'Courses', icon: GraduationCap },
    { id: 'college', label: 'Colleges', icon: Building2 },
    { id: 'scholarship', label: 'Scholarships', icon: Award },
  ];

  const quickPrompts: Record<AIChatMode, string[]> = {
    study: [
      'Explain Quadratic Formula step-by-step (SSLC Maths)',
      'Derive electric field on dipole axis (2nd PUC Physics)',
      'Explain Cannizzaro reaction mechanism (Chemistry)',
    ],
    exam: [
      'Solve question 1 of Karnataka 2nd PUC Physics model paper',
      'What is the question blueprint for 2nd PUC Mathematics?',
      'How to score 50+ in KCET Physics in the last 30 days?',
    ],
    career: [
      'What are my options after SSLC (10th)?',
      'Career options after 2nd PUC PCMB besides MBBS',
      'Create a personalized career roadmap for Engineering',
    ],
    course: [
      'Compare B.E Computer Science vs AI/ML',
      'Admission route for 5-Year B.A. LL.B at NLSIU Bengaluru',
      'Details of B.Sc (Hons) Agriculture via KCET',
    ],
    college: [
      'Find affordable government colleges in Bengaluru',
      'Compare RVCE, BMSCE, and MSRIT for CSE',
      'List top government medical colleges in Karnataka',
    ],
    scholarship: [
      'What documents are needed for SSP Karnataka Scholarship?',
      'How to apply for Vidyasiri ePASS Food & Accommodation?',
      'Find merit scholarships for PUC and Engineering',
    ],
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      mode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(-5).map(m => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        text: m.text
      }));

      const res = await api.sendChatMessage({
        prompt: query,
        sessionId,
        mode,
        language,
        history: historyPayload,
        paperContext: initialPaperContext
      });

      if (res.sessionId) setSessionId(res.sessionId);

      const assistantMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: res.answer,
        mode,
        source: res.source,
        citations: res.citations,
        orbitxLinks: res.orbitxLinks,
        suggestedFollowUps: res.suggestedFollowUps,
        lastCheckedDate: res.lastCheckedDate,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: `Apologies, I encountered a temporary connection issue (${err?.message || 'Network error'}). Please try again.`,
          mode,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenFullPage = () => {
    onClose();
    if (navigate) {
      navigate('/ai-assistant');
    } else {
      window.location.href = '/ai-assistant';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col h-[88vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-900 to-emerald-600 border border-emerald-400/40 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Orbit X AI Study Assistant</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  Gemini + Search
                </span>
              </div>
              <p className="text-xs text-slate-400">
                2nd PUC Papers • KCET • NEET • College & Career Navigator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLanguage(l => l === 'en' ? 'kn' : 'en')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1"
              title="Toggle Language (English / Kannada)"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'en' ? 'EN' : 'ಕನ್ನಡ'}</span>
            </button>

            <button
              onClick={handleOpenFullPage}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Open Dedicated Full-Screen Chat Page"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 6 Modes Selector Bar */}
        <div className="px-4 py-2 border-b border-slate-800 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          {modesConfig.map(m => {
            const Icon = m.icon;
            const isActive = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200 border-slate-800 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fadeIn`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-4 shadow-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap selection:bg-emerald-500 selection:text-slate-950">
                    {m.text}
                  </div>

                  {/* Real Search Citations */}
                  {!isUser && m.citations && m.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/80">
                      <p className="text-[10px] font-bold text-slate-400 mb-1.5 flex items-center gap-1">
                        <Search className="w-3 h-3 text-blue-400" />
                        <span>Live Grounding Sources:</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {m.citations.map((c, idx) => (
                          <a
                            key={idx}
                            href={c.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900/80 text-blue-300 hover:text-blue-200 border border-blue-900/50 text-[10px]"
                          >
                            <ExternalLink className="w-2.5 h-2.5 text-blue-400" />
                            <span className="truncate max-w-[180px]">{c.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Internal Orbit X Resource Cards */}
                  {!isUser && m.orbitxLinks && m.orbitxLinks.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/80 space-y-1.5">
                      <p className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>Orbit X Repository Links:</span>
                      </p>
                      {m.orbitxLinks.map(link => (
                        <div
                          key={link.id}
                          className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-2 flex items-center justify-between gap-2"
                        >
                          <span className="text-[11px] font-semibold text-white truncate">{link.title}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            {link.downloadUrl && (
                              <a
                                href={link.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-0.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] flex items-center gap-1"
                              >
                                <Download className="w-2.5 h-2.5" />
                                <span>PDF</span>
                              </a>
                            )}
                            {navigate && (
                              <button
                                onClick={() => { onClose(); navigate(link.route); }}
                                className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[10px]"
                              >
                                View
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Bar */}
                  {!isUser && (
                    <div className="mt-2.5 pt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{m.source || 'Orbit X AI'}</span>
                      <button
                        onClick={() => handleCopy(m.text, m.id)}
                        className="flex items-center gap-1 hover:text-white"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Follow ups */}
                {!isUser && m.suggestedFollowUps && m.suggestedFollowUps.length > 0 && (
                  <div className="mt-2 max-w-[90%] flex flex-wrap gap-1">
                    {m.suggestedFollowUps.slice(0, 2).map((q, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => handleSend(q)}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-700 text-left transition-colors"
                      >
                        &rarr; {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60 text-xs text-slate-400 animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Analyzing curriculum & search grounding for verified answer...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            {quickPrompts[mode].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/60 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-2xl p-1.5 focus-within:border-emerald-500"
          >
            <input
              type="text"
              placeholder={`Ask in ${language === 'kn' ? 'Kannada' : 'English'} (${mode} mode)...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={`p-2 sm:px-4 sm:py-2 rounded-xl text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all ${
                input.trim() && !loading
                  ? 'bg-emerald-500 hover:bg-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
