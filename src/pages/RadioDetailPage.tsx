import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Check, Mic, ExternalLink, Calendar, Globe } from 'lucide-react';
import { ContentStore } from '../services/contentStore';
import { VideoEmbed } from '../components/VideoEmbed';

export const RadioDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);

  const episode = ContentStore.getEpisodeById(id || '');
  const allEpisodes = ContentStore.getPublishedEpisodes();

  if (!episode || episode.status !== 'published') {
    return (
      <main id="main-content" className="section">
        <div className="container container-narrow" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h1 className="section-title" style={{ marginBottom: '14px' }}>Episode Not Found</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            This Student Radio episode could not be found or has not been published yet.
          </p>
          <Link to="/radio" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Back to All Episodes</span>
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

  const otherEpisodes = allEpisodes.filter(e => e.id !== episode.id).slice(0, 2);

  return (
    <main id="main-content" className="section" style={{ paddingTop: '40px' }}>
      <div className="container-narrow">
        {/* Navigation & Share */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <Link to="/radio" className="btn btn-secondary btn-sm">
            <ArrowLeft size={16} />
            <span>All Episodes</span>
          </Link>

          <button onClick={handleShare} className="btn btn-secondary btn-sm" aria-label="Share this episode">
            {copied ? (
              <>
                <Check size={16} color="#10B981" />
                <span style={{ color: '#10B981' }}>Link Copied</span>
              </>
            ) : (
              <>
                <Share2 size={16} />
                <span>Share Episode</span>
              </>
            )}
          </button>
        </div>

        {/* Video Embed */}
        <div style={{ marginBottom: '32px' }}>
          <VideoEmbed 
            youtubeUrl={episode.youtubeUrl} 
            thumbnailUrl={episode.thumbnail} 
            title={episode.title} 
          />
        </div>

        {/* Episode Header */}
        <header style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
            {episode.episodeNumber && (
              <span className="badge badge-radio">
                Episode {episode.episodeNumber}
              </span>
            )}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Calendar size={14} />
              <span>{episode.date}</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Globe size={14} />
              <span>Language: {episode.language}</span>
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.3rem', fontWeight: 800, lineHeight: 1.25, color: 'var(--text-primary)', marginBottom: '14px' }}>
            {episode.title}
          </h1>

          {episode.hostOrParticipants && (
            <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '16px' }}>
              Conversation with: {episode.hostOrParticipants}
            </p>
          )}
        </header>

        {/* Summary */}
        <div style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '36px' }}>
          <p>{episode.summary}</p>
        </div>

        {/* Key Takeaways & Discussion Points */}
        {episode.keyPoints && episode.keyPoints.length > 0 && (
          <section style={{ background: 'var(--bg-subtle)', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '36px' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '16px' }}>
              Key Discussion Points
            </h2>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)' }}>
              {episode.keyPoints.map((pt, idx) => (
                <li key={idx} style={{ lineHeight: 1.6 }}>{pt}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Transcript / Excerpt */}
        {episode.transcriptExcerpt && (
          <section style={{ marginBottom: '40px', padding: '24px', borderLeft: '4px solid var(--accent-primary)', background: 'var(--bg-surface)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: '8px' }}>
              Episode Highlight Quote
            </h3>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {episode.transcriptExcerpt}
            </p>
          </section>
        )}

        {/* External YouTube Link Fallback Option */}
        {episode.youtubeUrl && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '48px' }}>
            <a 
              href={episode.youtubeUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-secondary btn-sm"
            >
              <span>Watch on YouTube</span>
              <ExternalLink size={14} />
            </a>
          </div>
        )}

        {/* Participation Callout */}
        <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '32px', textAlign: 'center' }}>
          <Mic size={32} color="var(--accent-primary)" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '8px' }}>
            Want to speak on RISERS Student Radio?
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto 20px', fontSize: '0.95rem' }}>
            We invite students with projects, perspectives, or campus initiatives to record a conversation with our host.
          </p>
          <Link to="/get-featured" className="btn btn-primary">
            <span>Apply to Join Student Radio</span>
          </Link>
        </div>

        {/* Other Episodes */}
        {otherEpisodes.length > 0 && (
          <div style={{ marginTop: '56px', borderTop: '1px solid var(--border-subtle)', paddingTop: '36px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '20px' }}>
              More Radio Episodes
            </h3>
            <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              {otherEpisodes.map(ep => (
                <article key={ep.id} className="editorial-card">
                  <div className="card-img-wrap" style={{ aspectRatio: '16/9' }}>
                    <img src={ep.thumbnail} alt={ep.altText} className="card-img" />
                  </div>
                  <div className="card-content">
                    <h4 className="card-title" style={{ fontSize: '1.1rem' }}>
                      <Link to={`/radio/${ep.id}`}>{ep.title}</Link>
                    </h4>
                    <Link to={`/radio/${ep.id}`} style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                      Watch Episode →
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
