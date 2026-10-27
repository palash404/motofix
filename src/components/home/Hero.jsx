/**
 * MotoFix – Hero Section
 * Final Approved Design:
 * - Grey/off-white hero background
 * - YOUR BIKE. / OUR FIX.
 * - Description
 * - BOOK A MECHANIC
 * - BOOK A SERVICE
 * - No motorcycle graphic, telemetry cards, or invented service claims
 */

import { BOOKING_TYPES } from '../../utils/constants';
import engineImg from '../../assets/engine-illustration.png';
import './Hero.css';

function Hero({ onBookingNavigate }) {
  const handleMechanicClick = (e) => {
    e.preventDefault();
    if (onBookingNavigate) onBookingNavigate(BOOKING_TYPES.HOME_REPAIR);
  };

  const handleServiceClick = (e) => {
    e.preventDefault();
    if (onBookingNavigate) onBookingNavigate(BOOKING_TYPES.SERVICE_CENTER);
  };

  return (
    <section className="hero" aria-label="Hero Introduction">
      <div className="hero__content">
        {/* Main Heading */}
        <h1 className="hero__heading">
          <span className="hero__heading-line">Your bike</span>
          <span className="hero__heading-line">Our fix</span>
        </h1>

        {/* Supporting Text */}
        <p className="hero__description">
          Professional two-wheeler repair and servicing at
          <br className="hero__desc-br" />
          your doorstep.
        </p>

        {/* Action Buttons */}
        <div className="hero__actions">
          <a href="#book-home" className="btn btn--primary hero__btn hero__btn--primary" onClick={handleMechanicClick}>
            BOOK A MECHANIC
          </a>
          <a href="#book-service" className="btn hero__btn hero__btn--secondary btn--service-invert" onClick={handleServiceClick}>
            BOOK A SERVICE
          </a>
        </div>
      </div>

      {/* Technical Engine Illustration */}
      <div className="hero__illustration-wrapper" aria-hidden="true">
        <img
          src={engineImg}
          alt=""
          className="hero__engine-img"
        />
      </div>
    </section>
  );
}

export default Hero;
