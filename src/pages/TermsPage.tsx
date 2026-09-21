import React from 'react';
import { AlertCircle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <main id="main-content" className="section">
      <div className="container-narrow">
        <div style={{ marginBottom: '36px' }}>
          <span className="section-kicker">Editorial Standards</span>
          <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '14px' }}>
            Participation & Publishing Terms
          </h1>
          <p className="section-subtitle">
            Guidelines governing submissions, verification, editorial review, and student content publishing on RISERS.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '1.02rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          {/* 1. Nature of Participation */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              1. Voluntary Participation
            </h2>
            <p>
              Participation in RISERS—whether via an editorial article, a project showcase, or an appearance on RISERS Student Radio—is entirely voluntary. We do not charge fees from students or schools to be featured, nor do we pay appearance fees to student participants.
            </p>
          </section>

          {/* 2. Editorial Workflow & Review */}
          <section style={{ background: 'var(--bg-subtle)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              2. The Editorial Review Workflow
            </h2>
            <p style={{ marginBottom: '14px' }}>
              Submitting a story or talent suggestion does not guarantee publication. Every piece undergoes a structured editorial workflow:
            </p>
            <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-primary)', fontWeight: 500 }}>
              <li>Submission received via private form</li>
              <li>Editorial team preliminary review & qualification</li>
              <li>Direct contact and verification of project credentials</li>
              <li>Written consent & minor guardian confirmation (if under 18)</li>
              <li>Interview or article drafting</li>
              <li>Editorial approval by Root & Rise Learning</li>
              <li>Public publication</li>
            </ol>
          </section>

          {/* 3. Consent & Minor Protection */}
          <section id="consent">
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              3. Consent and Student Representation
            </h2>
            <p style={{ marginBottom: '10px' }}>
              All student photographs, project descriptions, and quotes are published with prior review and permission from the featured student (and guardian, for minors). Students retain full intellectual property ownership of their underlying projects, designs, and codebases.
            </p>
            <p>
              By agreeing to be featured, participants grant RISERS and Root & Rise Learning a non-exclusive license to present the story, photo, or recording across our platform and associated educational social media channels.
            </p>
          </section>

          {/* 4. Accuracy & Corrections */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              4. Accuracy and Fact-Checking
            </h2>
            <p>
              We take factual integrity seriously. We do not invent stories, student credentials, or exaggerated project achievements. If a participant, mentor, or reader notices an error, we encourage immediate notification via <code>corrections@risers.org</code>. Approved corrections will be updated promptly.
            </p>
          </section>

          {/* 5. Removal Requests */}
          <section style={{ background: '#FFFBEB', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid #FDE68A' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <AlertCircle size={20} color="#92400E" />
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#92400E', margin: 0 }}>
                5. Content Removal Protocol
              </h2>
            </div>
            <p style={{ color: '#78350F' }}>
              A student or their legal guardian may request the permanent removal or archiving of their published feature at any stage. RISERS respects student privacy above all else and will unpublish or archive requested items without unnecessary hurdles.
            </p>
          </section>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Published by Root & Rise Learning Editorial Desk. Effective March 2026.
          </div>
        </div>
      </div>
    </main>
  );
};
