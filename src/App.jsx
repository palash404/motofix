/**
 * MotoFix – Root App Component
 * Sets up global context providers, layout header/footer, and view routing
 * for Homepage, Services, Login, Sign Up, Home Repair, Service Repair, and Breakdown Assistance.
 *
 * Auth-gated booking: unauthenticated users clicking any booking CTA are
 * redirected to Login with a returnTo destination; after login they land on
 * their intended booking page.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { BOOKING_TYPES } from './utils/constants';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import ServicesPage from './components/services/ServicesPage';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import HomeBikeRepairPage from './components/booking/HomeBikeRepairPage';
import ServiceRepairPage from './components/booking/ServiceRepairPage';
import BreakdownAssistancePage from './components/booking/BreakdownAssistancePage';
import BookingConfirmationPage from './components/booking/BookingConfirmationPage';
import ContactPage from './components/contact/ContactPage';

/** Hash → view name mapping */
function hashToView(hash) {
  const cleanHash = (hash || '').split('?')[0];
  if (cleanHash === '#services') return 'services';
  if (cleanHash === '#login') return 'login';
  if (cleanHash === '#signup') return 'signup';
  if (cleanHash === '#book-home' || cleanHash === '#home-repair') return 'home-repair';
  if (cleanHash === '#book-service' || cleanHash === '#service-repair') return 'service-repair';
  if (cleanHash === '#book-breakdown' || cleanHash === '#breakdown') return 'breakdown';
  if (cleanHash === '#booking-confirmation' || cleanHash === '#track-repair' || cleanHash === '#confirmed') return 'booking-confirmation';
  if (cleanHash === '#contact' || cleanHash === '#contact-us') return 'contact';
  return 'home';
}

/** View → canonical hash mapping */
function viewToHash(view) {
  const map = {
    services: '#services',
    login: '#login',
    signup: '#signup',
    'home-repair': '#book-home',
    'service-repair': '#book-service',
    breakdown: '#book-breakdown',
    'booking-confirmation': '#track-repair',
    contact: '#contact',
  };
  return map[view] ?? '#home';
}

/** Booking views that require authentication */
const BOOKING_VIEWS = new Set(['home-repair', 'service-repair', 'breakdown', 'booking-confirmation']);

function AppInner() {
  const { isAuthenticated, loading } = useAuth();

  const [currentView, setCurrentView] = useState(() =>
    hashToView(window.location.hash)
  );

  // Transition state: 'idle' | 'covering' | 'revealing'
  const [transitionPhase, setTransitionPhase] = useState('idle');

  const currentViewRef = useRef(currentView);
  currentViewRef.current = currentView;

  const isTransitioningRef = useRef(false);
  const pendingTargetRef = useRef(null);

  const transitionTimerRef = useRef(null);
  const phaseTimerRef = useRef(null);

  // Clean up animation timers on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    };
  }, []);

  /**
   * returnTo: the booking view to navigate to after successful login.
   * Stored in sessionStorage so a page refresh doesn't lose the destination.
   */
  const [returnTo, setReturnTo] = useState(() =>
    sessionStorage.getItem('motofix_returnTo') || null
  );

  // Keep returnTo in sessionStorage in sync
  useEffect(() => {
    if (returnTo) {
      sessionStorage.setItem('motofix_returnTo', returnTo);
    } else {
      sessionStorage.removeItem('motofix_returnTo');
    }
  }, [returnTo]);

  /**
   * Core transition controller:
   * 1. Yellow overlay sweeps horizontally across viewport (150ms).
   * 2. View switch occurs underneath overlay at mid-point with instant scroll-to-top.
   * 3. Yellow overlay sweeps away (150ms) to reveal destination page.
   * Total duration: 300ms.
   */
  const executeTransition = useCallback((targetView, updateHash = true, customHash = null) => {
    if (targetView === currentViewRef.current && !customHash) {
      return;
    }

    if (isTransitioningRef.current) {
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      pendingTargetRef.current = targetView;
      if (updateHash) {
        window.location.hash = customHash || viewToHash(targetView);
      }
      setCurrentView(targetView);
      window.scrollTo({ top: 0, behavior: 'instant' });
      pendingTargetRef.current = null;
      return;
    }

    isTransitioningRef.current = true;
    pendingTargetRef.current = targetView;

    if (updateHash) {
      window.location.hash = customHash || viewToHash(targetView);
    }

    // Step 1: Yellow overlay sweeps in over current page (150ms)
    setTransitionPhase('covering');

    transitionTimerRef.current = setTimeout(() => {
      // Step 2: Switch view underneath overlay and reset scroll
      setCurrentView(targetView);
      window.scrollTo({ top: 0, behavior: 'instant' });
      pendingTargetRef.current = null;

      // Step 3: Yellow overlay sweeps away to reveal destination page (150ms)
      setTransitionPhase('revealing');

      phaseTimerRef.current = setTimeout(() => {
        // Step 4: Complete transition (300ms total)
        setTransitionPhase('idle');
        isTransitioningRef.current = false;
      }, 150);
    }, 150);
  }, []);

  // Sync hash → view on back/forward navigation (normal navigation, no hazard-stripe transition)
  useEffect(() => {
    const handleHashChange = () => {
      const next = hashToView(window.location.hash);

      // Auth guard: if navigating directly to a booking route while logged out
      if (BOOKING_VIEWS.has(next) && !isAuthenticated) {
        setReturnTo(next);
        window.location.hash = '#login';
        return;
      }

      // Avoid re-triggering if already matching or transitioning
      if (next === currentViewRef.current || next === pendingTargetRef.current) {
        return;
      }

      // Browser back/forward navigation: instant view update without hazard-stripe transition
      setCurrentView(next);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated]);

  /**
   * Standard navigation (Navbar, Footer, Auth, Contact, Back/Forward).
   * Navigates directly without triggering the hazard-stripe wipe overlay.
   */
  const navigateTo = (view) => {
    if (view === currentViewRef.current) return;
    setCurrentView(view);
    window.location.hash = viewToHash(view);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  /**
   * Group A: Three "BOOK NOW" buttons on the Services page.
   * Plays the hazard-stripe transition to the selected service booking form.
   */
  const handleServicesBookNow = (type) => {
    let targetView;
    if (type === BOOKING_TYPES.HOME_REPAIR) {
      targetView = 'home-repair';
    } else if (type === BOOKING_TYPES.SERVICE_CENTER) {
      targetView = 'service-repair';
    } else if (type === BOOKING_TYPES.BREAKDOWN) {
      targetView = 'breakdown';
    } else {
      navigateTo('services');
      return;
    }

    if (!isAuthenticated) {
      setReturnTo(targetView);
      executeTransition('login', true);
    } else {
      executeTransition(targetView, true);
    }
  };

  /**
   * Hero buttons ("BOOK A MECHANIC", "BOOK A SERVICE").
   * Navigates directly without hazard-stripe transition.
   */
  const handleHeroBookingNavigate = (type) => {
    let targetView;
    if (type === BOOKING_TYPES.HOME_REPAIR) {
      targetView = 'home-repair';
    } else if (type === BOOKING_TYPES.SERVICE_CENTER) {
      targetView = 'service-repair';
    } else if (type === BOOKING_TYPES.BREAKDOWN) {
      targetView = 'breakdown';
    } else {
      navigateTo('services');
      return;
    }

    if (!isAuthenticated) {
      setReturnTo(targetView);
      navigateTo('login');
    } else {
      navigateTo(targetView);
    }
  };

  /**
   * Called by LoginPage on successful authentication.
   * Clears returnTo and sends the user to their intended destination.
   */
  const handleLoginSuccess = (destination) => {
    const target = destination && BOOKING_VIEWS.has(destination) ? destination : 'home';
    setReturnTo(null);
    navigateTo(target);
  };

  /** Called by Navbar's Login link — remembers where user was */
  const handleLoginClick = () => {
    if (currentView !== 'login' && currentView !== 'signup') {
      const nonBookingReturn = BOOKING_VIEWS.has(currentView) ? 'home' : currentView;
      setReturnTo(nonBookingReturn === 'home' ? null : nonBookingReturn);
    }
    navigateTo('login');
  };

  /** Open Sign Up page (called from Login page's Sign up link) */
  const handleSignUpClick = () => {
    navigateTo('signup');
  };

  /** Sign Up → back to Login (called from SignUpPage's Login link or after success) */
  const handleGoToLogin = (preservedReturnTo) => {
    // preservedReturnTo may be passed from SignUpPage to keep the booking destination alive
    if (preservedReturnTo && BOOKING_VIEWS.has(preservedReturnTo)) {
      setReturnTo(preservedReturnTo);
    }
    navigateTo('login');
  };

  // Wait for auth hydration from localStorage before rendering guarded views
  if (loading) return null;

  // Runtime auth guard: if the current view is a booking view but user is not authed,
  // redirect to login (handles direct hash navigation on page load).
  let activeView = currentView;
  if (BOOKING_VIEWS.has(currentView) && !isAuthenticated) {
    activeView = 'login';
  }

  const handleBookingCompleted = (createdBooking) => {
    const refCode = createdBooking?.bookingReference;
    const targetHash = refCode
      ? `#booking-confirmation?ref=${encodeURIComponent(refCode)}`
      : '#booking-confirmation';
    executeTransition('booking-confirmation', true, targetHash);
  };

  return (
    <>
      <Navbar
        currentView={activeView}
        onNavigate={navigateTo}
        onLoginClick={handleLoginClick}
      />
      {transitionPhase !== 'idle' && (
        <div
          key={transitionPhase}
          className={`page-transition-wipe page-transition-wipe--${transitionPhase}`}
          aria-hidden="true"
        />
      )}
      <main>
        <div key={activeView} className="page-content-entrance">
          {activeView === 'services' ? (
            <ServicesPage onNavigateToBooking={handleServicesBookNow} />
          ) : activeView === 'login' ? (
            <LoginPage
              returnTo={returnTo}
              onLoginSuccess={handleLoginSuccess}
              onNavigate={navigateTo}
              onSignUpClick={handleSignUpClick}
            />
          ) : activeView === 'signup' ? (
            <SignUpPage
              returnTo={returnTo}
              onGoToLogin={handleGoToLogin}
            />
          ) : activeView === 'home-repair' ? (
            <HomeBikeRepairPage onComplete={handleBookingCompleted} />
          ) : activeView === 'service-repair' ? (
            <ServiceRepairPage onComplete={handleBookingCompleted} />
          ) : activeView === 'breakdown' ? (
            <BreakdownAssistancePage onComplete={handleBookingCompleted} />
          ) : activeView === 'booking-confirmation' ? (
            <BookingConfirmationPage onNavigate={navigateTo} />
          ) : activeView === 'contact' ? (
            <ContactPage />
          ) : (
            <Hero onBookingNavigate={handleHeroBookingNavigate} />
          )}
        </div>
      </main>
      <Footer onNavigate={navigateTo} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <AppInner />
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
