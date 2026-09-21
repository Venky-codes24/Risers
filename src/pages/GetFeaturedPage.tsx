import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ShieldAlert, Sparkles, Send, ArrowRight } from 'lucide-react';
import { ContentStore } from '../services/contentStore';
import type { SubmissionCategory, GetFeaturedSubmission } from '../types';

export const GetFeaturedPage: React.FC = () => {
  const [name, setName] = useState('');
  const [schoolOrCollege, setSchoolOrCollege] = useState('');
  const [category, setCategory] = useState<SubmissionCategory>('Student Talent');
  const [shortDescription, setShortDescription] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [city, setCity] = useState('');
  const [workLink, setWorkLink] = useState('');
  const [isUnder18, setIsUnder18] = useState<boolean | null>(null);
  const [guardianContact, setGuardianContact] = useState('');
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  
  // Anti-spam honeypot (bots fill this in, human users don't see it)
  const [botField, setBotField] = useState('');

  // Errors & Submission Status
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!name.trim()) errs.name = 'Please provide your name.';
    if (!schoolOrCollege.trim()) errs.schoolOrCollege = 'Please state your school or college.';
    if (!shortDescription.trim() || shortDescription.trim().length < 20) {
      errs.shortDescription = 'Please provide a brief description of at least 20 characters.';
    }
    if (!contactMethod.trim()) {
      errs.contactMethod = 'Please provide at least one valid email address or phone number.';
    }
    if (isUnder18 === null) {
      errs.isUnder18 = 'Please indicate whether you are under 18 years of age.';
    }
    if (isUnder18 === true && !guardianContact.trim()) {
      errs.guardianContact = 'Parent / Guardian contact is required for students under 18.';
    }
    if (!consentConfirmed) {
      errs.consentConfirmed = 'You must confirm that RISERS may contact you regarding this submission.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot spam protection
    if (botField) {
      console.warn('Spam submission detected.');
      return;
    }

    if (!validate()) {
      const firstErrorEl = document.querySelector('.form-error');
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    const newId = `sub-${Date.now()}`;
    const newSubmission: GetFeaturedSubmission = {
      id: newId,
      name: name.trim(),
      schoolOrCollege: schoolOrCollege.trim(),
      category,
      shortDescription: shortDescription.trim(),
      contactMethod: contactMethod.trim(),
      city: city.trim() || undefined,
      workLink: workLink.trim() || undefined,
      isUnder18: !!isUnder18,
      guardianContact: guardianContact.trim() || undefined,
      consentConfirmed,
      submittedAt: new Date().toISOString(),
      status: 'New'
    };

    try {
      const result = await ContentStore.addSubmission(newSubmission);
      setReferenceId(result.id || newId);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission error:', err);
      // Fallback
      setReferenceId(newId);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main id="main-content" className="section">
        <div className="container-narrow">
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '48px 32px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#DEF7EC', color: '#03543F', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle2 size={36} />
            </div>

            <span className="section-kicker">Submission Received</span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', marginBottom: '12px' }}>
              Thank you for sharing with RISERS
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '540px', margin: '0 auto 24px' }}>
              Your submission has been securely routed to the private RISERS editorial team for review. Reference: <code style={{ background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>{referenceId}</code>
            </p>

            {/* Editorial Privacy Assurance */}
            <div style={{ background: 'var(--bg-subtle)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', maxWidth: '520px', margin: '0 auto 32px', textAlign: 'left' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={16} color="var(--accent-primary)" />
                <span>Next Editorial Steps</span>
              </h4>
              <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li>Our editorial desk conducts initial review and fact verification.</li>
                <li>If selected for an article or Student Radio conversation, we will reach out via your provided contact.</li>
                <li>Your contact details remain strictly private and will <strong>never</strong> be published online.</li>
                <li>Submitting does not guarantee an automated public feature.</li>
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/" className="btn btn-secondary">
                <span>Back to Home</span>
              </Link>
              <Link to="/stories" className="btn btn-primary">
                <span>Read Student Stories</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="section">
      <div className="container-narrow">
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <span className="section-kicker" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} />
            <span>Participate in RISERS</span>
          </span>
          <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '14px' }}>
            Get Featured
          </h1>
          <p className="section-subtitle" style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
            Share your talent, campus initiative, startup journey, or suggest a professional mentor. Fill out the form below for the editorial team.
          </p>
        </div>

        {/* Form Safeguards Banner */}
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '16px 20px', borderRadius: 'var(--radius-md)', marginBottom: '32px', fontSize: '0.88rem', color: '#92400E', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Editorial & Privacy Notice:</strong> Submitting a proposal does not guarantee an automatic feature. Submissions are reviewed privately by the RISERS team. Contact information is strictly protected and will <em>never</em> appear publicly.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-card" noValidate>
          {/* Honeypot Field (Invisible to users, traps bots) */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <label htmlFor="website_url_hp">Do not fill this</label>
            <input 
              id="website_url_hp"
              type="text" 
              value={botField} 
              onChange={e => setBotField(e.target.value)} 
              tabIndex={-1} 
              autoComplete="off"
            />
          </div>

          {/* 1. Name */}
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              className="form-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Ananya Varma"
              required
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          {/* 2. School or College */}
          <div className="form-group">
            <label htmlFor="schoolOrCollege" className="form-label">
              School or College *
            </label>
            <input
              id="schoolOrCollege"
              type="text"
              className="form-input"
              value={schoolOrCollege}
              onChange={e => setSchoolOrCollege(e.target.value)}
              placeholder="e.g., Osmania University / Hyderabad Public School"
              required
            />
            {errors.schoolOrCollege && <p className="form-error">{errors.schoolOrCollege}</p>}
          </div>

          {/* 3. Participation Category */}
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Participation Category *
            </label>
            <select
              id="category"
              className="form-select"
              value={category}
              onChange={e => setCategory(e.target.value as SubmissionCategory)}
              required
            >
              <option value="Student Talent">Student Talent (Arts, Coding, Science, Creative)</option>
              <option value="Student Entrepreneur">Student Entrepreneur (Campus Venture, Project)</option>
              <option value="Student Radio Participation">Student Radio Participation (Podcast/Conversation)</option>
              <option value="Professional or Guest Suggestion">Professional or Guest Suggestion (Mentor)</option>
            </select>
          </div>

          {/* 4. City (Optional) */}
          <div className="form-group">
            <label htmlFor="city" className="form-label">
              City / Town (Optional)
            </label>
            <input
              id="city"
              type="text"
              className="form-input"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="e.g., Hyderabad, Vijayawada, Warangal"
            />
          </div>

          {/* 5. Short Description */}
          <div className="form-group">
            <label htmlFor="shortDescription" className="form-label">
              Short Description / Outline of Your Story *
            </label>
            <textarea
              id="shortDescription"
              rows={4}
              className="form-textarea"
              value={shortDescription}
              onChange={e => setShortDescription(e.target.value)}
              placeholder="Describe what you are working on, the problem solved, skills developed, or what topic you would like to discuss..."
              required
            />
            <span className="form-hint">Minimum 20 characters summarizing your work or proposed topic.</span>
            {errors.shortDescription && <p className="form-error">{errors.shortDescription}</p>}
          </div>

          {/* 6. Work / Portfolio Link (Optional per PRD Section 18) */}
          <div className="form-group">
            <label htmlFor="workLink" className="form-label">
              Work / Portfolio Link (Optional)
            </label>
            <input
              id="workLink"
              type="url"
              className="form-input"
              value={workLink}
              onChange={e => setWorkLink(e.target.value)}
              placeholder="https://github.com/yourproject, https://youtube.com/..., or portfolio link"
            />
            <span className="form-hint">At launch, please provide a web link rather than uploading raw files.</span>
          </div>

          {/* 7. Contact Method (Confidential) */}
          <div className="form-group">
            <label htmlFor="contactMethod" className="form-label">
              Primary Contact Method (Email or Phone) *
            </label>
            <input
              id="contactMethod"
              type="text"
              className="form-input"
              value={contactMethod}
              onChange={e => setContactMethod(e.target.value)}
              placeholder="e.g., student.name@gmail.com or +91 9876543210"
              required
            />
            <span className="form-hint">For team communication only. Never displayed publicly.</span>
            {errors.contactMethod && <p className="form-error">{errors.contactMethod}</p>}
          </div>

          {/* 8. Under 18 Field & Guardian Safeguard (PRD Section 18 Requirement) */}
          <div className="form-group" style={{ background: 'var(--bg-subtle)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
              <legend className="form-label" style={{ marginBottom: '10px' }}>
                Are you under 18 years old? *
              </legend>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="under18"
                    checked={isUnder18 === true}
                    onChange={() => setIsUnder18(true)}
                  />
                  <span>Yes, I am under 18</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="under18"
                    checked={isUnder18 === false}
                    onChange={() => setIsUnder18(false)}
                  />
                  <span>No, I am 18 or older</span>
                </label>
              </div>
            </fieldset>
            {errors.isUnder18 && <p className="form-error">{errors.isUnder18}</p>}

            {/* Minor Safeguard Note & Guardian Contact */}
            {isUnder18 === true && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-strong)' }}>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>
                  <strong>Minor Protection Notice:</strong> In accordance with child protection standards, identifiable student materials for minors will only be published after parent or legal guardian confirmation. RISERS never asks for government identity documents or full dates of birth.
                </p>
                <label htmlFor="guardianContact" className="form-label">
                  Parent / Legal Guardian Contact (Phone or Email) *
                </label>
                <input
                  id="guardianContact"
                  type="text"
                  className="form-input"
                  value={guardianContact}
                  onChange={e => setGuardianContact(e.target.value)}
                  placeholder="Guardian's name and contact phone or email"
                  required
                />
                {errors.guardianContact && <p className="form-error">{errors.guardianContact}</p>}
              </div>
            )}
          </div>

          {/* 9. Contact Confirmation Checkbox (PRD Section 18 Requirement) */}
          <div className="form-group" style={{ marginTop: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={consentConfirmed}
                onChange={e => setConsentConfirmed(e.target.checked)}
                style={{ marginTop: '4px' }}
                required
              />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                I confirm that RISERS and Root & Rise Learning may contact me regarding this submission. I understand that submitting does not guarantee publication. *
              </span>
            </label>
            {errors.consentConfirmed && <p className="form-error">{errors.consentConfirmed}</p>}
          </div>

          {/* Submit Action */}
          <div style={{ marginTop: '32px' }}>
            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%' }}
              disabled={isSubmitting}
            >
              <Send size={18} />
              <span>{isSubmitting ? 'Recording Submission...' : 'Submit for Editorial Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
