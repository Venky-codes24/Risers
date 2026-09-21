import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Plus, Edit2, Trash2, Eye, EyeOff, Download, Upload, 
  CheckCircle, User, Radio, 
  FileText, Video, MessageSquare, RotateCcw, Sparkles,
  Lock, LogOut, ExternalLink, GraduationCap, MapPin, Calendar, CheckCheck, ArrowRight
} from 'lucide-react';
import { ContentStore } from '../services/contentStore';
import type { StudentStory, StudentRadioEpisode, ProfessionalInterview, GetFeaturedSubmission } from '../types';

type AdminTab = 'stories' | 'episodes' | 'interviews' | 'submissions' | 'settings' | 'future-news';
export type ArticleCategory = 'Student Stories' | 'Student Radio' | 'Professional Interviews';

export const AdminCmsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    const tabParam = searchParams.get('tab') as AdminTab;
    if (tabParam && ['stories', 'episodes', 'interviews', 'submissions', 'settings', 'future-news'].includes(tabParam)) {
      return tabParam;
    }
    return 'submissions'; // Default to 'submissions' so newly filled user proposals are immediately visible!
  });
  const [userRole, setUserRole] = useState<'Owner' | 'Editor'>('Owner');

  // Admin Login State (Secured via .env backend & JWT)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return ContentStore.isAuthenticated();
  });
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRefreshingSubmissions, setIsRefreshingSubmissions] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both username and password.');
      return;
    }
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const result = await ContentStore.adminLogin(loginUsername.trim(), loginPassword);
      if (result.success) {
        setIsAuthenticated(true);
        showNotice('Logged in securely as Administrator.');
        refreshAll();
      } else {
        setLoginError(result.error || 'Invalid admin credentials.');
      }
    } catch {
      setLoginError('Could not reach authentication server.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await ContentStore.adminLogout();
    setIsAuthenticated(false);
    showNotice('Logged out successfully.');
  };
  
  // Data states
  const [stories, setStories] = useState<StudentStory[]>(ContentStore.getAllStories());
  const [episodes, setEpisodes] = useState<StudentRadioEpisode[]>(ContentStore.getAllEpisodes());
  const [interviews, setInterviews] = useState<ProfessionalInterview[]>(ContentStore.getAllInterviews());
  const [submissions, setSubmissions] = useState<GetFeaturedSubmission[]>(ContentStore.getSubmissions());
  const [settings, setSettings] = useState(ContentStore.getSettings());

  // Message banner with link support
  const [notice, setNotice] = useState<{ text: string; link?: string; linkText?: string } | null>(null);

  const showNotice = (text: string, link?: string, linkText?: string) => {
    setNotice({ text, link, linkText });
    setTimeout(() => setNotice(null), 6000);
  };

  // Article Creation & Destination State
  const [isCreatingArticle, setIsCreatingArticle] = useState(false);
  const [articleDestination, setArticleDestination] = useState<ArticleCategory>('Student Stories');

  const getInitialStory = (): StudentStory => ({
    id: `story-${Date.now()}`,
    title: '',
    category: 'Student Talent',
    studentName: '',
    schoolOrCollege: '',
    city: '',
    coverImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    altText: 'Student portrait or project view',
    shortIntro: '',
    workSummary: '',
    journey: '',
    challenges: '',
    lessons: '',
    publicationDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    author: 'RISERS Editorial Team',
    status: 'published',
    isFeatured: false
  });

  const getInitialEpisode = (): StudentRadioEpisode => ({
    id: `sr-ep-${Date.now()}`,
    title: '',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
    altText: 'Student Radio studio microphone',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    episodeNumber: episodes.length + 1,
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    language: 'Telugu & English (Bilingual)',
    hostOrParticipants: '',
    summary: '',
    keyPoints: ['Key takeaway 1', 'Key takeaway 2'],
    transcriptExcerpt: '',
    status: 'published'
  });

  const getInitialInterview = (): ProfessionalInterview => ({
    id: `interview-${Date.now()}`,
    title: '',
    guestName: '',
    guestRole: '',
    organisation: '',
    portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    summary: '',
    studentTakeaways: ['Focus on proof-of-work', 'Learn clear communication'],
    language: 'English',
    publicationDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    status: 'published'
  });

  // Story Form State
  const [editingStory, setEditingStory] = useState<StudentStory | null>(null);
  const [isNewStory, setIsNewStory] = useState(false);

  // Episode Form State
  const [editingEpisode, setEditingEpisode] = useState<StudentRadioEpisode | null>(null);
  const [isNewEpisode, setIsNewEpisode] = useState(false);

  // Interview Form State
  const [editingInterview, setEditingInterview] = useState<ProfessionalInterview | null>(null);
  const [isNewInterview, setIsNewInterview] = useState(false);

  // Handler to open create article flow with destination
  const handleStartCreateArticle = (presetCategory: ArticleCategory = 'Student Stories') => {
    setIsCreatingArticle(true);
    setArticleDestination(presetCategory);
    if (presetCategory === 'Student Stories') {
      setActiveTab('stories');
      setIsNewStory(true);
      setIsNewEpisode(false);
      setIsNewInterview(false);
      setEditingStory(getInitialStory());
      setEditingEpisode(null);
      setEditingInterview(null);
    } else if (presetCategory === 'Student Radio') {
      setActiveTab('episodes');
      setIsNewEpisode(true);
      setIsNewStory(false);
      setIsNewInterview(false);
      setEditingEpisode(getInitialEpisode());
      setEditingStory(null);
      setEditingInterview(null);
    } else if (presetCategory === 'Professional Interviews') {
      setActiveTab('interviews');
      setIsNewInterview(true);
      setIsNewStory(false);
      setIsNewEpisode(false);
      setEditingInterview(getInitialInterview());
      setEditingStory(null);
      setEditingEpisode(null);
    }
  };

  // Handler to switch category destination inside creation form
  const handleDestinationChange = (newDest: ArticleCategory) => {
    setArticleDestination(newDest);
    const currentTitle = editingStory?.title || editingEpisode?.title || editingInterview?.title || '';
    if (newDest === 'Student Stories') {
      setActiveTab('stories');
      setIsNewStory(true);
      setIsNewEpisode(false);
      setIsNewInterview(false);
      setEditingStory({
        ...getInitialStory(),
        title: currentTitle
      });
      setEditingEpisode(null);
      setEditingInterview(null);
    } else if (newDest === 'Student Radio') {
      setActiveTab('episodes');
      setIsNewEpisode(true);
      setIsNewStory(false);
      setIsNewInterview(false);
      setEditingEpisode({
        ...getInitialEpisode(),
        title: currentTitle
      });
      setEditingStory(null);
      setEditingInterview(null);
    } else if (newDest === 'Professional Interviews') {
      setActiveTab('interviews');
      setIsNewInterview(true);
      setIsNewStory(false);
      setIsNewEpisode(false);
      setEditingInterview({
        ...getInitialInterview(),
        title: currentTitle
      });
      setEditingStory(null);
      setEditingEpisode(null);
    }
  };

  // Submission Filter
  const [submissionFilter, setSubmissionFilter] = useState<'All' | 'New' | 'Contacted' | 'Selected' | 'Closed'>('All');

  const refreshAll = async () => {
    setStories(ContentStore.getAllStories());
    setEpisodes(ContentStore.getAllEpisodes());
    setInterviews(ContentStore.getAllInterviews());
    setSubmissions(ContentStore.getSubmissions());
    setSettings(ContentStore.getSettings());

    try {
      const freshSubs = await ContentStore.fetchSubmissions();
      setSubmissions(freshSubs);
      const [freshStories, freshEpisodes, freshInterviews, freshSettings] = await Promise.all([
        ContentStore.fetchAllStoriesFromServer(),
        ContentStore.fetchAllEpisodesFromServer(),
        ContentStore.fetchAllInterviewsFromServer(),
        ContentStore.fetchSettings()
      ]);
      setStories(freshStories);
      setEpisodes(freshEpisodes);
      setInterviews(freshInterviews);
      setSettings(freshSettings);
    } catch (err) {
      console.warn('Sync notice:', err);
    }
  };

  const refreshSubmissionsOnly = async () => {
    setIsRefreshingSubmissions(true);
    try {
      const freshSubs = await ContentStore.fetchSubmissions();
      setSubmissions(freshSubs);
      showNotice('Submissions synced with PostgreSQL.');
    } catch {
      showNotice('Failed to refresh submissions.');
    } finally {
      setIsRefreshingSubmissions(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshAll();

      // Automatically sync new submissions from PostgreSQL every 4 seconds
      const pollInterval = setInterval(() => {
        ContentStore.fetchSubmissions().then(freshSubs => {
          setSubmissions(freshSubs);
        });
      }, 4000);

      return () => clearInterval(pollInterval);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeTab === 'submissions' && isAuthenticated) {
      refreshSubmissionsOnly();
    }
  }, [activeTab]);

  // Story Operations
  const handleSaveStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;
    ContentStore.saveStory(editingStory);
    refreshAll();
    const wasPublished = editingStory.status === 'published';
    setEditingStory(null);
    setIsNewStory(false);
    setIsCreatingArticle(false);
    if (wasPublished) {
      showNotice('Article published to Student Stories! Visible to users.', '/stories', 'View Live on /#/stories');
    } else {
      showNotice('Story saved as draft (hidden from public users).');
    }
  };

  const handleDeleteStory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      ContentStore.deleteStory(id);
      refreshAll();
      showNotice('Story deleted.');
    }
  };

  const handleToggleStoryStatus = (story: StudentStory) => {
    const nextStatus = story.status === 'published' ? 'draft' : 'published';
    const updated = { ...story, status: nextStatus as StudentStory['status'] };
    ContentStore.saveStory(updated);
    refreshAll();
    showNotice(`Story is now ${nextStatus}.`);
  };

  // Episode Operations
  const handleSaveEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEpisode) return;
    ContentStore.saveEpisode(editingEpisode);
    refreshAll();
    const wasPublished = editingEpisode.status === 'published';
    setEditingEpisode(null);
    setIsNewEpisode(false);
    setIsCreatingArticle(false);
    if (wasPublished) {
      showNotice('Article published to Student Radio! Visible to users.', '/radio', 'View Live on /#/radio');
    } else {
      showNotice('Episode saved as draft (hidden from public users).');
    }
  };

  const handleDeleteEpisode = (id: string) => {
    if (window.confirm('Delete this Student Radio episode?')) {
      ContentStore.deleteEpisode(id);
      refreshAll();
      showNotice('Episode deleted.');
    }
  };

  const handleToggleEpisodeStatus = (ep: StudentRadioEpisode) => {
    const nextStatus = ep.status === 'published' ? 'draft' : 'published';
    ContentStore.saveEpisode({ ...ep, status: nextStatus as StudentRadioEpisode['status'] });
    refreshAll();
    showNotice(`Episode is now ${nextStatus}.`);
  };

  // Interview Operations
  const handleSaveInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInterview) return;
    ContentStore.saveInterview(editingInterview);
    refreshAll();
    const wasPublished = editingInterview.status === 'published';
    setEditingInterview(null);
    setIsNewInterview(false);
    setIsCreatingArticle(false);
    if (wasPublished) {
      showNotice('Article published to Professional Interviews! Visible to users.', '/interviews', 'View Live on /#/interviews');
    } else {
      showNotice('Interview saved as draft (hidden from public users).');
    }
  };

  const handleDeleteInterview = (id: string) => {
    if (window.confirm('Delete this interview?')) {
      ContentStore.deleteInterview(id);
      refreshAll();
      showNotice('Interview deleted.');
    }
  };

  const handleToggleInterviewStatus = (i: ProfessionalInterview) => {
    const nextStatus = i.status === 'published' ? 'draft' : 'published';
    ContentStore.saveInterview({ ...i, status: nextStatus as ProfessionalInterview['status'] });
    refreshAll();
    showNotice(`Interview is now ${nextStatus}.`);
  };

  // Submission Operations
  const handleUpdateSubmission = async (id: string, status: GetFeaturedSubmission['status']) => {
    await ContentStore.updateSubmissionStatus(id, status);
    refreshAll();
    showNotice(`Submission updated to ${status}.`);
  };

  const handleDeleteSubmission = async (id: string) => {
    if (window.confirm('Permanently delete this submission record from database?')) {
      await ContentStore.deleteSubmission(id);
      refreshAll();
      showNotice('Submission removed from database.');
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'School/College', 'Category', 'City', 'Contact Method', 'Under 18', 'Guardian Contact', 'Status', 'Submitted At', 'Description'];
    const rows = submissions.map(s => [
      s.id,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.schoolOrCollege.replace(/"/g, '""')}"`,
      s.category,
      `"${(s.city || '').replace(/"/g, '""')}"`,
      `"${s.contactMethod.replace(/"/g, '""')}"`,
      s.isUnder18 ? 'Yes' : 'No',
      `"${(s.guardianContact || '').replace(/"/g, '""')}"`,
      s.status,
      s.submittedAt,
      `"${s.shortDescription.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `risers_submissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotice('Submissions exported to CSV.');
  };

  // Settings & Backup
  const handleToggleRadioComingSoon = () => {
    const updated = { ...settings, forceRadioComingSoon: !settings.forceRadioComingSoon };
    ContentStore.saveSettings(updated);
    setSettings(updated);
    showNotice(updated.forceRadioComingSoon ? 'Homepage Student Radio set to "Coming Soon" fallback.' : 'Homepage Student Radio displaying latest episode.');
  };

  const handleSetFeaturedStory = (id: string) => {
    const updated = { ...settings, featuredStudentStoryId: id };
    ContentStore.saveSettings(updated);
    setSettings(updated);
    showNotice('Featured student story updated.');
  };

  const handleExportJSON = () => {
    const jsonStr = ContentStore.exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `risers_cms_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotice('Database backup exported.');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = ContentStore.importDatabaseJSON(content);
      if (success) {
        refreshAll();
        showNotice('Database successfully restored from backup.');
      } else {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all CMS content to original initial seed data? Any new entries will be overwritten.')) {
      ContentStore.resetDefaults();
      refreshAll();
      showNotice('Reset to initial starter content.');
    }
  };

  if (!isAuthenticated) {
    return (
      <main id="main-content" className="section" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        <div className="container" style={{ maxWidth: '460px' }}>
          <div className="form-card" style={{ boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-subtle)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', border: '1px solid var(--border-subtle)' }}>
                <Lock size={22} color="var(--accent-primary)" />
              </div>
              <span className="section-kicker">Secure Editorial Desk</span>
              <h1 className="section-title" style={{ fontSize: '1.8rem', margin: '6px 0' }}>
                Admin Login
              </h1>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Sign in to manage and publish articles to Student Stories, Student Radio, and Professional Interviews.
              </p>
            </div>

            {loginError && (
              <div style={{ background: '#FDE8E8', border: '1px solid #F98080', color: '#9B1C1C', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.85rem' }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Username / Email *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={loginUsername} 
                  onChange={e => setLoginUsername(e.target.value)} 
                  required 
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={loginPassword} 
                  onChange={e => setLoginPassword(e.target.value)} 
                  required 
                />
              </div>


              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={isLoggingIn}
              >
                <span>{isLoggingIn ? 'Authenticating...' : 'Sign In to Admin Dashboard'}</span>
              </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'underline' }}>
                ← Return to Public Website
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="section" style={{ paddingTop: '32px' }}>
      <div className="container">
        {/* Admin Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px' }}>
          <div>
            <span className="section-kicker">Private Editorial Administration</span>
            <h1 className="section-title" style={{ fontSize: '2rem', margin: '4px 0' }}>
              RISERS Content Desk
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              No-code publishing, submission moderation, and homepage curation.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => handleStartCreateArticle('Student Stories')}
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} />
              <span>Create Article</span>
            </button>


            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-subtle)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
              <User size={15} color="var(--accent-primary)" />
              <span>Role: <strong>{userRole}</strong></span>
              <button 
                onClick={() => setUserRole(userRole === 'Owner' ? 'Editor' : 'Owner')} 
                style={{ marginLeft: '8px', background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Switch
              </button>
            </div>

            <Link to="/" className="btn btn-secondary btn-sm">
              <span>View Public Site</span>
            </Link>

            <button 
              onClick={handleLogout}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#DC2626' }}
              title="Logout of Admin Desk"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Notice Notification */}
        {notice && (
          <div style={{ background: '#DEF7EC', border: '1px solid #31C48D', color: '#03543F', padding: '12px 20px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontWeight: 600, fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={18} />
              <span>{notice.text}</span>
            </div>
            {notice.link && (
              <Link to={notice.link} className="btn btn-primary btn-sm" style={{ padding: '4px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>{notice.linkText || 'View Live'}</span>
                <ExternalLink size={13} />
              </Link>
            )}
          </div>
        )}

        {/* Highlight Banner When New Get Featured Submissions Are Waiting */}
        {submissions.filter(s => s.status === 'New').length > 0 && activeTab !== 'submissions' && (
          <div style={{ background: '#EEF2FF', border: '2px solid #818CF8', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#4F46E5', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MessageSquare size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '1rem', color: '#1E1B4B', display: 'block' }}>
                  {submissions.filter(s => s.status === 'New').length} New Get Featured Submission(s) Received from Website!
                </strong>
                <span style={{ fontSize: '0.86rem', color: '#4338CA' }}>
                  Latest submission from <strong>{submissions[0]?.name}</strong> ({submissions[0]?.schoolOrCollege || 'Student'}, {submissions[0]?.city || ''})
                </span>
              </div>
            </div>
            <button 
              onClick={() => { setActiveTab('submissions'); setSubmissionFilter('All'); }}
              className="btn btn-primary btn-sm"
              style={{ background: '#4F46E5', borderColor: '#4F46E5', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>View User Submissions</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Tab Navigation (Responsive Horizontal Scroll) */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--border-subtle)', marginBottom: '32px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '6px', scrollbarWidth: 'thin' }}>
          <button 
            onClick={() => { setActiveTab('stories'); setEditingStory(null); }}
            className={`btn btn-sm ${activeTab === 'stories' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
          >
            <FileText size={15} />
            <span>Student Stories ({stories.length})</span>
          </button>

          <button 
            onClick={() => { setActiveTab('episodes'); setEditingEpisode(null); }}
            className={`btn btn-sm ${activeTab === 'episodes' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
          >
            <Radio size={15} />
            <span>Student Radio ({episodes.length})</span>
          </button>

          <button 
            onClick={() => { setActiveTab('interviews'); setEditingInterview(null); }}
            className={`btn btn-sm ${activeTab === 'interviews' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
          >
            <Video size={15} />
            <span>Interviews ({interviews.length})</span>
          </button>

          <button 
            onClick={() => setActiveTab('submissions')}
            className={`btn btn-sm ${activeTab === 'submissions' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
          >
            <MessageSquare size={15} />
            <span>Submissions ({submissions.filter(s => s.status === 'New').length} new)</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`btn btn-sm ${activeTab === 'settings' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
          >
            <span>Homepage & Backup</span>
          </button>

          <button 
            onClick={() => setActiveTab('future-news')}
            className={`btn btn-sm ${activeTab === 'future-news' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ opacity: 0.8, flexShrink: 0, whiteSpace: 'nowrap' }}
          >
            <span>Future News (Prepared)</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: STORIES */}
        {/* ========================================================= */}
        {activeTab === 'stories' && (
          <div>
            {!editingStory ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.4rem' }}>Manage Student Stories</h2>
                  <button 
                    onClick={() => handleStartCreateArticle('Student Stories')}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus size={16} />
                    <span>Create New Story</span>
                  </button>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                      <tr>
                        <th style={{ padding: '12px 16px' }}>Student & Title</th>
                        <th style={{ padding: '12px 16px' }}>Category</th>
                        <th style={{ padding: '12px 16px' }}>Status</th>
                        <th style={{ padding: '12px 16px' }}>Date</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stories.map(s => (
                        <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <strong>{s.studentName}</strong>
                            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{s.title}</div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span className={`badge ${s.category === 'Student Talent' ? 'badge-talent' : 'badge-entrepreneur'}`}>
                              {s.category}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ 
                              padding: '2px 8px', 
                              borderRadius: '4px', 
                              fontSize: '0.75rem', 
                              fontWeight: 700,
                              background: s.status === 'published' ? '#DEF7EC' : '#FEF08A',
                              color: s.status === 'published' ? '#03543F' : '#854D0E'
                            }}>
                              {s.status.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                            {s.publicationDate}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              <button 
                                onClick={() => handleToggleStoryStatus(s)}
                                className="btn btn-secondary btn-sm"
                                title={s.status === 'published' ? 'Unpublish' : 'Publish'}
                              >
                                {s.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                              <button 
                                onClick={() => { setIsNewStory(false); setEditingStory({ ...s }); }}
                                className="btn btn-secondary btn-sm"
                                title="Edit Story"
                              >
                                <Edit2 size={14} />
                              </button>
                              {userRole === 'Owner' && (
                                <button 
                                  onClick={() => handleDeleteStory(s.id)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ color: '#DC2626' }}
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
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
            ) : (
              /* Story Edit/Create Form */
              <div className="form-card">
                <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>
                  {isNewStory ? 'Create Article → Student Stories' : `Edit Story: ${editingStory.studentName}`}
                </h2>
                <form onSubmit={handleSaveStory}>
                  {(isNewStory || isCreatingArticle) && (
                    <div className="form-group" style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
                      <label className="form-label" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                        Where does this article belong? (Select Category / Section) *
                      </label>
                      <select 
                        className="form-select" 
                        value={articleDestination} 
                        onChange={e => handleDestinationChange(e.target.value as ArticleCategory)}
                        style={{ fontWeight: 600, fontSize: '0.95rem' }}
                      >
                        <option value="Student Stories">1. Student Stories → /#/stories</option>
                        <option value="Student Radio">2. Student Radio → /#/radio</option>
                        <option value="Professional Interviews">3. Professional Interviews → /#/interviews</option>
                      </select>
                      <span className="form-hint" style={{ marginTop: '4px', display: 'block' }}>
                        The article will be saved to the database and will appear on <code>/#/stories</code> once published.
                      </span>
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Student Name *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={editingStory.studentName} 
                        onChange={e => setEditingStory({ ...editingStory, studentName: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select 
                        className="form-select"
                        value={editingStory.category}
                        onChange={e => setEditingStory({ ...editingStory, category: e.target.value as any })}
                      >
                        <option value="Student Talent">Student Talent</option>
                        <option value="Student Entrepreneurs">Student Entrepreneurs</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Story Headline / Title *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={editingStory.title} 
                      onChange={e => setEditingStory({ ...editingStory, title: e.target.value })} 
                      required 
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">School / College</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={editingStory.schoolOrCollege || ''} 
                        onChange={e => setEditingStory({ ...editingStory, schoolOrCollege: e.target.value })} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={editingStory.city || ''} 
                        onChange={e => setEditingStory({ ...editingStory, city: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cover Image URL *</label>
                    <input 
                      type="url" 
                      className="form-input" 
                      value={editingStory.coverImage} 
                      onChange={e => setEditingStory({ ...editingStory, coverImage: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Alt Text (Image Accessibility) *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={editingStory.altText} 
                      onChange={e => setEditingStory({ ...editingStory, altText: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Short Introduction (Excerpt) *</label>
                    <textarea 
                      rows={2} 
                      className="form-textarea" 
                      value={editingStory.shortIntro} 
                      onChange={e => setEditingStory({ ...editingStory, shortIntro: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">The Work / Project Details *</label>
                    <textarea 
                      rows={4} 
                      className="form-textarea" 
                      value={editingStory.workSummary} 
                      onChange={e => setEditingStory({ ...editingStory, workSummary: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">The Journey *</label>
                    <textarea 
                      rows={3} 
                      className="form-textarea" 
                      value={editingStory.journey} 
                      onChange={e => setEditingStory({ ...editingStory, journey: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Challenges & Lessons *</label>
                    <textarea 
                      rows={3} 
                      className="form-textarea" 
                      value={editingStory.challenges} 
                      onChange={e => setEditingStory({ ...editingStory, challenges: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Key Lessons Quote</label>
                    <textarea 
                      rows={2} 
                      className="form-textarea" 
                      value={editingStory.lessons} 
                      onChange={e => setEditingStory({ ...editingStory, lessons: e.target.value })} 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Optional YouTube Video Link</label>
                    <input 
                      type="url" 
                      className="form-input" 
                      value={editingStory.youtubeUrl || ''} 
                      onChange={e => setEditingStory({ ...editingStory, youtubeUrl: e.target.value })} 
                      placeholder="https://www.youtube.com/watch?v=..." 
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '24px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Publishing Status *</label>
                      <select 
                        className="form-select"
                        value={editingStory.status}
                        onChange={e => setEditingStory({ ...editingStory, status: e.target.value as any })}
                      >
                        <option value="published">Published (Visible to all users on /#/stories)</option>
                        <option value="draft">Draft (Private, not public)</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ margin: 0, display: 'flex', alignItems: 'center', paddingTop: '20px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={!!editingStory.isFeatured}
                          onChange={e => setEditingStory({ ...editingStory, isFeatured: e.target.checked })} 
                        />
                        <span>Feature on Homepage</span>
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn btn-primary">
                      <span>{editingStory.status === 'published' ? 'Publish & Save Article' : 'Save Story Draft'}</span>
                    </button>
                    <button type="button" onClick={() => { setEditingStory(null); setIsNewStory(false); setIsCreatingArticle(false); }} className="btn btn-secondary">
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: STUDENT RADIO */}
        {/* ========================================================= */}
        {activeTab === 'episodes' && (
          <div>
            {!editingEpisode ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.4rem' }}>Student Radio Editorial Programme</h2>
                  <button 
                    onClick={() => handleStartCreateArticle('Student Radio')}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus size={16} />
                    <span>Create New Episode</span>
                  </button>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                      <tr>
                        <th style={{ padding: '12px 16px' }}>Ep # & Title</th>
                        <th style={{ padding: '12px 16px' }}>Language</th>
                        <th style={{ padding: '12px 16px' }}>Status</th>
                        <th style={{ padding: '12px 16px' }}>Date</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {episodes.map(ep => (
                        <tr key={ep.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <strong>Ep {ep.episodeNumber || 1}: {ep.title}</strong>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{ep.hostOrParticipants}</div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>{ep.language}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ 
                              padding: '2px 8px', 
                              borderRadius: '4px', 
                              fontSize: '0.75rem', 
                              fontWeight: 700,
                              background: ep.status === 'published' ? '#DEF7EC' : '#FEF08A',
                              color: ep.status === 'published' ? '#03543F' : '#854D0E'
                            }}>
                              {ep.status.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{ep.date}</td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              <button 
                                onClick={() => handleToggleEpisodeStatus(ep)}
                                className="btn btn-secondary btn-sm"
                                title={ep.status === 'published' ? 'Unpublish' : 'Publish'}
                              >
                                {ep.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                              <button 
                                onClick={() => { setIsNewEpisode(false); setEditingEpisode({ ...ep }); }}
                                className="btn btn-secondary btn-sm"
                                title="Edit"
                              >
                                <Edit2 size={14} />
                              </button>
                              {userRole === 'Owner' && (
                                <button 
                                  onClick={() => handleDeleteEpisode(ep.id)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ color: '#DC2626' }}
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
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
            ) : (
              /* Episode Edit Form */
              <div className="form-card">
                <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>
                  {isNewEpisode ? 'Create Article → Student Radio' : `Edit Episode: ${editingEpisode.title}`}
                </h2>
                <form onSubmit={handleSaveEpisode}>
                  {(isNewEpisode || isCreatingArticle) && (
                    <div className="form-group" style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
                      <label className="form-label" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                        Where does this article belong? (Select Category / Section) *
                      </label>
                      <select 
                        className="form-select" 
                        value={articleDestination} 
                        onChange={e => handleDestinationChange(e.target.value as ArticleCategory)}
                        style={{ fontWeight: 600, fontSize: '0.95rem' }}
                      >
                        <option value="Student Stories">1. Student Stories → /#/stories</option>
                        <option value="Student Radio">2. Student Radio → /#/radio</option>
                        <option value="Professional Interviews">3. Professional Interviews → /#/interviews</option>
                      </select>
                      <span className="form-hint" style={{ marginTop: '4px', display: 'block' }}>
                        The article will be saved to the database and will appear on <code>/#/radio</code> once published.
                      </span>
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Ep Number</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        value={editingEpisode.episodeNumber || 1} 
                        onChange={e => setEditingEpisode({ ...editingEpisode, episodeNumber: parseInt(e.target.value) || 1 })} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Episode Title *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={editingEpisode.title} 
                        onChange={e => setEditingEpisode({ ...editingEpisode, title: e.target.value })} 
                        required 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Host / Participants</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={editingEpisode.hostOrParticipants || ''} 
                        onChange={e => setEditingEpisode({ ...editingEpisode, hostOrParticipants: e.target.value })} 
                        placeholder="e.g. Varun (Host) with student creator Ananya" 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Language Label *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={editingEpisode.language} 
                        onChange={e => setEditingEpisode({ ...editingEpisode, language: e.target.value })} 
                        placeholder="Telugu, English, Bilingual" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">YouTube Video URL *</label>
                    <input 
                      type="url" 
                      className="form-input" 
                      value={editingEpisode.youtubeUrl || ''} 
                      onChange={e => setEditingEpisode({ ...editingEpisode, youtubeUrl: e.target.value })} 
                      placeholder="https://www.youtube.com/watch?v=..." 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Thumbnail Image URL *</label>
                    <input 
                      type="url" 
                      className="form-input" 
                      value={editingEpisode.thumbnail} 
                      onChange={e => setEditingEpisode({ ...editingEpisode, thumbnail: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Episode Summary *</label>
                    <textarea 
                      rows={3} 
                      className="form-textarea" 
                      value={editingEpisode.summary} 
                      onChange={e => setEditingEpisode({ ...editingEpisode, summary: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Publishing Status *</label>
                    <select 
                      className="form-select"
                      value={editingEpisode.status}
                      onChange={e => setEditingEpisode({ ...editingEpisode, status: e.target.value as any })}
                    >
                      <option value="published">Published (Visible to all users on /#/radio)</option>
                      <option value="draft">Draft (Private, hidden from public)</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn btn-primary">
                      <span>{editingEpisode.status === 'published' ? 'Publish & Save Article' : 'Save Episode Draft'}</span>
                    </button>
                    <button type="button" onClick={() => { setEditingEpisode(null); setIsNewEpisode(false); setIsCreatingArticle(false); }} className="btn btn-secondary">
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PROFESSIONAL INTERVIEWS */}
        {/* ========================================================= */}
        {activeTab === 'interviews' && (
          <div>
            {!editingInterview ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.4rem' }}>Professional Mentorship Interviews</h2>
                  <button 
                    onClick={() => handleStartCreateArticle('Professional Interviews')}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus size={16} />
                    <span>Create Interview</span>
                  </button>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                      <tr>
                        <th style={{ padding: '12px 16px' }}>Guest & Title</th>
                        <th style={{ padding: '12px 16px' }}>Role / Org</th>
                        <th style={{ padding: '12px 16px' }}>Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interviews.map(inv => (
                        <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <strong>{inv.guestName}</strong>
                            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{inv.title}</div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div>{inv.guestRole}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inv.organisation}</div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ 
                              padding: '2px 8px', 
                              borderRadius: '4px', 
                              fontSize: '0.75rem', 
                              fontWeight: 700,
                              background: inv.status === 'published' ? '#DEF7EC' : '#FEF08A',
                              color: inv.status === 'published' ? '#03543F' : '#854D0E'
                            }}>
                              {inv.status.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              <button 
                                onClick={() => handleToggleInterviewStatus(inv)}
                                className="btn btn-secondary btn-sm"
                                title={inv.status === 'published' ? 'Unpublish' : 'Publish'}
                              >
                                {inv.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                              <button 
                                onClick={() => { setIsNewInterview(false); setEditingInterview({ ...inv }); }}
                                className="btn btn-secondary btn-sm"
                                title="Edit"
                              >
                                <Edit2 size={14} />
                              </button>
                              {userRole === 'Owner' && (
                                <button 
                                  onClick={() => handleDeleteInterview(inv.id)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ color: '#DC2626' }}
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
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
            ) : (
              /* Interview Edit Form */
              <div className="form-card">
                <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>
                  {isNewInterview ? 'Create Article → Professional Interviews' : `Edit Interview: ${editingInterview.guestName}`}
                </h2>
                <form onSubmit={handleSaveInterview}>
                  {(isNewInterview || isCreatingArticle) && (
                    <div className="form-group" style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
                      <label className="form-label" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                        Where does this article belong? (Select Category / Section) *
                      </label>
                      <select 
                        className="form-select" 
                        value={articleDestination} 
                        onChange={e => handleDestinationChange(e.target.value as ArticleCategory)}
                        style={{ fontWeight: 600, fontSize: '0.95rem' }}
                      >
                        <option value="Student Stories">1. Student Stories → /#/stories</option>
                        <option value="Student Radio">2. Student Radio → /#/radio</option>
                        <option value="Professional Interviews">3. Professional Interviews → /#/interviews</option>
                      </select>
                      <span className="form-hint" style={{ marginTop: '4px', display: 'block' }}>
                        The article will be saved to the database and will appear on <code>/#/interviews</code> once published.
                      </span>
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Guest Name *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={editingInterview.guestName} 
                        onChange={e => setEditingInterview({ ...editingInterview, guestName: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Guest Role / Title *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={editingInterview.guestRole} 
                        onChange={e => setEditingInterview({ ...editingInterview, guestRole: e.target.value })} 
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Organisation / Affiliation *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={editingInterview.organisation} 
                      onChange={e => setEditingInterview({ ...editingInterview, organisation: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Interview Headline *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={editingInterview.title} 
                      onChange={e => setEditingInterview({ ...editingInterview, title: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Portrait Image URL *</label>
                    <input 
                      type="url" 
                      className="form-input" 
                      value={editingInterview.portrait} 
                      onChange={e => setEditingInterview({ ...editingInterview, portrait: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">YouTube Video URL</label>
                    <input 
                      type="url" 
                      className="form-input" 
                      value={editingInterview.youtubeUrl || ''} 
                      onChange={e => setEditingInterview({ ...editingInterview, youtubeUrl: e.target.value })} 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Interview Summary *</label>
                    <textarea 
                      rows={3} 
                      className="form-textarea" 
                      value={editingInterview.summary} 
                      onChange={e => setEditingInterview({ ...editingInterview, summary: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Publishing Status *</label>
                    <select 
                      className="form-select"
                      value={editingInterview.status}
                      onChange={e => setEditingInterview({ ...editingInterview, status: e.target.value as any })}
                    >
                      <option value="published">Published (Visible to all users on /#/interviews)</option>
                      <option value="draft">Draft (Private, hidden from public)</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn btn-primary">
                      <span>{editingInterview.status === 'published' ? 'Publish & Save Article' : 'Save Interview Draft'}</span>
                    </button>
                    <button type="button" onClick={() => { setEditingInterview(null); setIsNewInterview(false); setIsCreatingArticle(false); }} className="btn btn-secondary">
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PRIVATE SUBMISSION TRIAGE */}
        {/* ========================================================= */}
        {activeTab === 'submissions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Private Submissions Desk</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Candidate proposals received via "Get Featured". Contact info is protected and confidential.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button 
                  onClick={refreshSubmissionsOnly} 
                  className="btn btn-secondary btn-sm"
                  disabled={isRefreshingSubmissions}
                  title="Fetch latest from PostgreSQL"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <RotateCcw size={14} className={isRefreshingSubmissions ? 'spin' : ''} />
                  <span>{isRefreshingSubmissions ? 'Syncing...' : 'Sync Database'}</span>
                </button>
                <button onClick={handleExportCSV} className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Download size={14} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Filter pills */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '4px' }}>
              {(['All', 'New', 'Contacted', 'Selected', 'Closed'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setSubmissionFilter(st)}
                  className={`btn btn-sm ${submissionFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '4px 12px', fontSize: '0.8rem', flexShrink: 0 }}
                >
                  {st}
                </button>
              ))}
            </div>

            {submissions.length === 0 ? (
              <div className="radio-coming-soon-box">
                <p>No submissions recorded yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {submissions
                  .filter(s => submissionFilter === 'All' ? true : s.status === submissionFilter)
                  .map(sub => (
                    <div 
                      key={sub.id} 
                      style={{ 
                        background: '#FFFFFF', 
                        border: sub.status === 'New' ? '2px solid #6366F1' : '1px solid var(--border-subtle)', 
                        borderRadius: 'var(--radius-md)', 
                        padding: '24px', 
                        boxShadow: sub.status === 'New' ? '0 4px 14px rgba(99, 102, 241, 0.12)' : 'var(--shadow-sm)' 
                      }}
                    >
                      {/* Top Header with Candidate Name, Status, and Date */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                              {sub.name}
                            </h3>
                            <span className="badge" style={{ background: '#EEF2FF', color: '#3730A3', fontWeight: 700, padding: '4px 10px' }}>
                              {sub.category}
                            </span>
                            {sub.status === 'New' && (
                              <span className="badge" style={{ background: '#DEF7EC', color: '#03543F', fontWeight: 800, padding: '4px 10px' }}>
                                NEW PROPOSAL
                              </span>
                            )}
                            {sub.isUnder18 ? (
                              <span className="badge" style={{ background: '#FEF3C7', color: '#92400E', padding: '4px 8px' }}>
                                Under-18
                              </span>
                            ) : (
                              <span className="badge" style={{ background: '#F3F4F6', color: '#4B5563', padding: '4px 8px' }}>
                                18+ Adult
                              </span>
                            )}
                          </div>
                          
                          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <GraduationCap size={16} color="var(--accent-primary)" />
                              <strong>{sub.schoolOrCollege}</strong>
                            </span>
                            {sub.city && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                <MapPin size={16} color="var(--text-muted)" />
                                <span>{sub.city}</span>
                              </span>
                            )}
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <Calendar size={16} color="var(--text-muted)" />
                              <span>Submitted {new Date(sub.submittedAt).toLocaleString()}</span>
                            </span>
                          </div>
                        </div>

                        {/* Status Control & Delete */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Status:</span>
                          <select 
                            value={sub.status} 
                            onChange={e => handleUpdateSubmission(sub.id, e.target.value as any)}
                            className="form-select"
                            style={{ 
                              padding: '6px 12px', 
                              fontSize: '0.86rem', 
                              fontWeight: 700, 
                              width: 'auto',
                              borderColor: sub.status === 'New' ? '#6366F1' : 'var(--border-strong)',
                              color: sub.status === 'New' ? '#4F46E5' : 'inherit'
                            }}
                          >
                            <option value="New">🟡 New</option>
                            <option value="Contacted">🔵 Contacted</option>
                            <option value="Selected">🟢 Selected for Feature</option>
                            <option value="Closed">⚪ Closed</option>
                          </select>
                          
                          {userRole === 'Owner' && (
                            <button 
                              onClick={() => handleDeleteSubmission(sub.id)}
                              className="btn btn-secondary btn-sm"
                              style={{ color: '#DC2626', padding: '6px 10px' }}
                              title="Delete Record from Database"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Submitted Information: Outline / Pitch Description */}
                      <div style={{ marginBottom: '16px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                          User Submitted Story / Pitch:
                        </span>
                        <div style={{ fontSize: '1rem', color: 'var(--text-primary)', background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-sm)', lineHeight: 1.6, borderLeft: '4px solid var(--accent-primary)' }}>
                          "{sub.shortDescription}"
                        </div>
                      </div>

                      {/* Contact & Verification Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', background: '#F8FAFC', padding: '14px 18px', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0', fontSize: '0.88rem' }}>
                        <div>
                          <strong style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                            Candidate Contact:
                          </strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <code style={{ background: '#FFFFFF', padding: '3px 8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                              {sub.contactMethod}
                            </code>
                          </div>
                        </div>

                        {sub.guardianContact && (
                          <div>
                            <strong style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                              Parent / Guardian Contact:
                            </strong>
                            <code style={{ background: '#FFFFFF', padding: '3px 8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 600 }}>
                              {sub.guardianContact}
                            </code>
                          </div>
                        )}

                        {sub.workLink && (
                          <div>
                            <strong style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                              Work / Portfolio Link:
                            </strong>
                            <a 
                              href={sub.workLink} 
                              target="_blank" 
                              rel="noreferrer" 
                              style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 600, wordBreak: 'break-all', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <span>{sub.workLink}</span>
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        )}

                        <div>
                          <strong style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                            Editorial Consent:
                          </strong>
                          <span style={{ color: '#059669', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCheck size={15} />
                            <span>Confirmed & Verified</span>
                          </span>
                        </div>
                      </div>

                      {/* Convert to Draft Story Action */}
                      <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button
                          onClick={() => {
                            setIsCreatingArticle(true);
                            setArticleDestination('Student Stories');
                            setActiveTab('stories');
                            setIsNewStory(true);
                            setEditingStory({
                              ...getInitialStory(),
                              studentName: sub.name,
                              schoolOrCollege: sub.schoolOrCollege,
                              city: sub.city || '',
                              category: sub.category === 'Student Entrepreneur' ? 'Student Entrepreneurs' : 'Student Talent',
                              shortIntro: sub.shortDescription,
                              workSummary: sub.shortDescription,
                              relevantLinks: sub.workLink ? [{ label: 'Work Link', url: sub.workLink }] : []
                            });
                            showNotice(`Started draft story for ${sub.name}.`);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Plus size={14} />
                          <span>Draft Story from this Candidate</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: HOMEPAGE SETTINGS & BACKUP */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Homepage Controls */}
            <div className="form-card">
              <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Homepage Curation Settings</h2>
              
              <div className="form-group">
                <label className="form-label">Featured Student Story</label>
                <select 
                  className="form-select"
                  value={settings.featuredStudentStoryId}
                  onChange={e => handleSetFeaturedStory(e.target.value)}
                >
                  {stories.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.studentName} — {s.title} ({s.status})
                    </option>
                  ))}
                </select>
                <span className="form-hint">Selected student appears prominently in the spotlight section on the homepage.</span>
              </div>

              <div className="form-group" style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox"
                    checked={settings.forceRadioComingSoon}
                    onChange={handleToggleRadioComingSoon}
                  />
                  <div>
                    <strong>Force Student Radio "First episode coming soon" State</strong>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                      When checked, the homepage displays the honest "First episode coming soon" state and participation link even if episodes are in the database.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Backup & Restore (PRD Section 21 requirement) */}
            <div className="form-card">
              <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Database Backup & Restoration</h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Export full site content (stories, episodes, interviews, private submissions, and curation settings) to JSON or restore from a backup file.
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button onClick={handleExportJSON} className="btn btn-secondary">
                  <Download size={16} />
                  <span>Download Full JSON Backup</span>
                </button>

                <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                  <Upload size={16} />
                  <span>Restore from JSON Backup</span>
                  <input 
                    type="file" 
                    accept=".json" 
                    onChange={handleImportJSON} 
                    style={{ display: 'none' }} 
                  />
                </label>

                {userRole === 'Owner' && (
                  <button onClick={handleResetDefaults} className="btn btn-secondary" style={{ color: '#DC2626' }}>
                    <RotateCcw size={16} />
                    <span>Reset to Seed Defaults</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: FUTURE STUDENT NEWS (Prepared Architecture) */}
        {/* ========================================================= */}
        {activeTab === 'future-news' && (
          <div className="form-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sparkles size={22} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Future Student News (PRD Section 17 & 29 Architecture)</h2>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              In strict accordance with PRD Section 17 & 29, <strong>Student News is intentionally omitted from the public launch navigation</strong> until official editorial launch. The schema and editorial verification workflow below are prepared for future activation without needing to re-architect the site.
            </p>
            <div style={{ background: 'var(--bg-subtle)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>Prepared Schema Fields:</h3>
              <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li><strong>Categories:</strong> Student achievements, Campus events, Competitions, Scholarships, Opportunities</li>
                <li><strong>Verification Fields:</strong> Source links, Editor verification check, Deadline & Expired status flags</li>
                <li><strong>Editorial Guard:</strong> Unreviewed student submissions & scraped news are strictly prohibited</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
