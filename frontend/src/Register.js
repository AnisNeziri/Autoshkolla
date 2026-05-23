import React, { useState } from 'react';
import './Form.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { getApiErrorMessage } from './services/api';
import sq from './i18n/sq';
import AuthShell from './components/auth/AuthShell';

function Register() {
  const { authService, setAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    school_name: '',
    owners_name: '',
    owners_surname: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password_confirmation) {
      setError(sq.auth.errors.passwordMismatch);
      return;
    }
    if (form.password.length < 8) {
      setError(sq.auth.errors.passwordShort);
      return;
    }
    setLoading(true);
    try {
      const res = await authService.register({
        school_name: form.school_name.trim(),
        owners_name: form.owners_name.trim(),
        owners_surname: form.owners_surname.trim(),
        email: form.email.trim(),
        password: form.password,
        password_confirmation: form.password_confirmation,
      });
      setAuth({ token: res.token, user: res.user });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="form-container" style={{ maxWidth: 480 }}>
        <h2>{sq.auth.registerTitle}</h2>
      <p className="small text-secondary">{sq.auth.registerHint}</p>
      <form onSubmit={onSubmit}>
        {error ? (
          <div className="alert alert-danger text-start" role="alert">
            {error}
          </div>
        ) : null}
        <input
          type="text"
          placeholder={sq.auth.schoolName}
          value={form.school_name}
          onChange={onChange('school_name')}
        />
        <div className="d-flex gap-2">
          <input
            className="flex-grow-1"
            type="text"
            placeholder={sq.auth.ownerFirst}
            value={form.owners_name}
            onChange={onChange('owners_name')}
          />
          <input
            className="flex-grow-1"
            type="text"
            placeholder={sq.auth.ownerLast}
            value={form.owners_surname}
            onChange={onChange('owners_surname')}
          />
        </div>
        <input
          type="email"
          placeholder={`${sq.auth.email} (hyrje)`}
          value={form.email}
          onChange={onChange('email')}
          autoComplete="email"
        />
        <input
          type="password"
          placeholder={sq.auth.password}
          value={form.password}
          onChange={onChange('password')}
          autoComplete="new-password"
        />
        <input
          type="password"
          placeholder={sq.auth.passwordConfirm}
          value={form.password_confirmation}
          onChange={onChange('password_confirmation')}
          autoComplete="new-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? sq.auth.loadingRegister : sq.auth.submitRegister}
        </button>
      </form>
        <p className="mt-3 small text-secondary mb-0">
          {sq.auth.haveAccount} <Link to="/login">{sq.auth.linkLogin}</Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default Register;
