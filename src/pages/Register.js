import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    student_id: '',
    institution: '',
    course: '',
    password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formatPhoneNumber = (phone) => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 8) return '+266' + cleaned;
    if (!phone.startsWith('+')) return '+' + cleaned;
    return phone;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    const { data, error: authError } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
      options: {
        data: {
          full_name: formData.full_name,
          phone_number: formatPhoneNumber(formData.phone_number),
          student_id: formData.student_id,
          institution: formData.institution,
          course: formData.course,
        },
      },
    });

    setIsLoading(false);

    if (authError) {
      setError(authError.message || 'Registration failed');
      return;
    }

    if (data?.user && !data?.session) {
      alert('Registration successful! Please check your email to confirm your account, then log in.');
      navigate('/login');
      return;
    }

    if (data?.session) {
      alert('Registration successful!');
      navigate('/');
      return;
    }

    setError('Something unexpected happened. Please try again.');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Create Account</h1>
          <p>Join LeSAH today</p>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="full_name" placeholder="John Doe" value={formData.full_name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="student@university.ac.ls" value={formData.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone_number" placeholder="56613551 or +26612345678" value={formData.phone_number} onChange={handleChange} required />
                <small className="hint">Local 8-digit number will automatically get +266 prefix</small>
              </div>
              <div className="form-group">
                <label>Student ID</label>
                <input type="text" name="student_id" placeholder="STU12345" value={formData.student_id} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Institution</label>
                <input type="text" name="institution" placeholder="National University of Lesotho" value={formData.institution} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Course/Program</label>
                <input type="text" name="course" placeholder="Bachelor of Commerce" value={formData.course} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button type="button" className="toggle-password-btn" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle">
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                <small className="hint">8+ chars, upper, lower, number, special</small>
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirm_password"
                    placeholder="Confirm your password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                  />
                  <button type="button" className="toggle-password-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label="Toggle">
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </div>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></span>
              </label>
            </div>
            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;