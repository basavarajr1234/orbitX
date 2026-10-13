import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Resource } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PaperPreviewModal } from './components/PaperPreviewModal';
import { ReportBrokenLinkModal } from './components/ReportBrokenLinkModal';
import { AIAssistantModal } from './components/AIAssistantModal';

// Pages
import { HomePage } from './pages/HomePage';
import { KarnatakaBoardPage } from './pages/KarnatakaBoardPage';
import { CBSEBoardPage } from './pages/CBSEBoardPage';
import { QuestionPaperLibraryPage } from './pages/QuestionPaperLibraryPage';
import { KCETPortalPage } from './pages/KCETPortalPage';
import { NEETPortalPage } from './pages/NEETPortalPage';
import { ScholarshipPortalPage } from './pages/ScholarshipPortalPage';
import { MockTestPage } from './pages/MockTestPage';
import { StudyNotesPage } from './pages/StudyNotesPage';
import { CareerGuidancePage } from './pages/CareerGuidancePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { Sparkles } from 'lucide-react';

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportingResource, setReportingResource] = useState<Resource | null>(null);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiModalConfig, setAiModalConfig] = useState<{ mode?: any; paperContext?: any }>({});

  const handleOpenAIAssistant = (config?: { mode?: any; paperContext?: any }) => {
    setAiModalConfig(config || {});
    setAiAssistantOpen(true);
  };

  // Sync browser history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string, params?: Record<string, string>) => {
    setCurrentRoute(route);
    setRouteParams(params || {});
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPreview = (resource: Resource) => {
    setPreviewResource(resource);
  };

  const handleOpenReportModal = (resource?: Resource) => {
    setReportingResource(resource || null);
    setReportModalOpen(true);
  };

  // Render current page based on route
  const renderCurrentPage = () => {
    if (currentRoute === '/') {
      return (
        <HomePage
          navigate={navigate}
          onPreviewPaper={handleOpenPreview}
          openAIAssistant={() => setAiAssistantOpen(true)}
        />
      );
    }

    if (currentRoute === '/karnataka/sslc') {
      return (
        <KarnatakaBoardPage
          initialClass="SSLC"
          onPreviewPaper={handleOpenPreview}
          navigate={navigate}
        />
      );
    }

    if (currentRoute === '/karnataka/2nd-puc' || currentRoute === '/karnataka/2nd-puc/model-papers') {
      return (
        <KarnatakaBoardPage
          initialClass="2nd PUC"
          initialView="model-papers"
          onPreviewPaper={handleOpenPreview}
          navigate={navigate}
        />
      );
    }

    if (currentRoute === '/cbse/class-10') {
      return (
        <CBSEBoardPage
          initialClass="Class 10"
          onPreviewPaper={handleOpenPreview}
          navigate={navigate}
        />
      );
    }

    if (currentRoute === '/cbse/class-12') {
      return (
        <CBSEBoardPage
          initialClass="Class 12"
          onPreviewPaper={handleOpenPreview}
          navigate={navigate}
        />
      );
    }

    if (currentRoute === '/class-10') {
      return (
        <KarnatakaBoardPage
          initialClass="SSLC"
          onPreviewPaper={handleOpenPreview}
          navigate={navigate}
        />
      );
    }

    if (currentRoute === '/class-12') {
      return (
        <KarnatakaBoardPage
          initialClass="2nd PUC"
          onPreviewPaper={handleOpenPreview}
          navigate={navigate}
        />
      );
    }

    if (currentRoute === '/kcet') {
      return (
        <KCETPortalPage
          onPreviewPaper={handleOpenPreview}
          navigate={navigate}
        />
      );
    }

    if (currentRoute === '/neet') {
      return (
        <NEETPortalPage
          onPreviewPaper={handleOpenPreview}
          navigate={navigate}
        />
      );
    }

    if (currentRoute === '/papers') {
      return (
        <QuestionPaperLibraryPage
          initialQuery={routeParams.query || ''}
          onPreviewPaper={handleOpenPreview}
        />
      );
    }

    if (currentRoute.startsWith('/scholarships')) {
      const isClass10 = currentRoute === '/scholarships/class-10';
      const isClass12 = currentRoute === '/scholarships/class-12';
      const isKarnataka = currentRoute === '/scholarships/karnataka';
      const isCbse = currentRoute === '/scholarships/cbse';

      return (
        <ScholarshipPortalPage
          initialFilter={{
            classLevel: isClass10 ? 'Class 10' : isClass12 ? 'Class 12' : undefined,
            state: isKarnataka ? 'Karnataka' : undefined,
            board: isCbse ? 'CBSE' : isKarnataka ? 'Karnataka State Board' : undefined
          }}
        />
      );
    }

    if (currentRoute === '/mock-tests') {
      return <MockTestPage />;
    }

    if (currentRoute === '/study-notes') {
      return <StudyNotesPage navigate={navigate} />;
    }

    if (currentRoute === '/career-guidance') {
      return (
        <CareerGuidancePage
          navigate={navigate}
          openAIAssistant={() => setAiAssistantOpen(true)}
        />
      );
    }

    if (currentRoute === '/about') {
      return <AboutPage />;
    }

    if (currentRoute === '/contact') {
      return <ContactPage openReportModal={() => handleOpenReportModal()} />;
    }

    if (currentRoute === '/login') {
      return <LoginPage navigate={navigate} />;
    }

    if (currentRoute === '/dashboard') {
      return (
        <StudentDashboardPage
          navigate={navigate}
          onPreviewPaper={handleOpenPreview}
        />
      );
    }

    if (currentRoute === '/admin/dashboard') {
      return <AdminDashboardPage navigate={navigate} />;
    }

    if (currentRoute === '/ai-assistant' || currentRoute === '/chat') {
      return (
        <AIAssistantPage
          navigate={navigate}
          onPreviewPaper={handleOpenPreview}
          initialMode={(routeParams.mode as any) || 'study'}
          initialPrompt={routeParams.prompt}
          initialPaperContext={routeParams.subject ? { subject: routeParams.subject, originalFilename: routeParams.filename } : undefined}
        />
      );
    }

    // Default fallback
    return (
      <HomePage
        navigate={navigate}
        onPreviewPaper={handleOpenPreview}
        openAIAssistant={handleOpenAIAssistant}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar
        currentRoute={currentRoute}
        navigate={navigate}
        openAIAssistant={handleOpenAIAssistant}
      />

      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      <Footer
        navigate={navigate}
        openReportModal={() => handleOpenReportModal()}
      />

      {/* Floating AI Study Assistant Trigger Button */}
      <button
        onClick={() => handleOpenAIAssistant()}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white p-3.5 sm:px-4 sm:py-3 rounded-2xl shadow-2xl shadow-indigo-600/40 flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer border border-indigo-400/40"
        title="Ask Orbit X AI Study Assistant"
      >
        <Sparkles className="w-5 h-5 text-indigo-200 animate-pulse" />
        <span className="hidden sm:inline text-xs font-bold font-mono tracking-wide">
          AI Study Assistant
        </span>
      </button>

      {/* Modals */}
      <PaperPreviewModal
        resource={previewResource}
        onClose={() => setPreviewResource(null)}
        onReportBrokenLink={(r) => {
          setPreviewResource(null);
          handleOpenReportModal(r);
        }}
      />

      {reportModalOpen && (
        <ReportBrokenLinkModal
          resource={reportingResource}
          onClose={() => setReportModalOpen(false)}
        />
      )}

      <AIAssistantModal
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        navigate={navigate}
        initialMode={aiModalConfig.mode}
        initialPaperContext={aiModalConfig.paperContext}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
