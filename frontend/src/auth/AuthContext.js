import React, { createContext, useCallback, useMemo, useState } from 'react';
import { decodeJwt, getRoleFromClaims, getUserDisplayNameFromClaims } from '../utils/jwt';
import { ROLES } from './roles';
import { createAuthService } from '../services/authService';

const TOKEN_KEY = 'autoshkolla_token';

export const AuthContext = createContext(null);

function normalizeRole(role) {
  const r = (role || '').toString().toUpperCase();
  if (r === 'ADMIN') return ROLES.ADMIN;
  if (r === 'PROFESSOR' || r === 'INSTRUCTOR' || r === 'TEACHER') return ROLES.PROFESSOR;
  if (r === 'CANDIDATE' || r === 'STUDENT') return ROLES.CANDIDATE;
  return null;
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem(TOKEN_KEY) || '');

  const setToken = useCallback((nextToken) => {
    const t = nextToken || '';
    setTokenState(t);
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  }, []);

  const logout = useCallback(() => setToken(''), [setToken]);

  const claims = useMemo(() => decodeJwt(token), [token]);
  const displayName = useMemo(() => getUserDisplayNameFromClaims(claims), [claims]);
  const role = useMemo(() => normalizeRole(getRoleFromClaims(claims)), [claims]);

  const isAuthenticated = Boolean(token);

  const authService = useMemo(() => createAuthService({ getToken: () => token }), [token]);

  const value = useMemo(
    () => ({
      token,
      setToken,
      logout,
      isAuthenticated,
      claims,
      displayName,
      role,
      authService,
    }),
    [token, setToken, logout, isAuthenticated, claims, displayName, role, authService]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

