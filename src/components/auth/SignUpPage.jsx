/**
 * MotoFix – Sign Up Page
 * Four-field registration form: username, email, password, confirm password.
 * Connects to the Spring Boot backend via AuthContext.registerAccount.
 * Validates fields, checks email format, ensures passwords match,
 * handles HTTP 409 duplicate-email errors, and displays loading and error states.
 */

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './SignUpPage.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignUpPage({ returnTo, onGoToLogin }) {
  const { registerAccount } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for field on change
    if (errors[name] || errors.form) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        delete next.form;
        return next;
      });
    }
  };

  const validate = () => {
    const errs = {};

    if (!formData.username.trim()) {
      errs.username = 'User name is required.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!EMAIL_RE.test(formData.email.trim())) {
      errs.email = 'Enter a valid email address.';
    }
    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const result = await registerAccount({
      name: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
    });

    setIsSubmitting(false);

    if (!result.ok) {
      if (result.status === 409) {
        setErrors({
          email: 'An account with this email address already exists. Please log in.',
          form: 'An account with this email address already exists.',
        });
      } else if (result.errors) {
        setErrors({ ...result.errors, form: result.message || 'Validation failed.' });
      } else {
        setErrors({ form: result.message || 'Registration failed. Please try again.' });
      }
      return;
    }

    // Account created successfully on server
    setSuccessMsg('Account created successfully! Redirecting to login…');
    setTimeout(() => {
      if (onGoToLogin) onGoToLogin(returnTo);
    }, 1000);
  };

  const handleGoToLogin = (e) => {
    e.preventDefault();
    if (onGoToLogin) onGoToLogin(returnTo);
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="signup-heading">Sign up</h1>

        <div className="signup-card">
          <form onSubmit={handleSubmit} className="signup-form" noValidate>

            {/* Field 1: User name */}
            <div className="signup-field">
              <label htmlFor="signupUsername" className="signup-label">
                User name
              </label>
              <input
                type="text"
                id="signupUsername"
                name="username"
                className={`signup-input${errors.username ? ' signup-input--error' : ''}`}
                placeholder="XYZ.username"
                value={formData.username}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="username"
                spellCheck={false}
              />
              {errors.username && (
                <span className="signup-field-error">{errors.username}</span>
              )}
            </div>

            {/* Field 2: Email id */}
            <div className="signup-field">
              <label htmlFor="signupEmail" className="signup-label">
                Email id
              </label>
              <input
                type="email"
                id="signupEmail"
                name="email"
                className={`signup-input${errors.email ? ' signup-input--error' : ''}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="email"
              />
              {errors.email && (
                <span className="signup-field-error">{errors.email}</span>
              )}
            </div>

            {/* Field 3: Password */}
            <div className="signup-field">
              <label htmlFor="signupPassword" className="signup-label">
                Password
              </label>
              <input
                type="password"
                id="signupPassword"
                name="password"
                className={`signup-input${errors.password ? ' signup-input--error' : ''}`}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              {errors.password && (
                <span className="signup-field-error">{errors.password}</span>
              )}
            </div>

            {/* Field 4: Confirm Password */}
            <div className="signup-field">
              <label htmlFor="signupConfirmPassword" className="signup-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="signupConfirmPassword"
                name="confirmPassword"
                className={`signup-input${errors.confirmPassword ? ' signup-input--error' : ''}`}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <span className="signup-field-error">{errors.confirmPassword}</span>
              )}
            </div>

            {/* General form error */}
            {errors.form && <p className="signup-error" role="alert">{errors.form}</p>}

            {/* Success message */}
            {successMsg && <p className="signup-success">{successMsg}</p>}

            {/* Already have account note */}
            <p className="signup-login-note">
              Already have an account?{' '}
              <a href="#login" className="signup-login-link" onClick={handleGoToLogin}>
                Login
              </a>
            </p>

            {/* Create Account button */}
            <div className="signup-footer">
              <button
                type="submit"
                className="signup-create-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account…' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
