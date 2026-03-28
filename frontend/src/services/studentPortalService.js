import { createApiClient } from './api';

export function createStudentPortalService({ getToken }) {
  const api = createApiClient({ getToken });

  return {
    getDashboard() {
      return api.get('/student/dashboard').then((r) => r?.data);
    },
  };
}
