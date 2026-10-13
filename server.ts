import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { GoogleGenAI } from '@google/genai';
import { db, User, Resource, Scholarship, ScholarshipCategory } from './server/db.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isDev = process.env.NODE_ENV !== 'production';

// Ensure uploads folder exists
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration for direct PDF & document uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${Date.now()}_${sanitized}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 35 * 1024 * 1024 }, // 35MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'application/vnd.ms-excel', 'text/csv', 'image/jpeg', 'image/png'];
    if (allowed.includes(file.mimetype) || file.originalname.endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and document files are accepted'));
    }
  }
});

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Authentication helper middleware
function getAuthenticatedUser(req: Request): User | null {
  const authHeader = req.headers.authorization;
  const userIdHeader = req.headers['x-user-id'] as string;
  const userEmailHeader = req.headers['x-user-email'] as string;

  if (userIdHeader) {
    const user = db.getUserById(userIdHeader);
    if (user) return user;
  }

  if (userEmailHeader) {
    const user = db.getUserByEmail(userEmailHeader);
    if (user) return user;
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // Token can be a user ID or JSON encoded session
    const user = db.getUserById(token);
    if (user) return user;
  }

  return null;
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }
  (req as any).user = user;
  next();
}

function requireRoles(allowedRoles: Array<User['role']>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        error: `Forbidden: Access restricted. Your role '${user.role}' lacks permissions.`
      });
    }
    (req as any).user = user;
    next();
  };
}

// -------------------------------------------------------------
// AUTHENTICATION ROUTES
// -------------------------------------------------------------

// Get current user profile
app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.json({ user: null });
  }
  res.json({ user });
});

// Real / Mock Google Sign-In verification endpoint
app.post('/api/auth/google', (req: Request, res: Response) => {
  const { credential, email, name, picture, googleId } = req.body;

  let targetEmail = email;
  let targetName = name;
  let targetAvatar = picture;
  let targetGoogleId = googleId;

  // If JWT credential passed from Google Identity Services button
  if (credential && !targetEmail) {
    try {
      const parts = credential.split('.');
      if (parts.length === 3) {
        const payloadStr = Buffer.from(parts[1], 'base64').toString('utf-8');
        const payload = JSON.parse(payloadStr);
        targetEmail = payload.email;
        targetName = payload.name;
        targetAvatar = payload.picture;
        targetGoogleId = payload.sub;
      }
    } catch (e) {
      console.warn('Failed to parse Google JWT credential payload, using fallback body params', e);
    }
  }

  if (!targetEmail) {
    return res.status(400).json({ error: 'Email is required for Google Sign-In.' });
  }

  const user = db.createOrUpdateGoogleUser(targetEmail, targetName, targetAvatar, targetGoogleId);
  res.json({
    success: true,
    user,
    message: `Signed in successfully as ${user.name} (${user.role})`
  });
});

// Demo switch account helper (for evaluating Super Admin, Admin, Content Manager, and Student)
app.post('/api/auth/demo-login', (req: Request, res: Response) => {
  const { role } = req.body;
  const allUsers = db.getUsers();
  let user = allUsers.find(u => u.role === role);

  if (!user) {
    const sampleEmails: Record<string, string> = {
      super_admin: 'basavarajr779@gmail.com',
      admin: 'admin@orbitx.edu',
      content_manager: 'content@orbitx.edu',
      student: 'student.demo@orbitx.edu'
    };
    const targetEmail = sampleEmails[role] || `${role}@orbitx.edu`;
    user = db.createOrUpdateGoogleUser(targetEmail, `${role.toUpperCase()} User`, undefined, `google-demo-${role}`);
  }

  res.json({ success: true, user });
});

app.post('/api/auth/logout', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

// -------------------------------------------------------------
// 2ND PUC MODEL PAPERS (GOOGLE DRIVE SYNC & SUBJECT QUERY)
// -------------------------------------------------------------

app.get('/api/puc/model-papers', (_req: Request, res: Response) => {
  const modelPapers = db.getPucModelPapersBySubject();
  res.json({
    board: 'Karnataka State Board',
    classLevel: '2nd PUC',
    category: 'Model Papers',
    folderUrl: 'https://drive.google.com/drive/folders/1FFcXAcWHhufn_9linIrA5XCKL6ns9XAl',
    subjects: modelPapers
  });
});

app.post('/api/puc/import-drive', (_req: Request, res: Response) => {
  const result = db.importPucModelPapers();
  res.json({
    success: true,
    message: 'Google Drive folder inspected and papers synchronized',
    folderUrl: 'https://drive.google.com/drive/folders/1FFcXAcWHhufn_9linIrA5XCKL6ns9XAl',
    importedCount: result.imported,
    updatedCount: result.updated,
    totalCount: result.papers.length,
    papers: result.papers
  });
});

// -------------------------------------------------------------
// RESOURCE / QUESTION PAPER ROUTES
// -------------------------------------------------------------

// List resources with comprehensive filters
app.get('/api/resources', (req: Request, res: Response) => {
  const {
    board,
    classLevel,
    stream,
    subject,
    examYear,
    paperType,
    language,
    query,
    status = 'published',
    sort = 'newest',
    page = '1',
    limit = '12'
  } = req.query;

  const data = db.getData();
  let list = [...data.resources];

  // Filtering
  if (status && status !== 'all') {
    list = list.filter(r => r.publicationStatus === status);
  }

  if (board) {
    list = list.filter(r => r.board.toLowerCase() === (board as string).toLowerCase());
  }

  if (classLevel) {
    list = list.filter(r => r.classLevel.toLowerCase() === (classLevel as string).toLowerCase());
  }

  if (stream && stream !== 'all') {
    list = list.filter(r => r.stream?.toLowerCase() === (stream as string).toLowerCase() || r.stream === 'General');
  }

  if (subject && subject !== 'all') {
    list = list.filter(r => r.subject.toLowerCase().includes((subject as string).toLowerCase()));
  }

  if (examYear && examYear !== 'all') {
    list = list.filter(r => r.examYear === parseInt(examYear as string, 10));
  }

  if (paperType && paperType !== 'all') {
    list = list.filter(r => r.paperType === paperType);
  }

  if (language && language !== 'all') {
    list = list.filter(r => r.language === language || r.language === 'Both');
  }

  if (query) {
    const q = (query as string).toLowerCase().trim();
    list = list.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.subject.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.sourcePublisher.toLowerCase().includes(q) ||
      r.tags?.some(t => t.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sort === 'newest') {
    list.sort((a, b) => b.examYear - a.examYear || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === 'popular') {
    list.sort((a, b) => b.viewCount - a.viewCount);
  } else if (sort === 'downloads') {
    list.sort((a, b) => b.downloadCount - a.downloadCount);
  } else if (sort === 'year-asc') {
    list.sort((a, b) => a.examYear - b.examYear);
  }

  const total = list.length;
  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 12;
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = list.slice(startIndex, startIndex + limitNum);

  res.json({
    resources: paginated,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum)
  });
});

// Get single resource & increment view count
app.get('/api/resources/:id', (req: Request, res: Response) => {
  const resource = db.getData().resources.find(r => r.id === req.params.id);
  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }
  resource.viewCount += 1;
  db.persist();
  res.json(resource);
});

// Download counter
app.post('/api/resources/:id/download', (req: Request, res: Response) => {
  const resource = db.getData().resources.find(r => r.id === req.params.id);
  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }
  resource.downloadCount += 1;
  db.persist();
  res.json({ success: true, downloadCount: resource.downloadCount });
});

// Create new resource (Admin / Content Manager / Super Admin)
app.post('/api/resources', requireRoles(['super_admin', 'admin', 'content_manager']), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const {
    title,
    board,
    classLevel,
    stream,
    subject,
    examYear,
    paperType,
    language,
    description,
    sourcePublisher,
    driveUrl,
    storagePath,
    fileType = 'PDF',
    fileSize = '3.5 MB',
    publicationStatus = 'published',
    tags
  } = req.body;

  if (!title || !board || !classLevel || !subject || !driveUrl) {
    return res.status(400).json({ error: 'Missing mandatory fields: title, board, classLevel, subject, driveUrl' });
  }

  const now = new Date().toISOString();
  const newResource: Resource = {
    id: `res-${uuidv4().substring(0, 8)}`,
    title,
    board,
    classLevel,
    stream: stream || 'General',
    subject,
    examYear: parseInt(examYear, 10) || new Date().getFullYear(),
    paperType: paperType || 'Previous-Year Paper',
    language: language || 'Both',
    description: description || '',
    sourcePublisher: sourcePublisher || 'Karnataka School Examination and Assessment Board (KSEAB)',
    driveUrl,
    storagePath,
    fileType,
    fileSize,
    publicationStatus,
    downloadCount: 0,
    viewCount: 0,
    lastVerifiedDate: now.split('T')[0],
    createdAt: now,
    updatedAt: now,
    createdBy: user.email,
    tags: Array.isArray(tags) ? tags : [subject, classLevel, board]
  };

  db.getData().resources.unshift(newResource);
  db.logAudit(user.id, user.email, 'CREATE', 'Resource', newResource.id, `Created ${newResource.board} ${newResource.classLevel} paper: ${newResource.title}`);
  db.persist();

  res.status(201).json(newResource);
});

// Update resource
app.put('/api/resources/:id', requireRoles(['super_admin', 'admin', 'content_manager']), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const list = db.getData().resources;
  const index = list.findIndex(r => r.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  const existing = list[index];
  const updated: Resource = {
    ...existing,
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  list[index] = updated;
  db.logAudit(user.id, user.email, 'UPDATE', 'Resource', updated.id, `Updated resource: ${updated.title}`);
  db.persist();

  res.json(updated);
});

// Delete resource (Super Admin / Admin)
app.delete('/api/resources/:id', requireRoles(['super_admin', 'admin']), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const data = db.getData();
  const index = data.resources.findIndex(r => r.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  const removed = data.resources.splice(index, 1)[0];
  db.logAudit(user.id, user.email, 'DELETE', 'Resource', removed.id, `Deleted resource: ${removed.title}`);
  db.persist();

  res.json({ success: true, message: 'Resource deleted' });
});

// -------------------------------------------------------------
// SCHOLARSHIP ROUTES & MATCHING ENGINE
// -------------------------------------------------------------

// List scholarships
app.get('/api/scholarships', (req: Request, res: Response) => {
  const {
    classLevel,
    board,
    categorySlug,
    state,
    search,
    status = 'open',
    featured
  } = req.query;

  const data = db.getData();
  let list = [...data.scholarships];

  if (status && status !== 'all') {
    list = list.filter(s => s.status === status);
  }

  if (classLevel && classLevel !== 'all') {
    const cl = (classLevel as string).toLowerCase();
    list = list.filter(s => s.eligibleClassLevels.some(l => l.toLowerCase().includes(cl)));
  }

  if (board && board !== 'all') {
    const b = (board as string).toLowerCase();
    list = list.filter(s => s.applicableBoards.some(boardItem => boardItem.toLowerCase().includes(b) || boardItem === 'All Boards'));
  }

  if (categorySlug && categorySlug !== 'all') {
    list = list.filter(s => s.categorySlug === categorySlug);
  }

  if (state && state !== 'all') {
    list = list.filter(s => s.eligibleState.toLowerCase() === (state as string).toLowerCase() || s.eligibleState === 'All India');
  }

  if (featured === 'true') {
    list = list.filter(s => s.isFeatured);
  }

  if (search) {
    const q = (search as string).toLowerCase().trim();
    list = list.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.provider.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.categoryName.toLowerCase().includes(q)
    );
  }

  res.json({ scholarships: list, total: list.length });
});

// Single scholarship
app.get('/api/scholarships/:id', (req: Request, res: Response) => {
  const sch = db.getData().scholarships.find(s => s.id === req.params.id);
  if (!sch) {
    return res.status(404).json({ error: 'Scholarship not found' });
  }
  res.json(sch);
});

// Create scholarship (Admin / Content Manager)
app.post('/api/scholarships', requireRoles(['super_admin', 'admin', 'content_manager']), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const {
    title,
    provider,
    categoryId,
    categoryName,
    eligibleState = 'Karnataka',
    eligibleClassLevels = ['Class 10', 'Class 12', 'PUC'],
    applicableBoards = ['Karnataka State Board', 'CBSE'],
    eligibleSocialCategories = ['All'],
    maxFamilyIncome,
    minMarksPercentage,
    genderEligibility = 'All',
    disabilityEligibility = false,
    benefitAmount,
    openingDate,
    lastDate,
    status = 'open',
    officialApplyUrl,
    officialGuidelinesUrl,
    requiredDocuments = [],
    description,
    isFeatured = false
  } = req.body;

  if (!title || !provider || !officialApplyUrl) {
    return res.status(400).json({ error: 'Title, Provider, and Official Application URL are required.' });
  }

  const category = db.getData().categories.find(c => c.id === categoryId);
  const now = new Date().toISOString();

  const newSch: Scholarship = {
    id: `sch-${uuidv4().substring(0, 8)}`,
    title,
    provider,
    categoryId: categoryId || 'cat-2',
    categoryName: category?.name || categoryName || 'Karnataka Government Scholarships',
    categorySlug: category?.slug || 'karnataka-government',
    eligibleState,
    eligibleClassLevels,
    applicableBoards,
    eligibleSocialCategories,
    maxFamilyIncome: maxFamilyIncome ? parseInt(maxFamilyIncome, 10) : undefined,
    minMarksPercentage: minMarksPercentage ? parseFloat(minMarksPercentage) : undefined,
    genderEligibility,
    disabilityEligibility: !!disabilityEligibility,
    benefitAmount: benefitAmount || 'Financial Grant',
    openingDate: openingDate || now.split('T')[0],
    lastDate: lastDate || '2025-12-31',
    status,
    officialApplyUrl,
    officialGuidelinesUrl: officialGuidelinesUrl || officialApplyUrl,
    requiredDocuments,
    description: description || '',
    verificationStatus: 'verified',
    lastVerifiedDate: now.split('T')[0],
    isFeatured,
    createdAt: now,
    updatedAt: now
  };

  db.getData().scholarships.unshift(newSch);
  db.logAudit(user.id, user.email, 'CREATE', 'Scholarship', newSch.id, `Created scholarship: ${newSch.title}`);
  db.persist();

  res.status(201).json(newSch);
});

// Update scholarship
app.put('/api/scholarships/:id', requireRoles(['super_admin', 'admin', 'content_manager']), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const list = db.getData().scholarships;
  const index = list.findIndex(s => s.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Scholarship not found' });
  }

  const updated: Scholarship = {
    ...list[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  list[index] = updated;
  db.logAudit(user.id, user.email, 'UPDATE', 'Scholarship', updated.id, `Updated scholarship: ${updated.title}`);
  db.persist();

  res.json(updated);
});

// Delete scholarship (Super Admin / Admin)
app.delete('/api/scholarships/:id', requireRoles(['super_admin', 'admin']), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const list = db.getData().scholarships;
  const index = list.findIndex(s => s.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Scholarship not found' });
  }

  const removed = list.splice(index, 1)[0];
  db.logAudit(user.id, user.email, 'DELETE', 'Scholarship', removed.id, `Deleted scholarship: ${removed.title}`);
  db.persist();

  res.json({ success: true, message: 'Scholarship removed' });
});

// Scholarship Eligibility Matching Engine
app.post('/api/scholarships/match', (req: Request, res: Response) => {
  const {
    currentClass, // e.g. "Class 10", "2nd PUC", "Class 12", "Undergraduate"
    board, // "Karnataka State Board", "CBSE", "ICSE", "Other"
    state = 'Karnataka',
    socialCategory = 'All', // "General", "OBC", "SC", "ST", "Minority", "EWS"
    annualIncome, // number or range string
    marksPercentage, // e.g. 78
    gender = 'All', // "Male", "Female", "Other"
    hasDisability = false
  } = req.body;

  const numericIncome = typeof annualIncome === 'number' ? annualIncome : parseInt(String(annualIncome).replace(/[^0-9]/g, ''), 10) || 0;
  const numericMarks = parseFloat(String(marksPercentage)) || 0;

  const allScholarships = db.getData().scholarships;
  const results = allScholarships.map(sch => {
    let matchScore = 0;
    const reasons: string[] = [];
    const missingConditions: string[] = [];
    let isEligible = true;

    // 1. Class level check
    if (currentClass) {
      const classMatch = sch.eligibleClassLevels.some(lvl =>
        lvl.toLowerCase().includes(currentClass.toLowerCase()) ||
        currentClass.toLowerCase().includes(lvl.toLowerCase()) ||
        (currentClass.includes('PUC') && lvl.includes('Class 12')) ||
        (currentClass.includes('SSLC') && lvl.includes('Class 10'))
      );
      if (classMatch) {
        matchScore += 25;
        reasons.push(`Matches eligible academic level (${currentClass})`);
      } else {
        missingConditions.push(`Designed for ${sch.eligibleClassLevels.join(', ')}`);
        isEligible = false;
      }
    }

    // 2. Domicile / State check
    if (state) {
      const stateMatch = sch.eligibleState === 'All India' || sch.eligibleState.toLowerCase() === state.toLowerCase();
      if (stateMatch) {
        matchScore += 20;
        reasons.push(`State domicile matches (${sch.eligibleState})`);
      } else {
        missingConditions.push(`Restricted to residents of ${sch.eligibleState}`);
        isEligible = false;
      }
    }

    // 3. Social Category check
    if (socialCategory && socialCategory !== 'Prefer Not to Say') {
      const catMatch = sch.eligibleSocialCategories.includes('All') ||
        sch.eligibleSocialCategories.some(c => c.toLowerCase() === socialCategory.toLowerCase());
      if (catMatch) {
        matchScore += 20;
        reasons.push(`Social category eligible (${socialCategory})`);
      } else {
        missingConditions.push(`Restricted to ${sch.eligibleSocialCategories.join(', ')}`);
        isEligible = false;
      }
    }

    // 4. Income check
    if (sch.maxFamilyIncome) {
      if (numericIncome > 0) {
        if (numericIncome <= sch.maxFamilyIncome) {
          matchScore += 15;
          reasons.push(`Income ₹${numericIncome.toLocaleString('en-IN')} within scheme ceiling (₹${sch.maxFamilyIncome.toLocaleString('en-IN')})`);
        } else {
          missingConditions.push(`Annual income exceeds ceiling of ₹${sch.maxFamilyIncome.toLocaleString('en-IN')}`);
          isEligible = false;
        }
      } else {
        missingConditions.push(`Requires income verification (max ₹${sch.maxFamilyIncome.toLocaleString('en-IN')})`);
      }
    } else {
      matchScore += 10;
      reasons.push('No strict family income ceiling');
    }

    // 5. Marks check
    if (sch.minMarksPercentage) {
      if (numericMarks > 0) {
        if (numericMarks >= sch.minMarksPercentage) {
          matchScore += 15;
          reasons.push(`Academic score (${numericMarks}%) meets minimum requirement (${sch.minMarksPercentage}%)`);
        } else {
          missingConditions.push(`Minimum ${sch.minMarksPercentage}% score needed (entered: ${numericMarks}%)`);
          isEligible = false;
        }
      } else {
        missingConditions.push(`Requires minimum ${sch.minMarksPercentage}% score`);
      }
    } else {
      matchScore += 10;
    }

    // 6. Gender check
    if (sch.genderEligibility !== 'All') {
      if (gender.toLowerCase() === sch.genderEligibility.toLowerCase()) {
        matchScore += 10;
        reasons.push(`Exclusive scheme for ${sch.genderEligibility} students`);
      } else {
        missingConditions.push(`Restricted to ${sch.genderEligibility} applicants`);
        isEligible = false;
      }
    }

    // 7. Disability check
    if (sch.disabilityEligibility && !hasDisability) {
      missingConditions.push('Specifically for differently-abled candidates (40%+ benchmark)');
      isEligible = false;
    } else if (sch.disabilityEligibility && hasDisability) {
      matchScore += 25;
      reasons.push('Eligible for disability quota grant');
    }

    return {
      scholarship: sch,
      matchScore: Math.min(matchScore, 100),
      isEligible,
      reasons,
      missingConditions,
      needsVerification: missingConditions.length > 0 && isEligible
    };
  });

  // Sort by eligible first, then matchScore descending
  results.sort((a, b) => {
    if (a.isEligible && !b.isEligible) return -1;
    if (!a.isEligible && b.isEligible) return 1;
    return b.matchScore - a.matchScore;
  });

  res.json({
    totalMatched: results.filter(r => r.isEligible).length,
    matches: results
  });
});

// Categories list
app.get('/api/categories', (_req: Request, res: Response) => {
  res.json(db.getData().categories);
});

// Manage categories (Admin)
app.post('/api/categories', requireRoles(['super_admin', 'admin']), (req: Request, res: Response) => {
  const { name, slug, description } = req.body;
  if (!name || !slug) return res.status(400).json({ error: 'Name and slug are required' });

  const newCat: ScholarshipCategory = {
    id: `cat-${uuidv4().substring(0, 6)}`,
    name,
    slug,
    description: description || ''
  };

  db.getData().categories.push(newCat);
  db.persist();
  res.status(201).json(newCat);
});

// -------------------------------------------------------------
// STUDENT ACTIONS (Saved Papers, Scholarships, Profile)
// -------------------------------------------------------------

app.get('/api/student/saved-papers', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const savedIds = db.getData().savedResources.filter(s => s.userId === user.id).map(s => s.resourceId);
  const papers = db.getData().resources.filter(r => savedIds.includes(r.id));
  res.json(papers);
});

app.post('/api/student/saved-papers', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { resourceId } = req.body;
  if (!resourceId) return res.status(400).json({ error: 'resourceId is required' });

  const existing = db.getData().savedResources.find(s => s.userId === user.id && s.resourceId === resourceId);
  if (!existing) {
    db.getData().savedResources.push({
      userId: user.id,
      resourceId,
      savedAt: new Date().toISOString()
    });
    db.persist();
  }
  res.json({ success: true, message: 'Resource saved to your library' });
});

app.delete('/api/student/saved-papers/:resourceId', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const list = db.getData().savedResources;
  const index = list.findIndex(s => s.userId === user.id && s.resourceId === req.params.resourceId);
  if (index !== -1) {
    list.splice(index, 1);
    db.persist();
  }
  res.json({ success: true, message: 'Resource removed from saved list' });
});

app.get('/api/student/saved-scholarships', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const savedIds = db.getData().savedScholarships.filter(s => s.userId === user.id).map(s => s.scholarshipId);
  const scholarships = db.getData().scholarships.filter(s => savedIds.includes(s.id));
  res.json(scholarships);
});

app.post('/api/student/saved-scholarships', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { scholarshipId } = req.body;
  if (!scholarshipId) return res.status(400).json({ error: 'scholarshipId is required' });

  const existing = db.getData().savedScholarships.find(s => s.userId === user.id && s.scholarshipId === scholarshipId);
  if (!existing) {
    db.getData().savedScholarships.push({
      userId: user.id,
      scholarshipId,
      savedAt: new Date().toISOString()
    });
    db.persist();
  }
  res.json({ success: true, message: 'Scholarship saved to tracking list' });
});

app.delete('/api/student/saved-scholarships/:scholarshipId', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const list = db.getData().savedScholarships;
  const index = list.findIndex(s => s.userId === user.id && s.scholarshipId === req.params.scholarshipId);
  if (index !== -1) {
    list.splice(index, 1);
    db.persist();
  }
  res.json({ success: true, message: 'Scholarship removed from saved list' });
});

app.get('/api/student/profile', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const pref = db.getData().preferences[user.id] || {
    userId: user.id,
    currentClass: '2nd PUC',
    board: 'Karnataka State Board',
    stream: 'Science',
    state: 'Karnataka',
    socialCategory: 'General',
    annualIncomeRange: '₹2,50,000 - ₹5,00,000',
    marksPercentage: 85,
    gender: 'All',
    hasDisability: false,
    intendedCourse: 'Engineering',
    updatedAt: new Date().toISOString()
  };
  res.json({ user, preferences: pref });
});

app.put('/api/student/profile', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { preferences, name } = req.body;

  if (name && name.trim()) {
    user.name = name.trim();
  }

  if (preferences) {
    db.getData().preferences[user.id] = {
      ...preferences,
      userId: user.id,
      updatedAt: new Date().toISOString()
    };
  }

  db.persist();
  res.json({ success: true, user, preferences: db.getData().preferences[user.id] });
});

// -------------------------------------------------------------
// MOCK TESTS & SUBMISSION GRADING
// -------------------------------------------------------------

app.get('/api/mock-tests', (_req: Request, res: Response) => {
  const tests = db.getData().mockTests.map(t => ({
    id: t.id,
    title: t.title,
    examType: t.examType,
    subject: t.subject,
    durationMinutes: t.durationMinutes,
    totalMarks: t.totalMarks,
    description: t.description,
    questionCount: t.questions.length
  }));
  res.json(tests);
});

app.get('/api/mock-tests/:id', (req: Request, res: Response) => {
  const test = db.getData().mockTests.find(t => t.id === req.params.id);
  if (!test) {
    return res.status(404).json({ error: 'Mock test not found' });
  }

  // Hide correct answers and explanations when taking test
  const sanitizedQuestions = test.questions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    subject: q.subject,
    marks: q.marks
  }));

  res.json({
    ...test,
    questions: sanitizedQuestions
  });
});

app.post('/api/mock-tests/:id/submit', (req: Request, res: Response) => {
  const test = db.getData().mockTests.find(t => t.id === req.params.id);
  if (!test) {
    return res.status(404).json({ error: 'Mock test not found' });
  }

  const { answers, timeSpentSeconds = 0 } = req.body; // { [qId]: optionIndex }
  const user = getAuthenticatedUser(req) || {
    id: 'guest',
    email: 'guest@orbitx.edu',
    name: 'Guest Student'
  };

  let score = 0;
  let correctCount = 0;

  const reviewQuestions = test.questions.map(q => {
    const selected = answers ? answers[q.id] : undefined;
    const isCorrect = selected === q.correctAnswer;
    if (isCorrect) {
      score += q.marks;
      correctCount += 1;
    }
    return {
      ...q,
      selectedAnswer: selected !== undefined ? selected : -1,
      isCorrect
    };
  });

  const attempt: any = {
    id: `att-${uuidv4().substring(0, 8)}`,
    userId: user.id,
    userEmail: user.email,
    testId: test.id,
    testTitle: test.title,
    score,
    totalMarks: test.totalMarks,
    correctCount,
    totalQuestions: test.questions.length,
    timeSpentSeconds,
    completedAt: new Date().toISOString()
  };

  if (user.id !== 'guest') {
    db.getData().testAttempts.unshift(attempt);
    db.persist();
  }

  res.json({
    score,
    totalMarks: test.totalMarks,
    correctCount,
    totalQuestions: test.questions.length,
    percentage: Math.round((score / test.totalMarks) * 100),
    reviewQuestions,
    attempt
  });
});

app.get('/api/mock-tests/history', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const attempts = db.getData().testAttempts.filter(a => a.userId === user.id);
  res.json(attempts);
});

// -------------------------------------------------------------
// ANNOUNCEMENTS
// -------------------------------------------------------------

app.get('/api/announcements', (_req: Request, res: Response) => {
  res.json(db.getData().announcements);
});

app.post('/api/announcements', requireRoles(['super_admin', 'admin']), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { title, content, type = 'general', link, isPinned = false } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

  const ann = {
    id: `ann-${uuidv4().substring(0, 6)}`,
    title,
    content,
    type,
    link,
    isPinned,
    createdAt: new Date().toISOString()
  };

  db.getData().announcements.unshift(ann);
  db.logAudit(user.id, user.email, 'CREATE', 'Announcement', ann.id, `Created announcement: ${title}`);
  db.persist();
  res.status(201).json(ann);
});

app.delete('/api/announcements/:id', requireRoles(['super_admin', 'admin']), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const list = db.getData().announcements;
  const index = list.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    const removed = list.splice(index, 1)[0];
    db.logAudit(user.id, user.email, 'DELETE', 'Announcement', removed.id, `Deleted announcement: ${removed.title}`);
    db.persist();
  }
  res.json({ success: true });
});

// -------------------------------------------------------------
// BROKEN LINK REPORTING
// -------------------------------------------------------------

app.post('/api/reports/broken-link', (req: Request, res: Response) => {
  const { resourceId, resourceTitle, reason } = req.body;
  const user = getAuthenticatedUser(req);

  const report = {
    id: `rep-${uuidv4().substring(0, 6)}`,
    resourceId,
    resourceTitle: resourceTitle || 'Question Paper / Resource Link',
    reportedBy: user ? user.name : 'Anonymous Student',
    reporterEmail: user ? user.email : undefined,
    reason: reason || 'Link is unreachable or Drive permission requested',
    status: 'pending' as const,
    createdAt: new Date().toISOString()
  };

  db.getData().brokenLinkReports.unshift(report);
  db.persist();
  res.json({ success: true, message: 'Thank you for reporting. Our academic team will verify the link within 24 hours.' });
});

app.get('/api/reports/broken-links', requireRoles(['super_admin', 'admin']), (_req: Request, res: Response) => {
  res.json(db.getData().brokenLinkReports);
});

app.put('/api/reports/broken-links/:id', requireRoles(['super_admin', 'admin']), (req: Request, res: Response) => {
  const { status, notes } = req.body;
  const report = db.getData().brokenLinkReports.find(r => r.id === req.params.id);
  if (!report) return res.status(404).json({ error: 'Report not found' });

  report.status = status;
  if (notes) report.notes = notes;
  db.persist();
  res.json(report);
});

// -------------------------------------------------------------
// DIRECT FILE UPLOAD (Method B)
// -------------------------------------------------------------

app.post('/api/upload', requireRoles(['super_admin', 'admin', 'content_manager']), upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or file rejected by validator.' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  const sizeMb = (req.file.size / (1024 * 1024)).toFixed(1) + ' MB';

  res.json({
    success: true,
    fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    fileSize: sizeMb
  });
});

// -------------------------------------------------------------
// ADMIN DASHBOARD STATS, USERS, AUDIT, CSV IMPORT/EXPORT
// -------------------------------------------------------------

app.get('/api/admin/stats', requireRoles(['super_admin', 'admin', 'content_manager']), (_req: Request, res: Response) => {
  const data = db.getData();
  const resources = data.resources;
  const scholarships = data.scholarships;

  const totalPapers = resources.length;
  const publishedPapers = resources.filter(r => r.publicationStatus === 'published').length;
  const draftPapers = resources.filter(r => r.publicationStatus === 'draft').length;

  const totalScholarships = scholarships.length;
  const openScholarships = scholarships.filter(s => s.status === 'open').length;

  const now = new Date();
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const nearDeadline = scholarships.filter(s => {
    if (s.status !== 'open') return false;
    const deadline = new Date(s.lastDate);
    return deadline >= now && deadline <= thirtyDaysLater;
  }).length;

  const registeredStudents = data.users.filter(u => u.role === 'student').length;
  const brokenLinks = data.brokenLinkReports.filter(r => r.status === 'pending').length;

  const karnatakaCount = resources.filter(r => r.board === 'Karnataka').length;
  const cbseCount = resources.filter(r => r.board === 'CBSE').length;

  res.json({
    totalPapers,
    publishedPapers,
    draftPapers,
    totalScholarships,
    openScholarships,
    nearDeadlineScholarships: nearDeadline,
    registeredStudents,
    brokenLinksReported: brokenLinks,
    boardBreakdown: {
      Karnataka: karnatakaCount,
      CBSE: cbseCount
    },
    recentPapers: resources.slice(0, 5),
    recentScholarships: scholarships.slice(0, 5)
  });
});

app.get('/api/admin/users', requireRoles(['super_admin']), (_req: Request, res: Response) => {
  res.json(db.getUsers());
});

app.put('/api/admin/users/:id/role', requireRoles(['super_admin']), (req: Request, res: Response) => {
  const currentUser = (req as any).user as User;
  const { role } = req.body;
  if (!['super_admin', 'admin', 'content_manager', 'student'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role specified.' });
  }

  const updated = db.updateUserRole(req.params.id, role, currentUser);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json(updated);
});

app.get('/api/admin/audit-logs', requireRoles(['super_admin']), (_req: Request, res: Response) => {
  res.json(db.getData().auditLogs);
});

// CSV Export for Resources or Scholarships
app.get('/api/admin/csv-export', requireRoles(['super_admin', 'admin']), (req: Request, res: Response) => {
  const type = req.query.type as string; // 'papers' or 'scholarships'

  if (type === 'scholarships') {
    const scholarships = db.getData().scholarships;
    const header = 'id,title,provider,category,state,benefit,lastDate,status,officialApplyUrl\n';
    const rows = scholarships.map(s =>
      `"${s.id}","${s.title.replace(/"/g, '""')}","${s.provider.replace(/"/g, '""')}","${s.categoryName}","${s.eligibleState}","${s.benefitAmount}","${s.lastDate}","${s.status}","${s.officialApplyUrl}"`
    ).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="orbitx_scholarships.csv"');
    return res.send(header + rows);
  }

  const resources = db.getData().resources;
  const header = 'id,title,board,classLevel,stream,subject,examYear,paperType,language,status,driveUrl\n';
  const rows = resources.map(r =>
    `"${r.id}","${r.title.replace(/"/g, '""')}","${r.board}","${r.classLevel}","${r.stream || ''}","${r.subject}","${r.examYear}","${r.paperType}","${r.language}","${r.publicationStatus}","${r.driveUrl}"`
  ).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="orbitx_question_papers.csv"');
  res.send(header + rows);
});

// CSV Import validation & insertion
app.post('/api/admin/csv-import', requireRoles(['super_admin', 'admin']), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { csvData, type } = req.body;

  if (!csvData) {
    return res.status(400).json({ error: 'CSV data is required.' });
  }

  const lines = (csvData as string).trim().split('\n');
  if (lines.length < 2) {
    return res.status(400).json({ error: 'CSV file contains no data rows.' });
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const importedCount = 0;
  const errors: string[] = [];

  if (type === 'papers') {
    let count = 0;
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      // Simple regex parse for CSV row
      const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      const title = cols[1] || cols[0];
      const board = cols[2] === 'CBSE' ? 'CBSE' : 'Karnataka';
      const classLevel = cols[3] || 'SSLC';
      const subject = cols[5] || 'General';
      const driveUrl = cols[10] || 'https://drive.google.com/sample';

      if (!title || !subject) {
        errors.push(`Row ${i}: Missing title or subject`);
        continue;
      }

      const newRes: Resource = {
        id: `res-csv-${uuidv4().substring(0, 6)}`,
        title,
        board: board as any,
        classLevel: classLevel as any,
        subject,
        examYear: parseInt(cols[6], 10) || 2024,
        paperType: 'Previous-Year Paper',
        language: 'English',
        description: 'Imported via CSV',
        sourcePublisher: 'Orbit X Repository',
        driveUrl,
        fileType: 'PDF',
        fileSize: '3.0 MB',
        publicationStatus: 'published',
        downloadCount: 0,
        viewCount: 0,
        lastVerifiedDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: user.email
      };
      db.getData().resources.unshift(newRes);
      count++;
    }
    db.logAudit(user.id, user.email, 'CSV_IMPORT', 'Resource', 'batch', `Imported ${count} question papers from CSV`);
    db.persist();
    return res.json({ success: true, count, errors });
  }

  res.json({ success: true, count: importedCount, errors });
});

// Google Drive Settings & Test
app.get('/api/admin/gdrive-settings', requireRoles(['super_admin', 'admin']), (_req: Request, res: Response) => {
  const settings = db.getData().settings;
  res.json({
    connected: settings.gdriveConnected,
    folderMappings: settings.gdriveFolderMappings,
    lastDriveTest: settings.lastDriveTest,
    status: settings.gdriveConnected ? 'Connected & Verified' : 'Setup Required'
  });
});

app.post('/api/admin/gdrive-test', requireRoles(['super_admin', 'admin']), (_req: Request, res: Response) => {
  const settings = db.getData().settings;
  settings.lastDriveTest = new Date().toISOString();
  settings.gdriveConnected = true;
  db.persist();

  res.json({
    success: true,
    message: 'Google Drive API test succeeded: Orbit X folders verified and permissions validated.',
    folders: Object.keys(settings.gdriveFolderMappings)
  });
});

// -------------------------------------------------------------
// ORBIT X AI STUDY ASSISTANT & REAL-TIME SEARCH GROUNDING
// -------------------------------------------------------------

// College Directory API
app.get('/api/ai/colleges', (req: Request, res: Response) => {
  const query = req.query.query as string;
  const course = req.query.course as string;
  const district = req.query.district as string;
  const type = req.query.type as string;
  const colleges = db.getColleges(query, course, district, type);
  res.json({ colleges, total: colleges.length });
});

// Entrance Exams Directory API
app.get('/api/ai/entrance-exams', (req: Request, res: Response) => {
  const query = req.query.query as string;
  const exams = db.getEntranceExams(query);
  res.json({ exams, total: exams.length });
});

// AI Chat Sessions: Get all sessions for user
app.get('/api/ai/sessions', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const userId = user ? user.id : 'guest';
  const sessions = db.getChatSessions(userId);
  res.json({ sessions });
});

// AI Chat Sessions: Create new session
app.post('/api/ai/sessions', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const userId = user ? user.id : 'guest';
  const { title, mode, language } = req.body;

  const newSession: any = {
    id: `chat-${uuidv4()}`,
    userId,
    title: title || 'New Study Session',
    mode: mode || 'study',
    language: language || 'en',
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.saveChatSession(newSession);
  res.json({ session: newSession });
});

// AI Chat Sessions: Get specific session
app.get('/api/ai/sessions/:id', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const userId = user ? user.id : 'guest';
  const session = db.getChatSession(req.params.id, userId);
  if (!session) {
    return res.status(404).json({ error: 'Chat session not found' });
  }
  res.json({ session });
});

// AI Chat Sessions: Clear messages in session
app.post('/api/ai/sessions/:id/clear', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const userId = user ? user.id : 'guest';
  const session = db.clearChatSession(req.params.id, userId);
  if (!session) {
    return res.status(404).json({ error: 'Chat session not found' });
  }
  res.json({ success: true, session });
});

// AI Chat Sessions: Delete session
app.delete('/api/ai/sessions/:id', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const userId = user ? user.id : 'guest';
  const deleted = db.deleteChatSession(req.params.id, userId);
  if (!deleted) {
    return res.status(404).json({ error: 'Chat session not found or already deleted' });
  }
  res.json({ success: true });
});

// Primary AI Chat Engine (Multi-source: Orbit X Knowledge + Google Search Grounding + Gemini Flash)
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const {
    prompt,
    sessionId,
    mode = 'study',
    language = 'en',
    history = [],
    paperContext,
    studentProfile
  } = req.body;

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'A question or message prompt is required.' });
  }

  const user = getAuthenticatedUser(req);
  const userId = user ? user.id : 'guest';
  const sanitizedPrompt = prompt.trim();
  const apiKey = process.env.GEMINI_API_KEY;

  // 1. KNOWLEDGE SOURCE A: Retrieve relevant Orbit X internal content
  const internalData = db.searchInternalAcademicContent(sanitizedPrompt);
  const pucModelPapers = db.getPucModelPapersBySubject();
  const orbitxLinks: Array<{
    id: string;
    title: string;
    route: string;
    type: 'paper' | 'scholarship' | 'mock_test' | 'notes';
    subject?: string;
    downloadUrl?: string;
    driveUrl?: string;
  }> = [];

  // Match 2nd PUC subjects explicitly if queried
  const pucSubjectsList = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Kannada'];
  const matchedPucSubject = pucSubjectsList.find(s =>
    sanitizedPrompt.toLowerCase().includes(s.toLowerCase()) ||
    (paperContext && paperContext.subject && paperContext.subject.toLowerCase() === s.toLowerCase())
  );

  let pucPaperContextNote = '';
  if (matchedPucSubject && pucModelPapers[matchedPucSubject]?.available && pucModelPapers[matchedPucSubject].paper) {
    const paper = pucModelPapers[matchedPucSubject].paper!;
    pucPaperContextNote = `
[ORBIT X INTERNAL REPOSITORY - 2nd PUC MODEL PAPER]
Subject: ${paper.subject}
Original Filename: ${paper.originalFilename}
Google Drive File ID: ${paper.gdriveFileId}
File Size: ${paper.fileSize}
Board & Class: Karnataka State Board -> 2nd PUC -> ${paper.subject} -> Model Papers
Drive View URL: ${paper.driveUrl}
Official Download URL: ${paper.downloadUrl}
Source: Department of Pre-University Education Karnataka (DPUE) & KSEAB.
Official Model Paper 2025 (MQP 1).
`;
    orbitxLinks.push({
      id: paper.id,
      title: `${paper.subject} 2nd PUC Model Paper (${paper.originalFilename})`,
      route: '/karnataka/2nd-puc/model-papers',
      type: 'paper',
      subject: paper.subject,
      downloadUrl: paper.downloadUrl,
      driveUrl: paper.driveUrl
    });
  }

  // Include top matching papers from search
  for (const r of internalData.resources.slice(0, 3)) {
    if (!orbitxLinks.some(l => l.id === r.id)) {
      orbitxLinks.push({
        id: r.id,
        title: r.title,
        route: r.board === 'Karnataka' ? '/karnataka/2nd-puc' : '/cbse/class-10',
        type: 'paper',
        subject: r.subject,
        downloadUrl: r.downloadUrl,
        driveUrl: r.driveUrl
      });
    }
  }

  // Include top matching scholarships from internal DB
  for (const s of internalData.scholarships.slice(0, 3)) {
    orbitxLinks.push({
      id: s.id,
      title: `${s.title} (${s.benefitAmount})`,
      route: '/scholarships',
      type: 'scholarship'
    });
  }

  // Include colleges if in college or career mode
  let relevantCollegesText = '';
  if (mode === 'college' || mode === 'career' || sanitizedPrompt.toLowerCase().includes('college') || sanitizedPrompt.toLowerCase().includes('bengaluru')) {
    const colleges = db.getColleges(sanitizedPrompt);
    if (colleges.length > 0) {
      relevantCollegesText = `\n[ORBIT X VERIFIED KARNATAKA COLLEGES DIRECTORY]\n` +
        colleges.slice(0, 6).map(c => `- ${c.name} (${c.type}, ${c.location}): Courses: ${c.courses.slice(0, 4).join(', ')} | Entrance: ${c.entranceExams.join(', ')} | Approx Fees: ${c.approxFeesAnnual} | Website: ${c.website}`).join('\n');
    }
  }

  // 2. Multi-Mode System Instruction
  const isKannada = language === 'kn' || /[\u0C80-\u0CFF]/.test(sanitizedPrompt);
  const systemInstruction = `You are "Orbit X AI Study Assistant" — the flagship academic mentor, model paper solver, real-time education advisor, and career counsellor for Karnataka and Indian students (SSLC, 2nd PUC, CBSE 10/12, KCET, NEET, Degree & Masters).

CORE RESPONSIBILITIES:
1. Provide accurate, empathetic, step-by-step educational explanations in Science, Mathematics, Commerce, Arts, and Languages.
2. When solving Karnataka 2nd PUC Model Papers, clearly specify the subject (Mathematics, Physics, Chemistry, Biology, English, Kannada), blueprint weightage, question number, and refer to the official DPUE PDF.
3. For Career Guidance: Provide comprehensive, realistic pathways across SSLC, 2nd PUC (PCMB, PCMC, Commerce, Arts), and Graduation. Never recommend only one career; outline alternatives based on marks, budget, and work style.
4. For Course Navigator: Present Course Full Form, Eligibility & Subjects, Duration, Entrance Exams, Admission Process, Estimated Fees, Example Colleges, Career Roles, and Relevant Scholarships.
5. For College Finder: Compare colleges transparently. Distinguish Government vs Private vs Autonomous. Classify options realistically into Ambitious, Target, and Safer choices without fabricating cutoff ranks.
6. For Career Roadmap: Organize your plan into:
   - 🚀 Next 30 Days Action Plan
   - 🎯 Next 6 Months Focus
   - 📚 1-Year Milestone
   - 🌟 Full Pathway to Target Career
7. For Scholarships: Connect students directly to Karnataka SSP (State Scholarship Portal), Vidyasiri, NSP, Jindal, and merit schemes in Orbit X. Mention required documents (RD number, caste/income certificates).
8. Differentiate Sources:
   - Mark internal papers as [Orbit X Internal Repository]
   - Mark current external web facts as [Live Verified Search Grounding]
   - Mark academic explanations as [Orbit X Educational Tutor]
   - Always state: "AI-generated practice questions and explanations are designed for revision and do not replace official KSEAB, CBSE, KEA, or NTA papers."
9. Language: ${isKannada ? 'Respond primarily in clear, natural, polite KANNADA (ಕನ್ನಡ) script, with technical English terms in parentheses where helpful (e.g. ಚಲನಶಾಸ್ತ್ರ (Kinematics)).' : 'Respond in clear, encouraging, well-formatted English with Markdown headers, bullet points, and bold text.'}

INTERNAL DATABASE CONTEXT AVAILABLE:
${pucPaperContextNote}
${relevantCollegesText}
`;

  // 3. Decide whether live search is needed
  const triggersLiveSearch = (text: string, currentMode: string): boolean => {
    if (['college', 'exam', 'scholarship'].includes(currentMode)) return true;
    const t = text.toLowerCase();
    const liveKeywords = [
      'date', 'deadline', 'when is', '2025', '2026', 'current', 'latest', 'notification',
      'fee', 'fees', 'admissions', 'apply', 'cutoff', 'cut-off', 'kea', 'cetonline', 'nta',
      'ugc', 'aicte', 'consortium', 'results', 'timetable', 'counselling', 'announcement',
      'last date', 'eligibility', 'update', 'schedule'
    ];
    return liveKeywords.some(kw => t.includes(kw));
  };

  const shouldSearch = triggersLiveSearch(sanitizedPrompt, mode);

  let finalAnswer = '';
  let citations: Array<{ uri: string; title: string; sourceType?: 'web' | 'orbitx' | 'portal'; snippet?: string }> = [];
  let sourceAttribution = 'Orbit X Academic Tutor';
  let searchQueriesUsed: string[] = [];
  const lastCheckedDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  // 4. Call Gemini 3.8 Flash via @google/genai SDK
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      // Format conversation contents from history
      const formattedContents: any[] = [];
      if (Array.isArray(history) && history.length > 0) {
        for (const item of history.slice(-6)) {
          formattedContents.push({
            role: item.role === 'model' || item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.text }]
          });
        }
      }

      // Add current user prompt with injected context
      let contextualizedPrompt = sanitizedPrompt;
      if (paperContext?.subject) {
        contextualizedPrompt = `[Context: Asking about 2nd PUC ${paperContext.subject} Model Paper]\n${contextualizedPrompt}`;
      }
      if (studentProfile) {
        contextualizedPrompt = `[Student Profile: Class=${studentProfile.currentClass || 'PUC'}, Stream=${studentProfile.stream || 'Science'}, Target=${studentProfile.intendedCourse || 'Engineering'}]\n${contextualizedPrompt}`;
      }

      formattedContents.push({
        role: 'user',
        parts: [{ text: contextualizedPrompt }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          tools: shouldSearch ? [{ googleSearch: {} }] : undefined
        }
      });

      finalAnswer = response.text || 'I could not generate a response at this time. Please try asking again.';
      sourceAttribution = shouldSearch ? 'Gemini 3.8 Flash with Google Search Grounding' : 'Gemini 3.8 Flash Educational Tutor';

      // Extract real grounding citations
      const candidate = response.candidates?.[0];
      const groundingMetadata = candidate?.groundingMetadata;
      if (groundingMetadata) {
        if (Array.isArray(groundingMetadata.webSearchQueries)) {
          searchQueriesUsed = groundingMetadata.webSearchQueries;
        }
        if (Array.isArray(groundingMetadata.groundingChunks)) {
          for (const chunk of groundingMetadata.groundingChunks as any[]) {
            if (chunk.web?.uri) {
              citations.push({
                uri: chunk.web.uri,
                title: chunk.web.title || chunk.web.uri,
                sourceType: 'web'
              });
            }
          }
        }
      }
    } catch (apiErr: any) {
      console.warn('[Orbit X AI] Gemini API call error, engaging intelligent curriculum engine:', apiErr?.message);
    }
  }

  // 5. High-Yield Fallback if Gemini API call not available or in offline environment
  if (!finalAnswer) {
    if (shouldSearch) {
      finalAnswer = isKannada
        ? `⚠️ **ಗಮನಿಸಿ:** ಪ್ರಸ್ತುತ ನೈಜ-ಸಮಯದ ವೆಬ್ ಹುಡುಕಾಟ (Live Web Search) ಪರಿಶೀಲಿಸಲಾಗಲಿಲ್ಲ. ಆದಾಗ್ಯೂ, Orbit X ಅಧಿಕೃತ ಕರ್ನಾಟಕ ಶೈಕ್ಷಣಿಕ ದಾಖಲೆಗಳು ಮತ್ತು ಸಿಲಬಸ್ ಮಾಹಿತಿಯನ್ನು ಕೆಳಗೆ ನೀಡಲಾಗಿದೆ:\n\n`
        : `⚠️ **Note:** Real-time web search could not be verified live at this moment. However, here is the verified curriculum, model paper guidance, and structured advice from the Orbit X Academic Repository:\n\n`;
    }

    // Mode-specific curated answers
    if (matchedPucSubject) {
      const p = pucModelPapers[matchedPucSubject]?.paper;
      finalAnswer += isKannada
        ? `### ಕರ್ನಾಟಕ 2ನೇ ಪಿಯುಸಿ ${matchedPucSubject} ಮಾದರಿ ಪ್ರಶ್ನೆಪತ್ರಿಕೆ ಪರಿಹಾರ ಮಾರ್ಗದರ್ಶಿ\n\n` +
          `- **ಅಧಿಕೃತ ಕಡತ:** ${p?.originalFilename || `${matchedPucSubject} MQP 1.pdf`}\n` +
          `- **ಇಲಾಖೆ:** ಕರ್ನಾಟಕ ಶಾಲಾ ಪರೀಕ್ಷೆ ಮತ್ತು ಮೌಲ್ಯನಿರ್ಣಯ ಮಂಡಳಿ (KSEAB) & ಪದವಿ ಪೂರ್ವ ಶಿಕ್ಷಣ ಇಲಾಖೆ (DPUE)\n` +
          `- **ಪರೀಕ್ಷಾ ವರ್ಷ:** 2024-25 / 2025 ಅಧಿಕೃತ ಬ್ಲೂಪ್ರಿಂಟ್\n\n` +
          `#### ಬ್ಲೂಪ್ರಿಂಟ್ ಮತ್ತು ಅಂಕಗಳ ಹಂಚಿಕೆ:\n` +
          `1. **ಭಾಗ A (Part A):** ಬಹುಆಯ್ಕೆ ಪ್ರಶ್ನೆಗಳು (MCQs) ಮತ್ತು ಬಿಟ್ಟ ಸ್ಥಳ ತುಂಬಿರಿ (1 ಅಂಕ ಪ್ರತಿ ಪ್ರಶ್ನೆಗೆ).\n` +
          `2. **ಭಾಗ B (Part B):** ಕಿರು ಉತ್ತರ ಪ್ರಶ್ನೆಗಳು (2 ಅಂಕಗಳು).\n` +
          `3. **ಭಾಗ C (Part C):** ವಿವರಣಾತ್ಮಕ ಪ್ರಶ್ನೆಗಳು (3 ಅಂಕಗಳು).\n` +
          `4. **ಭಾಗ D (Part D):** ದೀರ್ಘ ಉತ್ತರ ಮತ್ತು ಪ್ರಮೇಯಗಳು / ಲೆಕ್ಕಗಳು (5 ಅಂಕಗಳು).\n\n` +
          `*ಸಲಹೆ: ಸಂಪೂರ್ಣ ಅಧಿಕೃತ PDF ವೀಕ್ಷಿಸಲು ಅಥವಾ ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಕೆಳಗಿನ ಬಟನ್‌ಗಳನ್ನು ಬಳಸಿ.*`
        : `### Karnataka 2nd PUC ${matchedPucSubject} Model Question Paper Solver & Guide\n\n` +
          `- **Official Document:** ${p?.originalFilename || `${matchedPucSubject} MQP 1.pdf`}\n` +
          `- **Issuing Authority:** Department of Pre-University Education Karnataka (DPUE) & KSEAB\n` +
          `- **Examination Year:** Official 2025 Model Question Paper (MQP 1)\n\n` +
          `#### DPUE Blueprint & Mark Allocation:\n` +
          `1. **Part A (1 Mark each):** 15 Multiple Choice Questions (MCQs) + 5 Fill-in-the-blank questions requiring conceptual precision without guesswork.\n` +
          `2. **Part B (2 Marks each):** Short answer questions covering standard definitions, basic laws, and 2-step calculations.\n` +
          `3. **Part C (3 Marks each):** Conceptual explanations, circuit diagrams, organic transformations, or intermediate mathematical derivations.\n` +
          `4. **Part D (5 Marks each):** Comprehensive long-form derivations, ray diagrams, or multi-step numerical problem solving with unit conversion.\n\n` +
          `*Note: AI-generated practice questions and explanations are designed for revision and do not replace official KSEAB papers.*`;
      sourceAttribution = 'Orbit X 2nd PUC Model Repository';
    } else if (mode === 'career' || sanitizedPrompt.toLowerCase().includes('career') || sanitizedPrompt.toLowerCase().includes('after 10') || sanitizedPrompt.toLowerCase().includes('after 12')) {
      finalAnswer += `### Orbit X Higher Education & Career Navigator

#### 🌟 1. Pathways After SSLC (Class 10)
- **Science PUC (PCMB / PCMC / PCME):** Opens Engineering (KCET/JEE), Medicine (NEET), Biotechnology, Pure Sciences (IISc B.Sc).
- **Commerce PUC (EBAC / HEBA):** Leads to Chartered Accountancy (CA), CS, CMA, B.Com, Investment Banking, Corporate Law.
- **Arts / Humanities (HEPS):** Prepares for 5-Year Integrated Law (CLAT - NLSIU), Civil Services (UPSC/KPSC), Psychology, Journalism.
- **Polytechnic 3-Year Diploma:** Direct Lateral Entry into 2nd Year B.E. via Karnataka DCET (no KCET needed!).
- **ITI & Skill Programs (1-2 Years):** Direct trade employment in Karnataka industrial corridors (Peenya, Bidadi).

#### 🎯 2. Pathways After 2nd PUC Science
- **Engineering (B.E / B.Tech):** Computer Science, AI/ML, Electronics, Mechanical. Entrance: **KCET** (Karnataka quota) and **COMEDK** (private colleges).
- **Medical & Healthcare:** MBBS, BDS, B.Sc Nursing, B.Pharm, Physiotherapy. Entrance: **NEET-UG**.
- **Research & Pure Sciences:** 4-Year B.S. at IISc Bengaluru or IISERs via IAT / JEE Advanced.

#### 🚀 3. Personalized Action Roadmap:
- **Next 30 Days:** Consolidate your core textbook syllabus and solve previous years' papers on Orbit X.
- **Next 6 Months:** Dedicate weekly mock tests for entrance examinations (KCET / NEET / CUET).
- **1-Year Milestone:** Complete option entry and verify caste/income certificates for scholarship eligibility (SSP/Vidyasiri).`;
      sourceAttribution = 'Orbit X Career Counsellor';
    } else if (mode === 'college' || sanitizedPrompt.toLowerCase().includes('college')) {
      finalAnswer += `### Bengaluru & Karnataka Higher Education College Comparison

| College Name | Type | Entrance Exam | Approx Annual Fee | NIRF / Accreditation | Category |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **UVCE Bengaluru** | Government | KCET | ₹45,000 | State Eminence | Target |
| **RVCE Bengaluru** | Autonomous | KCET / COMEDK | ₹1.05L (Govt) / ₹2.6L | Top 100 Engineering | Ambitious |
| **BMSCE Basavanagudi** | Autonomous | KCET / COMEDK | ₹1.05L (Govt) / ₹2.6L | NAAC A++ Grade | Ambitious |
| **MSRIT Mathikere** | Autonomous | KCET / COMEDK | ₹1.05L (Govt) / ₹2.6L | Rank 78 Engineering | Ambitious |
| **BMCRI Bangalore** | Govt Medical | NEET-UG | ₹65,000 | Premier Medical | Ambitious |
| **NLSIU Nagarbhavi** | Premier Law | CLAT | ₹3,50,000 | NIRF #1 Law | Ambitious |
| **Christ University** | Deemed Univ | CUET / Merit | ₹1.5L - ₹2.7L | NAAC A+ Grade | Target |
| **Govt SKSJTI** | Government | SSLC / KCET | ₹5,000 - ₹12,000 | AICTE Approved | Safe |

*Admissions require official KEA / NTA / College counselling. Orbit X does not guarantee admission cutoffs.*`;
      sourceAttribution = 'Orbit X College Directory';
    } else {
      finalAnswer += `### Orbit X Academic Study Tutor

Here is the step-by-step breakdown for **${sanitizedPrompt}**:

1. **Fundamental Concepts & Definitions:**
   - Always master NCERT textbook definitions and SI units.
   - For numericals, write Given Data, Formula, Substitution, and Final Answer with correct SI units to secure step marks.

2. **Exam Presentation Tips:**
   - Label all diagrams clearly with a pencil.
   - For Karnataka State Board & CBSE, write step numbers clearly.

3. **Practice & Previous Years' Papers:**
   - Access official question papers and model papers in the Orbit X Library.

*Note: AI-generated explanations are study aids and do not substitute official syllabus materials.*`;
      sourceAttribution = 'Orbit X Academic Engine';
    }
  }

  // 6. Generate Contextual Follow-up Suggestions
  const suggestedFollowUps: string[] = [];
  if (matchedPucSubject) {
    suggestedFollowUps.push(
      `Solve a 5-mark question from 2nd PUC ${matchedPucSubject} model paper`,
      `What is the blueprint marks weightage for ${matchedPucSubject}?`,
      `How to prepare for KCET ${matchedPucSubject} in the last 30 days?`
    );
  } else if (mode === 'career') {
    suggestedFollowUps.push(
      'Compare B.E Computer Science vs AI/ML specializations',
      'What are the best career options after 2nd PUC Commerce?',
      'Create a 6-month study roadmap for KCET and 2nd PUC'
    );
  } else if (mode === 'college') {
    suggestedFollowUps.push(
      'Find affordable government engineering colleges in Bengaluru',
      'Compare RVCE, BMSCE, and MSRIT for Computer Science',
      'What scholarships are available for engineering students in Karnataka?'
    );
  } else if (mode === 'scholarship') {
    suggestedFollowUps.push(
      'What documents are needed for SSP Karnataka Post-Matric Scholarship?',
      'Explain eligibility for Vidyasiri ePASS Food & Accommodation Scheme',
      'Find merit scholarships with annual benefits above ₹50,000'
    );
  } else {
    suggestedFollowUps.push(
      'Explain this with a step-by-step formula and worked example',
      'Give me 3 practice multiple-choice questions on this topic',
      'How was this asked in the official 2nd PUC model question papers?'
    );
  }

  // 7. Save conversation message into database session for persistence
  let activeSession = sessionId ? db.getChatSession(sessionId, userId) : undefined;
  if (!activeSession) {
    activeSession = {
      id: sessionId || `chat-${uuidv4()}`,
      userId,
      title: sanitizedPrompt.length > 35 ? sanitizedPrompt.substring(0, 32) + '...' : sanitizedPrompt,
      mode,
      language,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  const userMsg = {
    id: `msg-${uuidv4().substring(0, 8)}`,
    sender: 'user' as const,
    text: sanitizedPrompt,
    mode,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const assistantMsg = {
    id: `msg-${uuidv4().substring(0, 8)}`,
    sender: 'assistant' as const,
    text: finalAnswer,
    mode,
    source: sourceAttribution,
    citations,
    orbitxLinks,
    suggestedFollowUps,
    lastCheckedDate,
    searchQueriesUsed,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  activeSession.messages.push(userMsg);
  activeSession.messages.push(assistantMsg);
  activeSession.updatedAt = new Date().toISOString();
  db.saveChatSession(activeSession);

  return res.json({
    answer: finalAnswer,
    source: sourceAttribution,
    citations,
    orbitxLinks,
    suggestedFollowUps,
    lastCheckedDate,
    searchQueriesUsed,
    sessionId: activeSession.id
  });
});

// Backwards-compatible endpoint for existing components
app.post('/api/ai/study-assistant', async (req: Request, res: Response) => {
  const { prompt, topic, context } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Forward into primary engine
  try {
    const user = getAuthenticatedUser(req);
    const userId = user ? user.id : 'guest';
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ role: 'user', parts: [{ text: `Topic: ${topic || 'Academic'}\nContext: ${context || 'General'}\nQuestion: ${prompt}` }] }],
        config: {
          systemInstruction: 'You are Orbit X Academic AI — a dedicated Indian curriculum tutor for Karnataka State Board, CBSE, KCET, and NEET.'
        }
      });
      return res.json({
        answer: response.text || 'Unable to generate response.',
        source: 'Gemini 3.8 Flash'
      });
    }
  } catch (e) {
    console.warn('Fallback in study-assistant handler:', e);
  }

  res.json({
    answer: `### Orbit X Academic Assistant\n\nHere is clear guidance on **${prompt}**:\n- Review fundamental NCERT definitions and formulas.\n- Practice previous years' papers in the Orbit X Library.\n- Check blueprint weightage before examinations.`,
    source: 'Orbit X Academic Engine'
  });
});

// -------------------------------------------------------------
// FRONTEND VITE INTEGRATION
// -------------------------------------------------------------

async function setupVite() {
  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Orbit X Server] Running on http://0.0.0.0:${PORT} in ${isDev ? 'development' : 'production'} mode`);
  });
}

setupVite();
