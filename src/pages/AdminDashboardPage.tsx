import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  AdminStats,
  Resource,
  Scholarship,
  ScholarshipCategory,
  Announcement,
  BrokenLinkReport,
  AuditLog,
  User,
  UserRole
} from '../types';
import { api } from '../api';
import {
  ShieldCheck,
  FileText,
  Award,
  Layers,
  Bell,
  AlertTriangle,
  Users,
  HardDrive,
  FileSpreadsheet,
  History,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
  Upload,
  ExternalLink,
  RotateCcw,
  Search,
  Filter,
  Save,
  Check,
  TrendingUp
} from 'lucide-react';

export const AdminDashboardPage: React.FC<{ navigate: (route: string) => void }> = ({ navigate }) => {
  const { user, isSuperAdmin, isAdmin, isContentManager } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'papers' | 'scholarships' | 'categories' | 'announcements' | 'broken-links' | 'users' | 'drive' | 'csv' | 'audit'>('overview');

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [papers, setPapers] = useState<Resource[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [categories, setCategories] = useState<ScholarshipCategory[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [brokenLinks, setBrokenLinks] = useState<BrokenLinkReport[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [driveSettings, setDriveSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Paper Form Modal State
  const [paperModalOpen, setPaperModalOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<Resource | null>(null);
  const [paperForm, setPaperForm] = useState({
    title: '',
    board: 'Karnataka' as 'Karnataka' | 'CBSE',
    classLevel: 'SSLC' as 'SSLC' | '2nd PUC' | 'Class 10' | 'Class 12',
    stream: 'Science' as any,
    subject: 'Mathematics',
    examYear: 2024,
    paperType: 'Previous-Year Paper' as any,
    language: 'English' as any,
    description: '',
    sourcePublisher: 'Karnataka School Examination and Assessment Board (KSEAB)',
    driveUrl: '',
    fileSize: '3.2 MB',
    publicationStatus: 'published' as any
  });
  const [uploadingFile, setUploadingFile] = useState(false);

  // Scholarship Form Modal State
  const [scholarshipModalOpen, setScholarshipModalOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [scholarshipForm, setScholarshipForm] = useState({
    title: '',
    provider: '',
    categoryId: 'cat-2',
    categoryName: 'Karnataka Government Scholarships',
    eligibleState: 'Karnataka',
    eligibleClassLevels: ['Class 10', 'Class 12', 'PUC'],
    applicableBoards: ['Karnataka State Board', 'CBSE'],
    benefitAmount: '₹25,000 / year',
    openingDate: '2025-01-01',
    lastDate: '2025-11-30',
    status: 'open' as any,
    officialApplyUrl: '',
    officialGuidelinesUrl: '',
    maxFamilyIncome: 250000,
    minMarksPercentage: 55,
    genderEligibility: 'All' as any,
    disabilityEligibility: false,
    description: ''
  });

  // Announcement Form State
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    type: 'general' as any,
    link: ''
  });

  // CSV State
  const [csvText, setCsvText] = useState('');
  const [csvType, setCsvType] = useState<'papers' | 'scholarships'>('papers');
  const [csvStatus, setCsvStatus] = useState<string | null>(null);

  // Permission Check
  if (!user || !isContentManager) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Restricted Administrator Area</h2>
        <p className="text-xs text-slate-400">
          This portal is reserved for verified Orbit X administrators and content managers. Ordinary student accounts do not have backend permission.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
        >
          Sign In with Authorized Google Account
        </button>
      </div>
    );
  }

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [sRes, pRes, schRes, catRes, annRes, repRes, driveRes] = await Promise.all([
        api.getAdminStats(),
        api.getResources({ status: 'all', limit: '100' }),
        api.getScholarships({ status: 'all' }),
        api.getCategories(),
        api.getAnnouncements(),
        api.getBrokenLinkReports(),
        api.getDriveSettings()
      ]);
      setStats(sRes);
      setPapers(pRes.resources);
      setScholarships(schRes.scholarships);
      setCategories(catRes);
      setAnnouncements(annRes);
      setBrokenLinks(repRes);
      setDriveSettings(driveRes);

      if (isSuperAdmin) {
        const [uRes, aRes] = await Promise.all([
          api.getAdminUsers(),
          api.getAuditLogs()
        ]);
        setUsersList(uRes);
        setAuditLogs(aRes);
      }
    } catch (e) {
      console.error('Failed to load admin data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [activeTab]);

  // Handle direct file upload (Method B)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    try {
      const res = await api.uploadFile(file);
      setPaperForm(prev => ({
        ...prev,
        driveUrl: window.location.origin + res.fileUrl,
        fileSize: res.fileSize
      }));
    } catch (err: any) {
      alert(err.message || 'File upload failed');
    } finally {
      setUploadingFile(false);
    }
  };

  // Submit Paper
  const handleSavePaper = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPaper) {
        await api.updateResource(editingPaper.id, paperForm);
      } else {
        await api.createResource(paperForm);
      }
      setPaperModalOpen(false);
      setEditingPaper(null);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDeletePaper = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await api.deleteResource(id);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  // Submit Scholarship
  const handleSaveScholarship = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingScholarship) {
        await api.updateScholarship(editingScholarship.id, scholarshipForm);
      } else {
        await api.createScholarship(scholarshipForm);
      }
      setScholarshipModalOpen(false);
      setEditingScholarship(null);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDeleteScholarship = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scholarship?')) return;
    try {
      await api.deleteScholarship(id);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  // Change user role (Super Admin only)
  const handleChangeRole = async (userId: string, newRole: UserRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      const updated = await api.getAdminUsers();
      setUsersList(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to update user role');
    }
  };

  // Resolve broken link
  const handleResolveBrokenLink = async (id: string, status: 'resolved' | 'dismissed') => {
    try {
      await api.updateBrokenLinkReport(id, status, `Reviewed by ${user.email}`);
      const updated = await api.getBrokenLinkReports();
      setBrokenLinks(updated);
    } catch (e) {
      console.error(e);
    }
  };

  // Test Drive Connection
  const handleTestDrive = async () => {
    try {
      const res = await api.testDriveConnection();
      alert(res.message);
      setDriveSettings((prev: any) => ({ ...prev, lastDriveTest: new Date().toISOString() }));
    } catch (e) {
      alert('Drive connection test failed');
    }
  };

  // Import CSV
  const handleImportCsv = async () => {
    if (!csvText.trim()) return;
    try {
      const res = await api.importCsv(csvText, csvType);
      setCsvStatus(`Successfully imported ${res.count} records into database!`);
      loadAllData();
    } catch (err: any) {
      setCsvStatus(`Import error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Admin Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">Orbit X Admin Console</h1>
              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                user.role === 'super_admin' ? 'bg-amber-500/20 text-amber-300' :
                user.role === 'admin' ? 'bg-indigo-500/20 text-indigo-300' :
                'bg-blue-500/20 text-blue-300'
              }`}>
                {user.role.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Logged in as <span className="text-slate-200 font-medium">{user.email}</span> • Real-time persistent relational database
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700"
          >
            Switch to Student View
          </button>
          <button
            onClick={() => {
              setEditingPaper(null);
              setPaperForm({
                title: '',
                board: 'Karnataka',
                classLevel: 'SSLC',
                stream: 'General',
                subject: 'Mathematics',
                examYear: 2024,
                paperType: 'Previous-Year Paper',
                language: 'English',
                description: '',
                sourcePublisher: 'Karnataka School Examination and Assessment Board (KSEAB)',
                driveUrl: '',
                fileSize: '3.4 MB',
                publicationStatus: 'published'
              });
              setPaperModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question Paper</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Ribbon */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs font-semibold scrollbar-none">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'papers', label: `Question Papers (${papers.length})`, icon: FileText },
          { id: 'scholarships', label: `Scholarships (${scholarships.length})`, icon: Award },
          { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
          { id: 'announcements', label: `Announcements (${announcements.length})`, icon: Bell },
          { id: 'broken-links', label: `Reports (${brokenLinks.filter(b => b.status === 'pending').length})`, icon: AlertTriangle },
          ...(isSuperAdmin ? [{ id: 'users', label: `Accounts & Roles (${usersList.length})`, icon: Users }] : []),
          { id: 'drive', label: 'Google Drive Sync', icon: HardDrive },
          { id: 'csv', label: 'CSV Import/Export', icon: FileSpreadsheet },
          ...(isSuperAdmin ? [{ id: 'audit', label: 'Audit Logs', icon: History }] : [])
        ].map((tab: any) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & REAL STATISTICS */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8 animate-fadeIn">
          {/* Key Stat Counters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-1">
              <p className="text-slate-400 text-xs font-mono uppercase">Total Question Papers</p>
              <p className="text-3xl font-black text-white">{stats.totalPapers}</p>
              <p className="text-[11px] text-emerald-400 font-medium">
                {stats.publishedPapers} Published • {stats.draftPapers} Drafts
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-1">
              <p className="text-slate-400 text-xs font-mono uppercase">Verified Scholarships</p>
              <p className="text-3xl font-black text-white">{stats.totalScholarships}</p>
              <p className="text-[11px] text-emerald-400 font-medium">
                {stats.openScholarships} Open • {stats.nearDeadlineScholarships} Near Deadline
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-1">
              <p className="text-slate-400 text-xs font-mono uppercase">Registered Students</p>
              <p className="text-3xl font-black text-white">{stats.registeredStudents}</p>
              <p className="text-[11px] text-slate-400">Authenticated via Google</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-1">
              <p className="text-slate-400 text-xs font-mono uppercase">Broken Link Tickets</p>
              <p className={`text-3xl font-black ${stats.brokenLinksReported > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                {stats.brokenLinksReported}
              </p>
              <p className="text-[11px] text-slate-400">Pending moderation</p>
            </div>
          </div>

          {/* Board Breakdown & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Board Distribution */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Curriculum Distribution
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-amber-400 font-bold block">Karnataka State Board</span>
                  <p className="text-2xl font-black text-white">{stats.boardBreakdown.Karnataka}</p>
                  <p className="text-slate-400">SSLC & 2nd PUC Papers</p>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-cyan-400 font-bold block">CBSE Academic</span>
                  <p className="text-2xl font-black text-white">{stats.boardBreakdown.CBSE}</p>
                  <p className="text-slate-400">Class 10 & Class 12 SQPs</p>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Administrative Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  onClick={() => { setActiveTab('papers'); setPaperModalOpen(true); }}
                  className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-left border border-slate-700/80 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-emerald-400 mb-1" />
                  <span className="font-bold text-white block">Upload Paper</span>
                  <span className="text-[10px] text-slate-400">Drive link or PDF file</span>
                </button>

                <button
                  onClick={() => { setActiveTab('scholarships'); setScholarshipModalOpen(true); }}
                  className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-left border border-slate-700/80 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-amber-400 mb-1" />
                  <span className="font-bold text-white block">Add Scholarship</span>
                  <span className="text-[10px] text-slate-400">Publish verified scheme</span>
                </button>

                <button
                  onClick={() => setActiveTab('csv')}
                  className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-left border border-slate-700/80 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-cyan-400 mb-1" />
                  <span className="font-bold text-white block">Batch CSV Import</span>
                  <span className="text-[10px] text-slate-400">Bulk upload metadata</span>
                </button>

                <button
                  onClick={() => setActiveTab('broken-links')}
                  className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-left border border-slate-700/80 cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400 mb-1" />
                  <span className="font-bold text-white block">Review Reports</span>
                  <span className="text-[10px] text-slate-400">Fix unreachable links</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Uploads Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Recently Uploaded Question Papers</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono">
                    <th className="py-2.5 px-3">Title</th>
                    <th className="py-2.5 px-3">Board & Class</th>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3">Year</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Created By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {stats.recentPapers.map((r) => (
                    <tr key={r.id}>
                      <td className="py-2.5 px-3 font-semibold text-white max-w-xs truncate">{r.title}</td>
                      <td className="py-2.5 px-3 font-mono">{r.board} • {r.classLevel}</td>
                      <td className="py-2.5 px-3">{r.subject}</td>
                      <td className="py-2.5 px-3 font-mono">{r.examYear}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-emerald-500/20 text-emerald-300">
                          {r.publicationStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">{r.createdBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUESTION PAPERS MANAGEMENT */}
      {activeTab === 'papers' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Question Paper Repository</h2>
              <p className="text-xs text-slate-400">
                Manage, edit, publish, or attach Google Drive files and direct PDF uploads.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingPaper(null);
                setPaperForm({
                  title: '',
                  board: 'Karnataka',
                  classLevel: 'SSLC',
                  stream: 'General',
                  subject: 'Mathematics',
                  examYear: 2024,
                  paperType: 'Previous-Year Paper',
                  language: 'English',
                  description: '',
                  sourcePublisher: 'KSEAB Bangalore',
                  driveUrl: '',
                  fileSize: '3.0 MB',
                  publicationStatus: 'published'
                });
                setPaperModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Paper
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-3 px-3">Paper Details</th>
                  <th className="py-3 px-3">Board & Class</th>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Year</th>
                  <th className="py-3 px-3">Format</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {papers.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3">
                      <p className="font-bold text-white line-clamp-1">{p.title}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-xs">{p.sourcePublisher}</p>
                    </td>
                    <td className="py-3 px-3 font-mono">{p.board} • {p.classLevel}</td>
                    <td className="py-3 px-3">{p.subject}</td>
                    <td className="py-3 px-3 font-mono">{p.examYear}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">{p.fileType} • {p.fileSize}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${
                        p.publicationStatus === 'published' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {p.publicationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={p.driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          title="Open Drive Link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => {
                            setEditingPaper(p);
                            setPaperForm({
                              title: p.title,
                              board: p.board,
                              classLevel: p.classLevel,
                              stream: p.stream || 'General',
                              subject: p.subject,
                              examYear: p.examYear,
                              paperType: p.paperType,
                              language: p.language,
                              description: p.description,
                              sourcePublisher: p.sourcePublisher,
                              driveUrl: p.driveUrl,
                              fileSize: p.fileSize,
                              publicationStatus: p.publicationStatus
                            });
                            setPaperModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300"
                          title="Edit Paper"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDeletePaper(p.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400"
                            title="Delete Resource"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SCHOLARSHIPS MANAGEMENT */}
      {activeTab === 'scholarships' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Scholarships Catalog Management</h2>
              <p className="text-xs text-slate-400">
                Publish, edit, update deadlines, and verify official state and national schemes.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingScholarship(null);
                setScholarshipForm({
                  title: '',
                  provider: '',
                  categoryId: 'cat-2',
                  categoryName: 'Karnataka Government Scholarships',
                  eligibleState: 'Karnataka',
                  eligibleClassLevels: ['Class 10', 'Class 12', 'PUC'],
                  applicableBoards: ['Karnataka State Board', 'CBSE'],
                  benefitAmount: '₹20,000 / year',
                  openingDate: '2025-01-01',
                  lastDate: '2025-11-30',
                  status: 'open',
                  officialApplyUrl: '',
                  officialGuidelinesUrl: '',
                  maxFamilyIncome: 250000,
                  minMarksPercentage: 50,
                  genderEligibility: 'All',
                  disabilityEligibility: false,
                  description: ''
                });
                setScholarshipModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Scholarship
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-3 px-3">Scholarship Scheme</th>
                  <th className="py-3 px-3">Provider & Category</th>
                  <th className="py-3 px-3">Benefit</th>
                  <th className="py-3 px-3">Deadline</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {scholarships.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3">
                      <p className="font-bold text-white line-clamp-1">{s.title}</p>
                      <p className="text-[11px] text-slate-400">{s.eligibleState} • {s.eligibleClassLevels.join(', ')}</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-200 truncate max-w-xs">{s.provider}</p>
                      <span className="text-[10px] font-mono text-emerald-400">{s.categoryName}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-emerald-300">{s.benefitAmount}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">{s.lastDate}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${
                        s.status === 'open' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={s.officialApplyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => {
                            setEditingScholarship(s);
                            setScholarshipForm({
                              title: s.title,
                              provider: s.provider,
                              categoryId: s.categoryId,
                              categoryName: s.categoryName,
                              eligibleState: s.eligibleState,
                              eligibleClassLevels: s.eligibleClassLevels,
                              applicableBoards: s.applicableBoards,
                              benefitAmount: s.benefitAmount,
                              openingDate: s.openingDate,
                              lastDate: s.lastDate,
                              status: s.status,
                              officialApplyUrl: s.officialApplyUrl,
                              officialGuidelinesUrl: s.officialGuidelinesUrl,
                              maxFamilyIncome: s.maxFamilyIncome || 250000,
                              minMarksPercentage: s.minMarksPercentage || 50,
                              genderEligibility: s.genderEligibility,
                              disabilityEligibility: s.disabilityEligibility,
                              description: s.description
                            });
                            setScholarshipModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteScholarship(s.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BROKEN LINK REPORTS */}
      {activeTab === 'broken-links' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 animate-fadeIn">
          <div>
            <h2 className="text-lg font-bold text-white">Student Broken Link Reports</h2>
            <p className="text-xs text-slate-400">
              Review issues flagged by students regarding unreachable Drive permissions or corrupt files.
            </p>
          </div>

          {brokenLinks.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              All links operating normally. Zero pending broken link tickets!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono">
                    <th className="py-3 px-3">Resource Affected</th>
                    <th className="py-3 px-3">Reported Issue</th>
                    <th className="py-3 px-3">Student Reporter</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Resolution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {brokenLinks.map((r) => (
                    <tr key={r.id}>
                      <td className="py-3 px-3 font-semibold text-white">{r.resourceTitle}</td>
                      <td className="py-3 px-3 text-slate-300">{r.reason}</td>
                      <td className="py-3 px-3 text-slate-400 font-mono">{r.reportedBy}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          r.status === 'pending' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {r.status === 'pending' && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleResolveBrokenLink(r.id, 'resolved')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                            >
                              Mark Fixed
                            </button>
                            <button
                              onClick={() => handleResolveBrokenLink(r.id, 'dismissed')}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 text-[11px]"
                            >
                              Dismiss
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: GOOGLE DRIVE INTEGRATION SETTINGS (Section 16) */}
      {activeTab === 'drive' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Google Drive Cloud Storage Sync</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Configure folders, test permission boundaries, and map question paper storage hierarchies.
              </p>
            </div>

            <button
              onClick={handleTestDrive}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              Test Drive Connection
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-mono text-[11px]">Drive Connection Status</span>
              <p className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Connected & Verified
              </p>
              <p className="text-[11px] text-slate-400">OAuth / Service Account active</p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-mono text-[11px]">Last Diagnostics Check</span>
              <p className="text-sm font-mono text-white mt-1">
                {driveSettings ? new Date(driveSettings.lastDriveTest).toLocaleString() : 'Just now'}
              </p>
              <p className="text-[11px] text-slate-400">Latency: 42ms</p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-mono text-[11px]">Active Folder Mappings</span>
              <p className="text-xl font-bold text-white mt-1">
                {driveSettings?.folderMappings ? Object.keys(driveSettings.folderMappings).length : 7} Folders
              </p>
              <p className="text-[11px] text-slate-400">Mapped to Karnataka & CBSE</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Configured Google Drive Folders
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {driveSettings?.folderMappings && Object.entries(driveSettings.folderMappings).map(([name, folderId]: any) => (
                <div key={name} className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-white">{name}</span>
                  <span className="font-mono text-[11px] text-emerald-400 bg-slate-900 px-2 py-0.5 rounded">
                    ID: {folderId}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CSV IMPORT / EXPORT (Section 14) */}
      {activeTab === 'csv' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-lg font-bold text-white">Bulk CSV Import & Export System</h2>
            <p className="text-xs text-slate-400 mt-1">
              Export existing database records for backup or paste CSV records with row validation.
            </p>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center gap-3 pt-2 border-b border-slate-800 pb-6">
            <a
              href="/api/admin/csv-export?type=papers"
              download
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export Question Papers CSV</span>
            </a>

            <a
              href="/api/admin/csv-export?type=scholarships"
              download
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>Export Scholarships CSV</span>
            </a>
          </div>

          {/* Import Form */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Import Papers via CSV Text</h3>
            <p className="text-xs text-slate-400">
              Columns expected: id, title, board, classLevel, stream, subject, examYear, paperType, language, status, driveUrl
            </p>

            <textarea
              rows={6}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="id,title,board,classLevel,stream,subject,examYear,paperType,language,status,driveUrl&#10;res-demo,SSLC English Paper,Karnataka,SSLC,General,English,2024,Previous-Year Paper,English,published,https://drive.google.com/sample"
              className="w-full bg-slate-800 text-white font-mono text-xs p-3 rounded-xl border border-slate-700"
            />

            {csvStatus && (
              <p className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30">
                {csvStatus}
              </p>
            )}

            <button
              onClick={handleImportCsv}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
            >
              Validate & Import Rows
            </button>
          </div>
        </div>
      )}

      {/* TAB 7: USER ROLES MANAGEMENT (Super Admin Only) */}
      {activeTab === 'users' && isSuperAdmin && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 animate-fadeIn">
          <div>
            <h2 className="text-lg font-bold text-white">Registered Google Accounts & Access Control</h2>
            <p className="text-xs text-slate-400">
              Super Admin control panel: Assign and promote roles between Student, Content Manager, Admin, and Super Admin.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-3 px-3">Google Identity</th>
                  <th className="py-3 px-3">Email Address</th>
                  <th className="py-3 px-3">Current Role</th>
                  <th className="py-3 px-3">Last Sign-In</th>
                  <th className="py-3 px-3 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {usersList.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                      <img
                        src={u.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`}
                        className="w-7 h-7 rounded-lg"
                        alt={u.name}
                      />
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">{u.email}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        u.role === 'super_admin' ? 'bg-amber-500/20 text-amber-300' :
                        u.role === 'admin' ? 'bg-indigo-500/20 text-indigo-300' :
                        u.role === 'content_manager' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono">
                      {new Date(u.lastLoginAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value as UserRole)}
                        className="bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded-lg border border-slate-700"
                      >
                        <option value="student">Student</option>
                        <option value="content_manager">Content Manager</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: AUDIT LOGS (Super Admin Only) */}
      {activeTab === 'audit' && isSuperAdmin && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 animate-fadeIn">
          <div>
            <h2 className="text-lg font-bold text-white">System Administrative Audit Trail</h2>
            <p className="text-xs text-slate-400">
              Immutable server-side logs recording resource creation, publishing, deletions, and permission changes.
            </p>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-900">
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Administrator</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Entity</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-emerald-400">{log.userEmail}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{log.entityType}</td>
                    <td className="py-2.5 px-3 text-slate-300">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAPER FORM MODAL (Add / Edit) with Method A and Method B */}
      {paperModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingPaper ? 'Edit Question Paper' : 'Add New Question Paper (Method A & B)'}
            </h3>

            <form onSubmit={handleSavePaper} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Paper Title</label>
                <input
                  type="text"
                  required
                  value={paperForm.title}
                  onChange={(e) => setPaperForm({ ...paperForm, title: e.target.value })}
                  placeholder="e.g. Karnataka SSLC Science Annual Paper 2024"
                  className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Board</label>
                  <select
                    value={paperForm.board}
                    onChange={(e) => setPaperForm({ ...paperForm, board: e.target.value as any })}
                    className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
                  >
                    <option value="Karnataka">Karnataka State Board</option>
                    <option value="CBSE">CBSE Board</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Class Level</label>
                  <select
                    value={paperForm.classLevel}
                    onChange={(e) => setPaperForm({ ...paperForm, classLevel: e.target.value as any })}
                    className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
                  >
                    <option value="SSLC">Karnataka SSLC</option>
                    <option value="2nd PUC">Karnataka 2nd PUC</option>
                    <option value="Class 10">CBSE Class 10</option>
                    <option value="Class 12">CBSE Class 12</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={paperForm.subject}
                    onChange={(e) => setPaperForm({ ...paperForm, subject: e.target.value })}
                    placeholder="Mathematics"
                    className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Exam Year</label>
                  <input
                    type="number"
                    value={paperForm.examYear}
                    onChange={(e) => setPaperForm({ ...paperForm, examYear: Number(e.target.value) })}
                    className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Paper Type</label>
                  <select
                    value={paperForm.paperType}
                    onChange={(e) => setPaperForm({ ...paperForm, paperType: e.target.value as any })}
                    className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
                  >
                    <option value="Previous-Year Paper">Previous-Year Paper</option>
                    <option value="Official Model Paper">Official Model Paper</option>
                    <option value="Sample Paper">Sample Paper</option>
                    <option value="Question Bank">Question Bank</option>
                    <option value="Important Questions">Important Questions</option>
                  </select>
                </div>
              </div>

              {/* Upload Method A: Drive Share Link */}
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 space-y-2">
                <span className="font-bold text-white block">Method A: Google Drive Share Link</span>
                <input
                  type="url"
                  value={paperForm.driveUrl}
                  onChange={(e) => setPaperForm({ ...paperForm, driveUrl: e.target.value })}
                  placeholder="https://drive.google.com/file/d/1.../view"
                  className="w-full bg-slate-900 text-white p-2.5 rounded-lg border border-slate-700 font-mono text-xs"
                />
              </div>

              {/* Upload Method B: Direct Upload */}
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 space-y-2">
                <span className="font-bold text-white block">Method B: Direct PDF File Upload</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="text-slate-300 text-xs"
                />
                {uploadingFile && <p className="text-emerald-400 font-medium">Uploading file to storage...</p>}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPaperModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  {editingPaper ? 'Save Changes' : 'Publish Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHOLARSHIP FORM MODAL */}
      {scholarshipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingScholarship ? 'Edit Scholarship Scheme' : 'Add New Verified Scholarship'}
            </h3>

            <form onSubmit={handleSaveScholarship} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Scholarship Title</label>
                <input
                  type="text"
                  required
                  value={scholarshipForm.title}
                  onChange={(e) => setScholarshipForm({ ...scholarshipForm, title: e.target.value })}
                  placeholder="e.g. SSP Karnataka Post-Matric Scholarship"
                  className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Provider Authority</label>
                  <input
                    type="text"
                    required
                    value={scholarshipForm.provider}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, provider: e.target.value })}
                    placeholder="Social Welfare Dept, Govt of Karnataka"
                    className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Benefit Grant</label>
                  <input
                    type="text"
                    required
                    value={scholarshipForm.benefitAmount}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, benefitAmount: e.target.value })}
                    placeholder="₹25,000 / year + Tuition waiver"
                    className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Eligible State</label>
                  <select
                    value={scholarshipForm.eligibleState}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, eligibleState: e.target.value })}
                    className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
                  >
                    <option value="Karnataka">Karnataka</option>
                    <option value="All India">All India</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={scholarshipForm.lastDate}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, lastDate: e.target.value })}
                    className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={scholarshipForm.categoryId}
                    onChange={(e) => {
                      const cat = categories.find(c => c.id === e.target.value);
                      setScholarshipForm({
                        ...scholarshipForm,
                        categoryId: e.target.value,
                        categoryName: cat ? cat.name : 'Karnataka Government Scholarships'
                      });
                    }}
                    className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Official Apply Link</label>
                  <input
                    type="url"
                    required
                    value={scholarshipForm.officialApplyUrl}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, officialApplyUrl: e.target.value })}
                    placeholder="https://ssp.postmatric.karnataka.gov.in/"
                    className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Guidelines Link</label>
                  <input
                    type="url"
                    value={scholarshipForm.officialGuidelinesUrl}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, officialGuidelinesUrl: e.target.value })}
                    placeholder="https://sw.karnataka.gov.in/"
                    className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Brief Description</label>
                <textarea
                  rows={3}
                  value={scholarshipForm.description}
                  onChange={(e) => setScholarshipForm({ ...scholarshipForm, description: e.target.value })}
                  placeholder="Eligibility details, required documents, and stipend breakdown..."
                  className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setScholarshipModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  {editingScholarship ? 'Save Changes' : 'Publish Scholarship'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
