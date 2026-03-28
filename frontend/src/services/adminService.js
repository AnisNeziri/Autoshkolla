import { createApiClient } from './api';

export function createAdminService({ getToken }) {
  const api = createApiClient({ getToken });

  return {
    getSchools() {
      return api.get('/admin/schools').then((r) => r?.data || []);
    },

    deleteSchool(id) {
      return api.delete(`/admin/schools/${id}`);
    },

    getSchoolAnalytics(granularity = 'day') {
      return api.get('/admin/analytics/schools', { params: { granularity } }).then((r) => r?.data);
    },

    listUsers() {
      return api.get('/users').then((r) => r?.data || []);
    },
  };
}
