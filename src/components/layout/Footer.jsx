/**
 * MotoFix – Footer
 * Cursor-triggered piston-style footer:
 * - Hidden below viewport by default.
 * - Revealed when the cursor enters a 40px trigger zone at the viewport bottom.
 * - Retracted when the cursor leaves both the trigger zone and the footer.
 * - Touch devices: tap a persistent trigger strip to toggle.
 * - Keyboard: footer reveals when any footer link receives focus.
 * - Respects prefers-reduced-motion.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import './Footer.css';

const FOOTER_LINKS = [
  { label: 'Contact Us', href: '#contact', key: 'contact' },
];

/** Trigger zone height in pixels at the bottom of the viewport. */
const TRIGGER_HEIGHT = 40;

/** Retraction delay (ms) — prevents flicker when moving between trigger/footer. */
const RETRACT_DELAY = 120;

function Footer({ onNavigate }) {
  const [visible, setVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const retractTimer = useRef(null);
  const footerRef = useRef(null);
  const triggerRef = useRef(null);

  // Detect touch-primary devices on mount
  useEffect(() => {
    const mql = window.matchMedia('(pointer: coarse)');
    setIsTouchDevice(mql.matches);
    const handler = (e) => setIsTouchDevice(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  /* ── Helpers ──────────────────────────────────────────────── */
  const clearRetract = useCallback(() => {
    if (retractTimer.current) {
      clearTimeout(retractTimer.current);
      retractTimer.current = null;
    }
  }, []);

  const reveal = useCallback(() => {
    clearRetract();
    setVisible(true);
  }, [clearRetract]);

  const scheduleRetract = useCallback(() => {
    clearRetract();
    retractTimer.current = setTimeout(() => setVisible(false), RETRACT_DELAY);
  }, [clearRetract]);

  /* ── Mouse-driven trigger (non-touch) ────────────────────── */
  useEffect(() => {
    if (isTouchDevice) return;

    const onMouseMove = (e) => {
      const inTriggerZone = e.clientY >= window.innerHeight - TRIGGER_HEIGHT;
      if (inTriggerZone) {
        reveal();
      }
      // Retraction is handled by pointerleave on the footer + trigger wrapper
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [isTouchDevice, reveal]);

  /* ── Clean up retract timer on unmount ───────────────────── */
  useEffect(() => {
    return () => clearRetract();
  }, [clearRetract]);

  /* ── Pointer leave from the footer+trigger combined area ─── */
  const handleWrapperLeave = useCallback(
    (e) => {
      if (isTouchDevice) return;
      // Only retract if the cursor truly left the wrapper (not into a child)
      const wrapper = e.currentTarget;
      const related = e.relatedTarget;
      if (related && wrapper.contains(related)) return;
      scheduleRetract();
    },
    [isTouchDevice, scheduleRetract]
  );

  const handleWrapperEnter = useCallback(() => {
    if (!isTouchDevice) reveal();
  }, [isTouchDevice, reveal]);

  /* ── Touch: tap trigger strip to toggle ──────────────────── */
  const handleTouchToggle = useCallback(() => {
    setVisible((v) => !v);
  }, []);

  /* ── Keyboard: reveal footer when a link inside receives focus */
  const handleFocusIn = useCallback(() => {
    reveal();
  }, [reveal]);

  const handleFocusOut = useCallback(
    (e) => {
      // If focus is leaving the footer entirely, retract
      if (footerRef.current && !footerRef.current.contains(e.relatedTarget)) {
        scheduleRetract();
      }
    },
    [scheduleRetract]
  );

  const handleLinkClick = (e, key, href) => {
    if (key === 'contact' || href === '#contact' || href === '#contact-us') {
      e.preventDefault();
      scheduleRetract();
      if (onNavigate) {
        onNavigate('contact');
      } else {
        window.location.hash = '#contact';
      }
    }
  };

  return (
    <div
      className="footer-piston-wrapper"
      onMouseEnter={handleWrapperEnter}
      onMouseLeave={handleWrapperLeave}
    >
      {/* Invisible trigger zone — always at viewport bottom */}
      <div
        ref={triggerRef}
        className={`footer-trigger${isTouchDevice ? ' footer-trigger--touch' : ''}`}
        role="button"
        tabIndex={-1}
        aria-label="Show footer"
        aria-hidden={!isTouchDevice}
        onClick={isTouchDevice ? handleTouchToggle : undefined}
      />

      {/* The actual footer */}
      <footer
        ref={footerRef}
        className={`footer footer--piston${visible ? ' footer--visible' : ''}`}
        role="contentinfo"
        onFocus={handleFocusIn}
        onBlur={handleFocusOut}
      >
        <div className="footer__inner">
          {/* Left tagline */}
          <p className="footer__tagline">Your bike. Our fix.</p>

          {/* Right nav links */}
          <nav className="footer__nav" aria-label="Footer navigation">
            {FOOTER_LINKS.map(({ label, href, key }) => (
              <a
                key={label}
                href={href}
                className="footer__link nav-link-interactive"
                onClick={(e) => handleLinkClick(e, key, href)}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
