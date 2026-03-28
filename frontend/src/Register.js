import React, { useState } from 'react';
import './Form.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { getApiErrorMessage } from './services/api';

function Register() {
  const { authService, setAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    school_name: '',
    owners_name: '',
    owners_surname: '',
    numri_biz: '',
    invitation_code: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password_confirmation) {
      setError('Fjalëkalimet nuk përputhen.');
      return;
    }
    if (form.password.length < 8) {
      setError('Fjalëkalimi duhet të ketë të paktën 8 karaktere.');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.register({
        school_name: form.school_name.trim(),
        owners_name: form.owners_name.trim(),
        owners_surname: form.owners_surname.trim(),
        numri_biz: form.numri_biz.trim(),
        invitation_code: form.invitation_code.trim(),
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
    <div className="form-container" style={{ maxWidth: 480 }}>
      <h2>Regjistro Autoshkollën</h2>
      <p className="small text-secondary">Krijoni llogarinë e pronarit (professor) dhe të dhënat e autoshkollës.</p>
      <form onSubmit={onSubmit}>
        {error ? (
          <div className="alert alert-danger text-start" role="alert">
            {error}
          </div>
        ) : null}
        <input type="text" placeholder="Emri i autoshkollës" value={form.school_name} onChange={onChange('school_name')} />
        <div className="d-flex gap-2">
          <input
            className="flex-grow-1"
            type="text"
            placeholder="Emri pronarit"
            value={form.owners_name}
            onChange={onChange('owners_name')}
          />
          <input
            className="flex-grow-1"
            type="text"
            placeholder="Mbiemri pronarit"
            value={form.owners_surname}
            onChange={onChange('owners_surname')}
          />
        </div>
        <input type="text" placeholder="Numri i biznesit (unik)" value={form.numri_biz} onChange={onChange('numri_biz')} />
        <input type="text" placeholder="Kodi i ftesës (unik)" value={form.invitation_code} onChange={onChange('invitation_code')} />
        <input type="email" placeholder="Email (login)" value={form.email} onChange={onChange('email')} autoComplete="email" />
        <input type="password" placeholder="Fjalëkalimi" value={form.password} onChange={onChange('password')} autoComplete="new-password" />
        <input
          type="password"
          placeholder="Konfirmo fjalëkalimin"
          value={form.password_confirmation}
          onChange={onChange('password_confirmation')}
          autoComplete="new-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Duke regjistruar…' : 'Regjistrohu'}
        </button>
      </form>
      <p className="mt-3 small text-secondary mb-0">
        Keni llogari? <Link to="/login">Hyr</Link>
      </p>
    </div>
  );
}

export default Register;
