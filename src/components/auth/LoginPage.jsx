/**
 * MotoFix – Login Page
 * Validates credentials against the Spring Boot backend via AuthContext.
 * Displays loading states, inline validation errors, and server response errors.
 * On success calls onLoginSuccess(returnTo) to navigate to the intended destination.
 */

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

function LoginPage({ returnTo, onLoginSuccess, onSignUpClick }) {
  const { login } = useAuth();

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const identifier = formData.username.trim();
    const password = formData.password;

    if (!identifier || !password.trim()) {
      setErrorMsg('Please fill in both fields to continue.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const result = await login(identifier, password);
    setIsSubmitting(false);

    if (!result.ok) {
      if (result.status === 401) {
        setErrorMsg('Invalid email/username or password. Please try again.');
      } else {
        setErrorMsg(result.message || 'Login failed. Please try again.');
      }
      return;
    }

    if (onLoginSuccess) {
      onLoginSuccess(returnTo);
    }
  };

  const goToSignUp = (e) => {
    e.preventDefault();
    if (onSignUpClick) onSignUpClick();
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-heading">Login</h1>

        <div className="login-card">
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {/* Username or Email */}
            <div className="login-field">
              <label htmlFor="loginUsername" className="login-label">
                User name or Email
              </label>
              <input
                type="text"
                id="loginUsername"
                name="username"
                className="login-input"
                placeholder="XYZ.username or email@example.com"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username email"
                disabled={isSubmitting}
                spellCheck={false}
              />
            </div>

            {/* Password */}
            <div className="login-field">
              <label htmlFor="loginPassword" className="login-label">
                Password
              </label>
              <input
                type="password"
                id="loginPassword"
                name="password"
                className="login-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="current-password"
              />
            </div>

            {/* Inline error */}
            {errorMsg && (
              <p className="login-error" role="alert">
                {errorMsg}{' '}
                <a href="#signup" className="login-error-link" onClick={goToSignUp}>
                  Need an account? Sign up.
                </a>
              </p>
            )}

            {/* Sign up note */}
            <p className="login-signup-note">
              Dont have an account?{' '}
              <a href="#signup" className="login-signup-link" onClick={goToSignUp}>
                Sign up
              </a>
            </p>

            {/* Continue button */}
            <div className="login-footer">
              <button
                type="submit"
                className="login-continue-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in…' : 'continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
