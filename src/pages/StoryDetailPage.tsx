import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Check, ExternalLink, Sparkles, MapPin, School } from 'lucide-react';
import { ContentStore } from '../services/contentStore';
import { VideoEmbed } from '../components/VideoEmbed';

export const StoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);

  const story = ContentStore.getStoryById(id || '');
  const allStories = ContentStore.getPublishedStories();

  if (!story || story.status !== 'published') {
    return (
      <main id="main-content" className="section">
        <div className="container container-narrow" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h1 className="section-title" style={{ marginBottom: '14px' }}>Story Not Found</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            This student story may have been archived or is awaiting publication review.
          </p>
          <Link to="/stories" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Back to All Stories</span>
          </Link>
        </div>
      </main>
    );
  }

  const relatedStories = allStories
    .filter(s => s.id !== story.id)
    .slice(0, 2);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main id="main-content" className="section" style={{ paddingTop: '40px' }}>
      <div className="container-narrow">
        {/* Navigation back and Share */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <Link to="/stories" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} />
            <span>Back to Stories</span>
          </Link>

          <button 
            onClick={handleShare} 
            className="btn btn-secondary btn-sm"
            aria-label="Share this story"
          >
            {copied ? (
              <>
                <Check size={16} color="#10B981" />
                <span style={{ color: '#10B981' }}>Link Copied</span>
              </>
            ) : (
              <>
                <Share2 size={16} />
                <span>Share Story</span>
              </>
            )}
          </button>
        </div>

        {/* Article Header */}
        <header style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span className={`badge ${story.category === 'Student Talent' ? 'badge-talent' : 'badge-entrepreneur'}`}>
              {story.category}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Published {story.publicationDate}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>By {story.author}</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: '16px' }}>
            {story.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
            <div>
              <strong style={{ fontSize: '1.05rem', display: 'block', color: 'var(--text-primary)' }}>
                {story.studentName}
              </strong>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px', flexWrap: 'wrap' }}>
                {story.schoolOrCollege && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <School size={14} />
                    <span>{story.schoolOrCollege}</span>
                  </span>
                )}
                {story.city && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} />
                    <span>{story.city}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '40px', border: '1px solid var(--border-subtle)' }}>
          <img 
            src={story.coverImage} 
            alt={story.altText} 
            style={{ width: '100%', maxHeight: '480px', objectFit: 'cover' }} 
          />
          <div style={{ padding: '8px 16px', background: 'var(--bg-surface)', fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)' }}>
            Photo description: {story.altText}
          </div>
        </div>

        {/* Short Introduction Lead */}
        <div style={{ fontSize: '1.2rem', lineHeight: 1.6, color: 'var(--text-primary)', fontWeight: 500, marginBottom: '36px', borderLeft: '3px solid var(--accent-primary)', paddingLeft: '20px' }}>
          {story.shortIntro}
        </div>

        {/* Article Body Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
          <section>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              The Work & Project
            </h2>
            <p>{story.workSummary}</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              The Journey
            </h2>
            <p>{story.journey}</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              Challenges & Roadblocks
            </h2>
            <p>{story.challenges}</p>
          </section>

          <section style={{ background: 'var(--bg-subtle)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--accent-primary)', marginBottom: '10px' }}>
              Key Student Lessons
            </h2>
            <p style={{ fontStyle: 'italic', color: 'var(--text-primary)' }}>{story.lessons}</p>
          </section>

          {/* Optional YouTube Video Embed */}
          {story.youtubeUrl && (
            <section style={{ marginTop: '16px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '14px' }}>
                Video Demonstration
              </h2>
              <VideoEmbed 
                youtubeUrl={story.youtubeUrl} 
                thumbnailUrl={story.coverImage} 
                title={`${story.studentName} Demonstration`} 
              />
            </section>
          )}

          {/* Relevant Project Links */}
          {story.relevantLinks && story.relevantLinks.length > 0 && (
            <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '24px', marginTop: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Verified Project Links
              </h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {story.relevantLinks.map((link, idx) => (
                  <a 
                    key={idx} 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-secondary btn-sm"
                  >
                    <span>{link.label}</span>
                    <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Get Featured Action */}
        <div style={{ marginTop: '64px', background: 'linear-gradient(135deg, #FFEDD5 0%, #FEE2E2 100%)', border: '1px solid #FED7AA', borderRadius: 'var(--radius-lg)', padding: '32px 24px', textAlign: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '8px' }}>
            <Sparkles size={14} />
            <span>SHARE YOUR JOURNEY</span>
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '8px' }}>
            Are you a student building or creating?
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 20px', fontSize: '0.95rem' }}>
            RISERS features real student talent and initiatives with verified details and student consent.
          </p>
          <Link to="/get-featured" className="btn btn-primary">
            <span>GET FEATURED ON RISERS</span>
          </Link>
        </div>

        {/* Related Stories */}
        {relatedStories.length > 0 && (
          <div style={{ marginTop: '64px', borderTop: '1px solid var(--border-subtle)', paddingTop: '40px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '24px' }}>
              More Student Stories
            </h3>
            <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {relatedStories.map(rel => (
                <article key={rel.id} className="editorial-card">
                  <div className="card-img-wrap" style={{ aspectRatio: '16/9' }}>
                    <img src={rel.coverImage} alt={rel.altText} className="card-img" />
                  </div>
                  <div className="card-content">
                    <div className="card-meta">
                      <span className={`badge ${rel.category === 'Student Talent' ? 'badge-talent' : 'badge-entrepreneur'}`}>
                        {rel.category}
                      </span>
                    </div>
                    <h4 className="card-title" style={{ fontSize: '1.15rem' }}>
                      <Link to={`/stories/${rel.id}`}>{rel.title}</Link>
                    </h4>
                    <p className="card-excerpt" style={{ fontSize: '0.85rem' }}>{rel.shortIntro}</p>
                    <div className="card-byline">
                      <span>{rel.studentName}</span>
                      <Link to={`/stories/${rel.id}`} style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                        Read Story →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
