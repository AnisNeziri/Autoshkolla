import React, { useState } from 'react';
import './Form.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { getApiErrorMessage } from './services/api';

function Login() {
  const { authService, setAuth } = useAuth();
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
      setError('Ju lutem shkruani email-in.');
      return;
    }
    if (!password) {
      setError('Ju lutem shkruani fjalëkalimin.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.login({ emailOrCode, password });
      setAuth({ token: res.token, user: res.user });
      if (res.user?.must_change_password) {
        navigate('/change-password', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
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
          placeholder="Email"
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
      <p className="mt-3 small text-secondary mb-0">
        Nuk keni llogari? <Link to="/register">Regjistro autoshkollën</Link>
      </p>
    </div>
  );
}

export default Login;
