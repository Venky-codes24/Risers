import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Radio, Mic, BookOpen, Sparkles, UserCheck } from 'lucide-react';
import { ContentStore } from '../services/contentStore';

export const HomePage: React.FC = () => {
  const publishedStories = ContentStore.getPublishedStories();
  const publishedEpisodes = ContentStore.getPublishedEpisodes();
  const publishedInterviews = ContentStore.getPublishedInterviews();
  const settings = ContentStore.getSettings();

  // Featured student story
  const featuredStory = publishedStories.find(s => s.id === settings.featuredStudentStoryId) 
    || publishedStories.find(s => s.isFeatured) 
    || publishedStories[0];

  // Latest episode
  const latestEpisode = !settings.forceRadioComingSoon && publishedEpisodes.length > 0 
    ? publishedEpisodes[0] 
    : null;

  return (
    <main id="main-content">
      {/* 5. OPENING / HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <p className="hero-purpose">A platform for student talent, ideas and journeys.</p>
          <h1 className="hero-tagline">“There’s more than one way to rise.”</h1>
          <p className="hero-desc">
            Discover students creating their own paths, hear from professionals, and explore student voices through RISERS Student Radio.
          </p>
          {/* Exactly two primary actions as required by PRD Section 5 */}
          <div className="hero-actions">
            <Link to="/stories" className="btn btn-primary btn-lg">
              <span>Explore Stories</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/radio" className="btn btn-secondary btn-lg">
              <Radio size={18} />
              <span>Watch Student Radio</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FEATURED STUDENT */}
      {featuredStory && (
        <section className="section section-alt" aria-labelledby="featured-student-heading">
          <div className="container">
            <div className="section-header">
              <span className="section-kicker">Student Spotlight</span>
              <h2 id="featured-student-heading" className="section-title">Featured Student Journey</h2>
            </div>

            <div className="featured-student-box">
              <div className="featured-img-wrap">
                <img 
                  src={featuredStory.coverImage} 
                  alt={featuredStory.altText} 
                  className="featured-img" 
                />
              </div>
              <div className="featured-info">
                <div style={{ marginBottom: '12px' }}>
                  <span className={`badge ${featuredStory.category === 'Student Talent' ? 'badge-talent' : 'badge-entrepreneur'}`}>
                    {featuredStory.category}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', fontWeight: 700, lineHeight: 1.25, marginBottom: '8px' }}>
                  {featuredStory.studentName}
                </h3>
                {featuredStory.schoolOrCollege && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px', fontWeight: 500 }}>
                    {featuredStory.schoolOrCollege} {featuredStory.city ? `• ${featuredStory.city}` : ''}
                  </p>
                )}
                <p style={{ fontSize: '1.02rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                  {featuredStory.shortIntro}
                </p>
                <div>
                  <Link to={`/stories/${featuredStory.id}`} className="btn btn-primary">
                    <span>Read Story</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. STUDENT RADIO HOMEPAGE SECTION (Prominent, not hidden) */}
      <section className="section" aria-labelledby="student-radio-heading">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="section-kicker" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Radio size={14} />
                <span>YouTube-First Editorial Programme</span>
              </span>
              <h2 id="student-radio-heading" className="section-title">RISERS Student Radio</h2>
              <p className="section-subtitle">
                Authentic campus conversations, student journeys, and shared learning experiences.
              </p>
            </div>
            <Link to="/radio" className="btn btn-secondary btn-sm">
              <span>VIEW ALL EPISODES</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {latestEpisode ? (
            <div className="radio-featured-card">
              <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <img 
                  src={latestEpisode.thumbnail} 
                  alt={latestEpisode.altText} 
                  style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  <span className="badge badge-radio">
                    Episode {latestEpisode.episodeNumber || 1}
                  </span>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px', fontSize: '0.85rem', color: '#CBD5E1' }}>
                  <span>{latestEpisode.date}</span>
                  <span>•</span>
                  <span>Language: {latestEpisode.language}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', fontWeight: 700, lineHeight: 1.25, marginBottom: '14px', color: '#FFFFFF' }}>
                  {latestEpisode.title}
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  {latestEpisode.summary}
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link to={`/radio/${latestEpisode.id}`} className="btn btn-primary">
                    <Mic size={16} />
                    <span>Watch Episode</span>
                  </Link>
                  <Link to="/radio" className="btn btn-secondary" style={{ background: 'transparent', color: '#FFFFFF', borderColor: '#475569' }}>
                    <span>Episode Details</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Honest fallback when no episode is published yet (PRD Section 7 & 35) */
            <div className="radio-coming-soon-box">
              <Radio size={40} color="var(--accent-primary)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '8px' }}>
                First episode coming soon
              </h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 20px', fontSize: '0.95rem' }}>
                RISERS Student Radio is currently in recording sessions with student creators and innovators. Be part of an upcoming conversation.
              </p>
              <Link to="/get-featured" className="btn btn-primary">
                <span>Participate in Student Radio</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 8. STUDENT STORIES HOMEPAGE SECTION */}
      <section className="section section-alt" aria-labelledby="student-stories-heading">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="section-kicker">Student Talent & Ventures</span>
              <h2 id="student-stories-heading" className="section-title">Latest Student Stories</h2>
              <p className="section-subtitle">
                Real journeys from school and college students finding recognition and creating solutions.
              </p>
            </div>
            <Link to="/stories" className="btn btn-secondary btn-sm">
              <span>View All Stories</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-cards">
            {publishedStories.slice(0, 3).map(story => (
              <article key={story.id} className="editorial-card">
                <div className="card-img-wrap">
                  <img src={story.coverImage} alt={story.altText} className="card-img" />
                </div>
                <div className="card-content">
                  <div className="card-meta">
                    <span className={`badge ${story.category === 'Student Talent' ? 'badge-talent' : 'badge-entrepreneur'}`}>
                      {story.category}
                    </span>
                    <span className="card-date">{story.publicationDate}</span>
                  </div>
                  <h3 className="card-title">
                    <Link to={`/stories/${story.id}`}>{story.title}</Link>
                  </h3>
                  <p className="card-excerpt">{story.shortIntro}</p>
                  <div className="card-byline">
                    <span>{story.studentName}</span>
                    <Link to={`/stories/${story.id}`} style={{ color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span>Read</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 9. PROFESSIONAL INTERVIEWS HOMEPAGE SECTION */}
      <section className="section" aria-labelledby="interviews-heading">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="section-kicker">Practical Direction</span>
              <h2 id="interviews-heading" className="section-title">Professional Interviews</h2>
              <p className="section-subtitle">
                Industry practitioners share unfiltered guidance, workplace realities, and mentorship for students.
              </p>
            </div>
            <Link to="/interviews" className="btn btn-secondary btn-sm">
              <span>View All Interviews</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-cards">
            {publishedInterviews.slice(0, 3).map(interview => (
              <article key={interview.id} className="editorial-card">
                <div className="card-img-wrap">
                  <img src={interview.portrait} alt={interview.guestName} className="card-img" />
                </div>
                <div className="card-content">
                  <div className="card-meta">
                    <span className="badge" style={{ background: '#F1F5F9', color: '#334155' }}>
                      {interview.guestRole}
                    </span>
                  </div>
                  <h3 className="card-title">
                    <Link to={`/interviews/${interview.id}`}>{interview.title}</Link>
                  </h3>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '8px' }}>
                    {interview.guestName} • {interview.organisation}
                  </p>
                  <p className="card-excerpt">
                    {interview.summary}
                  </p>
                  <div className="card-byline">
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      What students learn
                    </span>
                    <Link to={`/interviews/${interview.id}`} style={{ color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span>Watch & Learn</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 10. PARTICIPATION INVITATION */}
      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="cta-banner">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', padding: '4px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '14px' }}>
              <Sparkles size={14} />
              <span>COMMUNITY INVITATION</span>
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
              Have a talent or a story to share? Submit it to RISERS.
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 24px', fontSize: '1rem' }}>
              Whether you are building a venture, mastering a craft, coding a regional tool, or doing something creative in your school or college, we want to hear your journey.
            </p>
            <Link to="/get-featured" className="btn btn-primary btn-lg">
              <span>GET FEATURED</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 11. SHORT ABOUT */}
      <section className="section section-alt">
        <div className="container container-narrow" style={{ textAlign: 'center' }}>
          <span className="section-kicker">About RISERS</span>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>
            Built for Students, Centered on Real Paths
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
            RISERS is an initiative by <strong>Root & Rise Learning</strong> dedicated to spotlighting student talent, early entrepreneurship, and practical career direction. We believe there is never just one conventional path to success.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/about" className="btn btn-secondary btn-sm">
              <BookOpen size={16} />
              <span>Read Our Full Story</span>
            </Link>
            <Link to="/contact" className="btn btn-secondary btn-sm">
              <UserCheck size={16} />
              <span>Contact Editorial Team</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
