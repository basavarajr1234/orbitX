import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'super_admin' | 'admin' | 'content_manager' | 'student';
  googleId?: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface Resource {
  id: string;
  title: string;
  board: 'Karnataka' | 'CBSE';
  classLevel: 'SSLC' | '2nd PUC' | 'Class 10' | 'Class 12';
  stream?: 'Science' | 'Commerce' | 'Arts' | 'General';
  subject: string;
  examYear: number;
  paperType: 'Previous-Year Paper' | 'Official Model Paper' | 'Sample Paper' | 'Practice Paper' | 'Question Bank' | 'Important Questions' | 'Mock Test';
  language: 'English' | 'Kannada' | 'Both';
  description: string;
  sourcePublisher: string;
  driveUrl: string;
  storagePath?: string;
  fileType: string;
  fileSize: string;
  publicationStatus: 'published' | 'draft' | 'archived';
  downloadCount: number;
  viewCount: number;
  lastVerifiedDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags?: string[];
  gdriveFileId?: string;
  originalFilename?: string;
  downloadUrl?: string;
}

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  eligibleState: string; // e.g. "Karnataka", "All India"
  eligibleClassLevels: string[]; // ['Class 10', 'Class 12', 'PUC', 'Undergraduate', 'Diploma']
  applicableBoards: string[]; // ['Karnataka State Board', 'CBSE', 'All Boards']
  eligibleSocialCategories: string[]; // ['General', 'SC', 'ST', 'OBC', 'EWS', 'Minority', 'All']
  maxFamilyIncome?: number; // annual income limit in INR
  minMarksPercentage?: number;
  genderEligibility: 'All' | 'Female' | 'Transgender';
  disabilityEligibility: boolean;
  benefitAmount: string; // e.g. "₹50,000 / year", "Full Tuition Fee Waiver"
  openingDate: string;
  lastDate: string;
  status: 'open' | 'closed' | 'upcoming';
  officialApplyUrl: string;
  officialGuidelinesUrl: string;
  requiredDocuments: string[];
  description: string;
  verificationStatus: 'verified' | 'pending';
  lastVerifiedDate: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ScholarshipCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface SavedResource {
  userId: string;
  resourceId: string;
  savedAt: string;
}

export interface SavedScholarship {
  userId: string;
  scholarshipId: string;
  savedAt: string;
}

export interface StudentPreference {
  userId: string;
  currentClass: string;
  board: string;
  stream: string;
  state: string;
  socialCategory: string;
  annualIncomeRange: string;
  marksPercentage: number;
  gender: string;
  hasDisability: boolean;
  intendedCourse: string;
  updatedAt: string;
}

export interface MockQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
  marks: number;
}

export interface MockTest {
  id: string;
  title: string;
  examType: 'KCET' | 'NEET' | 'SSLC' | '2nd PUC' | 'CBSE 10' | 'CBSE 12';
  subject: string;
  durationMinutes: number;
  totalMarks: number;
  description: string;
  questions: MockQuestion[];
}

export interface TestAttempt {
  id: string;
  userId: string;
  userEmail: string;
  testId: string;
  testTitle: string;
  score: number;
  totalMarks: number;
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  completedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'exam_alert' | 'scholarship_deadline' | 'new_paper' | 'general';
  link?: string;
  isPinned: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface BrokenLinkReport {
  id: string;
  resourceId: string;
  resourceTitle: string;
  reportedBy: string;
  reporterEmail?: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export type AIChatMode = 'study' | 'exam' | 'career' | 'course' | 'college' | 'scholarship';

export interface ChatCitation {
  uri: string;
  title: string;
  sourceType?: 'web' | 'orbitx' | 'portal';
  snippet?: string;
}

export interface OrbitXResourceLink {
  id: string;
  title: string;
  route: string;
  type: 'paper' | 'scholarship' | 'mock_test' | 'notes';
  subject?: string;
  downloadUrl?: string;
  driveUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  mode?: AIChatMode;
  source?: string;
  citations?: ChatCitation[];
  orbitxLinks?: OrbitXResourceLink[];
  suggestedFollowUps?: string[];
  lastCheckedDate?: string;
  searchQueriesUsed?: string[];
  timestamp: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  mode: AIChatMode;
  language: 'en' | 'kn';
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CollegeInfo {
  id: string;
  name: string;
  location: string;
  district: string;
  type: 'Government' | 'Private' | 'Autonomous' | 'Aided';
  courses: string[];
  entranceExams: string[];
  approxFeesAnnual: string;
  website: string;
  admissionsUrl: string;
  hostelAvailable: boolean;
  nirfOrAccreditation?: string;
  verifiedDate: string;
  category?: 'ambitious' | 'target' | 'safe';
}

export interface EntranceExamInfo {
  id: string;
  name: string;
  fullName: string;
  authority: string;
  officialUrl: string;
  courses: string[];
  eligibility: string;
  subjectsRequired: string[];
  frequency: string;
  examPattern: string;
  status: 'announced' | 'tentative' | 'upcoming';
  importantDates: string;
  preparationStrategy: string;
}

export interface DatabaseSchema {
  users: User[];
  resources: Resource[];
  scholarships: Scholarship[];
  categories: ScholarshipCategory[];
  savedResources: SavedResource[];
  savedScholarships: SavedScholarship[];
  preferences: Record<string, StudentPreference>;
  mockTests: MockTest[];
  testAttempts: TestAttempt[];
  announcements: Announcement[];
  brokenLinkReports: BrokenLinkReport[];
  auditLogs: AuditLog[];
  chatSessions: ChatSession[];
  colleges: CollegeInfo[];
  entranceExams: EntranceExamInfo[];
  settings: {
    siteTitle: string;
    gdriveConnected: boolean;
    gdriveFolderMappings: Record<string, string>;
    lastDriveTest: string;
    maintenanceMode: boolean;
    contactEmail: string;
  };
}

const DB_DIR = path.resolve(process.cwd(), 'server/data');
const DB_FILE = path.join(DB_DIR, 'database.json');

// Ensure DB directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
    this.importPucModelPapers();
  }

  public importPucModelPapers(): { imported: number; updated: number; papers: Resource[] } {
    const now = new Date().toISOString();
    let imported = 0;
    let updated = 0;

    const folderFiles = [
      {
        gdriveFileId: '1LiYT1ElOAIOpWVT2Yq6OqMz1sdfCZ-fw',
        originalFilename: '35 MATHEMATICS MQP 1.pdf',
        subject: 'Mathematics',
        stream: 'Science' as const,
        fileSize: '375 KB',
        title: 'Karnataka 2nd PUC Mathematics Model Question Paper (MQP 1)',
        language: 'English' as const,
        tags: ['2nd PUC', 'Mathematics', 'Model Paper', 'MQP 1', 'KSEAB', 'DPUE']
      },
      {
        gdriveFileId: '12UTkqTsD_NpxpwiYjV9et5WMjs4uz3tu',
        originalFilename: '33 PHYSICS MQP 1Cnew.pdf',
        subject: 'Physics',
        stream: 'Science' as const,
        fileSize: '1.03 MB',
        title: 'Karnataka 2nd PUC Physics Model Question Paper (MQP 1C)',
        language: 'English' as const,
        tags: ['2nd PUC', 'Physics', 'Model Paper', 'MQP 1C', 'KSEAB', 'DPUE']
      },
      {
        gdriveFileId: '1bBzWTXJ8VLsGMH4UvROFtsdJ6AS-cyaS',
        originalFilename: '34 CHEMISTRY MQP 1.pdf',
        subject: 'Chemistry',
        stream: 'Science' as const,
        fileSize: '223 KB',
        title: 'Karnataka 2nd PUC Chemistry Model Question Paper (MQP 1)',
        language: 'English' as const,
        tags: ['2nd PUC', 'Chemistry', 'Model Paper', 'MQP 1', 'KSEAB', 'DPUE']
      },
      {
        gdriveFileId: '1tpAc0oLW3QYwkupZijxOZeXa1dt5i7iW',
        originalFilename: '36 BIOLOGY MQP 1.pdf',
        subject: 'Biology',
        stream: 'Science' as const,
        fileSize: '412 KB',
        title: 'Karnataka 2nd PUC Biology Model Question Paper (MQP 1)',
        language: 'English' as const,
        tags: ['2nd PUC', 'Biology', 'Model Paper', 'MQP 1', 'KSEAB', 'DPUE']
      },
      {
        gdriveFileId: '1pqLjf5RvDtXQrOayTtCZH7syRysflD-I',
        originalFilename: '02 English MQP 1.pdf',
        subject: 'English',
        stream: 'General' as const,
        fileSize: '835 KB',
        title: 'Karnataka 2nd PUC English Model Question Paper (MQP 1)',
        language: 'English' as const,
        tags: ['2nd PUC', 'English', 'Model Paper', 'MQP 1', 'DPUE']
      },
      {
        gdriveFileId: '1hrGQ77uzAjfUIIHHfNITO2noZ2FRshHK',
        originalFilename: '01 KANNADA MQP 1.pdf',
        subject: 'Kannada',
        stream: 'General' as const,
        fileSize: '213 KB',
        title: 'Karnataka 2nd PUC Kannada Model Question Paper (MQP 1)',
        language: 'Kannada' as const,
        tags: ['2nd PUC', 'Kannada', 'Model Paper', 'MQP 1', 'DPUE']
      }
    ];

    const affected: Resource[] = [];

    for (const item of folderFiles) {
      // Prevent duplicates by checking Google Drive file ID
      const existingIndex = this.data.resources.findIndex(
        r => r.gdriveFileId === item.gdriveFileId || (r.driveUrl && r.driveUrl.includes(item.gdriveFileId))
      );

      const driveUrl = `https://drive.google.com/file/d/${item.gdriveFileId}/view`;
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${item.gdriveFileId}`;

      if (existingIndex >= 0) {
        this.data.resources[existingIndex] = {
          ...this.data.resources[existingIndex],
          board: 'Karnataka',
          classLevel: '2nd PUC',
          stream: item.stream,
          subject: item.subject,
          paperType: 'Official Model Paper',
          examYear: 2025,
          language: item.language,
          driveUrl,
          downloadUrl,
          gdriveFileId: item.gdriveFileId,
          originalFilename: item.originalFilename,
          fileSize: item.fileSize,
          fileType: 'PDF',
          sourcePublisher: 'Department of Pre-University Education Karnataka (DPUE) & KSEAB',
          publicationStatus: 'published',
          lastVerifiedDate: now.split('T')[0],
          updatedAt: now
        };
        affected.push(this.data.resources[existingIndex]);
        updated++;
      } else {
        const newResource: Resource = {
          id: `res-puc2-mqp-${item.subject.toLowerCase()}`,
          title: item.title,
          board: 'Karnataka',
          classLevel: '2nd PUC',
          stream: item.stream,
          subject: item.subject,
          examYear: 2025,
          paperType: 'Official Model Paper',
          language: item.language,
          description: `Official Karnataka 2nd PUC Model Question Paper for ${item.subject} (${item.originalFilename}) issued by the Department of Pre-University Education Karnataka (DPUE).`,
          sourcePublisher: 'Department of Pre-University Education Karnataka (DPUE) & KSEAB',
          driveUrl,
          downloadUrl,
          gdriveFileId: item.gdriveFileId,
          originalFilename: item.originalFilename,
          fileType: 'PDF',
          fileSize: item.fileSize,
          publicationStatus: 'published',
          downloadCount: 0,
          viewCount: 0,
          lastVerifiedDate: now.split('T')[0],
          createdAt: now,
          updatedAt: now,
          createdBy: 'system@orbitx.edu',
          tags: item.tags
        };
        this.data.resources.unshift(newResource);
        affected.push(newResource);
        imported++;
      }
    }

    if (imported > 0 || updated > 0) {
      this.logAudit(
        'system-gdrive',
        'system@orbitx.edu',
        'IMPORT_GDRIVE_PAPERS',
        'Resource',
        '1FFcXAcWHhufn_9linIrA5XCKL6ns9XAl',
        `Imported/verified 6 Karnataka 2nd PUC Model Papers from Google Drive folder (Maths, Physics, Chem, Bio, Eng, Kan)`
      );
      this.persist();
    }

    return { imported, updated, papers: affected };
  }

  public getPucModelPapersBySubject(): Record<string, { available: boolean; paper?: Resource; message?: string }> {
    const requiredSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Kannada'];
    const result: Record<string, { available: boolean; paper?: Resource; message?: string }> = {};

    for (const subj of requiredSubjects) {
      const paper = this.data.resources.find(
        r => r.board === 'Karnataka' &&
             r.classLevel === '2nd PUC' &&
             r.subject.toLowerCase() === subj.toLowerCase() &&
             (r.paperType === 'Official Model Paper' || r.paperType === 'Sample Paper') &&
             r.publicationStatus === 'published' &&
             !!r.gdriveFileId
      );

      if (paper && paper.gdriveFileId) {
        result[subj] = {
          available: true,
          paper
        };
      } else {
        result[subj] = {
          available: false,
          message: 'Paper not available'
        };
      }
    }

    return result;
  }

  private loadDatabase(): DatabaseSchema {
    let loaded: DatabaseSchema;
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        loaded = JSON.parse(raw);
      } catch (e) {
        console.error('Error reading database file, re-initializing with seeds:', e);
        loaded = this.getInitialSeed();
      }
    } else {
      loaded = this.getInitialSeed();
    }

    // Ensure collections exist if migrating an existing database file
    let needsSave = false;
    if (!Array.isArray(loaded.chatSessions)) {
      loaded.chatSessions = [];
      needsSave = true;
    }
    if (!Array.isArray(loaded.colleges) || loaded.colleges.length === 0) {
      loaded.colleges = this.getDefaultColleges();
      needsSave = true;
    }
    if (!Array.isArray(loaded.entranceExams) || loaded.entranceExams.length === 0) {
      loaded.entranceExams = this.getDefaultEntranceExams();
      needsSave = true;
    }

    if (needsSave) {
      this.saveData(loaded);
    }
    return loaded;
  }

  private saveData(data: DatabaseSchema) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  public persist() {
    this.saveData(this.data);
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  // --- AI Chat Sessions ---
  public getChatSessions(userId: string): ChatSession[] {
    if (!this.data.chatSessions) this.data.chatSessions = [];
    return this.data.chatSessions
      .filter(s => s.userId === userId || s.userId === 'guest')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public getChatSession(id: string, userId?: string): ChatSession | undefined {
    if (!this.data.chatSessions) this.data.chatSessions = [];
    return this.data.chatSessions.find(s => s.id === id && (!userId || s.userId === userId || s.userId === 'guest'));
  }

  public saveChatSession(session: ChatSession): ChatSession {
    if (!this.data.chatSessions) this.data.chatSessions = [];
    const idx = this.data.chatSessions.findIndex(s => s.id === session.id);
    session.updatedAt = new Date().toISOString();
    if (idx >= 0) {
      this.data.chatSessions[idx] = session;
    } else {
      this.data.chatSessions.unshift(session);
    }
    this.persist();
    return session;
  }

  public deleteChatSession(id: string, userId?: string): boolean {
    if (!this.data.chatSessions) return false;
    const initialLen = this.data.chatSessions.length;
    this.data.chatSessions = this.data.chatSessions.filter(
      s => !(s.id === id && (!userId || s.userId === userId || s.userId === 'guest'))
    );
    const deleted = this.data.chatSessions.length < initialLen;
    if (deleted) this.persist();
    return deleted;
  }

  public clearChatSession(id: string, userId?: string): ChatSession | undefined {
    const session = this.getChatSession(id, userId);
    if (session) {
      session.messages = [];
      session.updatedAt = new Date().toISOString();
      this.persist();
    }
    return session;
  }

  // --- Colleges Directory ---
  public getColleges(query?: string, course?: string, district?: string, type?: string): CollegeInfo[] {
    let list = this.data.colleges || [];
    if (district && district !== 'All') {
      list = list.filter(c => c.district.toLowerCase() === district.toLowerCase() || c.location.toLowerCase().includes(district.toLowerCase()));
    }
    if (type && type !== 'All') {
      list = list.filter(c => c.type.toLowerCase() === type.toLowerCase());
    }
    if (course && course !== 'All') {
      const cLow = course.toLowerCase();
      list = list.filter(c => c.courses.some(cs => cs.toLowerCase().includes(cLow)));
    }
    if (query) {
      const qLow = query.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(qLow) ||
        c.location.toLowerCase().includes(qLow) ||
        c.district.toLowerCase().includes(qLow) ||
        c.courses.some(cs => cs.toLowerCase().includes(qLow))
      );
    }
    return list;
  }

  // --- Entrance Exams Directory ---
  public getEntranceExams(query?: string): EntranceExamInfo[] {
    let list = this.data.entranceExams || [];
    if (query) {
      const qLow = query.toLowerCase();
      list = list.filter(e =>
        e.name.toLowerCase().includes(qLow) ||
        e.fullName.toLowerCase().includes(qLow) ||
        e.authority.toLowerCase().includes(qLow) ||
        e.courses.some(c => c.toLowerCase().includes(qLow))
      );
    }
    return list;
  }

  // --- Internal Academic Knowledge Retriever for AI Tutor ---
  public searchInternalAcademicContent(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) {
      return {
        resources: this.data.resources.slice(0, 6),
        scholarships: this.data.scholarships.slice(0, 4),
        mockTests: this.data.mockTests.slice(0, 2)
      };
    }

    const words = q.split(/\s+/).filter(w => w.length > 2);

    const matchesResource = (r: Resource) => {
      const text = `${r.title} ${r.subject} ${r.board} ${r.classLevel} ${r.description} ${r.originalFilename || ''} ${(r.tags || []).join(' ')}`.toLowerCase();
      if (text.includes(q)) return 10;
      let score = 0;
      for (const w of words) {
        if (text.includes(w)) score += 2;
      }
      return score;
    };

    const scoredResources = this.data.resources
      .filter(r => r.publicationStatus === 'published')
      .map(r => ({ r, score: matchesResource(r) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.r);

    const scoredScholarships = this.data.scholarships
      .filter(s => {
        const text = `${s.title} ${s.provider} ${s.categoryName} ${s.description} ${s.eligibleState} ${s.applicableBoards.join(' ')}`.toLowerCase();
        return text.includes(q) || words.some(w => text.includes(w));
      })
      .slice(0, 5);

    const scoredMockTests = this.data.mockTests
      .filter(t => {
        const text = `${t.title} ${t.subject} ${t.examType} ${t.description}`.toLowerCase();
        return text.includes(q) || words.some(w => text.includes(w));
      })
      .slice(0, 3);

    return {
      resources: scoredResources.slice(0, 8),
      scholarships: scoredScholarships,
      mockTests: scoredMockTests
    };
  }

  // --- User Operations ---
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createOrUpdateGoogleUser(email: string, name: string, avatarUrl?: string, googleId?: string): User {
    let user = this.getUserByEmail(email);
    const now = new Date().toISOString();

    // Check pre-configured super admins allowlist
    const superAdminEmails = [
      'basavarajr779@gmail.com',
      'admin@orbitx.edu',
      'superadmin@orbitx.edu'
    ];

    if (!user) {
      const isSuperAdmin = superAdminEmails.includes(email.toLowerCase());
      user = {
        id: uuidv4(),
        email,
        name: name || email.split('@')[0],
        avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
        role: isSuperAdmin ? 'super_admin' : 'student',
        googleId,
        createdAt: now,
        lastLoginAt: now,
      };
      this.data.users.push(user);
      this.logAudit(user.id, user.email, 'CREATE', 'User', user.id, `First-time login: Created ${user.role} user account.`);
    } else {
      user.lastLoginAt = now;
      if (avatarUrl) user.avatarUrl = avatarUrl;
      if (name) user.name = name;
      if (googleId) user.googleId = googleId;
    }
    this.persist();
    return user;
  }

  public updateUserRole(userId: string, newRole: User['role'], updatedBy: User): User | null {
    const user = this.getUserById(userId);
    if (!user) return null;
    const oldRole = user.role;
    user.role = newRole;
    this.persist();
    this.logAudit(updatedBy.id, updatedBy.email, 'UPDATE_ROLE', 'User', user.id, `Role changed from ${oldRole} to ${newRole}`);
    return user;
  }

  // --- Audit Logs ---
  public logAudit(userId: string, userEmail: string, action: string, entityType: string, entityId: string, details: string) {
    const log: AuditLog = {
      id: uuidv4(),
      userId,
      userEmail,
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString()
    };
    this.data.auditLogs.unshift(log);
    // keep latest 500 logs
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
    this.persist();
  }

  // Initial seed dataset
  private getInitialSeed(): DatabaseSchema {
    const now = new Date().toISOString();

    const categories: ScholarshipCategory[] = [
      { id: 'cat-1', name: 'Central Government Scholarships', slug: 'central-government', description: 'National level schemes sponsored by Govt of India' },
      { id: 'cat-2', name: 'Karnataka Government Scholarships', slug: 'karnataka-government', description: 'State-sponsored schemes like SSP, Vidyasiri, and ePASS' },
      { id: 'cat-3', name: 'SC Scholarships', slug: 'sc-scholarships', description: 'Scholarships exclusively for Scheduled Caste students' },
      { id: 'cat-4', name: 'ST Scholarships', slug: 'st-scholarships', description: 'Scholarships dedicated to Scheduled Tribe students' },
      { id: 'cat-5', name: 'OBC Scholarships', slug: 'obc-scholarships', description: 'Welfare schemes for Other Backward Classes' },
      { id: 'cat-6', name: 'EWS Scholarships', slug: 'ews-scholarships', description: 'Economically Weaker Section education grants' },
      { id: 'cat-7', name: 'Minority Scholarships', slug: 'minority-scholarships', description: 'Schemes for Muslim, Christian, Jain, Sikh, Parsi, Buddhist students' },
      { id: 'cat-8', name: 'General Merit Scholarships', slug: 'general-merit', description: 'Open merit-based awards based on examination ranks' },
      { id: 'cat-9', name: 'Income-Based Scholarships', slug: 'income-based', description: 'Financial aid targeted at low-income household students' },
      { id: 'cat-10', name: 'Merit-Based Scholarships', slug: 'merit-based', description: 'Awards based strictly on high academic percentage' },
      { id: 'cat-11', name: 'Merit-cum-Means Scholarships', slug: 'merit-cum-means', description: 'Balanced combination of academic performance and economic need' },
      { id: 'cat-12', name: 'Girl-Student Scholarships', slug: 'girl-student', description: 'Dedicated funding programs for female education and STEM' },
      { id: 'cat-13', name: 'Disability Scholarships', slug: 'disability', description: 'Empowerment scholarships for differently-abled students' },
      { id: 'cat-14', name: 'Rural-Student Scholarships', slug: 'rural-student', description: 'Targeted support for students studying in rural Karnataka & India' },
      { id: 'cat-15', name: 'First-Generation Learner Scholarships', slug: 'first-generation-learner', description: 'Support for students whose parents have no college education' },
      { id: 'cat-16', name: 'Private Foundation Scholarships', slug: 'private-foundation', description: 'Charitable trusts like Jindal Foundation, Azim Premji, etc.' },
      { id: 'cat-17', name: 'Corporate and CSR Scholarships', slug: 'corporate-csr', description: 'Corporate CSR programs from HDFC, Tata, Reliance, Infosys' },
      { id: 'cat-18', name: 'School-Level Scholarships', slug: 'school-level', description: 'Fellowships and grants for students currently in school' },
      { id: 'cat-19', name: 'Class 10 to Class 11/PUC Scholarships', slug: 'class-10-to-11-puc', description: 'Transition scholarships for students entering 1st PUC / Class 11' },
      { id: 'cat-20', name: 'Class 12 to College Scholarships', slug: 'class-12-to-college', description: 'Scholarships for students entering undergraduate degree courses' },
      { id: 'cat-21', name: 'Engineering Scholarships', slug: 'engineering', description: 'Specific aid for B.Tech / B.E / Polytechnic engineering students' },
      { id: 'cat-22', name: 'Medical and NEET-Related Scholarships', slug: 'medical-neet', description: 'Grants and fee concessions for MBBS, BDS, Nursing, AYUSH students' },
      { id: 'cat-23', name: 'KCET-Related Scholarships', slug: 'kcet-related', description: 'Fee reimbursement and scholarships tied to KCET rank & KEA allotment' },
      { id: 'cat-24', name: 'Diploma and Vocational Scholarships', slug: 'diploma-vocational', description: 'Financial support for ITI, polytechnic diplomas, and vocational training' }
    ];

    const users: User[] = [
      {
        id: 'usr-superadmin',
        email: 'basavarajr779@gmail.com',
        name: 'Basavaraj R (Super Admin)',
        avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Basavaraj',
        role: 'super_admin',
        createdAt: now,
        lastLoginAt: now
      },
      {
        id: 'usr-admin-demo',
        email: 'admin@orbitx.edu',
        name: 'Orbit X Academic Admin',
        avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=OrbitAdmin',
        role: 'admin',
        createdAt: now,
        lastLoginAt: now
      },
      {
        id: 'usr-editor-demo',
        email: 'content@orbitx.edu',
        name: 'Priya Sharma (Content Manager)',
        avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Priya',
        role: 'content_manager',
        createdAt: now,
        lastLoginAt: now
      },
      {
        id: 'usr-student-demo',
        email: 'student.demo@orbitx.edu',
        name: 'Kiran Gowda (Student)',
        avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Kiran',
        role: 'student',
        createdAt: now,
        lastLoginAt: now
      }
    ];

    const resources: Resource[] = [
      // Karnataka SSLC
      {
        id: 'res-sslc-maths-2024',
        title: 'Karnataka SSLC Mathematics Annual Exam Paper (March/April 2024)',
        board: 'Karnataka',
        classLevel: 'SSLC',
        stream: 'General',
        subject: 'Mathematics',
        examYear: 2024,
        paperType: 'Previous-Year Paper',
        language: 'Both',
        description: 'Official KSEAB Karnataka Secondary Education Examination Board SSLC Mathematics paper with English & Kannada medium versions and blueprint breakdown.',
        sourcePublisher: 'Karnataka School Examination and Assessment Board (KSEAB)',
        driveUrl: 'https://drive.google.com/file/d/1SSLC-Maths-2024-Official/view',
        fileType: 'PDF',
        fileSize: '3.4 MB',
        publicationStatus: 'published',
        downloadCount: 1420,
        viewCount: 4580,
        lastVerifiedDate: '2025-01-15',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin@orbitx.edu',
        tags: ['SSLC', 'Maths', '2024', 'KSEAB', 'Annual Paper']
      },
      {
        id: 'res-sslc-sci-2024',
        title: 'Karnataka SSLC Science Model Question Paper 2024 (Physics, Chemistry, Biology)',
        board: 'Karnataka',
        classLevel: 'SSLC',
        stream: 'General',
        subject: 'Science',
        examYear: 2024,
        paperType: 'Official Model Paper',
        language: 'Both',
        description: 'Official model question paper issued by KSEAB with complete scoring key and marks distribution per chapter.',
        sourcePublisher: 'KSEAB Bangalore',
        driveUrl: 'https://drive.google.com/file/d/1SSLC-Sci-Model-2024/view',
        fileType: 'PDF',
        fileSize: '2.8 MB',
        publicationStatus: 'published',
        downloadCount: 980,
        viewCount: 3120,
        lastVerifiedDate: '2025-01-10',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin@orbitx.edu',
        tags: ['SSLC', 'Science', 'Model Paper', 'Scoring Key']
      },
      {
        id: 'res-sslc-soc-2023',
        title: 'Karnataka SSLC Social Science Question Bank & Map Work',
        board: 'Karnataka',
        classLevel: 'SSLC',
        stream: 'General',
        subject: 'Social Science',
        examYear: 2023,
        paperType: 'Question Bank',
        language: 'Both',
        description: 'Comprehensive chapter-wise question bank covering History, Geography, Political Science, Sociology and Economics with solved 4-mark questions and historical map plotting.',
        sourcePublisher: 'DSERT Karnataka & Orbit X Editorial',
        driveUrl: 'https://drive.google.com/file/d/1SSLC-SocSci-Bank/view',
        fileType: 'PDF',
        fileSize: '5.1 MB',
        publicationStatus: 'published',
        downloadCount: 1840,
        viewCount: 5200,
        lastVerifiedDate: '2025-02-01',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin@orbitx.edu',
        tags: ['SSLC', 'Social Science', 'Question Bank', 'Map Work']
      },
      {
        id: 'res-sslc-kan-2024',
        title: 'Karnataka SSLC First Language Kannada Annual Paper 2024',
        board: 'Karnataka',
        classLevel: 'SSLC',
        stream: 'General',
        subject: 'Kannada',
        examYear: 2024,
        paperType: 'Previous-Year Paper',
        language: 'Kannada',
        description: 'Karnataka SSLC 1st Language Kannada paper with Grammar, Gadya, Padya, and Nataka sections along with model answers.',
        sourcePublisher: 'KSEAB Bangalore',
        driveUrl: 'https://drive.google.com/file/d/1SSLC-Kan-2024/view',
        fileType: 'PDF',
        fileSize: '2.2 MB',
        publicationStatus: 'published',
        downloadCount: 1120,
        viewCount: 3670,
        lastVerifiedDate: '2025-01-12',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin@orbitx.edu',
        tags: ['SSLC', 'Kannada', '1st Language', 'KSEAB']
      },

      // Karnataka 2nd PUC
      {
        id: 'res-puc-phy-2024',
        title: 'Karnataka 2nd PUC Physics Annual Examination Question Paper 2024',
        board: 'Karnataka',
        classLevel: '2nd PUC',
        stream: 'Science',
        subject: 'Physics',
        examYear: 2024,
        paperType: 'Previous-Year Paper',
        language: 'English',
        description: 'Complete 2nd PUC Board Physics question paper (Code 33) following NCERT syllabus, including 5-mark derivations and numericals with official scheme of evaluation.',
        sourcePublisher: 'Department of Pre-University Education Karnataka (DPUE)',
        driveUrl: 'https://drive.google.com/file/d/1PUC2-Phy-2024/view',
        fileType: 'PDF',
        fileSize: '3.9 MB',
        publicationStatus: 'published',
        downloadCount: 2890,
        viewCount: 8900,
        lastVerifiedDate: '2025-01-20',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin@orbitx.edu',
        tags: ['2nd PUC', 'Physics', 'Science', 'NCERT', '2024']
      },
      {
        id: 'res-puc-chem-2024',
        title: 'Karnataka 2nd PUC Chemistry Official Model Question Paper 2024',
        board: 'Karnataka',
        classLevel: '2nd PUC',
        stream: 'Science',
        subject: 'Chemistry',
        examYear: 2024,
        paperType: 'Official Model Paper',
        language: 'English',
        description: 'DPUE Karnataka Model Paper with complete step-wise evaluation scheme, Organic name reactions, and Electrochemistry/Kinetics problem sets.',
        sourcePublisher: 'DPUE Karnataka',
        driveUrl: 'https://drive.google.com/file/d/1PUC2-Chem-Model/view',
        fileType: 'PDF',
        fileSize: '2.7 MB',
        publicationStatus: 'published',
        downloadCount: 2450,
        viewCount: 7100,
        lastVerifiedDate: '2025-01-18',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin@orbitx.edu',
        tags: ['2nd PUC', 'Chemistry', 'Model Paper', 'Science']
      },
      {
        id: 'res-puc-math-2024',
        title: 'Karnataka 2nd PUC Mathematics Annual Paper 2024 with Solutions',
        board: 'Karnataka',
        classLevel: '2nd PUC',
        stream: 'Science',
        subject: 'Mathematics',
        examYear: 2024,
        paperType: 'Previous-Year Paper',
        language: 'English',
        description: '2nd PUC Mathematics Board Paper (Code 35) with step-by-step calculus, vectors, 3D geometry and matrix solutions.',
        sourcePublisher: 'DPUE Karnataka & Expert Faculty',
        driveUrl: 'https://drive.google.com/file/d/1PUC2-Math-2024/view',
        fileType: 'PDF',
        fileSize: '4.5 MB',
        publicationStatus: 'published',
        downloadCount: 3100,
        viewCount: 9400,
        lastVerifiedDate: '2025-02-05',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin@orbitx.edu',
        tags: ['2nd PUC', 'Mathematics', 'Calculus', 'Solved Paper']
      },
      {
        id: 'res-puc-bio-2024',
        title: 'Karnataka 2nd PUC Biology Important Questions & Diagrams Bank',
        board: 'Karnataka',
        classLevel: '2nd PUC',
        stream: 'Science',
        subject: 'Biology',
        examYear: 2024,
        paperType: 'Important Questions',
        language: 'English',
        description: 'Hand-curated 5-mark diagram questions, Genetics pedigree charts, and Biotechnology flowcharts frequently asked in PUC board examinations.',
        sourcePublisher: 'Karnataka PU Board Senior Lecturers Forum',
        driveUrl: 'https://drive.google.com/file/d/1PUC2-Bio-Diagrams/view',
        fileType: 'PDF',
        fileSize: '3.6 MB',
        publicationStatus: 'published',
        downloadCount: 2210,
        viewCount: 6890,
        lastVerifiedDate: '2025-01-22',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin@orbitx.edu',
        tags: ['2nd PUC', 'Biology', 'Diagrams', 'Question Bank']
      },
      {
        id: 'res-puc-acc-2024',
        title: 'Karnataka 2nd PUC Accountancy Annual Exam Paper 2024',
        board: 'Karnataka',
        classLevel: '2nd PUC',
        stream: 'Commerce',
        subject: 'Accountancy',
        examYear: 2024,
        paperType: 'Previous-Year Paper',
        language: 'English',
        description: 'Accountancy Paper (Code 30) covering Partnership Accounts, Company Accounts, Cash Flow Statements with working notes.',
        sourcePublisher: 'DPUE Bangalore',
        driveUrl: 'https://drive.google.com/file/d/1PUC2-Acc-2024/view',
        fileType: 'PDF',
        fileSize: '3.1 MB',
        publicationStatus: 'published',
        downloadCount: 1530,
        viewCount: 4800,
        lastVerifiedDate: '2025-01-14',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin@orbitx.edu',
        tags: ['2nd PUC', 'Accountancy', 'Commerce', '2024']
      },

      // CBSE Class 10
      {
        id: 'res-cbse10-math-2024',
        title: 'CBSE Class 10 Mathematics Standard Official Board Paper 2024',
        board: 'CBSE',
        classLevel: 'Class 10',
        stream: 'General',
        subject: 'Mathematics',
        examYear: 2024,
        paperType: 'Previous-Year Paper',
        language: 'English',
        description: 'CBSE Class 10 Standard Mathematics board question paper (Set 1, 2, 3) with official marking scheme and solution breakdown.',
        sourcePublisher: 'Central Board of Secondary Education (CBSE Delhi)',
        driveUrl: 'https://drive.google.com/file/d/1CBSE10-Math-2024/view',
        fileType: 'PDF',
        fileSize: '4.2 MB',
        publicationStatus: 'published',
        downloadCount: 3890,
        viewCount: 11200,
        lastVerifiedDate: '2025-01-28',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin@orbitx.edu',
        tags: ['CBSE', 'Class 10', 'Maths Standard', 'Marking Scheme']
      },
      {
        id: 'res-cbse10-sci-2024',
        title: 'CBSE Class 10 Science Sample Question Paper & Official Marking Scheme 2024',
        board: 'CBSE',
        classLevel: 'Class 10',
        stream: 'General',
        subject: 'Science',
        examYear: 2024,
        paperType: 'Sample Paper',
        language: 'English',
        description: 'Official CBSE Academic SQP with case-based assertion reasoning questions and point-wise step marking rubric.',
        sourcePublisher: 'CBSE Academic Unit',
        driveUrl: 'https://drive.google.com/file/d/1CBSE10-Sci-SQP-2024/view',
        fileType: 'PDF',
        fileSize: '3.0 MB',
        publicationStatus: 'published',
        downloadCount: 2950,
        viewCount: 8840,
        lastVerifiedDate: '2025-01-25',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin@orbitx.edu',
        tags: ['CBSE', 'Class 10', 'Science', 'SQP', 'Marking Scheme']
      },

      // CBSE Class 12
      {
        id: 'res-cbse12-phy-2024',
        title: 'CBSE Class 12 Physics Board Examination Paper 2024 with Marking Scheme',
        board: 'CBSE',
        classLevel: 'Class 12',
        stream: 'Science',
        subject: 'Physics',
        examYear: 2024,
        paperType: 'Previous-Year Paper',
        language: 'English',
        description: 'CBSE Class 12 Physics Theory examination paper (55/1/1) with official CBSE evaluator guidelines and derivation proofs.',
        sourcePublisher: 'CBSE New Delhi',
        driveUrl: 'https://drive.google.com/file/d/1CBSE12-Phy-2024/view',
        fileType: 'PDF',
        fileSize: '4.8 MB',
        publicationStatus: 'published',
        downloadCount: 4200,
        viewCount: 12900,
        lastVerifiedDate: '2025-02-02',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin@orbitx.edu',
        tags: ['CBSE', 'Class 12', 'Physics', 'Marking Scheme', '2024']
      },
      {
        id: 'res-cbse12-chem-2024',
        title: 'CBSE Class 12 Chemistry Sample Paper & Solution Blueprint 2024',
        board: 'CBSE',
        classLevel: 'Class 12',
        stream: 'Science',
        subject: 'Chemistry',
        examYear: 2024,
        paperType: 'Sample Paper',
        language: 'English',
        description: 'Official CBSE sample paper with detailed conversions, coordination chemistry IUPAC questions, and electrochemistry numericals.',
        sourcePublisher: 'CBSE Academic Directorate',
        driveUrl: 'https://drive.google.com/file/d/1CBSE12-Chem-SQP/view',
        fileType: 'PDF',
        fileSize: '3.2 MB',
        publicationStatus: 'published',
        downloadCount: 3150,
        viewCount: 9100,
        lastVerifiedDate: '2025-01-30',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin@orbitx.edu',
        tags: ['CBSE', 'Class 12', 'Chemistry', 'Sample Paper']
      },

      // KCET Preparation Papers
      {
        id: 'res-kcet-math-2024',
        title: 'KCET 2024 Mathematics Official Question Paper with Answer Key',
        board: 'Karnataka',
        classLevel: '2nd PUC',
        stream: 'Science',
        subject: 'KCET Mathematics',
        examYear: 2024,
        paperType: 'Previous-Year Paper',
        language: 'English',
        description: 'Karnataka Examination Authority (KEA) official KCET 2024 Mathematics paper (60 questions in 80 minutes) with verified answer key and shortcuts.',
        sourcePublisher: 'Karnataka Examinations Authority (KEA)',
        driveUrl: 'https://drive.google.com/file/d/1KCET-Math-2024/view',
        fileType: 'PDF',
        fileSize: '3.8 MB',
        publicationStatus: 'published',
        downloadCount: 5600,
        viewCount: 16500,
        lastVerifiedDate: '2025-02-10',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin@orbitx.edu',
        tags: ['KCET', 'KEA', 'Mathematics', '2024', 'Engineering Entrance']
      },
      {
        id: 'res-kcet-phy-2024',
        title: 'KCET 2024 Physics Question Paper with Solutions and Speed Tricks',
        board: 'Karnataka',
        classLevel: '2nd PUC',
        stream: 'Science',
        subject: 'KCET Physics',
        examYear: 2024,
        paperType: 'Previous-Year Paper',
        language: 'English',
        description: 'Official KEA KCET Physics paper featuring Mechanics, Electromagnetism, Modern Physics with high-yield shortcut techniques.',
        sourcePublisher: 'KEA & Orbit X Academic Cell',
        driveUrl: 'https://drive.google.com/file/d/1KCET-Phy-2024/view',
        fileType: 'PDF',
        fileSize: '4.1 MB',
        publicationStatus: 'published',
        downloadCount: 4890,
        viewCount: 14200,
        lastVerifiedDate: '2025-02-10',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin@orbitx.edu',
        tags: ['KCET', 'Physics', '2024', 'KEA', 'Formula Revision']
      },
      {
        id: 'res-kcet-chem-2024',
        title: 'KCET 2024 Chemistry Solved Paper & Chapter Weightage Analysis',
        board: 'Karnataka',
        classLevel: '2nd PUC',
        stream: 'Science',
        subject: 'KCET Chemistry',
        examYear: 2024,
        paperType: 'Previous-Year Paper',
        language: 'English',
        description: 'KEA Chemistry 2024 paper with detailed question-wise difficulty analysis and chapter weightage breakdown.',
        sourcePublisher: 'KEA Bangalore',
        driveUrl: 'https://drive.google.com/file/d/1KCET-Chem-2024/view',
        fileType: 'PDF',
        fileSize: '3.3 MB',
        publicationStatus: 'published',
        downloadCount: 4210,
        viewCount: 12800,
        lastVerifiedDate: '2025-02-10',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin@orbitx.edu',
        tags: ['KCET', 'Chemistry', '2024', 'Weightage']
      },

      // NEET Preparation Papers
      {
        id: 'res-neet-2024',
        title: 'NEET UG 2024 Official Question Paper (Code Q1-Q6) with NTA Answer Key',
        board: 'CBSE',
        classLevel: 'Class 12',
        stream: 'Science',
        subject: 'NEET Full Exam',
        examYear: 2024,
        paperType: 'Previous-Year Paper',
        language: 'English',
        description: 'National Testing Agency (NTA) NEET UG 2024 complete paper with 200 questions across Physics, Chemistry, Botany, and Zoology with NTA verified final answer key.',
        sourcePublisher: 'National Testing Agency (NTA)',
        driveUrl: 'https://drive.google.com/file/d/1NEET-2024-Official/view',
        fileType: 'PDF',
        fileSize: '6.4 MB',
        publicationStatus: 'published',
        downloadCount: 7800,
        viewCount: 24000,
        lastVerifiedDate: '2025-02-12',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin@orbitx.edu',
        tags: ['NEET', 'NTA', 'Medical Entrance', 'UG 2024', 'Answer Key']
      },
      {
        id: 'res-neet-bio-bank',
        title: 'NEET UG High-Yield NCERT Biology Chapterwise Question Bank (3000+ MCQs)',
        board: 'CBSE',
        classLevel: 'Class 12',
        stream: 'Science',
        subject: 'NEET Biology',
        examYear: 2024,
        paperType: 'Question Bank',
        language: 'English',
        description: 'Comprehensive line-by-line NCERT extraction MCQs for Human Physiology, Genetics, Ecology, Reproduction, and Cell Biology.',
        sourcePublisher: 'Orbit X Medical Faculty',
        driveUrl: 'https://drive.google.com/file/d/1NEET-Bio-NCERT-Bank/view',
        fileType: 'PDF',
        fileSize: '8.2 MB',
        publicationStatus: 'published',
        downloadCount: 6400,
        viewCount: 19800,
        lastVerifiedDate: '2025-02-12',
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin@orbitx.edu',
        tags: ['NEET', 'Biology', 'NCERT MCQs', 'Genetics', 'High Yield']
      }
    ];

    const scholarships: Scholarship[] = [
      {
        id: 'sch-vidyasiri-2025',
        title: 'Vidyasiri Scholarship (Karnataka ePASS Food & Accommodation Scheme)',
        provider: 'Backward Classes Welfare Department, Government of Karnataka',
        categoryId: 'cat-2',
        categoryName: 'Karnataka Government Scholarships',
        categorySlug: 'karnataka-government',
        eligibleState: 'Karnataka',
        eligibleClassLevels: ['PUC', 'Class 12', 'Undergraduate', 'Diploma'],
        applicableBoards: ['Karnataka State Board', 'CBSE', 'All Boards'],
        eligibleSocialCategories: ['OBC', 'Cat-1', '2A', '2B', '3A', '3B'],
        maxFamilyIncome: 250000,
        minMarksPercentage: 50,
        genderEligibility: 'All',
        disabilityEligibility: false,
        benefitAmount: '₹1,500/month (up to ₹15,000/year) + Fee Concession',
        openingDate: '2025-01-01',
        lastDate: '2025-11-30',
        status: 'open',
        officialApplyUrl: 'https://karepass.cgg.gov.in/',
        officialGuidelinesUrl: 'https://bcwd.karnataka.gov.in/',
        requiredDocuments: ['Aadhaar Card', 'Income & Caste Certificate (RD Number)', 'SSLC Marks Card', 'College Admission Fee Receipt', 'Bank Passbook with Aadhaar Seeding'],
        description: 'Flagship Karnataka welfare scheme providing monthly financial stipend for hostel/food and accommodation assistance to OBC, Cat-1, and minority students pursuing post-matric courses.',
        verificationStatus: 'verified',
        lastVerifiedDate: '2025-02-01',
        isFeatured: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'sch-ssp-postmatric-2025',
        title: 'SSP Karnataka Post-Matric Scholarship for SC/ST/OBC Students',
        provider: 'Social Welfare & Tribal Welfare Dept, Govt of Karnataka',
        categoryId: 'cat-3',
        categoryName: 'SC Scholarships',
        categorySlug: 'sc-scholarships',
        eligibleState: 'Karnataka',
        eligibleClassLevels: ['PUC', 'Class 11', 'Class 12', 'Undergraduate', 'Engineering', 'Medical'],
        applicableBoards: ['Karnataka State Board', 'CBSE', 'All Boards'],
        eligibleSocialCategories: ['SC', 'ST'],
        maxFamilyIncome: 250000,
        minMarksPercentage: 45,
        genderEligibility: 'All',
        disabilityEligibility: false,
        benefitAmount: '100% Tuition Fee Reimbursement + ₹20,000 Maintenance Allowance',
        openingDate: '2025-01-10',
        lastDate: '2025-12-15',
        status: 'open',
        officialApplyUrl: 'https://ssp.postmatric.karnataka.gov.in/',
        officialGuidelinesUrl: 'https://sw.karnataka.gov.in/',
        requiredDocuments: ['Aadhaar Card of Student & Parent', 'Caste Certificate with RD number', 'Income Certificate with RD number', 'Hostel Stay Certificate if hosteller', 'Bonafide Certificate', 'KCET / NEET Allotment Letter (if applicable)'],
        description: 'Direct Benefit Transfer (DBT) state portal scheme covering entire institutional tuition fees, exam fees, and monthly maintenance allowance for SC and ST students studying in Karnataka.',
        verificationStatus: 'verified',
        lastVerifiedDate: '2025-02-03',
        isFeatured: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'sch-hdfc-parivartan-2025',
        title: 'HDFC Bank Parivartan’s ECS Scholarship for School & College Students',
        provider: 'HDFC Bank Educational Crisis Support (ECS)',
        categoryId: 'cat-17',
        categoryName: 'Corporate and CSR Scholarships',
        categorySlug: 'corporate-csr',
        eligibleState: 'All India',
        eligibleClassLevels: ['Class 10', 'Class 11', 'Class 12', 'PUC', 'Undergraduate', 'Diploma'],
        applicableBoards: ['All Boards'],
        eligibleSocialCategories: ['All'],
        maxFamilyIncome: 250000,
        minMarksPercentage: 55,
        genderEligibility: 'All',
        disabilityEligibility: false,
        benefitAmount: 'Up to ₹35,000 for Class 10/12; up to ₹75,000 for Degree',
        openingDate: '2025-01-15',
        lastDate: '2025-10-31',
        status: 'open',
        officialApplyUrl: 'https://www.hdfcbank.com/personal/about-us/csr/educational-crisis-scholarship-support',
        officialGuidelinesUrl: 'https://www.buddy4study.com/page/hdfc-bank-parivartans-ecs-scholarship',
        requiredDocuments: ['Previous year mark sheet', 'Identity proof (Aadhaar/PAN)', 'Current year admission proof (fee receipt/ID card)', 'Income certificate / BPL Card', 'Crisis document if applicable (death certificate/job loss)'],
        description: 'Comprehensive CSR initiative supporting meritorious underprivileged students facing acute personal or economic crises to ensure uninterrupted continuation of studies.',
        verificationStatus: 'verified',
        lastVerifiedDate: '2025-02-05',
        isFeatured: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'sch-nmms-class10-2025',
        title: 'National Means-cum-Merit Scholarship Scheme (NMMS)',
        provider: 'Department of School Education & Literacy, Ministry of Education, Govt of India',
        categoryId: 'cat-1',
        categoryName: 'Central Government Scholarships',
        categorySlug: 'central-government',
        eligibleState: 'All India',
        eligibleClassLevels: ['Class 10', 'Class 11', 'Class 12'],
        applicableBoards: ['Karnataka State Board', 'CBSE', 'All Boards'],
        eligibleSocialCategories: ['All', 'SC', 'ST', 'OBC', 'General'],
        maxFamilyIncome: 350000,
        minMarksPercentage: 55,
        genderEligibility: 'All',
        disabilityEligibility: false,
        benefitAmount: '₹12,000 per annum (₹1,000 per month)',
        openingDate: '2025-01-01',
        lastDate: '2025-11-15',
        status: 'open',
        officialApplyUrl: 'https://scholarships.gov.in/',
        officialGuidelinesUrl: 'https://www.education.gov.in/en/nmms',
        requiredDocuments: ['Aadhaar Card', 'NMMS Selection Exam Marks Card', 'Parental Income Certificate', 'Bank Account details linked to Aadhaar (NPCI mapped)'],
        description: 'A prestigious Central Government scheme to award scholarships to meritorious students of economically weaker sections to arrest their drop out at Class 8 and encourage them to continue education till Class 12.',
        verificationStatus: 'verified',
        lastVerifiedDate: '2025-01-28',
        isFeatured: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'sch-jindal-2025',
        title: 'Sitaram Jindal Foundation Scholarship Scheme for Karnataka Students',
        provider: 'Sitaram Jindal Foundation, Bengaluru',
        categoryId: 'cat-16',
        categoryName: 'Private Foundation Scholarships',
        categorySlug: 'private-foundation',
        eligibleState: 'Karnataka',
        eligibleClassLevels: ['Class 11', 'Class 12', 'PUC', 'Diploma', 'Undergraduate', 'Engineering', 'Medical'],
        applicableBoards: ['Karnataka State Board', 'CBSE'],
        eligibleSocialCategories: ['All'],
        maxFamilyIncome: 400000,
        minMarksPercentage: 60,
        genderEligibility: 'All',
        disabilityEligibility: false,
        benefitAmount: '₹500 to ₹3,200 per month depending on course level',
        openingDate: '2025-01-01',
        lastDate: '2025-12-31',
        status: 'open',
        officialApplyUrl: 'https://www.sitaramjindalfoundation.org/scholarships.php',
        officialGuidelinesUrl: 'https://www.sitaramjindalfoundation.org/annexure.php',
        requiredDocuments: ['SSLC / PUC Marks card', 'Income certificate issued by revenue officer', 'Certificate regarding hostel stay (if applicable)', 'Fees paid receipt'],
        description: 'Prestigious Bangalore-headquartered foundation offering continuous financial grants to meritorious poor students across Karnataka from PUC through post-graduate levels.',
        verificationStatus: 'verified',
        lastVerifiedDate: '2025-02-08',
        isFeatured: false,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'sch-santoor-women-2025',
        title: 'Santoor Women’s Scholarship for Rural Karnataka Girls',
        provider: 'Wipro Cares & Santoor (Wipro Consumer Care)',
        categoryId: 'cat-12',
        categoryName: 'Girl-Student Scholarships',
        categorySlug: 'girl-student',
        eligibleState: 'Karnataka',
        eligibleClassLevels: ['PUC', 'Class 12', 'Undergraduate'],
        applicableBoards: ['Karnataka State Board'],
        eligibleSocialCategories: ['All'],
        maxFamilyIncome: 300000,
        minMarksPercentage: 55,
        genderEligibility: 'Female',
        disabilityEligibility: false,
        benefitAmount: '₹24,000 per annum until completion of degree',
        openingDate: '2025-06-01',
        lastDate: '2025-10-31',
        status: 'open',
        officialApplyUrl: 'https://www.santoorscholarship.com/',
        officialGuidelinesUrl: 'https://www.santoorscholarship.com/eligibility.html',
        requiredDocuments: ['Class 10 & Class 12 government school study certificate', 'PUC marks card', 'College admission letter', 'Aadhaar Card', 'Bank Passbook'],
        description: 'Exclusive scholarship program for young women from rural and government schools in Karnataka who have passed Class 10 & 12 and enrolled in higher education.',
        verificationStatus: 'verified',
        lastVerifiedDate: '2025-02-04',
        isFeatured: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'sch-kotak-kanya-2025',
        title: 'Kotak Kanya Scholarship for Meritorious Girls in Professional Courses',
        provider: 'Kotak Education Foundation',
        categoryId: 'cat-20',
        categoryName: 'Class 12 to College Scholarships',
        categorySlug: 'class-12-to-college',
        eligibleState: 'All India',
        eligibleClassLevels: ['Class 12', 'PUC', 'Engineering', 'Medical'],
        applicableBoards: ['Karnataka State Board', 'CBSE', 'All Boards'],
        eligibleSocialCategories: ['All'],
        maxFamilyIncome: 600000,
        minMarksPercentage: 75,
        genderEligibility: 'Female',
        disabilityEligibility: false,
        benefitAmount: '₹1,50,000 per year until professional degree completion',
        openingDate: '2025-07-01',
        lastDate: '2025-11-15',
        status: 'open',
        officialApplyUrl: 'https://kotakeducation.org/kotak-kanya-scholarship/',
        officialGuidelinesUrl: 'https://kotakeducation.org/',
        requiredDocuments: ['Class 12 / 2nd PUC marksheet with >75%', 'Entrance exam scorecard (KCET / NEET / JEE)', 'College fee receipt & bonafide certificate', 'Income proof (ITR / Form 16 / Tehsildar certificate)'],
        description: 'High-value scholarship providing up to ₹1.5 Lakhs annually for meritorious female students pursuing professional degrees like Engineering, MBBS, Architecture, and Law.',
        verificationStatus: 'verified',
        lastVerifiedDate: '2025-02-09',
        isFeatured: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'sch-aicte-pragati-2025',
        title: 'AICTE Pragati Scholarship for Girls in Technical Degrees & Diplomas',
        provider: 'All India Council for Technical Education (AICTE)',
        categoryId: 'cat-21',
        categoryName: 'Engineering Scholarships',
        categorySlug: 'engineering',
        eligibleState: 'All India',
        eligibleClassLevels: ['Class 12', 'PUC', 'Engineering', 'Diploma'],
        applicableBoards: ['Karnataka State Board', 'CBSE', 'All Boards'],
        eligibleSocialCategories: ['All'],
        maxFamilyIncome: 800000,
        minMarksPercentage: 60,
        genderEligibility: 'Female',
        disabilityEligibility: false,
        benefitAmount: '₹50,000 per annum for tuition & study equipment',
        openingDate: '2025-08-01',
        lastDate: '2025-12-31',
        status: 'open',
        officialApplyUrl: 'https://scholarships.gov.in/',
        officialGuidelinesUrl: 'https://www.aicte-india.org/schemes/students-development-schemes/Pragati',
        requiredDocuments: ['Class 10 & 12 mark sheets', 'KCET / JEE rank allotment letter in AICTE approved college', 'Tuition fee receipts', 'Family annual income certificate (< 8 Lakhs)'],
        description: 'Government of India initiative empowering girl students admitted to 1st year degree or diploma engineering programs in AICTE recognized technical colleges.',
        verificationStatus: 'verified',
        lastVerifiedDate: '2025-02-01',
        isFeatured: false,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'sch-begum-hazrat-2025',
        title: 'Begum Hazrat Mahal National Scholarship for Minority Girls',
        provider: 'Maulana Azad Education Foundation, Ministry of Minority Affairs',
        categoryId: 'cat-7',
        categoryName: 'Minority Scholarships',
        categorySlug: 'minority-scholarships',
        eligibleState: 'All India',
        eligibleClassLevels: ['Class 10', 'Class 11', 'Class 12', 'PUC'],
        applicableBoards: ['Karnataka State Board', 'CBSE', 'All Boards'],
        eligibleSocialCategories: ['Minority'],
        maxFamilyIncome: 200000,
        minMarksPercentage: 50,
        genderEligibility: 'Female',
        disabilityEligibility: false,
        benefitAmount: '₹5,000 for Class 10; ₹6,000 for Class 11 & 12/PUC',
        openingDate: '2025-01-01',
        lastDate: '2025-10-31',
        status: 'open',
        officialApplyUrl: 'https://scholarships.gov.in/',
        officialGuidelinesUrl: 'https://www.minorityaffairs.gov.in/',
        requiredDocuments: ['Previous class marks card with minimum 50%', 'Self-declaration of Minority Community', 'Income certificate from revenue authority', 'School verification form'],
        description: 'National scholarship for meritorious girl students belonging to notified minority communities (Muslims, Christians, Sikhs, Buddhists, Jains, and Parsis).',
        verificationStatus: 'verified',
        lastVerifiedDate: '2025-01-20',
        isFeatured: false,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'sch-saksham-aicte-2025',
        title: 'AICTE Saksham Scholarship Scheme for Specially Abled Students',
        provider: 'AICTE, Ministry of Education, Govt of India',
        categoryId: 'cat-13',
        categoryName: 'Disability Scholarships',
        categorySlug: 'disability',
        eligibleState: 'All India',
        eligibleClassLevels: ['Class 12', 'PUC', 'Engineering', 'Diploma'],
        applicableBoards: ['All Boards'],
        eligibleSocialCategories: ['All'],
        maxFamilyIncome: 800000,
        minMarksPercentage: 50,
        genderEligibility: 'All',
        disabilityEligibility: true,
        benefitAmount: '₹50,000 per year towards tuition & assistive tech devices',
        openingDate: '2025-08-15',
        lastDate: '2025-12-31',
        status: 'open',
        officialApplyUrl: 'https://scholarships.gov.in/',
        officialGuidelinesUrl: 'https://www.aicte-india.org/schemes/students-development-schemes/Saksham',
        requiredDocuments: ['Disability certificate issued by competent medical board (minimum 40%)', 'AICTE college admission receipt', '10th and 12th marks cards'],
        description: 'Support scheme aimed at encouraging specially-abled students with more than 40% disability to pursue technical degrees and diplomas.',
        verificationStatus: 'verified',
        lastVerifiedDate: '2025-01-29',
        isFeatured: false,
        createdAt: now,
        updatedAt: now
      }
    ];

    const mockTests: MockTest[] = [
      {
        id: 'test-kcet-phy-1',
        title: 'KCET Physics Speed Practice Test (Mechanics & Waves)',
        examType: 'KCET',
        subject: 'Physics',
        durationMinutes: 20,
        totalMarks: 10,
        description: 'Timed practice test with previous KCET pattern questions covering Kinematics, Laws of Motion, Work Energy, and Wave Optics.',
        questions: [
          {
            id: 'q-kcet-p1',
            question: 'A ball is projected with kinetic energy E at an angle of 45° to the horizontal. At the highest point of its trajectory, its kinetic energy will be:',
            options: ['E / 2', 'E / √2', 'E', 'Zero'],
            correctAnswer: 0,
            explanation: 'At the highest point, vertical velocity is zero and horizontal velocity is v_h = v cos(45°) = v / √2. Therefore, KE = 1/2 m (v/√2)² = 1/2 (1/2 m v²) = E / 2.',
            subject: 'Physics',
            marks: 1
          },
          {
            id: 'q-kcet-p2',
            question: 'In Young’s double slit experiment, if the distance between the slits is halved and the distance between the screen and slits is doubled, the fringe width becomes:',
            options: ['Doubled', 'Halved', 'Four times', 'Remains unchanged'],
            correctAnswer: 2,
            explanation: 'Fringe width β = (λ D) / d. If d becomes d/2 and D becomes 2D, then β\' = (λ × 2D) / (d/2) = 4 × (λ D / d) = 4β.',
            subject: 'Physics',
            marks: 1
          },
          {
            id: 'q-kcet-p3',
            question: 'The electric potential V at any point (x, y, z) is given by V = 3x² volt. The electric field at (2m, 0, 1m) is:',
            options: ['-12 i V/m', '12 i V/m', '-6 i V/m', '6 i V/m'],
            correctAnswer: 0,
            explanation: 'E = - dV/dx i = - d/dx(3x²) i = -6x i. At x = 2, E = -12 i V/m.',
            subject: 'Physics',
            marks: 1
          },
          {
            id: 'q-kcet-p4',
            question: 'A transformer has 500 turns in primary and 1000 turns in secondary. If 220 V AC is applied to primary, output voltage is:',
            options: ['110 V', '440 V', '220 V', '880 V'],
            correctAnswer: 1,
            explanation: 'Vs / Vp = Ns / Np => Vs = 220 × (1000 / 500) = 440 V.',
            subject: 'Physics',
            marks: 1
          },
          {
            id: 'q-kcet-p5',
            question: 'The de-Broglie wavelength of an electron accelerated through a potential difference of 100 V is approximately:',
            options: ['1.227 Å', '0.123 Å', '12.27 Å', '0.012 Å'],
            correctAnswer: 0,
            explanation: 'λ = 12.27 / √V Å = 12.27 / √100 = 1.227 Å.',
            subject: 'Physics',
            marks: 1
          }
        ]
      },
      {
        id: 'test-neet-bio-1',
        title: 'NEET Biology High-Yield Mock (Human Physiology & Genetics)',
        examType: 'NEET',
        subject: 'Biology',
        durationMinutes: 15,
        totalMarks: 20,
        description: 'Authentic NCERT line questions for NEET medical aspirants focusing on Cardiology, Endocrine glands, Mendelian genetics and DNA replication.',
        questions: [
          {
            id: 'q-neet-b1',
            question: 'Which of the following hormones is secreted by the corpus luteum to maintain the endometrium?',
            options: ['Estrogen', 'Progesterone', 'Luteinizing Hormone (LH)', 'Human Chorionic Gonadotropin (hCG)'],
            correctAnswer: 1,
            explanation: 'Progesterone is secreted in large amounts by the corpus luteum for maintenance of the endometrium, which is necessary for implantation of the fertilized ovum.',
            subject: 'Biology',
            marks: 4
          },
          {
            id: 'q-neet-b2',
            question: 'In a dihybrid cross of peas, the phenotypic ratio obtained in the F2 generation according to Mendel’s law of independent assortment is:',
            options: ['3 : 1', '9 : 3 : 3 : 1', '1 : 2 : 1', '9 : 7'],
            correctAnswer: 1,
            explanation: 'The classic dihybrid phenotypic ratio of Round Yellow : Round Green : Wrinkled Yellow : Wrinkled Green is 9:3:3:1.',
            subject: 'Biology',
            marks: 4
          },
          {
            id: 'q-neet-b3',
            question: 'The enzyme responsible for unwinding the DNA double helix during replication is:',
            options: ['DNA Polymerase', 'DNA Helicase', 'DNA Ligase', 'RNA Primase'],
            correctAnswer: 1,
            explanation: 'DNA Helicase unwinds the DNA double helix by breaking the hydrogen bonds between complementary base pairs, creating the replication fork.',
            subject: 'Biology',
            marks: 4
          },
          {
            id: 'q-neet-b4',
            question: 'Which valve prevents the backflow of deoxygenated blood from the right ventricle into the right atrium?',
            options: ['Bicuspid valve (Mitral)', 'Tricuspid valve', 'Aortic semilunar valve', 'Pulmonary semilunar valve'],
            correctAnswer: 1,
            explanation: 'The Tricuspid valve guards the right atrioventricular aperture and prevents backflow of blood into the right atrium during ventricular systole.',
            subject: 'Biology',
            marks: 4
          },
          {
            id: 'q-neet-b5',
            question: 'The primary site of respiratory gas exchange in human lungs is:',
            options: ['Bronchi', 'Bronchioles', 'Alveoli', 'Trachea'],
            correctAnswer: 2,
            explanation: 'Alveoli are thin-walled, highly vascularized sac-like structures where O2 and CO2 diffuse across the alveolar-capillary membrane.',
            subject: 'Biology',
            marks: 4
          }
        ]
      },
      {
        id: 'test-sslc-math-1',
        title: 'Karnataka SSLC Mathematics Quick Practice (Quadratic & Trigonometry)',
        examType: 'SSLC',
        subject: 'Mathematics',
        durationMinutes: 15,
        totalMarks: 5,
        description: 'Targeted SSLC 1-mark & 2-mark questions following the KSEAB blueprint.',
        questions: [
          {
            id: 'q-sslc-m1',
            question: 'The roots of the quadratic equation x² - 5x + 6 = 0 are:',
            options: ['2 and 3', '-2 and -3', '1 and 6', '-1 and -6'],
            correctAnswer: 0,
            explanation: 'Factorizing: (x - 2)(x - 3) = 0 => x = 2 or x = 3.',
            subject: 'Mathematics',
            marks: 1
          },
          {
            id: 'q-sslc-m2',
            question: 'If sin θ = 3/5, then the value of cos θ is (for acute angle θ):',
            options: ['4/5', '5/4', '3/4', '5/3'],
            correctAnswer: 0,
            explanation: 'cos θ = √(1 - sin² θ) = √(1 - 9/25) = √(16/25) = 4/5.',
            subject: 'Mathematics',
            marks: 1
          },
          {
            id: 'q-sslc-m3',
            question: 'The nth term of an Arithmetic Progression is given by an = 3n + 2. The common difference (d) is:',
            options: ['2', '3', '5', '1'],
            correctAnswer: 1,
            explanation: 'a1 = 3(1) + 2 = 5; a2 = 3(2) + 2 = 8. Common difference d = a2 - a1 = 8 - 5 = 3.',
            subject: 'Mathematics',
            marks: 1
          },
          {
            id: 'q-sslc-m4',
            question: 'The distance between points (0, 0) and (3, 4) is:',
            options: ['7 units', '5 units', '1 unit', '25 units'],
            correctAnswer: 1,
            explanation: 'd = √(3² + 4²) = √(9 + 16) = √25 = 5 units.',
            subject: 'Mathematics',
            marks: 1
          },
          {
            id: 'q-sslc-m5',
            question: 'The perimeter of a circle with radius 7 cm (using π = 22/7) is:',
            options: ['22 cm', '44 cm', '88 cm', '154 cm'],
            correctAnswer: 1,
            explanation: 'Perimeter = 2 π r = 2 × (22/7) × 7 = 44 cm.',
            subject: 'Mathematics',
            marks: 1
          }
        ]
      }
    ];

    const announcements: Announcement[] = [
      {
        id: 'ann-1',
        title: 'Karnataka SSLC 2025-26 Annual Exam Timetable Released by KSEAB',
        content: 'Official exam schedule announced by Karnataka School Examination Board. Examination commences in March 2025. Download official blueprint and model question papers on Orbit X.',
        type: 'exam_alert',
        link: '/karnataka/sslc',
        isPinned: true,
        createdAt: now
      },
      {
        id: 'ann-2',
        title: 'KEA KCET 2025 Online Application & Document Verification Portal Open',
        content: 'Karnataka Examinations Authority (KEA) has activated the online application registration. Check required caste, income, and rural study certificates before submission.',
        type: 'exam_alert',
        link: '/kcet',
        isPinned: true,
        createdAt: now
      },
      {
        id: 'ann-3',
        title: 'SSP Karnataka Post-Matric Scholarship 2025-26 Last Date Reminder',
        content: 'Students enrolled in 1st/2nd PUC, ITI, Diploma, and Degree programs must complete Aadhaar seeding and apply before the notified deadline on SSP portal.',
        type: 'scholarship_deadline',
        link: '/scholarships/karnataka',
        isPinned: true,
        createdAt: now
      },
      {
        id: 'ann-4',
        title: 'New CBSE Class 10 & 12 Solved Sample Papers Added to Library',
        content: 'Official CBSE Academic 2024-25 sample papers with step-by-step marking schemes for Physics, Chemistry, and Mathematics have been added to our question paper repository.',
        type: 'new_paper',
        link: '/cbse/class-10',
        isPinned: false,
        createdAt: now
      }
    ];

    return {
      users,
      resources,
      scholarships,
      categories,
      savedResources: [
        { userId: 'usr-student-demo', resourceId: 'res-sslc-maths-2024', savedAt: now },
        { userId: 'usr-student-demo', resourceId: 'res-puc-phy-2024', savedAt: now }
      ],
      savedScholarships: [
        { userId: 'usr-student-demo', scholarshipId: 'sch-vidyasiri-2025', savedAt: now },
        { userId: 'usr-student-demo', scholarshipId: 'sch-hdfc-parivartan-2025', savedAt: now }
      ],
      preferences: {
        'usr-student-demo': {
          userId: 'usr-student-demo',
          currentClass: '2nd PUC',
          board: 'Karnataka State Board',
          stream: 'Science',
          state: 'Karnataka',
          socialCategory: 'OBC',
          annualIncomeRange: 'Under ₹2,50,000',
          marksPercentage: 88,
          gender: 'Female',
          hasDisability: false,
          intendedCourse: 'Engineering (KCET)',
          updatedAt: now
        }
      },
      mockTests,
      testAttempts: [
        {
          id: 'att-1',
          userId: 'usr-student-demo',
          userEmail: 'student.demo@orbitx.edu',
          testId: 'test-kcet-phy-1',
          testTitle: 'KCET Physics Speed Practice Test (Mechanics & Waves)',
          score: 8,
          totalMarks: 10,
          correctCount: 4,
          totalQuestions: 5,
          timeSpentSeconds: 420,
          completedAt: now
        }
      ],
      announcements,
      brokenLinkReports: [],
      auditLogs: [
        {
          id: 'log-init-1',
          userId: 'usr-superadmin',
          userEmail: 'basavarajr779@gmail.com',
          action: 'SYSTEM_BOOTSTRAP',
          entityType: 'System',
          entityId: 'orbit-x-core',
          details: 'Initialized Orbit X academic database with verified Karnataka Board, CBSE, KCET, NEET resources and scholarships.',
          timestamp: now
        }
      ],
      chatSessions: [],
      colleges: this.getDefaultColleges(),
      entranceExams: this.getDefaultEntranceExams(),
      settings: {
        siteTitle: 'Orbit X – Integrated Academic Resource & Scholarship Platform',
        gdriveConnected: true,
        gdriveFolderMappings: {
          'Karnataka SSLC': '1SSLC_Folder_OrbitX_Secure',
          'Karnataka 2nd PUC': '1PUC2_Folder_OrbitX_Secure',
          'CBSE Class 10': '1CBSE10_Folder_OrbitX_Secure',
          'CBSE Class 12': '1CBSE12_Folder_OrbitX_Secure',
          'KCET Prep': '1KCET_Folder_OrbitX_Secure',
          'NEET Prep': '1NEET_Folder_OrbitX_Secure',
          'Study Notes': '1Notes_Folder_OrbitX_Secure'
        },
        lastDriveTest: now,
        maintenanceMode: false,
        contactEmail: 'support@orbitx.edu'
      }
    };
  }

  public getDefaultColleges(): CollegeInfo[] {
    const today = new Date().toISOString().split('T')[0];
    return [
      {
        id: 'col-uvce',
        name: 'University Visvesvaraya College of Engineering (UVCE)',
        location: 'KR Circle, Bengaluru',
        district: 'Bengaluru Urban',
        type: 'Government',
        courses: ['B.Tech Computer Science', 'B.Tech AI & Machine Learning', 'B.Tech Electronics & Comm', 'B.Tech Mechanical', 'B.Tech Civil', 'B.Arch'],
        entranceExams: ['KCET', 'NATA'],
        approxFeesAnnual: '₹45,000 - ₹55,000 (Govt Fee Structure)',
        website: 'https://uvce.ac.in',
        admissionsUrl: 'https://cetonline.karnataka.gov.in/kea/',
        hostelAvailable: true,
        nirfOrAccreditation: 'State University of Eminence / AICTE Approved',
        verifiedDate: today,
        category: 'target'
      },
      {
        id: 'col-rvce',
        name: 'R.V. College of Engineering (RVCE)',
        location: 'Mysuru Road, Bengaluru',
        district: 'Bengaluru Urban',
        type: 'Autonomous',
        courses: ['B.E Computer Science', 'B.E AI & Data Science', 'B.E Electronics & Communication', 'B.E Biotechnology', 'B.E Aerospace Engineering'],
        entranceExams: ['KCET', 'COMEDK UGET'],
        approxFeesAnnual: '₹1,05,000 (Govt Quota via KCET) / ₹2,60,000 (COMEDK)',
        website: 'https://rvce.edu.in',
        admissionsUrl: 'https://rvce.edu.in/admissions',
        hostelAvailable: true,
        nirfOrAccreditation: 'NIRF Top 100 Engineering / NAAC A+ Grade',
        verifiedDate: today,
        category: 'ambitious'
      },
      {
        id: 'col-bmsce',
        name: 'B.M.S. College of Engineering (BMSCE)',
        location: 'Bull Temple Road, Basavanagudi, Bengaluru',
        district: 'Bengaluru Urban',
        type: 'Autonomous',
        courses: ['B.E Computer Science & Engg', 'B.E Electronics', 'B.E Mechanical', 'B.E Civil', 'B.E Medical Electronics'],
        entranceExams: ['KCET', 'COMEDK UGET'],
        approxFeesAnnual: '₹1,05,000 (KCET Quota) / ₹2,60,000 (COMEDK)',
        website: 'https://bmsce.ac.in',
        admissionsUrl: 'https://bmsce.ac.in/admission',
        hostelAvailable: true,
        nirfOrAccreditation: 'NIRF Ranked / NAAC A++ Grade',
        verifiedDate: today,
        category: 'ambitious'
      },
      {
        id: 'col-msrit',
        name: 'M.S. Ramaiah Institute of Technology (MSRIT)',
        location: 'MSR Nagar, Mathikere, Bengaluru',
        district: 'Bengaluru Urban',
        type: 'Autonomous',
        courses: ['B.Tech CSE', 'B.Tech AI & Data Science', 'B.Tech ECE', 'B.Tech Biotechnology', 'B.Arch'],
        entranceExams: ['KCET', 'COMEDK UGET', 'NATA'],
        approxFeesAnnual: '₹1,05,000 (KCET Quota) / ₹2,60,000 (COMEDK)',
        website: 'https://msrit.edu',
        admissionsUrl: 'https://msrit.edu/admissions.html',
        hostelAvailable: true,
        nirfOrAccreditation: 'NIRF Engineering Rank 78 / NBA Accredited',
        verifiedDate: today,
        category: 'ambitious'
      },
      {
        id: 'col-pes',
        name: 'PES University (Ring Road & Electronic City Campuses)',
        location: 'BSK 3rd Stage & Electronic City, Bengaluru',
        district: 'Bengaluru Urban',
        type: 'Private',
        courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mechanical', 'BBA', 'B.Com (Hons)', 'B.Pharm', 'B.Des'],
        entranceExams: ['PESSAT', 'KCET', 'JEE Main'],
        approxFeesAnnual: '₹1,05,000 (KCET Quota) / ₹4,20,000 (PESSAT Quota)',
        website: 'https://pes.edu',
        admissionsUrl: 'https://pes.edu/admissions/',
        hostelAvailable: true,
        nirfOrAccreditation: 'Top Ranked Private University / NAAC Accredited',
        verifiedDate: today,
        category: 'target'
      },
      {
        id: 'col-bmcri',
        name: 'Bangalore Medical College and Research Institute (BMCRI)',
        location: 'Fort, K.R. Market, Bengaluru',
        district: 'Bengaluru Urban',
        type: 'Government',
        courses: ['MBBS', 'B.Sc Nursing', 'B.Sc Allied Health Sciences', 'MD / MS'],
        entranceExams: ['NEET-UG'],
        approxFeesAnnual: '₹65,000 / year (Govt Medical College Tuition)',
        website: 'https://bmcribangalore.edu.in',
        admissionsUrl: 'https://cetonline.karnataka.gov.in/kea/',
        hostelAvailable: true,
        nirfOrAccreditation: 'NMC Approved / Premier Karnataka Govt Medical College',
        verifiedDate: today,
        category: 'ambitious'
      },
      {
        id: 'col-mmcri',
        name: 'Mysore Medical College and Research Institute (MMCRI)',
        location: 'Irwin Road, Mysuru',
        district: 'Mysuru',
        type: 'Government',
        courses: ['MBBS', 'B.Sc Allied Health', 'MD / MS'],
        entranceExams: ['NEET-UG'],
        approxFeesAnnual: '₹65,000 / year (Govt Medical Tuition)',
        website: 'https://mysoremedicalcollege.com',
        admissionsUrl: 'https://cetonline.karnataka.gov.in/kea/',
        hostelAvailable: true,
        nirfOrAccreditation: 'NMC Approved / Historic Govt Institution',
        verifiedDate: today,
        category: 'ambitious'
      },
      {
        id: 'col-nlsiu',
        name: 'National Law School of India University (NLSIU)',
        location: 'Gnana Bharathi, Nagarbhavi, Bengaluru',
        district: 'Bengaluru Urban',
        type: 'Autonomous',
        courses: ['B.A. LL.B. (Hons) 5-Year Integrated', 'LL.M.', 'Master of Public Policy (MPP)'],
        entranceExams: ['CLAT (UG)', 'CLAT (PG)'],
        approxFeesAnnual: '₹3,50,000 / year (Includes Tuition, Mess & Residence)',
        website: 'https://nls.ac.in',
        admissionsUrl: 'https://consortiumofnlus.ac.in/',
        hostelAvailable: true,
        nirfOrAccreditation: 'NIRF #1 Law University in India',
        verifiedDate: today,
        category: 'ambitious'
      },
      {
        id: 'col-christ',
        name: 'Christ (Deemed to be University)',
        location: 'Hosur Road, Bengaluru',
        district: 'Bengaluru Urban',
        type: 'Private',
        courses: ['B.Com (Finance & Accountancy / Strategic Finance)', 'BBA', 'B.Sc Psychology', 'B.A. Journalism', 'B.Tech'],
        entranceExams: ['Christ University Entrance Test (CUET) / Merit Interview'],
        approxFeesAnnual: '₹1,50,000 - ₹2,75,000 / year',
        website: 'https://christuniversity.in',
        admissionsUrl: 'https://christuniversity.in/admissions',
        hostelAvailable: true,
        nirfOrAccreditation: 'NAAC A+ Accredited',
        verifiedDate: today,
        category: 'target'
      },
      {
        id: 'col-stjosephs',
        name: 'St. Joseph\'s University',
        location: 'Langford Road, Shanthala Nagar, Bengaluru',
        district: 'Bengaluru Urban',
        type: 'Aided',
        courses: ['B.Com (Regular & Professional)', 'BBA', 'B.Sc Physics/Maths/CS', 'B.A. Political Science/History'],
        entranceExams: ['12th / 2nd PUC Board Marks + Subject Aptitude Test'],
        approxFeesAnnual: '₹75,000 - ₹1,30,000 / year',
        website: 'https://sju.edu.in',
        admissionsUrl: 'https://sju.edu.in/admissions',
        hostelAvailable: true,
        nirfOrAccreditation: 'Historic Jesuit State University / NAAC A++',
        verifiedDate: today,
        category: 'safe'
      },
      {
        id: 'col-uas-gkvk',
        name: 'University of Agricultural Sciences (UAS), GKVK',
        location: 'Bellary Road, Yelahanka, Bengaluru',
        district: 'Bengaluru Urban',
        type: 'Government',
        courses: ['B.Sc (Hons) Agriculture', 'B.Sc (Hons) Horticulture', 'B.Tech Agricultural Engineering', 'B.Sc (Hons) Sericulture'],
        entranceExams: ['KCET (Practical Test for Agriculturist Quota + PCB CET Marks)'],
        approxFeesAnnual: '₹35,000 - ₹45,000 / year (Govt Agricultural Rate)',
        website: 'https://uasbangalore.edu.in',
        admissionsUrl: 'https://cetonline.karnataka.gov.in/kea/',
        hostelAvailable: true,
        nirfOrAccreditation: 'ICAR Accredited State Agricultural University',
        verifiedDate: today,
        category: 'target'
      },
      {
        id: 'col-sksjti',
        name: 'Government SKSJTI Polytechnic & Engineering College',
        location: 'K.R. Circle, Bengaluru',
        district: 'Bengaluru Urban',
        type: 'Government',
        courses: ['Diploma in Computer Science', 'Diploma in Textile Technology', 'Diploma in Mechanical', 'B.Tech Textile'],
        entranceExams: ['Karnataka SSLC Marks (Diploma) / DCET (Lateral Entry) / KCET'],
        approxFeesAnnual: '₹5,000 - ₹12,000 / year (Government Poly Subsidized Rate)',
        website: 'https://dtek.karnataka.gov.in',
        admissionsUrl: 'https://dtek.karnataka.gov.in',
        hostelAvailable: true,
        nirfOrAccreditation: 'DTE Karnataka & AICTE Recognized',
        verifiedDate: today,
        category: 'safe'
      }
    ];
  }

  public getDefaultEntranceExams(): EntranceExamInfo[] {
    return [
      {
        id: 'exam-kcet',
        name: 'KCET',
        fullName: 'Karnataka Common Entrance Test',
        authority: 'Karnataka Examinations Authority (KEA)',
        officialUrl: 'https://cetonline.karnataka.gov.in/kea/',
        courses: ['B.E / B.Tech (Engineering)', 'B.Sc (Hons) Agriculture', 'B.Sc Forestry / Sericulture', 'B.Pharm', 'Pharm D', 'B.Sc Veterinary', 'Naturopathy & Yogic Sciences (BNYS)'],
        eligibility: 'Passed 2nd PUC / 12th Standard with Physics, Mathematics, and Chemistry/Bio/Tech subject with min 45% (40% for SC/ST/OBC). Must satisfy Karnataka 7-year study domicile eligibility (Clauses A to O).',
        subjectsRequired: ['Physics (60 Marks)', 'Chemistry (60 Marks)', 'Mathematics (60 Marks)', 'Biology (60 Marks - Agri/Veterinary)'],
        frequency: 'Once a year (Usually conducted in April / May)',
        examPattern: 'Pen-and-paper OMR. 60 MCQs per paper (80 minutes each). 1 mark per question, No negative marking.',
        status: 'announced',
        importantDates: 'Registration: Jan - Feb | Exam: April | Results: May/June | Verification & Option Entry: June - July',
        preparationStrategy: 'Thoroughly master NCERT / Karnataka 1st & 2nd PUC state textbooks. ~70% questions are direct conceptual or formula applications. Practice previous 10 years KEA papers with strict 80-minute timing.'
      },
      {
        id: 'exam-comedk',
        name: 'COMEDK UGET',
        fullName: 'Consortium of Medical, Engineering and Dental Colleges of Karnataka',
        authority: 'COMEDK',
        officialUrl: 'https://www.comedk.org/',
        courses: ['B.E / B.Tech in ~190 Private Engineering Member Colleges in Karnataka (RVCE, BMSCE, MSRIT, BIT, NIE Mysuru, etc.)'],
        eligibility: 'Open to All-India candidates. 10+2 / 2nd PUC passed with Physics, Chemistry, Mathematics and English with min 45% aggregate in PCM (40% for Karnataka SC/ST/OBC).',
        subjectsRequired: ['Physics (60 MCQs)', 'Chemistry (60 MCQs)', 'Mathematics (60 MCQs)'],
        frequency: 'Once a year (Usually held in May)',
        examPattern: 'Computer Based Test (CBT). 180 total MCQs in 3 hours. 1 mark per question, No negative marking.',
        status: 'announced',
        importantDates: 'Applications: Feb - April | Exam: May | Scorecards: May/June | Online Centralized Counselling: June - July',
        preparationStrategy: 'Speed and accuracy test. Since there is no negative marking, answer all 180 questions. Focus on speed formulas in Maths and organic reactions in Chemistry.'
      },
      {
        id: 'exam-neet',
        name: 'NEET-UG',
        fullName: 'National Eligibility cum Entrance Test (Undergraduate)',
        authority: 'National Testing Agency (NTA)',
        officialUrl: 'https://neet.nta.nic.in/',
        courses: ['MBBS', 'BDS', 'BAMS', 'BHMS', 'BUMS', 'B.Sc Nursing', 'BVSc & AH (Veterinary)'],
        eligibility: 'Minimum 17 years of age. Passed 10+2 / 2nd PUC with Physics, Chemistry, Biology/Biotechnology, and English with min 50% aggregate in PCB (40% for SC/ST/OBC, 45% for PwD).',
        subjectsRequired: ['Physics (45 Questions / 180 Marks)', 'Chemistry (45 Questions / 180 Marks)', 'Biology - Botany & Zoology (90 Questions / 360 Marks)'],
        frequency: 'Once a year (First Sunday of May)',
        examPattern: 'Pen-and-paper OMR. 180 questions to be answered out of 200. Total 720 Marks. +4 for correct, -1 for incorrect.',
        status: 'announced',
        importantDates: 'Notification & Registration: Feb - March | Exam: 1st Sunday of May | Answer Key: May | Result: June',
        preparationStrategy: '100% line-by-line mastery of NCERT Biology (Class 11 & 12). For Chemistry, solve all in-text NCERT examples and reaction mechanisms. For Physics, practice numerical problem-solving with dimensional checks.'
      },
      {
        id: 'exam-jee-main',
        name: 'JEE Main',
        fullName: 'Joint Entrance Examination (Main)',
        authority: 'National Testing Agency (NTA)',
        officialUrl: 'https://jeemain.nta.nic.in/',
        courses: ['B.E / B.Tech in NITs (e.g. NITK Surathkal), IIITs, CFTIs; Qualifying exam for JEE Advanced (IITs)'],
        eligibility: 'Passed Class 12 / 2nd PUC with Physics and Mathematics along with Chemistry/Bio/Tech. 75% aggregate marks in 12th board or top 20 percentile for NIT/IIT admissions.',
        subjectsRequired: ['Mathematics (25 Questions / 100 Marks)', 'Physics (25 Questions / 100 Marks)', 'Chemistry (25 Questions / 100 Marks)'],
        frequency: 'Twice a year (Session 1: Jan/Feb, Session 2: April)',
        examPattern: 'Computer Based Test (CBT). Total 300 marks. 20 MCQs + 5 Numerical Value Questions per subject. +4 correct, -1 incorrect.',
        status: 'announced',
        importantDates: 'Session 1: Jan | Session 2: April | JEE Advanced: May',
        preparationStrategy: 'Focus on in-depth analytical problem solving. Solve standard previous 5 years (both shifts) official NTA question papers.'
      },
      {
        id: 'exam-clat',
        name: 'CLAT',
        fullName: 'Common Law Admission Test',
        authority: 'Consortium of National Law Universities',
        officialUrl: 'https://consortiumofnlus.ac.in/',
        courses: ['5-Year Integrated B.A. LL.B (Hons), BBA LL.B at 26 National Law Universities including NLSIU Bengaluru'],
        eligibility: 'Passed Class 10+2 / 2nd PUC with minimum 45% marks (40% for SC/ST). No upper age limit.',
        subjectsRequired: ['English Language', 'Current Affairs including General Knowledge', 'Legal Reasoning', 'Logical Reasoning', 'Quantitative Techniques (Maths)'],
        frequency: 'Once a year (Usually conducted in December for next academic year)',
        examPattern: 'Comprehension-based reading test. 120 questions in 2 hours. +1 for correct, -0.25 for incorrect.',
        status: 'announced',
        importantDates: 'Applications: July - Nov | Exam: December | Counselling: Jan - May',
        preparationStrategy: 'Read national daily newspapers (The Hindu / Indian Express) daily. Develop rapid reading speed (300+ words/min). Practice reading passages and evaluating logical arguments.'
      },
      {
        id: 'exam-nata',
        name: 'NATA',
        fullName: 'National Aptitude Test in Architecture',
        authority: 'Council of Architecture (CoA)',
        officialUrl: 'https://www.nata.in/',
        courses: ['5-Year Bachelor of Architecture (B.Arch) in all recognized colleges across Karnataka and India'],
        eligibility: 'Passed 10+2 / 2nd PUC with Physics and Mathematics as compulsory subjects, or 10+3 Diploma with Mathematics, with at least 50% marks in aggregate.',
        subjectsRequired: ['Diagrammatic Reasoning', 'Numerical Reasoning', 'Verbal Reasoning', 'Inductive Reasoning', 'Situational Judgment', 'Visual Perception & Architecture Drawing'],
        frequency: 'Multiple attempts available on weekends between April and July',
        examPattern: 'Computer-based aptitude + Drawing test. Total 200 marks. Best score out of allowed attempts is considered for admission.',
        status: 'announced',
        importantDates: 'Registrations: March onwards | Tests: April to July | KEA B.Arch Counselling: July/August',
        preparationStrategy: 'Practice freehand sketching, 2D and 3D geometric perspective drawing, shadow rendering, architectural history, and spatial visualization.'
      },
      {
        id: 'exam-cuet',
        name: 'CUET-UG',
        fullName: 'Common University Entrance Test (Undergraduate)',
        authority: 'National Testing Agency (NTA)',
        officialUrl: 'https://cuetug.ntaonline.in/',
        courses: ['B.A, B.Sc, B.Com, BBA, Integrated M.Sc at Central Universities (DU, BHU, JNU, Central University of Karnataka Kalaburagi)'],
        eligibility: 'Passed or appearing in Class 12 / 2nd PUC. Subject-wise eligibility criteria vary by target university.',
        subjectsRequired: ['Section 1: Languages (e.g. English, Kannada)', 'Section 2: Domain Subjects (up to 6 domains)', 'Section 3: General Test'],
        frequency: 'Once a year (May / June)',
        examPattern: 'Computer Based Test (CBT). Multiple choice questions mapped directly to Class 12 NCERT syllabus.',
        status: 'announced',
        importantDates: 'Applications: Feb - March | Exam: May - June | Results: July',
        preparationStrategy: 'Master the Class 12 NCERT textbook for each chosen domain subject. Practice mock tests on the NTA National Test Abhyas app.'
      },
      {
        id: 'exam-ca-foundation',
        name: 'CA Foundation',
        fullName: 'Chartered Accountancy Foundation Examination',
        authority: 'Institute of Chartered Accountants of India (ICAI)',
        officialUrl: 'https://www.icai.org/',
        courses: ['Entry route to Chartered Accountancy (Intermediate & Final)'],
        eligibility: 'Registered with ICAI after passing Class 10. Can appear after appearing in 2nd PUC / Class 12 board examination.',
        subjectsRequired: ['Paper 1: Accounting (100 Marks)', 'Paper 2: Business Laws (100 Marks)', 'Paper 3: Quantitative Aptitude (100 Marks)', 'Paper 4: Business Economics (100 Marks)'],
        frequency: 'Thrice a year (January, May/June, September)',
        examPattern: 'Papers 1 & 2 are subjective (descriptive); Papers 3 & 4 are objective (MCQ with negative marking -0.25). Need 40% in each paper and 50% aggregate.',
        status: 'announced',
        importantDates: 'Exam sessions: January, June, September. Registration must be completed 4 months prior to examination month.',
        preparationStrategy: 'Solve ICAI Study Material Illustrations, Practice Questions, RTPs (Revision Test Papers), and MTPs (Mock Test Papers). Focus heavily on legal drafting for Business Laws.'
      }
    ];
  }
}

export const db = new DatabaseManager();
