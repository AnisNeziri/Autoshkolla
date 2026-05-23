import { createApiClient } from './api';

export function createAuthService({ getToken }) {
  const api = createApiClient({ getToken });

  return {
    async register(payload) {
      const res = await api.post('/register', payload);
      return extractAuth(res?.data);
    },

    async login({ emailOrCode, password }) {
      const res = await api.post('/login', { email: emailOrCode, password });
      return extractAuth(res?.data);
    },

    async logout() {
      await api.post('/logout');
    },

    async me() {
      const res = await api.get('/me');
      return res?.data;
    },

    async changePassword({ password, password_confirmation }) {
      const res = await api.post('/change-password', { password, password_confirmation });
      return res?.data;
    },
  };
}

function extractAuth(data) {
  const token =
    data?.token ||
    data?.access_token ||
    null;
  const user = data?.user || null;
  if (!token) {
    throw new Error('Hyrja suksedoi por API nuk ktheu token.');
  }
  return { token, user, raw: data };
}
