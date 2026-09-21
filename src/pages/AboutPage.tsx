import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Compass, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <main id="main-content" className="section">
      <div className="container-narrow">
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <span className="section-kicker">Brand Identity & Purpose</span>
          <h1 className="section-title" style={{ fontSize: '2.6rem', marginBottom: '16px' }}>
            About RISERS
          </h1>
          <p style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--accent-primary)', marginBottom: '16px' }}>
            “There’s more than one way to rise.”
          </p>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
            An initiative by Root & Rise Learning
          </p>
        </div>

        {/* Narrative & Purpose */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '1.08rem', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '48px' }}>
          <p>
            <strong>RISERS</strong> is a student media platform created to center real student voices, their projects, and their early journeys. Rooted in the belief that education extends far beyond exam scores, RISERS bridges school and college initiatives with the broader world.
          </p>

          <p>
            Across schools and universities, students are coding applications, organizing grassroots campaigns, engineering prototypes in dorm rooms, and practicing arts with immense dedication. Yet, many of these efforts remain confined within campus gates. RISERS provides a credible, ethical space where these efforts are documented, archived, and celebrated.
          </p>

          {/* 3 Pillars */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', margin: '16px 0' }}>
            <div style={{ background: 'var(--bg-subtle)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--accent-primary)', marginBottom: '10px' }}><Sparkles size={24} /></div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Recognition</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Providing genuine, verified visibility to student talent and early entrepreneurial experiments.
              </p>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--accent-primary)', marginBottom: '10px' }}><Compass size={24} /></div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Inspiration</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Showing students that peers in their own cities and campuses are already taking initiative.
              </p>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--accent-primary)', marginBottom: '10px' }}><Users size={24} /></div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Practical Direction</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Connecting student curiosity with candid, grounded wisdom from experienced professionals.
              </p>
            </div>
          </div>

          {/* Regional & Multilingual Focus */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
              భాషా వైవిధ్యం & బహుభాషా సంభాషణలు (Regional Voice & Multilingual Dialogue)
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              We celebrate multilingual journeys. Whether students speak Telugu, English, or a mix of regional languages, RISERS ensures students feel comfortable expressing their ideas authentically without language barriers.
            </p>
          </div>

          {/* Root & Rise Learning Attribution */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              Root & Rise Learning
            </h2>
            <p>
              Root & Rise Learning guides young learners to build strong academic and problem-solving roots while empowering them to rise through self-driven projects, entrepreneurial thinking, and civic engagement. RISERS operates as the student storytelling and media division of this overarching learning vision.
            </p>
          </section>

          {/* Founder Introduction (Supplied Copy Section — Strictly No Invented Facts) */}
          <section style={{ padding: '28px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Shield size={20} color="var(--accent-primary)" />
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>
                From the Founder
              </h2>
            </div>
            <p style={{ fontStyle: 'italic', marginBottom: '14px', color: 'var(--text-primary)' }}>
              “Every student carries a spark of talent or an urge to build. Traditional education often measures only one dimension of intelligence. At RISERS and Root & Rise Learning, our mission is to ensure that every student who dares to create finds the encouragement, community, and guidance needed to keep going.”
            </p>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              — <strong>Editorial Leadership, Root & Rise Learning</strong>
            </div>
          </section>

          {/* Editorial Principles & Standards */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', color: 'var(--text-primary)', marginBottom: '14px' }}>
              Our Editorial Commitments
            </h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0 }}>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} color="var(--accent-primary)" style={{ marginTop: '3px', flexShrink: 0 }} />
                <span><strong>No Invented Metrics:</strong> We do not publish fake member counts, unverified partnerships, or inflated statistics.</span>
              </li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} color="var(--accent-primary)" style={{ marginTop: '3px', flexShrink: 0 }} />
                <span><strong>Student Consent & Minor Protection:</strong> Identifiable material from minors is published only with verified guardian consent. We never request or publish government IDs or full birth dates.</span>
              </li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} color="var(--accent-primary)" style={{ marginTop: '3px', flexShrink: 0 }} />
                <span><strong>Privacy of Contacts:</strong> Personal contact info of students and submitters is strictly confidential and never published on public pages.</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Action Link */}
        <div style={{ textAlign: 'center', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Want to get involved or recommend a student?
          </p>
          <Link to="/get-featured" className="btn btn-primary">
            <span>GET FEATURED ON RISERS</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
};
