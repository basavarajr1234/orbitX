export type UserRole = 'super_admin' | 'admin' | 'content_manager' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
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
  eligibleState: string;
  eligibleClassLevels: string[];
  applicableBoards: string[];
  eligibleSocialCategories: string[];
  maxFamilyIncome?: number;
  minMarksPercentage?: number;
  genderEligibility: 'All' | 'Female' | 'Transgender';
  disabilityEligibility: boolean;
  benefitAmount: string;
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
  correctAnswer?: number;
  explanation?: string;
  subject: string;
  marks: number;
  selectedAnswer?: number;
  isCorrect?: boolean;
}

export interface MockTest {
  id: string;
  title: string;
  examType: 'KCET' | 'NEET' | 'SSLC' | '2nd PUC' | 'CBSE 10' | 'CBSE 12';
  subject: string;
  durationMinutes: number;
  totalMarks: number;
  description: string;
  questionCount?: number;
  questions?: MockQuestion[];
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

export interface AdminStats {
  totalPapers: number;
  publishedPapers: number;
  draftPapers: number;
  totalScholarships: number;
  openScholarships: number;
  nearDeadlineScholarships: number;
  registeredStudents: number;
  brokenLinksReported: number;
  boardBreakdown: {
    Karnataka: number;
    CBSE: number;
  };
  recentPapers: Resource[];
  recentScholarships: Scholarship[];
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
