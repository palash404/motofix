import { useState } from 'react';
import './ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    enquiryType: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        {/* Main Heading */}
        <h1 className="contact-heading">Contact us</h1>

        {/* Subtitle / Intro Description */}
        <p className="contact-description">
          Have a question or need help with your bike? We're here to assist with service bookings, repairs, and breakdown support. Reach out to the MotoFix team, and we'll help you get back on the road.
        </p>

        {/* Form Card */}
        <div className="contact-card">
          <h2 className="contact-card__title">Send us a message</h2>
          <p className="contact-card__subtitle">Fill in the details below and tell us how we can help.</p>

          <form onSubmit={handleSubmit} className="contact-form" noValidate>
            {/* Full name */}
            <div className="contact-field">
              <label htmlFor="contactFullName" className="contact-label">
                Full name
              </label>
              <input
                type="text"
                id="contactFullName"
                name="fullName"
                className="contact-input"
                placeholder="Enter your name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            {/* Email address */}
            <div className="contact-field">
              <label htmlFor="contactEmail" className="contact-label">
                Email address
              </label>
              <input
                type="email"
                id="contactEmail"
                name="email"
                className="contact-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* What do you need help with? */}
            <div className="contact-field">
              <label htmlFor="contactEnquiryType" className="contact-label">
                What do you need help with?
              </label>
              <input
                type="text"
                id="contactEnquiryType"
                name="enquiryType"
                className="contact-input"
                placeholder="Select an enquiry type"
                value={formData.enquiryType}
                onChange={handleChange}
              />
            </div>

            {/* Message */}
            <div className="contact-field">
              <label htmlFor="contactMessage" className="contact-label">
                Message
              </label>
              <textarea
                id="contactMessage"
                name="message"
                className="contact-textarea"
                placeholder="Describe how we can help…"
                rows={4}
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="contact-submit-btn">
              SEND MESSAGE &rarr;
            </button>

            {/* Confirmation Message */}
            {submitted && (
              <p className="contact-confirmation" role="status">
                Thank you for contacting us. We will reach out to you soon.
              </p>
            )}
          </form>
        </div>

        {/* Contact info at bottom right */}
        <div className="contact-footer-note">
          Contact us at: 98134875216
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
