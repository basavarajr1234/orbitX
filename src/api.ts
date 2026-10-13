import {
  User,
  Resource,
  Scholarship,
  ScholarshipCategory,
  StudentPreference,
  MockTest,
  TestAttempt,
  Announcement,
  BrokenLinkReport,
  AuditLog,
  AdminStats,
  ChatSession,
  ChatMessage,
  AIChatMode,
  CollegeInfo,
  EntranceExamInfo,
  ChatCitation,
  OrbitXResourceLink
} from './types';

// Helper to get auth headers from localStorage session token
export function getAuthHeaders(): HeadersInit {
  const storedUser = localStorage.getItem('orbitx_user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.id}`,
        'x-user-id': user.id,
        'x-user-email': user.email
      };
    } catch (e) {
      // fallback
    }
  }
  return {
    'Content-Type': 'application/json'
  };
}

// Auth API
export const api = {
  async getMe(): Promise<{ user: User | null }> {
    const res = await fetch('/api/auth/me', { headers: getAuthHeaders() });
    return res.json();
  },

  async loginWithGoogle(payload: { credential?: string; email?: string; name?: string; picture?: string; googleId?: string }): Promise<{ success: boolean; user: User; message: string }> {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to sign in with Google');
    }
    return res.json();
  },

  async demoLogin(role: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    return res.json();
  },

  async logout(): Promise<void> {
    await fetch('/api/auth/logout', { method: 'POST', headers: getAuthHeaders() });
  },

  // Resources
  async getResources(params?: Record<string, string>): Promise<{ resources: Resource[]; total: number; page: number; totalPages: number }> {
    const query = new URLSearchParams(params || {}).toString();
    const res = await fetch(`/api/resources?${query}`);
    return res.json();
  },

  async getResourceById(id: string): Promise<Resource> {
    const res = await fetch(`/api/resources/${id}`);
    if (!res.ok) throw new Error('Resource not found');
    return res.json();
  },

  async recordDownload(id: string): Promise<{ success: boolean; downloadCount: number }> {
    const res = await fetch(`/api/resources/${id}/download`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async getPucModelPapers(): Promise<{
    board: string;
    classLevel: string;
    category: string;
    folderUrl: string;
    subjects: Record<string, { available: boolean; paper?: Resource; message?: string }>;
  }> {
    const res = await fetch('/api/puc/model-papers');
    return res.json();
  },

  async syncPucDrivePapers(): Promise<any> {
    const res = await fetch('/api/puc/import-drive', {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async createResource(data: Partial<Resource>): Promise<Resource> {
    const res = await fetch('/api/resources', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create resource');
    }
    return res.json();
  },

  async updateResource(id: string, data: Partial<Resource>): Promise<Resource> {
    const res = await fetch(`/api/resources/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update resource');
    }
    return res.json();
  },

  async deleteResource(id: string): Promise<void> {
    const res = await fetch(`/api/resources/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete resource');
    }
  },

  // Scholarships
  async getScholarships(params?: Record<string, string>): Promise<{ scholarships: Scholarship[]; total: number }> {
    const query = new URLSearchParams(params || {}).toString();
    const res = await fetch(`/api/scholarships?${query}`);
    return res.json();
  },

  async getScholarshipById(id: string): Promise<Scholarship> {
    const res = await fetch(`/api/scholarships/${id}`);
    if (!res.ok) throw new Error('Scholarship not found');
    return res.json();
  },

  async createScholarship(data: Partial<Scholarship>): Promise<Scholarship> {
    const res = await fetch('/api/scholarships', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create scholarship');
    }
    return res.json();
  },

  async updateScholarship(id: string, data: Partial<Scholarship>): Promise<Scholarship> {
    const res = await fetch(`/api/scholarships/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update scholarship');
    }
    return res.json();
  },

  async deleteScholarship(id: string): Promise<void> {
    const res = await fetch(`/api/scholarships/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete scholarship');
    }
  },

  async matchScholarships(criteria: any): Promise<{ totalMatched: number; matches: Array<{ scholarship: Scholarship; matchScore: number; isEligible: boolean; reasons: string[]; missingConditions: string[]; needsVerification: boolean }> }> {
    const res = await fetch('/api/scholarships/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(criteria)
    });
    return res.json();
  },

  // Categories
  async getCategories(): Promise<ScholarshipCategory[]> {
    const res = await fetch('/api/categories');
    return res.json();
  },

  async createCategory(cat: { name: string; slug: string; description: string }): Promise<ScholarshipCategory> {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cat)
    });
    return res.json();
  },

  // Student saved items
  async getSavedPapers(): Promise<Resource[]> {
    const res = await fetch('/api/student/saved-papers', { headers: getAuthHeaders() });
    return res.json();
  },

  async savePaper(resourceId: string): Promise<void> {
    await fetch('/api/student/saved-papers', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ resourceId })
    });
  },

  async removeSavedPaper(resourceId: string): Promise<void> {
    await fetch(`/api/student/saved-papers/${resourceId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  async getSavedScholarships(): Promise<Scholarship[]> {
    const res = await fetch('/api/student/saved-scholarships', { headers: getAuthHeaders() });
    return res.json();
  },

  async saveScholarship(scholarshipId: string): Promise<void> {
    await fetch('/api/student/saved-scholarships', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ scholarshipId })
    });
  },

  async removeSavedScholarship(scholarshipId: string): Promise<void> {
    await fetch(`/api/student/saved-scholarships/${scholarshipId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  async getStudentProfile(): Promise<{ user: User; preferences: StudentPreference }> {
    const res = await fetch('/api/student/profile', { headers: getAuthHeaders() });
    return res.json();
  },

  async updateStudentProfile(data: { name?: string; preferences?: Partial<StudentPreference> }): Promise<{ success: boolean; user: User; preferences: StudentPreference }> {
    const res = await fetch('/api/student/profile', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Mock Tests
  async getMockTests(): Promise<MockTest[]> {
    const res = await fetch('/api/mock-tests');
    return res.json();
  },

  async getMockTest(id: string): Promise<MockTest> {
    const res = await fetch(`/api/mock-tests/${id}`);
    return res.json();
  },

  async submitMockTest(id: string, payload: { answers: Record<string, number>; timeSpentSeconds: number }): Promise<any> {
    const res = await fetch(`/api/mock-tests/${id}/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async getTestHistory(): Promise<TestAttempt[]> {
    const res = await fetch('/api/mock-tests/history', { headers: getAuthHeaders() });
    return res.json();
  },

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    const res = await fetch('/api/announcements');
    return res.json();
  },

  async createAnnouncement(data: Partial<Announcement>): Promise<Announcement> {
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteAnnouncement(id: string): Promise<void> {
    await fetch(`/api/announcements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  // Broken link reports
  async reportBrokenLink(data: { resourceId: string; resourceTitle: string; reason: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/reports/broken-link', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getBrokenLinkReports(): Promise<BrokenLinkReport[]> {
    const res = await fetch('/api/reports/broken-links', { headers: getAuthHeaders() });
    return res.json();
  },

  async updateBrokenLinkReport(id: string, status: string, notes?: string): Promise<BrokenLinkReport> {
    const res = await fetch(`/api/reports/broken-links/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes })
    });
    return res.json();
  },

  // Admin Stats & Management
  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch('/api/admin/stats', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async getAdminUsers(): Promise<User[]> {
    const res = await fetch('/api/admin/users', { headers: getAuthHeaders() });
    return res.json();
  },

  async updateUserRole(userId: string, role: string): Promise<User> {
    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role })
    });
    return res.json();
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch('/api/admin/audit-logs', { headers: getAuthHeaders() });
    return res.json();
  },

  async getDriveSettings(): Promise<any> {
    const res = await fetch('/api/admin/gdrive-settings', { headers: getAuthHeaders() });
    return res.json();
  },

  async testDriveConnection(): Promise<any> {
    const res = await fetch('/api/admin/gdrive-test', {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async importCsv(csvData: string, type: 'papers' | 'scholarships'): Promise<any> {
    const res = await fetch('/api/admin/csv-import', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ csvData, type })
    });
    return res.json();
  },

  // Direct File Upload
  async uploadFile(file: File): Promise<{ success: boolean; fileUrl: string; fileSize: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const headers: Record<string, string> = {};
    const storedUser = localStorage.getItem('orbitx_user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        headers['Authorization'] = `Bearer ${u.id}`;
        headers['x-user-id'] = u.id;
      } catch (e) {}
    }

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers,
      body: formData
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }
    return res.json();
  },

  // Gemini AI Assistant (Legacy fallback)
  async askAIAssistant(prompt: string, topic?: string, context?: string): Promise<{ answer: string; source: string }> {
    const res = await fetch('/api/ai/study-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, topic, context })
    });
    return res.json();
  },

  // Orbit X AI Study Assistant & Real-time Knowledge Chat
  async sendChatMessage(payload: {
    prompt: string;
    sessionId?: string;
    mode?: AIChatMode;
    language?: 'en' | 'kn';
    history?: Array<{ role: 'user' | 'model'; text: string }>;
    paperContext?: { subject: string; resourceId?: string; originalFilename?: string };
    studentProfile?: Record<string, any>;
  }): Promise<{
    answer: string;
    source: string;
    citations?: ChatCitation[];
    orbitxLinks?: OrbitXResourceLink[];
    suggestedFollowUps?: string[];
    lastCheckedDate?: string;
    searchQueriesUsed?: string[];
    sessionId: string;
  }> {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to send message to AI Study Assistant');
    }
    return res.json();
  },

  async getChatSessions(): Promise<ChatSession[]> {
    const res = await fetch('/api/ai/sessions', {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.sessions || [];
  },

  async createChatSession(title?: string, mode?: AIChatMode, language?: 'en' | 'kn'): Promise<ChatSession> {
    const res = await fetch('/api/ai/sessions', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title, mode, language })
    });
    const data = await res.json();
    return data.session;
  },

  async getChatSession(id: string): Promise<ChatSession> {
    const res = await fetch(`/api/ai/sessions/${id}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.session;
  },

  async clearChatSession(id: string): Promise<ChatSession> {
    const res = await fetch(`/api/ai/sessions/${id}/clear`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.session;
  },

  async deleteChatSession(id: string): Promise<void> {
    await fetch(`/api/ai/sessions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  async getColleges(params?: { query?: string; course?: string; district?: string; type?: string }): Promise<CollegeInfo[]> {
    const searchParams = new URLSearchParams();
    if (params?.query) searchParams.set('query', params.query);
    if (params?.course) searchParams.set('course', params.course);
    if (params?.district) searchParams.set('district', params.district);
    if (params?.type) searchParams.set('type', params.type);

    const res = await fetch(`/api/ai/colleges?${searchParams.toString()}`);
    const data = await res.json();
    return data.colleges || [];
  },

  async getEntranceExams(query?: string): Promise<EntranceExamInfo[]> {
    const url = query ? `/api/ai/entrance-exams?query=${encodeURIComponent(query)}` : '/api/ai/entrance-exams';
    const res = await fetch(url);
    const data = await res.json();
    return data.exams || [];
  }
};
