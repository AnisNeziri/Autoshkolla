import React, { useState } from 'react';
import './Form.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { getApiErrorMessage } from './services/api';

function Login() {
  const { authService, setToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [emailOrCode, setEmailOrCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailOrCode.trim()) {
      setError('Ju lutem shkruani email-in ose kodin referues.');
      return;
    }
    if (!password) {
      setError('Ju lutem shkruani fjalëkalimin.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.login({ emailOrCode, password });
      setToken(res.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Hyr në Llogari</h2>
      <form onSubmit={onSubmit}>
        {error ? (
          <div className="alert alert-danger text-start" role="alert">
            {error}
          </div>
        ) : null}
        <input
          type="text"
          placeholder="Email ose Kodi Referues"
          value={emailOrCode}
          onChange={(e) => setEmailOrCode(e.target.value)}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Fjalëkalimi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Duke hyrë…' : 'Hyr'}
        </button>
      </form>
    </div>
  );
}

export default Login;
