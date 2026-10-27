/**
 * MotoFix – ServiceCard Component
 * Reusable card for Services page with title, description, variant styling,
 * decorative corner bolts, and dedicated glass-hover BOOK NOW button.
 */

import './ServiceCard.css';

function BoltIcon({ position }) {
  return (
    <span className={`service-card__bolt service-card__bolt--${position}`} aria-hidden="true">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="6" r="5" fill="#1C1C1E" />
        <path d="M4 6H8M6 4V8" stroke="#3A3A3E" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function ServiceCard({ title, description, variant, onBookNow }) {
  return (
    <div className={`service-card service-card--${variant}`}>
      {/* Decorative Corner Bolts */}
      <div className="service-card__bolts">
        <BoltIcon position="top-left" />
        <BoltIcon position="top-right" />
        <BoltIcon position="bottom-left" />
        <BoltIcon position="bottom-right" />
      </div>

      <div className="service-card__body">
        <h3 className="service-card__title">{title}</h3>
        <p className="service-card__description">{description}</p>
      </div>

      <div className="service-card__footer">
        <button
          type="button"
          className="book-now-button"
          onClick={onBookNow}
        >
          BOOK NOW
        </button>
      </div>
    </div>
  );
}

export default ServiceCard;
