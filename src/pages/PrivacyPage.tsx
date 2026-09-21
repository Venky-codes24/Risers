import React from 'react';
import { ShieldCheck, Lock, UserCheck, EyeOff } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <main id="main-content" className="section">
      <div className="container-narrow">
        <div style={{ marginBottom: '36px' }}>
          <span className="section-kicker">Privacy & Data Ethics</span>
          <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '14px' }}>
            Privacy Policy
          </h1>
          <p className="section-subtitle">
            How RISERS and Root & Rise Learning protect student information, minor privacy, and submitted materials.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '1.02rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          {/* 1. Core Commitment */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              1. Our Core Privacy Commitment
            </h2>
            <p>
              RISERS operates with high ethical standards tailored specifically for school and college students. We do not sell student data, monetize submission contact lists, or place third-party behavioral trackers across student profiles.
            </p>
          </section>

          {/* 2. Protection of Minors (Under-18) */}
          <section style={{ background: '#FFFBEB', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid #FDE68A' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <ShieldCheck size={22} color="#92400E" />
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#92400E', margin: 0 }}>
                2. Special Safeguards for Minors
              </h2>
            </div>
            <ul style={{ paddingLeft: '20px', color: '#78350F', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Parental / Guardian Consent:</strong> Any identifiable student under 18 years of age will only have their work, name, or photo published with explicit written or confirmed consent from a parent or legal guardian.</li>
              <li><strong>No Sensitive Identity Requests:</strong> RISERS will never ask students for government identification numbers, Aadhaar details, passport copies, or full dates of birth.</li>
              <li><strong>Guardian Communication:</strong> When an under-18 student applies through our “Get Featured” form, all formal permissions are verified through the provided guardian contact.</li>
            </ul>
          </section>

          {/* 3. Form Submissions */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Lock size={20} color="var(--accent-primary)" />
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>
                3. Confidentiality of Submission Contacts
              </h2>
            </div>
            <p>
              Information entered into the <em>Get Featured</em> submission form (including phone numbers, personal email addresses, and guardian details) is strictly confidential. This data is retained exclusively in private administrative records for direct editorial follow-up and is <strong>never displayed on public pages</strong>.
            </p>
          </section>

          {/* 4. Analytics Telemetry */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <EyeOff size={20} color="var(--accent-primary)" />
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>
                4. Analytics & Telemetry Privacy
              </h2>
            </div>
            <p>
              We measure basic aggregate metrics to understand reading interest (such as page views, YouTube clicks, and anonymous form start counts). In strict compliance with our PRD, <strong>no personal information or form input values are ever sent into analytics events</strong>.
            </p>
          </section>

          {/* 5. Content Removal & Right to Erasure */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <UserCheck size={20} color="var(--accent-primary)" />
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>
                5. Right to Modification & Removal
              </h2>
            </div>
            <p>
              A student or legal guardian may request the prompt update, redaction, or complete unpublishing/removal of any featured story or profile at any time by emailing <code>corrections@risers.org</code>. Requests are processed within 48 hours.
            </p>
          </section>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Last updated: March 2026. Approved by Root & Rise Learning Legal & Editorial Oversight.
          </div>
        </div>
      </div>
    </main>
  );
};
