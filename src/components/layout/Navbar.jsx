/**
 * MotoFix – Navbar
 * Fixed header: logo | nav links | BOOK NOW | hamburger (mobile)
 * Supports route-aware active state for Services and Login pages,
 * and dynamic Login / Logout display based on session auth.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo-transparent.png';
import './Navbar.css';

function Navbar({ currentView = 'home', onNavigate, onLoginClick }) {
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { label: 'Services', href: '#services', key: 'services' },
    { label: 'Track Repair', href: '#track-repair', key: 'track' },
    isAuthenticated
      ? { label: 'Logout', href: '#logout', key: 'logout' }
      : { label: 'Login', href: '#login', key: 'login' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setMenuOpen(false);

  const handleLinkClick = (e, key) => {
    close();
    if (!onNavigate) return;

    if (key === 'services') {
      e.preventDefault();
      onNavigate('services');
    } else if (key === 'track') {
      e.preventDefault();
      onNavigate('booking-confirmation');
    } else if (key === 'login') {
      e.preventDefault();
      if (onLoginClick) {
        onLoginClick();
      } else {
        onNavigate('login');
      }
    } else if (key === 'logout') {
      e.preventDefault();
      logout();
      onNavigate('home');
    } else if (key === 'home') {
      e.preventDefault();
      onNavigate('home');
    }
  };

  const isActive = (key) => {
    if (key === 'services') return currentView === 'services';
    if (key === 'track') return currentView === 'booking-confirmation';
    if (key === 'login') return currentView === 'login' || currentView === 'signup';
    return false;
  };

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="banner">
      <div className="navbar__inner">

        {/* ── Logo ── */}
        <a
          href="#home"
          className="navbar__logo"
          onClick={(e) => handleLinkClick(e, 'home')}
          aria-label="MotoFix home"
        >
          <img src={logoImg} alt="MotoFix" className="navbar__logo-img" />
        </a>

        {/* ── Desktop navigation ── */}
        <nav className="navbar__nav" aria-label="Main navigation">
          <ul className="navbar__links">
            {navLinks.map(({ label, href, key }) => (
              <li key={key}>
                <a
                  href={href}
                  className={`navbar__link nav-link-interactive${isActive(key) ? ' active' : ''}`}
                  onClick={(e) => handleLinkClick(e, key)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── BOOK NOW (desktop) ── */}
        <a
          href="#services"
          className="btn btn--primary navbar__cta"
          onClick={(e) => handleLinkClick(e, 'services')}
        >
          BOOK NOW
        </a>

        {/* ── Hamburger (mobile) ── */}
        <button
          className={`navbar__hamburger${menuOpen ? ' navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className="navbar__bar" />
          <span className="navbar__bar" />
          <span className="navbar__bar" />
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        className={`navbar__mobile${menuOpen ? ' navbar__mobile--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        {navLinks.map(({ label, href, key }) => (
          <a
            key={key}
            href={href}
            className={`navbar__mobile-link nav-link-interactive${isActive(key) ? ' active' : ''}`}
            onClick={(e) => handleLinkClick(e, key)}
          >
            {label}
          </a>
        ))}
        <a
          href="#services"
          className="btn btn--primary navbar__mobile-cta"
          onClick={(e) => handleLinkClick(e, 'services')}
        >
          BOOK NOW
        </a>
      </div>
    </header>
  );
}

export default Navbar;
