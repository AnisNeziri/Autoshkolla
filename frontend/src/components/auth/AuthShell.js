import React from 'react';
import { Link } from 'react-router-dom';
import sq from '../../i18n/sq';

export default function AuthShell({ children }) {
  return (
    <div className="auth-page">
      <header className="auth-topbar">
        <Link to="/" className="auth-brand text-decoration-none">
          <span className="auth-brand-mark" aria-hidden>
            A
          </span>
          <span className="auth-brand-text">
            <span className="auth-brand-title">{sq.brand}</span>
            <span className="auth-brand-tag d-none d-sm-inline">{sq.brandTagline}</span>
          </span>
        </Link>
      </header>
      <main className="auth-main">{children}</main>
    </div>
  );
}
