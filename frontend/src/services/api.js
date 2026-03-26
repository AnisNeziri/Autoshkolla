function requireAxios() {
  const axios = typeof window !== 'undefined' ? window.axios : null;
  if (!axios) {
    throw new Error(
      'Axios is not available. Ensure the Axios CDN script is loaded in public/index.html.'
    );
  }
  return axios;
}

export function createApiClient({ getToken }) {
  const axios = requireAxios();

  const client = axios.create({
    baseURL: '/api',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  client.interceptors.request.use((config) => {
    const token = getToken?.();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return client;
}

export function getApiErrorMessage(err) {
  const fallback = 'Diçka shkoi keq. Ju lutem provoni përsëri.';
  if (!err) return fallback;

  const msg =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    null;

  return msg || fallback;
}

