import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="site-header">
        <div className="container nav-inner">
          <Link to="/" className="brand-group" onClick={closeMenu}>
            <span className="brand-wordmark">RISERS</span>
            <span className="brand-attribution">An initiative by Root & Rise Learning</span>
          </Link>

          {/* Launch Navigation (Strictly 5 items per PRD) */}
          <nav aria-label="Main Navigation">
            <ul className="nav-links">
              <li>
                <NavLink 
                  to="/" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  end
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/stories" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  Student Stories
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/radio" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  Student Radio
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/interviews" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  Professional Interviews
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/about" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  About
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="nav-actions">
            <Link to="/get-featured" className="btn btn-primary btn-sm">
              <span>GET FEATURED</span>
              <ArrowUpRight size={16} />
            </Link>

            <button
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-menu-drawer" id="mobile-menu">
            <ul className="mobile-menu-links">
              <li>
                <Link to="/" className="mobile-nav-link" onClick={closeMenu}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/stories" className="mobile-nav-link" onClick={closeMenu}>
                  Student Stories
                </Link>
              </li>
              <li>
                <Link to="/radio" className="mobile-nav-link" onClick={closeMenu}>
                  Student Radio
                </Link>
              </li>
              <li>
                <Link to="/interviews" className="mobile-nav-link" onClick={closeMenu}>
                  Professional Interviews
                </Link>
              </li>
              <li>
                <Link to="/about" className="mobile-nav-link" onClick={closeMenu}>
                  About
                </Link>
              </li>
            </ul>
            <div style={{ paddingTop: '8px' }}>
              <Link 
                to="/get-featured" 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                onClick={closeMenu}
              >
                GET FEATURED
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
