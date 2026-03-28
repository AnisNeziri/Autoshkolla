import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getApiErrorMessage } from '../services/api';
import '../Form.css';

export default function ChangePasswordPage() {
  const { isAuthenticated, mustChangePassword, authService, setAuth, user, token } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!mustChangePassword) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== passwordConfirmation) {
      setError('Password confirmation does not match.');
      return;
    }
    setLoading(true);
    try {
      const data = await authService.changePassword({
        password,
        password_confirmation: passwordConfirmation,
      });
      const nextUser = data?.user || { ...user, must_change_password: false };
      setAuth({ token, user: nextUser });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Ndrysho fjalëkalimin</h2>
      <p className="text-secondary small mb-3">
        Për arsye sigurie, duhet të vendosni një fjalëkalim të ri para se të vazhdoni.
      </p>
      <form onSubmit={onSubmit}>
        {error ? (
          <div className="alert alert-danger text-start" role="alert">
            {error}
          </div>
        ) : null}
        <input
          type="password"
          placeholder="Fjalëkalimi i ri"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <input
          type="password"
          placeholder="Konfirmoni fjalëkalimin"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          autoComplete="new-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Duke ruajtur…' : 'Ruaj'}
        </button>
      </form>
    </div>
  );
}
