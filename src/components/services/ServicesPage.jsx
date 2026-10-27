/**
 * MotoFix – Services Page
 * Displays the "Services made for you" heading and description across the top,
 * followed by a horizontal row of three service cards.
 */

import ServiceCard from './ServiceCard';
import { useBooking } from '../../context/BookingContext';
import { BOOKING_TYPES } from '../../utils/constants';
import './ServicesPage.css';

function ServicesPage({ onNavigateToBooking }) {
  const { startBooking } = useBooking();

  const handleBook = (type) => {
    startBooking(type);
    if (onNavigateToBooking) {
      onNavigateToBooking(type);
    }
  };

  return (
    <div className="services-page">
      <div className="services-container">
        {/* Upper-left Heading & Wide Introductory Description */}
        <div className="services-header">
          <h1 className="services-heading">
            Services
            <br />
            made for you
          </h1>

          <p className="services-description">
            From quick fixes at your doorstep to complete service-center repairs and emergency breakdown assistance, MotoFix makes getting your bike back on the road simple. Choose the service you need and book in just a few steps.
          </p>
        </div>

        {/* Horizontal Three-Card Row Below Intro Text */}
        <div className="services-cards">
          <ServiceCard
            title={"Home bike\nrepair"}
            description="Get minor repairs and routine maintenance done right at your doorstep."
            variant="home-repair"
            onBookNow={() => handleBook(BOOKING_TYPES.HOME_REPAIR)}
          />

          <ServiceCard
            title={"Service\nrepair"}
            description="Professional servicing and complex repairs handled at a service center."
            variant="service-repair"
            onBookNow={() => handleBook(BOOKING_TYPES.SERVICE_CENTER)}
          />

          <ServiceCard
            title={"Break down\nassistance"}
            description="Get roadside help when your bike breaks down or won't start."
            variant="breakdown"
            onBookNow={() => handleBook(BOOKING_TYPES.BREAKDOWN)}
          />
        </div>
      </div>
    </div>
  );
}

export default ServicesPage;
