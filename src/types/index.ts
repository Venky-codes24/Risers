export type StoryCategory = 'Student Talent' | 'Student Entrepreneurs';

export interface StudentStory {
  id: string;
  title: string;
  category: StoryCategory;
  studentName: string;
  schoolOrCollege?: string;
  city?: string;
  coverImage: string;
  altText: string;
  shortIntro: string;
  workSummary: string;
  journey: string;
  challenges: string;
  lessons: string;
  relevantLinks?: { label: string; url: string }[];
  publicationDate: string;
  author: string;
  youtubeUrl?: string;
  publicProfileLinks?: { platform: string; url: string }[];
  status: 'draft' | 'published' | 'archived';
  isFeatured?: boolean;
}

export interface StudentRadioEpisode {
  id: string;
  title: string;
  thumbnail: string;
  altText: string;
  youtubeUrl?: string;
  episodeNumber?: number;
  date: string;
  language: string; // e.g. "English", "Telugu", "Bilingual"
  hostOrParticipants?: string;
  summary: string;
  keyPoints?: string[];
  transcriptExcerpt?: string;
  status: 'draft' | 'published' | 'archived';
}

export interface ProfessionalInterview {
  id: string;
  title: string;
  guestName: string;
  guestRole: string;
  organisation: string;
  portrait: string;
  youtubeUrl?: string;
  summary: string;
  studentTakeaways: string[];
  language: string;
  publicationDate: string;
  status: 'draft' | 'published' | 'archived';
}

export type SubmissionCategory = 
  | 'Student Talent' 
  | 'Student Entrepreneur' 
  | 'Student Radio Participation' 
  | 'Professional or Guest Suggestion';

export type SubmissionStatus = 'New' | 'Contacted' | 'Selected' | 'Closed';

export interface GetFeaturedSubmission {
  id: string;
  name: string;
  schoolOrCollege: string;
  category: SubmissionCategory;
  shortDescription: string;
  contactMethod: string;
  city?: string;
  workLink?: string;
  isUnder18: boolean;
  guardianContact?: string;
  consentConfirmed: boolean;
  submittedAt: string;
  status: SubmissionStatus;
  adminNotes?: string;
}

// Future Student News (PRD Section 17 & 29)
export interface StudentNewsItem {
  id: string;
  title: string;
  category: 'achievement' | 'event' | 'competition' | 'scholarship' | 'opportunity';
  publicationDate: string;
  updateDate?: string;
  language: string;
  summary: string;
  sourceLinks: { label: string; url: string }[];
  deadline?: string;
  isExpired?: boolean;
  isSponsored?: boolean;
  status: 'draft' | 'published' | 'archived';
}
