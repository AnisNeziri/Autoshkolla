import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Forces students (or any user) with must_change_password to /change-password
 * until they update their password.
 */
export default function RequirePasswordChange() {
  const { isAuthenticated, mustChangePassword } = useAuth();
  const location = useLocation();

  if (
    isAuthenticated &&
    mustChangePassword &&
    location.pathname !== '/change-password'
  ) {
    return <Navigate to="/change-password" replace />;
  }

  return <Outlet />;
}
