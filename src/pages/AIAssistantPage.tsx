import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  ChatMessage,
  ChatSession,
  AIChatMode,
  ChatCitation,
  OrbitXResourceLink,
  CollegeInfo,
  EntranceExamInfo
} from '../types';
import {
  Sparkles,
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  GraduationCap,
  Award,
  Compass,
  Search,
  ExternalLink,
  Download,
  Eye,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  Languages,
  CheckCircle2,
  FileText,
  Clock,
  Menu,
  X
} from 'lucide-react';

interface AIAssistantPageProps {
  navigate: (route: string) => void;
  onPreviewPaper?: (resource: any) => void;
  initialMode?: AIChatMode;
  initialPrompt?: string;
  initialPaperContext?: { subject: string; originalFilename?: string };
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({
  navigate,
  onPreviewPaper,
  initialMode = 'study',
  initialPrompt,
  initialPaperContext
}) => {
  const { user } = useAuth();

  const [mode, setMode] = useState<AIChatMode>(initialMode);
  const [language, setLanguage] = useState<'en' | 'kn'>('en');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paperContext, setPaperContext] = useState<{ subject: string; originalFilename?: string } | undefined>(initialPaperContext);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const modesConfig: Array<{ id: AIChatMode; label: string; icon: any; color: string; desc: string }> = [
    { id: 'study', label: 'Study Help', icon: BookOpen, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', desc: 'Concept explanations, formulas & NCERT worked examples' },
    { id: 'exam', label: 'Exam Preparation', icon: Layers, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10', desc: '2nd PUC model papers solver, blueprints & KCET/NEET shortcuts' },
    { id: 'career', label: 'Career Guidance', icon: Compass, color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10', desc: 'Pathways after 10th/12th, stream selection & personalized roadmaps' },
    { id: 'course', label: 'Course Finder', icon: GraduationCap, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10', desc: 'Eligibility, duration, entrance exams & career outcomes' },
    { id: 'college', label: 'College Finder', icon: Building2, color: 'text-purple-400 border-purple-500/30 bg-purple-500/10', desc: 'Bengaluru & Karnataka colleges, fee estimates & comparisons' },
    { id: 'scholarship', label: 'Scholarship Guidance', icon: Award, color: 'text-teal-400 border-teal-500/30 bg-teal-500/10', desc: 'SSP Karnataka, Vidyasiri, NSP & merit financial aid' },
  ];

  const suggestedQuestions: Record<AIChatMode, string[]> = {
    study: [
      'Explain Quadratic Formula with a worked example (SSLC Maths)',
      'Derive the expression for electric field due to a dipole (2nd PUC Physics)',
      'Explain Cannizzaro Reaction mechanism with examples (Chemistry)',
      'Describe the structure of human nephron and urine formation (Biology)',
    ],
    exam: [
      'Solve Question 1 from Karnataka 2nd PUC Physics model paper (MQP 1C)',
      'What is the question blueprint and mark weightage for 2nd PUC Mathematics?',
      'How to score 55+ in KCET Physics in the last 30 days?',
      'High-yield NCERT Biology chapters for NEET 2025/2026',
    ],
    career: [
      'What can I do after 10th (SSLC)? Compare Science vs Commerce vs Diploma',
      'What are my career options after 2nd PUC PCMB besides MBBS?',
      'What can I study after 2nd PUC PCMC (Computer Science)?',
      'Career options after Commerce without Mathematics',
      'Create a personalized career roadmap for Engineering based on 85% marks',
    ],
    course: [
      'Compare B.E Computer Science vs AI & Data Science (Eligibility & Jobs)',
      'Complete guide to B.Sc (Hons) Agriculture in Karnataka via KCET',
      'What is the admission process for 5-Year B.A. LL.B at NLSIU Bengaluru?',
      'Details of Chartered Accountancy (CA Foundation to Final)',
    ],
    college: [
      'Find affordable government engineering colleges in Bengaluru',
      'Compare RVCE, BMSCE, and MSRIT for B.Tech Computer Science',
      'List top government medical colleges in Karnataka with approximate fees',
      'Compare Christ University vs St. Joseph\'s for B.Com and BBA',
    ],
    scholarship: [
      'What documents and RD numbers are needed for SSP Karnataka Post-Matric Scholarship?',
      'How to apply for Vidyasiri ePASS Food & Accommodation Scheme?',
      'Find merit scholarships for 2nd PUC and Engineering students',
      'List scholarships for female students in Karnataka with eligibility',
    ],
  };

  // Load chat sessions on mount
  useEffect(() => {
    loadSessions();
  }, [user]);

  const loadSessions = async () => {
    try {
      const list = await api.getChatSessions();
      setSessions(list);
      if (list.length > 0 && !currentSessionId) {
        setCurrentSessionId(list[0].id);
        setMessages(list[0].messages || []);
      } else if (list.length === 0) {
        startNewChat();
      }
    } catch (e) {
      console.warn('Could not load sessions', e);
      if (messages.length === 0) {
        initWelcomeMessage();
      }
    }
  };

  const initWelcomeMessage = (customMode?: AIChatMode) => {
    const activeM = customMode || mode;
    const welcome: ChatMessage = {
      id: 'welcome-msg',
      sender: 'assistant',
      text: language === 'kn'
        ? `ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ **Orbit X AI Study Assistant**.\n\nನಾನು ನಿಮಗೆ ಈ ಕೆಳಗಿನವುಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ:\n- **ಕರ್ನಾಟಕ 2ನೇ ಪಿಯುಸಿ ಮಾದರಿ ಪ್ರಶ್ನೆಪತ್ರಿಕೆಗಳು:** ಗಣಿತ, ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ, ಜೀವಶಾಸ್ತ್ರ, ಇಂಗ್ಲಿಷ್ ಮತ್ತು ಕನ್ನಡ.\n- **ಪರಿಕಲ್ಪನೆಗಳ ವಿವರಣೆ:** SSLC, 2nd PUC, CBSE 10 & 12.\n- **ಪ್ರವೇಶ ಪರೀಕ್ಷೆಗಳು:** KCET, NEET, COMEDK, JEE ಮತ್ತು CUET ನೈಜ-ಸಮಯದ ಮಾಹಿತಿ.\n- **ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಕಾಲೇಜುಗಳು:** ಬೆಂಗಳೂರು ಮತ್ತು ಕರ್ನಾಟಕದ ಉನ್ನತ ಶಿಕ್ಷಣ ಸಂಸ್ಥೆಗಳು.\n- **ವಿದ್ಯಾರ್ಥಿವೇತನಗಳು:** SSP, ವಿದ್ಯಾಸಿರಿ, NSP ಮತ್ತು ಮೆರಿಟ್ ಸ್ಕಾಲರ್‌ಶಿಪ್‌ಗಳು.\n\nನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಿ!`
        : `Hello! I am the **Orbit X AI Study Assistant** — your integrated academic mentor, model paper solver, real-time education advisor, and career counsellor.\n\nI combine **three intelligent knowledge sources**:\n1. 📂 **Orbit X Internal Repository:** Karnataka 2nd PUC Model Papers (Mathematics, Physics, Chemistry, Biology, English, Kannada), SSLC papers, and verified scholarships.\n2. 🌐 **Live Google Search Grounding:** Real-time entrance exam dates, application deadlines, notifications, and college fees.\n3. 🎓 **Gemini 3.8 Flash Educational Tutor:** Step-by-step solutions, derivations, formulas, blueprints, and career roadmaps.\n\nSelect a mode above or ask your question below!`,
      mode: activeM,
      source: 'Orbit X Academic Engine',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([welcome]);
  };

  const startNewChat = async (targetMode?: AIChatMode) => {
    const newM = targetMode || mode;
    try {
      const newSession = await api.createChatSession('New Chat', newM, language);
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      setMessages([]);
      initWelcomeMessage(newM);
    } catch (e) {
      const fallbackId = `chat-${Date.now()}`;
      setCurrentSessionId(fallbackId);
      setMessages([]);
      initWelcomeMessage(newM);
    }
  };

  const selectSession = async (sess: ChatSession) => {
    setCurrentSessionId(sess.id);
    setMode(sess.mode || 'study');
    setLanguage(sess.language || 'en');
    setMessages(sess.messages || []);
    setSidebarOpen(false);
  };

  const handleClearChat = async () => {
    if (!currentSessionId) return;
    try {
      await api.clearChatSession(currentSessionId);
    } catch (e) {}
    initWelcomeMessage();
  };

  const handleDeleteSession = async (sessId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deleteChatSession(sessId);
      setSessions(prev => prev.filter(s => s.id !== sessId));
      if (currentSessionId === sessId) {
        startNewChat();
      }
    } catch (err) {
      console.warn('Failed to delete session', err);
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle initial prompt from props
  useEffect(() => {
    if (initialPrompt && messages.length <= 1) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSend = async (queryToSend?: string) => {
    const text = (queryToSend || input).trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      mode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!queryToSend) setInput('');
    setLoading(true);

    try {
      const historyPayload = messages
        .filter(m => m.id !== 'welcome-msg')
        .slice(-6)
        .map(m => ({
          role: m.sender === 'user' ? ('user' as const) : ('model' as const),
          text: m.text
        }));

      const res = await api.sendChatMessage({
        prompt: text,
        sessionId: currentSessionId || undefined,
        mode,
        language,
        history: historyPayload,
        paperContext
      });

      if (res.sessionId && (!currentSessionId || currentSessionId.startsWith('chat-fallback'))) {
        setCurrentSessionId(res.sessionId);
      }

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: res.answer,
        mode,
        source: res.source,
        citations: res.citations,
        orbitxLinks: res.orbitxLinks,
        suggestedFollowUps: res.suggestedFollowUps,
        lastCheckedDate: res.lastCheckedDate,
        searchQueriesUsed: res.searchQueriesUsed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update session title in list if this was the first query
      if (currentSessionId) {
        setSessions(prev =>
          prev.map(s => {
            if (s.id === currentSessionId && s.title === 'New Chat') {
              return { ...s, title: text.length > 30 ? text.substring(0, 28) + '...' : text };
            }
            return s;
          })
        );
      }
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `I encountered an unexpected issue while retrieving information (${err?.message || 'Network error'}). Please try asking again.`,
        mode,
        source: 'Orbit X Recovery Engine',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-4.5rem)] bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Conversations Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Orbit X AI</h2>
              <p className="text-[10px] text-slate-400">Study & Career Mentor</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => startNewChat()}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat Session</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1 text-xs">
          <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Recent Conversations
          </div>
          {sessions.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-[11px]">
              No saved sessions yet. Start a new question!
            </div>
          ) : (
            sessions.map((sess) => (
              <div
                key={sess.id}
                onClick={() => selectSession(sess)}
                className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                  currentSessionId === sess.id
                    ? 'bg-slate-800 text-emerald-400 font-semibold border border-slate-700/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-1">
                  <Sparkles className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  <span className="truncate text-xs">{sess.title || 'Study Session'}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteSession(sess.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 transition-opacity"
                  title="Delete chat"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* User / Storage status footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate">{user ? user.email : 'Guest Student'}</span>
          </div>
          <button
            onClick={handleClearChat}
            className="text-[10px] text-slate-400 hover:text-slate-300 flex items-center gap-1"
            title="Clear current messages"
          >
            <RotateCcw className="w-3 h-3" />
            Clear
          </button>
        </div>
      </aside>

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
        {/* Top Navigation & Mode Selector Ribbon */}
        <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                <Menu className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Orbit X AI Assistant
                </span>
                <span className="hidden sm:inline text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Gemini 3.8 Flash + Google Search Grounding
                </span>
              </div>
            </div>

            {/* Language Toggle & Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLanguage(l => l === 'en' ? 'kn' : 'en')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                title="Toggle response language between English and Kannada"
              >
                <Languages className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'en' ? 'English' : 'ಕನ್ನಡ (Kannada)'}</span>
              </button>

              <button
                onClick={() => navigate('/karnataka/2nd-puc/model-papers')}
                className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>2nd PUC Papers</span>
              </button>
            </div>
          </div>

          {/* 6 Modes Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {modesConfig.map((mConfig) => {
              const Icon = mConfig.icon;
              const isActive = mode === mConfig.id;
              return (
                <button
                  key={mConfig.id}
                  onClick={() => setMode(mConfig.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    isActive
                      ? mConfig.color + ' shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 border-slate-800 hover:bg-slate-800/40'
                  }`}
                  title={mConfig.desc}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{mConfig.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Paper Context Notice Bar (if asking about a specific model paper) */}
        {paperContext && (
          <div className="bg-emerald-950/40 border-b border-emerald-800/40 px-4 py-1.5 text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">
                Active Paper Focus: <strong>Karnataka 2nd PUC {paperContext.subject} Model Question Paper</strong> {paperContext.originalFilename && `(${paperContext.originalFilename})`}
              </span>
            </div>
            <button
              onClick={() => setPaperContext(undefined)}
              className="text-emerald-400 hover:text-white text-[11px] underline"
            >
              Clear Focus
            </button>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fadeIn`}
              >
                {/* Header with avatar / tag */}
                <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
                  {isUser ? (
                    <>
                      <span>You</span>
                      <span>•</span>
                      <span>{m.timestamp}</span>
                    </>
                  ) : (
                    <>
                      <div className="w-4 h-4 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[9px]">
                        OX
                      </div>
                      <span className="font-bold text-slate-300">Orbit X Assistant</span>
                      {m.source && (
                        <>
                          <span>•</span>
                          <span className="text-slate-400 text-[10px]">{m.source}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{m.timestamp}</span>
                    </>
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-4 sm:p-5 shadow-sm text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans selection:bg-emerald-500 selection:text-slate-950">
                    {m.text}
                  </div>

                  {/* Grounding Source Citations (Clickable Real URLs) */}
                  {!isUser && m.citations && m.citations.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-800">
                      <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5 text-blue-400" />
                        <span>Verified Live Search Sources & Official Citations:</span>
                        {m.lastCheckedDate && (
                          <span className="text-[10px] text-slate-400 font-normal">
                            (Checked: {m.lastCheckedDate})
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {m.citations.map((c, idx) => (
                          <a
                            key={idx}
                            href={c.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-blue-300 hover:text-blue-200 border border-blue-900/50 text-[11px] transition-colors"
                          >
                            <ExternalLink className="w-3 h-3 text-blue-400 shrink-0" />
                            <span className="truncate max-w-[240px]">{c.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Internal Orbit X Resources (Clickable View / Download / Apply) */}
                  {!isUser && m.orbitxLinks && m.orbitxLinks.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-800">
                      <div className="text-[11px] font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Orbit X Repository Resources for this Answer:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {m.orbitxLinks.map((link) => (
                          <div
                            key={link.id}
                            className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2.5 flex items-center justify-between gap-2"
                          >
                            <div className="truncate">
                              <p className="text-xs font-bold text-white truncate">{link.title}</p>
                              <span className="text-[10px] text-emerald-400 font-mono">
                                {link.type === 'paper' ? 'Official Model Paper' : link.type === 'scholarship' ? 'Verified Scholarship' : 'Academic Resource'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {link.downloadUrl && (
                                <a
                                  href={link.downloadUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow-sm"
                                  title="Download Original PDF"
                                >
                                  <Download className="w-3 h-3" />
                                  <span className="hidden sm:inline">PDF</span>
                                </a>
                              )}
                              <button
                                onClick={() => navigate(link.route)}
                                className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[10px] flex items-center gap-1"
                                title="Open in Orbit X"
                              >
                                <Eye className="w-3 h-3 text-slate-300" />
                                <span className="hidden sm:inline">Open</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action row: Copy, Follow-ups */}
                  {!isUser && (
                    <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(m.text, m.id)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                          title="Copy response"
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
                    </div>
                  )}
                </div>

                {/* Contextual Suggested Follow-ups */}
                {!isUser && m.suggestedFollowUps && m.suggestedFollowUps.length > 0 && (
                  <div className="mt-2.5 max-w-[92%] sm:max-w-[85%] flex flex-wrap gap-1.5">
                    {m.suggestedFollowUps.map((q, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => handleSend(q)}
                        className="text-left text-[11px] px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <ChevronRight className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{q}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Loading Indicator */}
          {loading && (
            <div className="flex flex-col items-start animate-fadeIn">
              <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
                <div className="w-4 h-4 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[9px]">
                  OX
                </div>
                <span>Orbit X Assistant is consulting curriculum & live sources...</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-none p-4 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce delay-150" />
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-bounce delay-300" />
                </div>
                <span className="text-xs text-slate-400">Searching internal papers, KEA/NTA databases, and formulating step-by-step guidance...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts for Current Mode */}
        <div className="px-4 py-2 border-t border-slate-850 bg-slate-900/40 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" /> Suggestions:
            </span>
            {suggestedQuestions[mode].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-3 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-750 text-[11px] transition-colors cursor-pointer shrink-0"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 shrink-0">
          <div className="relative flex items-end gap-2 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-2 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all shadow-lg">
            <textarea
              ref={textareaRef}
              rows={2}
              placeholder={
                mode === 'study'
                  ? 'Ask any Maths, Physics, Chemistry, Biology concept or homework problem...'
                  : mode === 'exam'
                  ? 'Ask to solve 2nd PUC model papers (Maths, Physics, Chem, Bio, Eng, Kannada) or KCET shortcuts...'
                  : mode === 'career'
                  ? 'Ask about career options after SSLC, 2nd PUC PCMB/PCMC, Commerce, Arts, or ask for a roadmap...'
                  : mode === 'course'
                  ? 'Ask for details of any course: eligibility, duration, entrance exams, fees & colleges...'
                  : mode === 'college'
                  ? 'Ask to find & compare colleges in Bengaluru / Karnataka within your budget...'
                  : 'Ask about SSP, Vidyasiri, NSP scholarships, eligibility criteria & deadlines...'
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-400 resize-none focus:outline-none p-1.5"
            />

            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className={`p-3 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                input.trim() && !loading
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-750 text-slate-400 cursor-not-allowed'
              }`}
              title="Send (Enter)"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span className="flex items-center gap-1.5">
              <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for new line</span>
            </span>
            <span>
              Supported: <strong>English</strong> & <strong>ಕನ್ನಡ (Kannada)</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
