import type { StudentStory, StudentRadioEpisode, ProfessionalInterview, GetFeaturedSubmission } from '../types';
import { initialStories, initialEpisodes, initialInterviews, initialSubmissions } from '../data/seedData';

const STORAGE_KEYS = {
  STORIES: 'risers_stories_v1',
  EPISODES: 'risers_episodes_v1',
  INTERVIEWS: 'risers_interviews_v1',
  SUBMISSIONS: 'risers_submissions_v1',
  SETTINGS: 'risers_settings_v1',
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

  saveStory(story: StudentStory): void {
    const stories = this.getAllStories();
    const index = stories.findIndex(s => s.id === story.id);
    if (index >= 0) {
      stories[index] = story;
    } else {
      stories.unshift(story);
    }
    setStored(STORAGE_KEYS.STORIES, stories);
  },

  deleteStory(id: string): void {
    const stories = this.getAllStories().filter(s => s.id !== id);
    setStored(STORAGE_KEYS.STORIES, stories);
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

  saveEpisode(episode: StudentRadioEpisode): void {
    const episodes = this.getAllEpisodes();
    const index = episodes.findIndex(e => e.id === episode.id);
    if (index >= 0) {
      episodes[index] = episode;
    } else {
      episodes.unshift(episode);
    }
    setStored(STORAGE_KEYS.EPISODES, episodes);
  },

  deleteEpisode(id: string): void {
    const episodes = this.getAllEpisodes().filter(e => e.id !== id);
    setStored(STORAGE_KEYS.EPISODES, episodes);
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

  saveInterview(interview: ProfessionalInterview): void {
    const interviews = this.getAllInterviews();
    const index = interviews.findIndex(i => i.id === interview.id);
    if (index >= 0) {
      interviews[index] = interview;
    } else {
      interviews.unshift(interview);
    }
    setStored(STORAGE_KEYS.INTERVIEWS, interviews);
  },

  deleteInterview(id: string): void {
    const interviews = this.getAllInterviews().filter(i => i.id !== id);
    setStored(STORAGE_KEYS.INTERVIEWS, interviews);
  },

  // --- Submissions ---
  getSubmissions(): GetFeaturedSubmission[] {
    return getStored<GetFeaturedSubmission[]>(STORAGE_KEYS.SUBMISSIONS, initialSubmissions);
  },

  addSubmission(submission: GetFeaturedSubmission): void {
    const current = this.getSubmissions();
    current.unshift(submission);
    setStored(STORAGE_KEYS.SUBMISSIONS, current);
  },

  updateSubmissionStatus(id: string, status: GetFeaturedSubmission['status'], adminNotes?: string): void {
    const submissions = this.getSubmissions();
    const sub = submissions.find(s => s.id === id);
    if (sub) {
      sub.status = status;
      if (adminNotes !== undefined) sub.adminNotes = adminNotes;
      setStored(STORAGE_KEYS.SUBMISSIONS, submissions);
    }
  },

  deleteSubmission(id: string): void {
    const submissions = this.getSubmissions().filter(s => s.id !== id);
    setStored(STORAGE_KEYS.SUBMISSIONS, submissions);
  },

  // --- Settings ---
  getSettings(): SiteSettings {
    return getStored<SiteSettings>(STORAGE_KEYS.SETTINGS, defaultSettings);
  },

  saveSettings(settings: SiteSettings): void {
    setStored(STORAGE_KEYS.SETTINGS, settings);
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
