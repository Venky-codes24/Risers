import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, Mic, Play } from 'lucide-react';
import { ContentStore } from '../services/contentStore';

export const RadioPage: React.FC = () => {
  const publishedEpisodes = ContentStore.getPublishedEpisodes();
  const settings = ContentStore.getSettings();

  const showEpisodes = !settings.forceRadioComingSoon && publishedEpisodes.length > 0;

  return (
    <main id="main-content" className="section">
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '740px', marginBottom: '44px' }}>
          <span className="section-kicker" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Radio size={15} />
            <span>YouTube-First Editorial Programme</span>
          </span>
          <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
            RISERS Student Radio
          </h1>
          <p className="section-subtitle" style={{ fontSize: '1.08rem', lineHeight: 1.6 }}>
            A space for candid campus stories, student conversations, peer insights, and learning experiences published on YouTube.
          </p>
        </div>

        {showEpisodes ? (
          <div className="grid-cards">
            {publishedEpisodes.map(ep => (
              <article key={ep.id} className="editorial-card">
                <div className="card-img-wrap">
                  <img src={ep.thumbnail} alt={ep.altText} className="card-img" loading="lazy" />
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <span className="badge badge-radio">
                      Episode {ep.episodeNumber || 1}
                    </span>
                  </div>
                  <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.75)', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {ep.language}
                  </div>
                </div>

                <div className="card-content">
                  <div className="card-meta">
                    <span className="card-date">{ep.date}</span>
                    {ep.hostOrParticipants && (
                      <>
                        <span style={{ color: 'var(--text-muted)' }}>•</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ep.hostOrParticipants}</span>
                      </>
                    )}
                  </div>

                  <h2 className="card-title" style={{ fontSize: '1.35rem' }}>
                    <Link to={`/radio/${ep.id}`}>{ep.title}</Link>
                  </h2>

                  <p className="card-excerpt">{ep.summary}</p>

                  <div className="card-byline">
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Video Episode
                    </span>
                    <Link to={`/radio/${ep.id}`} className="btn btn-primary btn-sm" style={{ padding: '6px 12px' }}>
                      <Play size={13} fill="currentColor" />
                      <span>Watch Episode</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Honest fallback per PRD Section 7 & 22 */
          <div className="radio-coming-soon-box">
            <Radio size={48} color="var(--accent-primary)" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', marginBottom: '10px' }}>
              First episode coming soon
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 24px', fontSize: '1rem', lineHeight: 1.6 }}>
              Student Radio episodes are in pre-production. Have a student conversation, campus project, or learning experience you want to discuss?
            </p>
            <Link to="/get-featured" className="btn btn-primary">
              <Mic size={16} />
              <span>Participate in Student Radio</span>
            </Link>
          </div>
        )}

        {/* Editorial Information Note */}
        <div style={{ marginTop: '64px', padding: '24px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', maxWidth: '780px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--accent-primary)', marginBottom: '8px' }}>
            About Student Radio Editorial Programme
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Student Radio is published as episodic video conversations on YouTube and archived here for student discovery. It is not a 24-hour live broadcast station. Episode frequency is driven by editorial curation and real student availability.
          </p>
        </div>
      </div>
    </main>
  );
};
