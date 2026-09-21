import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & Purpose */}
          <div>
            <div style={{ marginBottom: '14px' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'block' }}>
                RISERS
              </span>
              <span style={{ fontSize: '0.8rem', color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                An initiative by Root & Rise Learning
              </span>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '340px', marginBottom: '20px' }}>
              “There’s more than one way to rise.” A credible student media platform bringing together student talent, entrepreneurship, and professional learning.
            </p>
            <div style={{ display: 'flex', gap: '14px' }}>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="RISERS on YouTube"
                style={{ color: '#CBD5E1', transition: 'color 0.15s' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="RISERS on LinkedIn"
                style={{ color: '#CBD5E1', transition: 'color 0.15s' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="RISERS on Instagram"
                style={{ color: '#CBD5E1', transition: 'color 0.15s' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="RISERS on X"
                style={{ color: '#CBD5E1', transition: 'color 0.15s' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links">
              <li><Link to="/stories" className="footer-link">Student Stories</Link></li>
              <li><Link to="/radio" className="footer-link">Student Radio</Link></li>
              <li><Link to="/interviews" className="footer-link">Professional Interviews</Link></li>
              <li><Link to="/about" className="footer-link">About RISERS</Link></li>
              <li><Link to="/get-featured" className="footer-link">Get Featured</Link></li>
            </ul>
          </div>

          {/* Verification & Policies */}
          <div>
            <h4 className="footer-heading">Editorial & Legal</h4>
            <ul className="footer-links">
              <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/terms" className="footer-link">Publishing Terms</Link></li>
              <li><Link to="/terms#consent" className="footer-link">Minor Consent Rules</Link></li>
              <li><Link to="/contact#corrections" className="footer-link">Corrections & Removals</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="footer-heading">Contact & Desk</h4>
            <ul className="footer-links">
              <li style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} />
                <span>contact@risers.org</span>
              </li>
              <li style={{ color: '#94A3B8', fontSize: '0.84rem', marginTop: '6px' }}>
                Editorial Desk: Root & Rise Learning Foundation, Hyderabad / Vijayawada
              </li>
              <li style={{ marginTop: '12px' }}>
                <Link to="/contact" className="btn btn-secondary btn-sm" style={{ background: '#1E293B', color: '#FFFFFF', borderColor: '#334155' }}>
                  Contact Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Admin link */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} RISERS. An initiative by Root & Rise Learning. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={15} color="#10B981" />
              <span>Verified Student Media Platform</span>
            </span>
            <span>•</span>
            <Link to="/admin" style={{ color: '#64748B', textDecoration: 'underline' }}>
              Editorial CMS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
