import { createApiClient } from './api';

export function createAuthService({ getToken }) {
  const api = createApiClient({ getToken });

  return {
    async login({ emailOrCode, password }) {
      // Expect backend to return one of: { token }, { access_token }, { data: { token } }, { user, token }
      const res = await api.post('/login', { email: emailOrCode, password });
      const token =
        res?.data?.token ||
        res?.data?.access_token ||
        res?.data?.data?.token ||
        res?.data?.data?.access_token ||
        null;

      if (!token) {
        throw new Error('Login succeeded but no token was returned by the API.');
      }

      return { token, raw: res?.data };
    },

    async me() {
      // Common endpoint; adjust on backend when ready.
      const res = await api.get('/me');
      return res?.data;
    },
  };
}

