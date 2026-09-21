import React, { useState } from 'react';
import { Play, ExternalLink, AlertCircle } from 'lucide-react';

interface VideoEmbedProps {
  youtubeUrl?: string;
  thumbnailUrl?: string;
  title: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ youtubeUrl, thumbnailUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Helper to extract YouTube video ID
  const getYouTubeId = (url?: string): string | null => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(youtubeUrl);

  if (!youtubeUrl || !videoId) {
    return (
      <div className="radio-coming-soon-box">
        <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
          Video recording for this session is being processed or will be linked shortly.
        </p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div style={{ padding: '24px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
        <AlertCircle size={32} color="#DC2626" style={{ margin: '0 auto 10px' }} />
        <p style={{ fontWeight: 600, color: '#991B1B', marginBottom: '8px' }}>
          This video cannot be embedded here or requires direct platform viewing.
        </p>
        <a 
          href={youtubeUrl} 
          target="_blank" 
          rel="noreferrer" 
          className="btn btn-secondary btn-sm"
          style={{ marginTop: '8px' }}
        >
          <span>Watch Directly on YouTube</span>
          <ExternalLink size={14} />
        </a>
      </div>
    );
  }

  return (
    <div className="video-responsive-wrap">
      {!isPlaying ? (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : 'linear-gradient(135deg, #1E293B, #0F172A)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={() => setIsPlaying(true)}
          role="button"
          tabIndex={0}
          aria-label={`Play video: ${title}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsPlaying(true);
            }
          }}
        >
          {/* Dark backdrop overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />

          <div style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--accent-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(194, 65, 12, 0.5)',
              transition: 'transform 0.15s ease',
            }}>
              <Play size={28} style={{ marginLeft: '4px' }} />
            </div>
            <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.03em', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
              CLICK TO PLAY VIDEO
            </span>
          </div>
        </div>
      ) : (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
};
