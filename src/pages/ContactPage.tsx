import React from 'react';
import { Mail, MapPin, MessageSquare, AlertCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContactPage: React.FC = () => {
  return (
    <main id="main-content" className="section">
      <div className="container-narrow">
        <div style={{ marginBottom: '40px' }}>
          <span className="section-kicker">Get in Touch</span>
          <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '14px' }}>
            Contact RISERS
          </h1>
          <p className="section-subtitle" style={{ fontSize: '1.08rem', lineHeight: 1.6 }}>
            Reach out to our editorial desk for questions, school collaborations, guest suggestions, or editorial corrections.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          {/* General Editorial Desk */}
          <div style={{ background: 'var(--bg-surface)', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ color: 'var(--accent-primary)', marginBottom: '12px' }}><Mail size={24} /></div>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Editorial & General Desk</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              For inquiries regarding published stories, student features, or media inquiries.
            </p>
            <a href="mailto:contact@risers.org" style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
              contact@risers.org
            </a>
          </div>

          {/* School & College Collaborations */}
          <div style={{ background: 'var(--bg-surface)', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ color: 'var(--accent-primary)', marginBottom: '12px' }}><MessageSquare size={24} /></div>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Campus & School Outreach</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              For teachers, principals, club leaders, or universities wishing to recommend student talent.
            </p>
            <a href="mailto:outreach@risers.org" style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
              outreach@risers.org
            </a>
          </div>
        </div>

        {/* Location / Physical Base */}
        <div style={{ background: 'var(--bg-subtle)', padding: '24px 28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '48px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <MapPin size={22} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
          <div>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
              Root & Rise Learning Editorial Base
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Operating across Telangana and Andhra Pradesh (Hyderabad & Vijayawada Hubs).
            </p>
          </div>
        </div>

        {/* Corrections & Removal Requests (PRD Section 21 requirement) */}
        <section id="corrections" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-lg)', padding: '36px 28px', marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <AlertCircle size={22} color="var(--accent-primary)" />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>
              Correction and Removal Requests
            </h2>
          </div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '16px' }}>
            RISERS is committed to accurate and voluntary student storytelling. If you are a student, parent, or institution and need to request an update, factual correction, or removal of published content:
          </p>
          <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
            <li>Email our editorial lead at <code>corrections@risers.org</code> with the subject <em>“Correction/Removal Request”</em>.</li>
            <li>Provide the URL of the published story or interview and specify the exact update or reason for removal.</li>
            <li>Inquiries are acknowledged within 48 hours and resolved with priority.</li>
          </ul>
          <Link to="/terms" style={{ fontSize: '0.88rem', color: 'var(--accent-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <FileText size={14} />
            <span>Read our full Publishing & Removal Terms</span>
          </Link>
        </section>
      </div>
    </main>
  );
};
