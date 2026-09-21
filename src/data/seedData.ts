import type { StudentStory, StudentRadioEpisode, ProfessionalInterview, GetFeaturedSubmission } from '../types';

export const initialStories: StudentStory[] = [
  {
    id: 'story-ananya-assistive-tech',
    title: 'Building Telugu-Voice Tools for Rural Classrooms: Ananya\'s Journey',
    category: 'Student Talent',
    studentName: 'Ananya Varma',
    schoolOrCollege: 'VNR Vignana Jyothi Institute of Engineering & Technology',
    city: 'Hyderabad',
    coverImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    altText: 'Ananya working on voice-enabled educational software for regional schools',
    shortIntro: 'Third-year student Ananya combined deep speech processing with regional dialects to help primary students learn phonetics in Telugu and English.',
    workSummary: 'Ananya developed "Bala Vani", a lightweight offline web utility designed for low-bandwidth rural government schools. It allows students to practice pronunciation in their mother tongue with visual speech-wave feedback.',
    journey: 'Starting with small open-source contributions in her first semester, Ananya noticed that audio tools in education predominantly focused on standard accents. During weekend outreach sessions in rural districts, she saw firsthand how hesitation with accents affected student confidence. She spent 8 months collecting phoneme sets and testing with teachers.',
    challenges: 'Balancing intensive university coursework with field testing was tough. Hardware limitations on school systems meant heavy neural models could not run locally, pushing Ananya to optimize quantized lightweight models that run directly inside the browser without internet connectivity.',
    lessons: '“Technology is only as smart as the empathy behind it. Building for real classrooms taught me that clarity beats complexity every single time.”',
    relevantLinks: [
      { label: 'GitHub Repository', url: 'https://github.com' },
      { label: 'Project Demonstration', url: 'https://youtube.com' }
    ],
    publicationDate: 'March 14, 2026',
    author: 'RISERS Editorial Team',
    status: 'published',
    isFeatured: true
  },
  {
    id: 'story-karthik-green-pack',
    title: 'From Dorm Experiment to Zero-Waste Campus Delivery: Karthik\'s RePack',
    category: 'Student Entrepreneurs',
    studentName: 'Karthik Rao',
    schoolOrCollege: 'University College of Engineering, Osmania University',
    city: 'Hyderabad',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    altText: 'Karthik demonstrating reusable campus packaging modules',
    shortIntro: 'When Karthik saw mountains of single-use takeaway plastic piling up near campus hostels, he mobilized cafeteria vendors to adopt reusable returnable meal containers.',
    workSummary: 'Karthik founded "RePack Campus", a circular packaging system partnering with 12 food kiosks around the university. Students scan a quick QR to borrow sanitized containers and return them at any drop bin across campus.',
    journey: 'It began with a campus petition that Karthik turned into a viable operational model. Rather than just asking people to be eco-conscious, he made it financially beneficial for cafeteria operators by reducing disposable container procurement costs by 35%.',
    challenges: 'The biggest operational roadblock was inventory loss during the first month. Karthik redesigned the student incentive structure, introducing a point-based cafeteria credit for timely container drop-offs.',
    lessons: '“A business idea succeeds when you solve the vendor’s problem first. The green impact follows naturally when the unit economics work.”',
    relevantLinks: [
      { label: 'Venture Showcase', url: 'https://risers.org' }
    ],
    publicationDate: 'March 08, 2026',
    author: 'RISERS Editorial Team',
    status: 'published',
    isFeatured: false
  }
];

export const initialEpisodes: StudentRadioEpisode[] = [
  {
    id: 'sr-ep-01',
    title: 'Finding Your Rhythm: Balancing Academics and Creative Passions',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
    altText: 'Student Radio studio recording microphone and headphones',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    episodeNumber: 1,
    date: 'March 18, 2026',
    language: 'Telugu & English (Bilingual)',
    hostOrParticipants: 'Varun (Host) with student creator Shruti',
    summary: 'In this pilot episode of RISERS Student Radio, we explore how students manage their personal creative output alongside rigorous university examination schedules without burnout.',
    keyPoints: [
      'The myth of having "enough free time" vs. intentional time-blocking',
      'How to explain non-traditional student projects to parents and faculty',
      'Why shipping imperfect student projects early accelerates learning'
    ],
    transcriptExcerpt: '“When you are in college, your biggest currency isn’t capital—it’s the permission to make mistakes in public and learn openly.”',
    status: 'published'
  }
];

export const initialInterviews: ProfessionalInterview[] = [
  {
    id: 'interview-dr-suresh-career-foundations',
    title: 'Navigating Early Careers: From Textbook Knowledge to Industry Impact',
    guestName: 'Dr. Suresh Rayapati',
    guestRole: 'VP of Engineering & Student Mentor',
    organisation: 'CloudScale Technologies & Advisor to Root & Rise Learning',
    portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    summary: 'Dr. Suresh shares 22 years of perspective on how hiring managers evaluate student portfolios, why authentic curiosity beats memorized frameworks, and how students can build proof-of-work before graduation.',
    studentTakeaways: [
      'Focus on depth in one demonstrable project rather than having ten superficial repos on your GitHub.',
      'Learn to write clear documentation; engineers who communicate their reasoning get noticed fastest.',
      'Seek mentors by showing what you have already tried, not by asking generic questions.',
      'Treat setbacks in college hackathons as dry-runs for real engineering troubleshooting.'
    ],
    language: 'English',
    publicationDate: 'March 10, 2026',
    status: 'published'
  }
];

export const initialSubmissions: GetFeaturedSubmission[] = [
  {
    id: 'sub-demo-01',
    name: 'Meghana Reddy',
    schoolOrCollege: 'Hyderabad Central University',
    category: 'Student Talent',
    shortDescription: 'I compose classical Carnatic fusions with digital synthesizers and perform youth cultural concerts across Telangana.',
    contactMethod: 'meghana.reddy@example.edu / +91 98765 43210',
    city: 'Hyderabad',
    workLink: 'https://soundcloud.com/meghana-music',
    isUnder18: false,
    consentConfirmed: true,
    submittedAt: '2026-03-17T10:30:00Z',
    status: 'New',
    adminNotes: 'Reviewed portfolio track. Excellent candidate for Student Stories or Student Radio interview.'
  }
];
