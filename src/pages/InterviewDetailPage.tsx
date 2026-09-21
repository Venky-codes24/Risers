import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Check, ExternalLink, Calendar, Briefcase, CheckCircle2 } from 'lucide-react';
import { ContentStore } from '../services/contentStore';
import { VideoEmbed } from '../components/VideoEmbed';

export const InterviewDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);

  const interview = ContentStore.getInterviewById(id || '');
  const allInterviews = ContentStore.getPublishedInterviews();

  if (!interview || interview.status !== 'published') {
    return (
      <main id="main-content" className="section">
        <div className="container container-narrow" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h1 className="section-title" style={{ marginBottom: '14px' }}>Interview Not Found</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            This professional interview could not be found or is undergoing fact-checking.
          </p>
          <Link to="/interviews" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Back to All Interviews</span>
          </Link>
        </div>
      </main>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const relatedInterviews = allInterviews.filter(i => i.id !== interview.id).slice(0, 2);

  return (
    <main id="main-content" className="section" style={{ paddingTop: '40px' }}>
      <div className="container-narrow">
        {/* Navigation & Share */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <Link to="/interviews" className="btn btn-secondary btn-sm">
            <ArrowLeft size={16} />
            <span>All Interviews</span>
          </Link>

          <button onClick={handleShare} className="btn btn-secondary btn-sm" aria-label="Share this interview">
            {copied ? (
              <>
                <Check size={16} color="#10B981" />
                <span style={{ color: '#10B981' }}>Link Copied</span>
              </>
            ) : (
              <>
                <Share2 size={16} />
                <span>Share Interview</span>
              </>
            )}
          </button>
        </div>

        {/* Video Player */}
        <div style={{ marginBottom: '32px' }}>
          <VideoEmbed 
            youtubeUrl={interview.youtubeUrl} 
            thumbnailUrl={interview.portrait} 
            title={interview.title} 
          />
        </div>

        {/* Header */}
        <header style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: '#F1F5F9', color: '#1E293B' }}>
              Professional Interview
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Calendar size={14} />
              <span>Published {interview.publicationDate}</span>
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Language: {interview.language}</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.3rem', fontWeight: 800, lineHeight: 1.25, color: 'var(--text-primary)', marginBottom: '20px' }}>
            {interview.title}
          </h1>

          {/* Guest Card */}
          <div style={{ display: 'flex', gap: '18px', alignItems: 'center', padding: '20px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
            <img 
              src={interview.portrait} 
              alt={interview.guestName} 
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }} 
            />
            <div>
              <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)', display: 'block' }}>
                {interview.guestName}
              </strong>
              <div style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                {interview.guestRole}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {interview.organisation}
              </div>
            </div>
          </div>
        </header>

        {/* Summary */}
        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
            Interview Summary
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            {interview.summary}
          </p>
        </section>

        {/* Key Takeaways for Students (PRD Section 14 Requirement) */}
        <section style={{ background: '#FFFBEB', padding: '32px 24px', borderRadius: 'var(--radius-md)', border: '1px solid #FDE68A', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Briefcase size={20} color="var(--accent-primary)" />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#92400E', margin: 0 }}>
              Key Takeaways for Students
            </h2>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', padding: 0 }}>
            {interview.studentTakeaways.map((item, idx) => (
              <li key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#78350F', fontSize: '1rem', lineHeight: 1.6 }}>
                <CheckCircle2 size={18} color="#D97706" style={{ marginTop: '3px', flexShrink: 0 }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* External Link */}
        {interview.youtubeUrl && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '48px' }}>
            <a 
              href={interview.youtubeUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-secondary btn-sm"
            >
              <span>Watch Video on YouTube</span>
              <ExternalLink size={14} />
            </a>
          </div>
        )}

        {/* Related Content */}
        {relatedInterviews.length > 0 && (
          <div style={{ marginTop: '56px', borderTop: '1px solid var(--border-subtle)', paddingTop: '36px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '20px' }}>
              More Professional Interviews
            </h3>
            <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              {relatedInterviews.map(rel => (
                <article key={rel.id} className="editorial-card">
                  <div className="card-img-wrap" style={{ aspectRatio: '16/9' }}>
                    <img src={rel.portrait} alt={rel.guestName} className="card-img" />
                  </div>
                  <div className="card-content">
                    <h4 className="card-title" style={{ fontSize: '1.1rem' }}>
                      <Link to={`/interviews/${rel.id}`}>{rel.title}</Link>
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      {rel.guestName}
                    </p>
                    <Link to={`/interviews/${rel.id}`} style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.85rem', marginTop: '8px', display: 'inline-block' }}>
                      Read Takeaways →
                    </Link>
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
