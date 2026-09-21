import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ContentStore } from '../services/contentStore';
import type { StoryCategory } from '../types';

export const StoriesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | StoryCategory>('All');
  const stories = ContentStore.getPublishedStories();

  const filteredStories = selectedCategory === 'All'
    ? stories
    : stories.filter(s => s.category === selectedCategory);

  return (
    <main id="main-content" className="section">
      <div className="container">
        {/* Page Header */}
        <div style={{ maxWidth: '720px', marginBottom: '40px' }}>
          <span className="section-kicker">Editorial Stories</span>
          <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '14px' }}>
            Student Stories
          </h1>
          <p className="section-subtitle" style={{ fontSize: '1.08rem', lineHeight: 1.6 }}>
            Discover students crafting real projects, building ventures from hostels, and pursuing unique skills across schools and colleges.
          </p>
        </div>

        {/* Category Filters (Required: Student Talent, Student Entrepreneurs) */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }} role="tablist" aria-label="Filter stories by category">
          {(['All', 'Student Talent', 'Student Entrepreneurs'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              role="tab"
              aria-selected={selectedCategory === cat}
            >
              {cat === 'All' ? 'All Stories' : cat}
            </button>
          ))}
        </div>

        {/* Stories Listing */}
        {filteredStories.length === 0 ? (
          <div className="radio-coming-soon-box">
            <Sparkles size={36} color="var(--accent-primary)" style={{ margin: '0 auto 12px' }} />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '8px' }}>
              No stories published in this category yet
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              We only publish verified stories with student consent. Have a story to share?
            </p>
            <Link to="/get-featured" className="btn btn-primary btn-sm">
              Submit Your Story
            </Link>
          </div>
        ) : (
          <div className="grid-cards">
            {filteredStories.map(story => (
              <article key={story.id} className="editorial-card">
                <div className="card-img-wrap">
                  <img src={story.coverImage} alt={story.altText} className="card-img" loading="lazy" />
                </div>
                <div className="card-content">
                  <div className="card-meta">
                    <span className={`badge ${story.category === 'Student Talent' ? 'badge-talent' : 'badge-entrepreneur'}`}>
                      {story.category}
                    </span>
                    <span className="card-date">{story.publicationDate}</span>
                  </div>

                  <h2 className="card-title" style={{ fontSize: '1.35rem' }}>
                    <Link to={`/stories/${story.id}`}>{story.title}</Link>
                  </h2>

                  <p className="card-excerpt">{story.shortIntro}</p>

                  <div className="card-byline">
                    <div>
                      <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{story.studentName}</strong>
                      {story.schoolOrCollege && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {story.schoolOrCollege}
                        </span>
                      )}
                    </div>
                    <Link to={`/stories/${story.id}`} className="btn btn-secondary btn-sm" style={{ padding: '6px 10px' }}>
                      <span>Read</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
