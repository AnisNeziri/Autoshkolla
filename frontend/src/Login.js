import React, { useState } from 'react';
import './Form.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { getApiErrorMessage } from './services/api';
import sq from './i18n/sq';
import AuthShell from './components/auth/AuthShell';

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
      setError(sq.auth.errors.emailRequired);
      return;
    }
    if (!password) {
      setError(sq.auth.errors.passwordRequired);
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
      <h2>{sq.auth.loginTitle}</h2>
      <form onSubmit={onSubmit}>
        {error ? (
          <div className="alert alert-danger text-start" role="alert">
            {error}
          </div>
        ) : null}
        <input
          type="text"
          placeholder={sq.auth.email}
          value={emailOrCode}
          onChange={(e) => setEmailOrCode(e.target.value)}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder={sq.auth.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? sq.auth.loadingLogin : sq.auth.submitLogin}
        </button>
      </form>
      <p className="mt-3 small text-secondary mb-0">
        {sq.auth.noAccount} <Link to="/register">{sq.auth.linkRegister}</Link>
      </p>
      </div>
    </AuthShell>
  );
}

export default Login;
