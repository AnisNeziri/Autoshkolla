import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { decodeJwt, getRoleFromClaims, getUserDisplayNameFromClaims } from '../utils/jwt';
import { ROLES } from './roles';
import { createAuthService } from '../services/authService';

const TOKEN_KEY = 'autoshkolla_token';
const USER_KEY = 'autoshkolla_user';

export const AuthContext = createContext(null);

function normalizeRole(role) {
  const r = (role || '').toString().toLowerCase();
  if (r === 'admin') return ROLES.ADMIN;
  if (r === 'professor' || r === 'instructor' || r === 'teacher') return ROLES.PROFESSOR;
  if (r === 'student' || r === 'candidate') return ROLES.STUDENT;
  return null;
}

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUserState] = useState(readStoredUser);

  const setAuth = useCallback(({ token: nextToken, user: nextUser }) => {
    const t = nextToken || '';
    setTokenState(t);
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);

    if (nextUser) {
      setUserState(nextUser);
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } else {
      setUserState(null);
      localStorage.removeItem(USER_KEY);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) {
        const svc = createAuthService({ getToken: () => token });
        await svc.logout();
      }
    } catch {
      // Revoke may fail if token expired; always clear client session.
    }
    setAuth({ token: '', user: null });
  }, [token, setAuth]);

  const claims = useMemo(() => decodeJwt(token), [token]);
  const displayName = useMemo(
    () => user?.name || getUserDisplayNameFromClaims(claims) || '',
    [user, claims]
  );
  const role = useMemo(
    () => normalizeRole(user?.role || getRoleFromClaims(claims)),
    [user, claims]
  );

  const mustChangePassword = Boolean(user?.must_change_password);

  const isAuthenticated = Boolean(token);

  const authService = useMemo(() => createAuthService({ getToken: () => token }), [token]);

  useEffect(() => {
    if (!token || user) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const data = await authService.me();
        if (!cancelled && data) {
          setUserState(data);
          localStorage.setItem(USER_KEY, JSON.stringify(data));
        }
      } catch {
        if (!cancelled) setAuth({ token: '', user: null });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, user, authService, setAuth]);

  const value = useMemo(
    () => ({
      token,
      user,
      setAuth,
      logout,
      isAuthenticated,
      mustChangePassword,
      claims,
      displayName,
      role,
      authService,
    }),
    [token, user, setAuth, logout, isAuthenticated, mustChangePassword, claims, displayName, role, authService]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

