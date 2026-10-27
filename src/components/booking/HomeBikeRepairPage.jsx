/**
 * MotoFix – Home Bike Repair Booking Page
 * Displays the doorstep repair form with bike model, pickup address,
 * problem description, native HTML placeholders, and color-inverting Continue button.
 */

import { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { bookingApi } from '../../services/api';
import './HomeBikeRepairPage.css';

function BoltIcon({ position }) {
  return (
    <span className={`repair-card__bolt${position ? ` repair-card__bolt--${position}` : ''}`} aria-hidden="true">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="6" r="5" fill="#1C1C1E" />
        <path d="M4 6H8M6 4V8" stroke="#3A3A3E" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function HomeBikeRepairPage({ onComplete }) {
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
        type: 'HOME_REPAIR',
        packageType: 'General Service',
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
    <div className="repair-page">
      <div className="repair-container">
        {/* Page Heading */}
        <h1 className="repair-heading">Home bike repair</h1>

        {/* Page Description */}
        <p className="repair-description">
          Get minor repairs and routine maintenance done right at your doorstep. Our mechanic comes to your location, checks the issue, and handles the repair so you can get back on the road without the hassle of visiting a service center.
        </p>

        {/* Form Card */}
        <div className="repair-card">
          {/* Decorative Corner Bolts */}
          <div className="repair-card__bolts">
            <BoltIcon position="top-left" />
            <BoltIcon position="top-right" />
            <BoltIcon position="bottom-left" />
            <BoltIcon position="bottom-right" />
          </div>

          {isSubmitted ? (
            <div className="repair-success-message">
              <h2>Booking Initiated!</h2>
              <p>Your doorstep mechanic request for <strong>{formData.bikeModel}</strong> at <strong>{formData.pickupAddress}</strong> has been saved.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="repair-form">
              {/* Field 1: Your bike */}
              <div className="repair-field">
                <label htmlFor="bikeModel" className="repair-label">
                  Your bike
                </label>
                <input
                  type="text"
                  id="bikeModel"
                  name="bikeModel"
                  className="repair-input"
                  placeholder="Enter bike model"
                  value={formData.bikeModel}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              {/* Field 2: Pickup address */}
              <div className="repair-field">
                <label htmlFor="pickupAddress" className="repair-label">
                  Pickup address
                </label>
                <input
                  type="text"
                  id="pickupAddress"
                  name="pickupAddress"
                  className="repair-input"
                  placeholder="Enter address where mechanic should collect bike"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              {/* Field 3: What service does your bike need? */}
              <div className="repair-field">
                <label htmlFor="problemDescription" className="repair-label">
                  What service does your bike need?
                </label>
                <textarea
                  id="problemDescription"
                  name="problemDescription"
                  className="repair-textarea"
                  placeholder="Describe the service or problem..."
                  value={formData.problemDescription}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              {/* Validation Error */}
              {errorMsg && <p className="repair-error">{errorMsg}</p>}

              {/* Continue Button */}
              <div className="repair-card__footer">
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

export default HomeBikeRepairPage;
