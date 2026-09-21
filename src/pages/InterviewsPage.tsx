import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, Video } from 'lucide-react';
import { ContentStore } from '../services/contentStore';

export const InterviewsPage: React.FC = () => {
  const publishedInterviews = ContentStore.getPublishedInterviews();

  return (
    <main id="main-content" className="section">
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '740px', marginBottom: '44px' }}>
          <span className="section-kicker" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Briefcase size={15} />
            <span>Practical Direction</span>
          </span>
          <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
            Professional Interviews
          </h1>
          <p className="section-subtitle" style={{ fontSize: '1.08rem', lineHeight: 1.6 }}>
            In-depth conversations with industry practitioners, engineering leaders, and mentors breaking down how to bridge college education and real-world work.
          </p>
        </div>

        {publishedInterviews.length === 0 ? (
          <div className="radio-coming-soon-box">
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '8px' }}>
              Interviews undergoing editorial review
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              All professional guest facts and takeaways are verified prior to publication.
            </p>
            <Link to="/get-featured" className="btn btn-primary btn-sm">
              Suggest an Interview Guest
            </Link>
          </div>
        ) : (
          <div className="grid-cards">
            {publishedInterviews.map(interview => (
              <article key={interview.id} className="editorial-card">
                <div className="card-img-wrap">
                  <img 
                    src={interview.portrait} 
                    alt={`Portrait of ${interview.guestName}`} 
                    className="card-img" 
                    loading="lazy" 
                  />
                  <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.75)', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {interview.language}
                  </div>
                </div>

                <div className="card-content">
                  <div className="card-meta">
                    <span className="badge" style={{ background: '#F1F5F9', color: '#1E293B' }}>
                      {interview.guestRole}
                    </span>
                  </div>

                  <h2 className="card-title" style={{ fontSize: '1.35rem' }}>
                    <Link to={`/interviews/${interview.id}`}>{interview.title}</Link>
                  </h2>

                  <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '10px' }}>
                    {interview.guestName} • <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{interview.organisation}</span>
                  </p>

                  <p className="card-excerpt">{interview.summary}</p>

                  <div className="card-byline">
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Published {interview.publicationDate}
                    </span>
                    <Link to={`/interviews/${interview.id}`} className="btn btn-secondary btn-sm" style={{ padding: '6px 12px' }}>
                      <Video size={14} />
                      <span>Watch & Takeaways</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Suggestion Callout */}
        <div style={{ marginTop: '64px', background: 'var(--bg-subtle)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '6px' }}>
              Know a mentor or professional students should hear from?
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Suggest an industry guest with practical lessons for school or college students.
            </p>
          </div>
          <Link to="/get-featured" className="btn btn-primary">
            <span>Suggest a Guest</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
};
