/**
 * MotoFix – Booking Confirmation and Service Tracking Page
 * Renders the exact confirmation layout from the reference design:
 * - Yellow "Booking Confirmed!" heading and subtitle
 * - Black rounded main card
 *   - Left: Booking Reference box with copy button and motorcycle image
 *   - Right: Booking Details heading + 2x2 grid of details cards with dark pills
 * - Black rounded "What happens next?" card with 4-stage tracking timeline
 * Supports direct links / reload via URL query param (?ref=...) or context.
 */

import { useState, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import { bookingApi } from '../../services/api';
import bikeImage from '../../assets/images/motorcycle-confirmed.png';
import './BookingConfirmationPage.css';

/* ── SVG Icons ── */

function CopyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function CircleCheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <span className="tracking-step__arrow" aria-hidden="true">
      <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
        <path d="M1.5 1.5L8 8L1.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function BookingConfirmationPage({ bookingData, onNavigate }) {
  const { confirmedBooking, setConfirmedBooking } = useBooking();
  const [activeBooking, setActiveBooking] = useState(bookingData || confirmedBooking || null);
  const [loading, setLoading] = useState(!activeBooking);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Extract reference from window hash: e.g. #booking-confirmation?ref=MF250614001 or #track-repair?ref=...
  useEffect(() => {
    let isMounted = true;

    async function loadBooking() {
      // If booking was passed via props or context, use it immediately
      if (bookingData) {
        setActiveBooking(bookingData);
        setLoading(false);
        return;
      }
      if (confirmedBooking) {
        setActiveBooking(confirmedBooking);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // Check URL hash for ref parameter
      const hash = window.location.hash || '';
      const queryIdx = hash.indexOf('?');
      let urlRef = null;
      if (queryIdx !== -1) {
        const params = new URLSearchParams(hash.substring(queryIdx));
        urlRef = params.get('ref');
      }

      try {
        let fetched = null;
        if (urlRef) {
          fetched = await bookingApi.getByRef(urlRef);
        } else {
          fetched = await bookingApi.getLatest();
        }

        if (isMounted) {
          if (fetched && fetched.bookingReference) {
            setActiveBooking(fetched);
            setConfirmedBooking(fetched);
          } else {
            setError('No recent booking found.');
          }
        }
      } catch (err) {
        if (isMounted) {
          if (err.status === 404) {
            setError('You do not have any active service bookings yet.');
          } else {
            setError(err.message || 'Could not retrieve your booking.');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadBooking();

    return () => {
      isMounted = false;
    };
  }, [bookingData, confirmedBooking, setConfirmedBooking]);

  const handleCopy = () => {
    if (!activeBooking?.bookingReference) return;
    const refCode = activeBooking.bookingReference.startsWith('#')
      ? activeBooking.bookingReference
      : `#${activeBooking.bookingReference}`;

    navigator.clipboard.writeText(refCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="confirmed-page">
        <div className="confirmed-loading-card">
          <div className="confirmed-loading-spinner" />
          <h2>Loading booking details...</h2>
          <p>Please wait while we retrieve your confirmation information.</p>
        </div>
      </div>
    );
  }

  if (error || !activeBooking) {
    return (
      <div className="confirmed-page">
        <div className="confirmed-loading-card">
          <h2>No Active Booking Found</h2>
          <p>{error || 'You do not have any active service bookings yet.'}</p>
          <button
            type="button"
            className="confirmed-btn-primary"
            onClick={() => onNavigate && onNavigate('services')}
          >
            Explore Services
          </button>
        </div>
      </div>
    );
  }

  const rawRef = activeBooking.bookingReference || 'MF250614001';
  const displayRef = rawRef.startsWith('#') ? rawRef : `#${rawRef}`;

  const packageTitle = activeBooking.packageType || 'General Service';
  const descriptionText = activeBooking.description || 'Full checkup, oil change, and essential maintenance.';
  const bikeModelText = activeBooking.bikeModel || 'Yamaha FZ-S';
  const regNumberText = activeBooking.regNumber || 'WB12AB3456';
  const bikeYearText = activeBooking.bikeYear || '2022';
  const addressText = activeBooking.address || '123 Park Street, Kolkata, West Bengal 700016';
  const preferredDateText = activeBooking.preferredDate || '17 Jun 2025';
  const preferredTimeText = activeBooking.preferredTime || '10:00 AM - 12:00 PM';

  return (
    <div className="confirmed-page">
      <div className="confirmed-container">

        {/* ── Heading & Subtitle ── */}
        <header className="confirmed-header">
          <h1 className="confirmed-title">Booking Confirmed!</h1>
          <p className="confirmed-subtitle">
            Your service booking has been successfully created. We will keep you updated on the progress of your service
          </p>
        </header>

        {/* ── Main Black Booking Card ── */}
        <section className="confirmed-card" aria-label="Booking Details">

          {/* Left Column: Reference box + Motorcycle image */}
          <div className="confirmed-left">
            <div className="ref-box">
              <span className="ref-box__label">Booking Reference</span>
              <div className="ref-box__value-row">
                <span className="ref-box__code">{displayRef}</span>
                <button
                  type="button"
                  className="ref-box__copy-btn"
                  onClick={handleCopy}
                  title="Copy Reference Code"
                  aria-label="Copy booking reference"
                >
                  {copied ? (
                    <>
                      <CheckIcon />
                      <span className="ref-box__copy-feedback">Copied!</span>
                    </>
                  ) : (
                    <CopyIcon />
                  )}
                </button>
              </div>
            </div>

            <div className="confirmed-bike-wrap">
              <img
                src={bikeImage}
                alt="Motorcycle Confirmed"
                className="confirmed-bike-img"
              />
            </div>
          </div>

          {/* Right Column: Heading + 2x2 Details Grid */}
          <div className="confirmed-right">
            <h2 className="confirmed-details-title">Booking Details</h2>

            <div className="details-grid">
              {/* Card 1: Service details */}
              <div className="detail-outer-card">
                <span className="detail-outer-label">Service Details</span>
                <div className="detail-inner-pill detail-inner-pill--tall">
                  <h3 className="detail-pill-title">{packageTitle}</h3>
                  <p className="detail-pill-sub">{descriptionText}</p>
                </div>
              </div>

              {/* Card 2: Vehicle details */}
              <div className="detail-outer-card">
                <span className="detail-outer-label">Vehicle details</span>
                <div className="detail-inner-pill detail-inner-pill--tall">
                  <h3 className="detail-pill-title">{bikeModelText}</h3>
                  <p className="detail-pill-sub">Registration: {regNumberText}</p>
                  <p className="detail-pill-sub">Year: {bikeYearText}</p>
                </div>
              </div>

              {/* Card 3: Service Address */}
              <div className="detail-outer-card">
                <span className="detail-outer-label">Service Address</span>
                <div className="detail-inner-pill detail-inner-pill--tall">
                  <p className="detail-pill-title" style={{ fontSize: '13px', fontWeight: '600', lineHeight: '1.35' }}>
                    {addressText}
                  </p>
                </div>
              </div>

              {/* Card 4: Preferred Date & Time */}
              <div className="detail-outer-card">
                <span className="detail-outer-label">Preferred date</span>
                <div className="detail-inner-pill detail-inner-pill--tall">
                  <h3 className="detail-pill-title">{preferredDateText}</h3>
                  <p className="detail-pill-sub">{preferredTimeText}</p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* ── Bottom Tracking Timeline ("What happens next?") ── */}
        <section className="confirmed-tracking-card" aria-label="Service Tracking">
          <h2 className="tracking-title">What happens next?</h2>

          <div className="tracking-steps-row">
            {/* Step 1: Booking Received (Active) */}
            <div className="tracking-step">
              <div className="tracking-step__icon-circle tracking-step__icon-circle--active" aria-hidden="true">
                <ClipboardIcon />
              </div>
              <div className="tracking-step__content">
                <h3 className="tracking-step__name tracking-step__name--active">Booking Received</h3>
                <p className="tracking-step__desc">We have received your service request.</p>
              </div>
            </div>

            <ChevronRight />

            {/* Step 2: Mechanic Assigned */}
            <div className="tracking-step">
              <div className="tracking-step__icon-circle" aria-hidden="true">
                <UserIcon />
              </div>
              <div className="tracking-step__content">
                <h3 className="tracking-step__name">Mechanic Assigned</h3>
                <p className="tracking-step__desc">A trusted mechanic will be assigned.</p>
              </div>
            </div>

            <ChevronRight />

            {/* Step 3: Service in Progress */}
            <div className="tracking-step">
              <div className="tracking-step__icon-circle" aria-hidden="true">
                <WrenchIcon />
              </div>
              <div className="tracking-step__content">
                <h3 className="tracking-step__name">Service in Progress</h3>
                <p className="tracking-step__desc">We'll work on your vehicle.</p>
              </div>
            </div>

            <ChevronRight />

            {/* Step 4: Completed */}
            <div className="tracking-step">
              <div className="tracking-step__icon-circle" aria-hidden="true">
                <CircleCheckIcon />
              </div>
              <div className="tracking-step__content">
                <h3 className="tracking-step__name">Completed</h3>
                <p className="tracking-step__desc">You'll be notified once the service is complete.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default BookingConfirmationPage;
