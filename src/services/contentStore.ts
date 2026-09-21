import type { StudentStory, StudentRadioEpisode, ProfessionalInterview, GetFeaturedSubmission } from '../types';
import { initialStories, initialEpisodes, initialInterviews, initialSubmissions } from '../data/seedData';

const STORAGE_KEYS = {
  STORIES: 'risers_stories_v1',
  EPISODES: 'risers_episodes_v1',
  INTERVIEWS: 'risers_interviews_v1',
  SUBMISSIONS: 'risers_submissions_v1',
  SETTINGS: 'risers_settings_v1',
  AUTH_TOKEN: 'risers_admin_jwt_v1',
};

export interface SiteSettings {
  featuredStudentStoryId?: string;
  forceRadioComingSoon: boolean;
}

const defaultSettings: SiteSettings = {
  featuredStudentStoryId: 'story-ananya-assistive-tech',
  forceRadioComingSoon: false,
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed saving to ${key}:`, err);
  }
}

export const ContentStore = {
  // --- Auth Helpers ---
  getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  setAuthToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  clearAuthToken(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  },

  async adminLogin(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        this.setAuthToken(data.token);
        return { success: true, token: data.token };
      }
      return { success: false, error: data.error || 'Authentication failed.' };
    } catch (err: any) {
      return { success: false, error: 'Could not connect to authentication service.' };
    }
  },

  async adminLogout(): Promise<void> {
    this.clearAuthToken();
  },

  // --- Stories ---
  getPublishedStories(): StudentStory[] {
    const stories = getStored<StudentStory[]>(STORAGE_KEYS.STORIES, initialStories);
    return stories.filter(s => s.status === 'published');
  },

  getAllStories(): StudentStory[] {
    return getStored<StudentStory[]>(STORAGE_KEYS.STORIES, initialStories);
  },

  getStoryById(id: string): StudentStory | undefined {
    const stories = this.getAllStories();
    return stories.find(s => s.id === id);
  },

  async fetchAllStoriesFromServer(): Promise<StudentStory[]> {
    try {
      const res = await fetch('/api/stories');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setStored(STORAGE_KEYS.STORIES, data);
          return data;
        }
      }
    } catch {}
    return this.getAllStories();
  },

  async saveStory(story: StudentStory): Promise<void> {
    const stories = this.getAllStories();
    const index = stories.findIndex(s => s.id === story.id);
    if (index >= 0) {
      stories[index] = story;
    } else {
      stories.unshift(story);
    }
    setStored(STORAGE_KEYS.STORIES, stories);

    // Sync to PostgreSQL backend
    const token = this.getAuthToken();
    if (token) {
      try {
        await fetch('/api/stories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(story)
        });
      } catch (err) {
        console.warn('Backend sync failed, saved locally:', err);
      }
    }
  },

  async deleteStory(id: string): Promise<void> {
    const stories = this.getAllStories().filter(s => s.id !== id);
    setStored(STORAGE_KEYS.STORIES, stories);

    const token = this.getAuthToken();
    if (token) {
      try {
        await fetch(`/api/stories/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) {
        console.warn('Backend delete failed, deleted locally:', err);
      }
    }
  },

  // --- Episodes ---
  getPublishedEpisodes(): StudentRadioEpisode[] {
    const episodes = getStored<StudentRadioEpisode[]>(STORAGE_KEYS.EPISODES, initialEpisodes);
    return episodes.filter(e => e.status === 'published');
  },

  getAllEpisodes(): StudentRadioEpisode[] {
    return getStored<StudentRadioEpisode[]>(STORAGE_KEYS.EPISODES, initialEpisodes);
  },

  getEpisodeById(id: string): StudentRadioEpisode | undefined {
    return this.getAllEpisodes().find(e => e.id === id);
  },

  async fetchAllEpisodesFromServer(): Promise<StudentRadioEpisode[]> {
    try {
      const res = await fetch('/api/episodes');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setStored(STORAGE_KEYS.EPISODES, data);
          return data;
        }
      }
    } catch {}
    return this.getAllEpisodes();
  },

  async saveEpisode(episode: StudentRadioEpisode): Promise<void> {
    const episodes = this.getAllEpisodes();
    const index = episodes.findIndex(e => e.id === episode.id);
    if (index >= 0) {
      episodes[index] = episode;
    } else {
      episodes.unshift(episode);
    }
    setStored(STORAGE_KEYS.EPISODES, episodes);

    const token = this.getAuthToken();
    if (token) {
      try {
        await fetch('/api/episodes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(episode)
        });
      } catch (err) {
        console.warn('Backend sync failed, saved locally:', err);
      }
    }
  },

  async deleteEpisode(id: string): Promise<void> {
    const episodes = this.getAllEpisodes().filter(e => e.id !== id);
    setStored(STORAGE_KEYS.EPISODES, episodes);

    const token = this.getAuthToken();
    if (token) {
      try {
        await fetch(`/api/episodes/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) {
        console.warn('Backend delete failed, deleted locally:', err);
      }
    }
  },

  // --- Interviews ---
  getPublishedInterviews(): ProfessionalInterview[] {
    const interviews = getStored<ProfessionalInterview[]>(STORAGE_KEYS.INTERVIEWS, initialInterviews);
    return interviews.filter(i => i.status === 'published');
  },

  getAllInterviews(): ProfessionalInterview[] {
    return getStored<ProfessionalInterview[]>(STORAGE_KEYS.INTERVIEWS, initialInterviews);
  },

  getInterviewById(id: string): ProfessionalInterview | undefined {
    return this.getAllInterviews().find(i => i.id === id);
  },

  async fetchAllInterviewsFromServer(): Promise<ProfessionalInterview[]> {
    try {
      const res = await fetch('/api/interviews');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setStored(STORAGE_KEYS.INTERVIEWS, data);
          return data;
        }
      }
    } catch {}
    return this.getAllInterviews();
  },

  async saveInterview(interview: ProfessionalInterview): Promise<void> {
    const interviews = this.getAllInterviews();
    const index = interviews.findIndex(i => i.id === interview.id);
    if (index >= 0) {
      interviews[index] = interview;
    } else {
      interviews.unshift(interview);
    }
    setStored(STORAGE_KEYS.INTERVIEWS, interviews);

    const token = this.getAuthToken();
    if (token) {
      try {
        await fetch('/api/interviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(interview)
        });
      } catch (err) {
        console.warn('Backend sync failed, saved locally:', err);
      }
    }
  },

  async deleteInterview(id: string): Promise<void> {
    const interviews = this.getAllInterviews().filter(i => i.id !== id);
    setStored(STORAGE_KEYS.INTERVIEWS, interviews);

    const token = this.getAuthToken();
    if (token) {
      try {
        await fetch(`/api/interviews/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) {
        console.warn('Backend delete failed, deleted locally:', err);
      }
    }
  },

  // --- Submissions (PostgreSQL & Get Featured) ---
  getSubmissions(): GetFeaturedSubmission[] {
    return getStored<GetFeaturedSubmission[]>(STORAGE_KEYS.SUBMISSIONS, initialSubmissions);
  },

  async fetchSubmissions(): Promise<GetFeaturedSubmission[]> {
    const token = this.getAuthToken();
    if (token) {
      try {
        const res = await fetch('/api/submissions', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.submissions) {
            setStored(STORAGE_KEYS.SUBMISSIONS, data.submissions);
            return data.submissions;
          }
        }
      } catch (err) {
        console.warn('Failed to fetch submissions from PostgreSQL, using local store:', err);
      }
    }
    return this.getSubmissions();
  },

  async addSubmission(submission: GetFeaturedSubmission): Promise<{ success: boolean; id?: string; error?: string }> {
    // 1. Save to backend PostgreSQL database
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const newSub = { ...submission, id: data.id || submission.id };
        const current = this.getSubmissions();
        current.unshift(newSub);
        setStored(STORAGE_KEYS.SUBMISSIONS, current);
        return { success: true, id: newSub.id };
      }
    } catch (err: any) {
      console.warn('Backend submission error, persisting locally as backup:', err);
    }

    // Fallback locally if server unreachable
    const current = this.getSubmissions();
    current.unshift(submission);
    setStored(STORAGE_KEYS.SUBMISSIONS, current);
    return { success: true, id: submission.id };
  },

  async updateSubmissionStatus(id: string, status: GetFeaturedSubmission['status'], adminNotes?: string): Promise<void> {
    const submissions = this.getSubmissions();
    const sub = submissions.find(s => s.id === id);
    if (sub) {
      sub.status = status;
      if (adminNotes !== undefined) sub.adminNotes = adminNotes;
      setStored(STORAGE_KEYS.SUBMISSIONS, submissions);
    }

    const token = this.getAuthToken();
    if (token) {
      try {
        await fetch(`/api/submissions/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status, adminNotes })
        });
      } catch (err) {
        console.warn('Failed to update submission on server:', err);
      }
    }
  },

  async deleteSubmission(id: string): Promise<void> {
    const submissions = this.getSubmissions().filter(s => s.id !== id);
    setStored(STORAGE_KEYS.SUBMISSIONS, submissions);

    const token = this.getAuthToken();
    if (token) {
      try {
        await fetch(`/api/submissions/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) {
        console.warn('Failed to delete submission on server:', err);
      }
    }
  },

  // --- Settings ---
  getSettings(): SiteSettings {
    return getStored<SiteSettings>(STORAGE_KEYS.SETTINGS, defaultSettings);
  },

  async fetchSettings(): Promise<SiteSettings> {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setStored(STORAGE_KEYS.SETTINGS, data);
        return data;
      }
    } catch {}
    return this.getSettings();
  },

  async saveSettings(settings: SiteSettings): Promise<void> {
    setStored(STORAGE_KEYS.SETTINGS, settings);
    const token = this.getAuthToken();
    if (token) {
      try {
        await fetch('/api/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(settings)
        });
      } catch (err) {
        console.warn('Failed to save settings on server:', err);
      }
    }
  },

  // --- Backup & Restore ---
  exportDatabaseJSON(): string {
    const data = {
      stories: this.getAllStories(),
      episodes: this.getAllEpisodes(),
      interviews: this.getAllInterviews(),
      submissions: this.getSubmissions(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  },

  importDatabaseJSON(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.stories) setStored(STORAGE_KEYS.STORIES, data.stories);
      if (data.episodes) setStored(STORAGE_KEYS.EPISODES, data.episodes);
      if (data.interviews) setStored(STORAGE_KEYS.INTERVIEWS, data.interviews);
      if (data.submissions) setStored(STORAGE_KEYS.SUBMISSIONS, data.submissions);
      if (data.settings) setStored(STORAGE_KEYS.SETTINGS, data.settings);
      return true;
    } catch {
      return false;
    }
  },

  resetDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.STORIES);
    localStorage.removeItem(STORAGE_KEYS.EPISODES);
    localStorage.removeItem(STORAGE_KEYS.INTERVIEWS);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }
};
