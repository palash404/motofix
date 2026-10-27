/**
 * MotoFix – Service Repair Booking Page
 * Displays the service center pickup/delivery repair form with bike model,
 * pickup address, problem description, native placeholders, and Continue button.
 */

import { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { bookingApi } from '../../services/api';
import './ServiceRepairPage.css';

function BoltIcon() {
  return (
    <span className="repair-card__bolt" aria-hidden="true">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="6" r="5" fill="#1C1C1E" />
        <path d="M4 6H8M6 4V8" stroke="#3A3A3E" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function ServiceRepairPage({ onComplete }) {
  const { booking, updateBooking, nextStep, setConfirmedBooking } = useBooking();

  const [formData, setFormData] = useState({
    bikeModel: booking.bikeModel || booking.bikeBrand || '',
    pickupAddress: booking.address || '',
    problemDescription: booking.description || '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.bikeModel.trim() || !formData.pickupAddress.trim() || !formData.problemDescription.trim()) {
      setErrorMsg('Please complete all required fields to continue.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const created = await bookingApi.create({
        type: 'SERVICE_CENTER',
        packageType: 'Comprehensive Workshop Service',
        bikeModel: formData.bikeModel,
        address: formData.pickupAddress,
        description: formData.problemDescription,
      });

      updateBooking({
        bikeBrand: created.bikeBrand || formData.bikeModel,
        bikeModel: created.bikeModel || formData.bikeModel,
        address: created.address || formData.pickupAddress,
        description: created.description || formData.problemDescription,
        bookingRef: created.bookingReference,
      });

      if (setConfirmedBooking) {
        setConfirmedBooking(created);
      }

      nextStep();
      setIsSubmitted(true);

      if (onComplete) {
        onComplete(created);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="service-repair-page">
      <div className="service-repair-container">
        {/* Page Heading */}
        <h1 className="service-repair-heading">Service repair</h1>

        {/* Page Description */}
        <p className="service-repair-description">
          Get your bike serviced or repaired without having to take it to the workshop yourself. Our mechanic picks up your bike, takes it to a service center for professional inspection and repair, and delivers it back to your doorstep once the work is complete.
        </p>

        {/* Form Card (Grey Variant) */}
        <div className="service-repair-card">
          {/* Decorative Corner Bolts */}
          <div className="service-repair-card__bolts">
            <BoltIcon />
            <BoltIcon />
            <BoltIcon />
            <BoltIcon />
          </div>

          {isSubmitted ? (
            <div className="service-repair-success-message">
              <h2>Service Center Booking Initiated!</h2>
              <p>Your service center pickup request for <strong>{formData.bikeModel}</strong> at <strong>{formData.pickupAddress}</strong> has been saved.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="service-repair-form">
              {/* Field 1: Your bike */}
              <div className="service-repair-field">
                <label htmlFor="bikeModelService" className="service-repair-label">
                  Your bike
                </label>
                <input
                  type="text"
                  id="bikeModelService"
                  name="bikeModel"
                  className="service-repair-input"
                  placeholder="Enter bike model"
                  value={formData.bikeModel}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              {/* Field 2: Pickup address */}
              <div className="service-repair-field">
                <label htmlFor="pickupAddressService" className="service-repair-label">
                  Pickup address
                </label>
                <input
                  type="text"
                  id="pickupAddressService"
                  name="pickupAddress"
                  className="service-repair-input"
                  placeholder="Enter address where mechanic should collect bike"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              {/* Field 3: What service does your bike need? */}
              <div className="service-repair-field">
                <label htmlFor="problemDescriptionService" className="service-repair-label">
                  What service does your bike need?
                </label>
                <textarea
                  id="problemDescriptionService"
                  name="problemDescription"
                  className="service-repair-textarea"
                  placeholder="Describe the service or problem..."
                  value={formData.problemDescription}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              {/* Validation Error */}
              {errorMsg && <p className="service-repair-error">{errorMsg}</p>}

              {/* Continue Button */}
              <div className="service-repair-card__footer">
                <button type="submit" className="continue-button" disabled={isSubmitting}>
                  {isSubmitting ? 'submitting...' : 'continue'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceRepairPage;
