/**
 * MotoFix – Breakdown Assistance Booking Page
 * Displays emergency roadside breakdown assistance form with bike model,
 * pickup address, problem description, native placeholders, and Continue button.
 */

import { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { bookingApi } from '../../services/api';
import './BreakdownAssistancePage.css';

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

function BreakdownAssistancePage({ onComplete }) {
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
        type: 'BREAKDOWN',
        packageType: 'Emergency Roadside Dispatch',
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
    <div className="breakdown-page">
      <div className="breakdown-container">
        {/* Page Heading */}
        <h1 className="breakdown-heading">Breakdown assistance</h1>

        {/* Page Description */}
        <p className="breakdown-description">
          Stranded with a bike that won't start or has suddenly broken down? Share your location and tell us what happened, and we'll arrange roadside assistance to help get your bike running or safely move it to a service center if needed.
        </p>

        {/* Form Card (Light Grey Variant) */}
        <div className="breakdown-card">
          {/* Decorative Corner Bolts */}
          <div className="breakdown-card__bolts">
            <BoltIcon />
            <BoltIcon />
            <BoltIcon />
            <BoltIcon />
          </div>

          {isSubmitted ? (
            <div className="breakdown-success-message">
              <h2>Roadside Dispatch Initiated!</h2>
              <p>Your breakdown assistance request for <strong>{formData.bikeModel}</strong> at <strong>{formData.pickupAddress}</strong> has been saved.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="breakdown-form">
              {/* Field 1: Your bike */}
              <div className="breakdown-field">
                <label htmlFor="bikeModelBreakdown" className="breakdown-label">
                  Your bike
                </label>
                <input
                  type="text"
                  id="bikeModelBreakdown"
                  name="bikeModel"
                  className="breakdown-input"
                  placeholder="Enter bike model"
                  value={formData.bikeModel}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              {/* Field 2: Your location */}
              <div className="breakdown-field">
                <label htmlFor="locationBreakdown" className="breakdown-label">
                  Your location
                </label>
                <input
                  type="text"
                  id="locationBreakdown"
                  name="pickupAddress"
                  className="breakdown-input"
                  placeholder="Enter your current location"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              {/* Field 3: What happened? */}
              <div className="breakdown-field">
                <label htmlFor="problemDescriptionBreakdown" className="breakdown-label">
                  What happened?
                </label>
                <textarea
                  id="problemDescriptionBreakdown"
                  name="problemDescription"
                  className="breakdown-textarea"
                  placeholder="Describe the breakdown or emergency..."
                  value={formData.problemDescription}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              {/* Validation Error */}
              {errorMsg && <p className="breakdown-error">{errorMsg}</p>}

              {/* Continue Button */}
              <div className="breakdown-card__footer">
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

export default BreakdownAssistancePage;
