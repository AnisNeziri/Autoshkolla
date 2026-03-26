import { createApiClient } from './api';

export function createProfessorService({ getToken }) {
  const api = createApiClient({ getToken });

  return {
    async getStudents() {
      const res = await api.get('/professor/students');
      return res?.data || [];
    },

    async getStudent(studentId) {
      const res = await api.get(`/professor/students/${studentId}`);
      return res?.data;
    },

    async getLectures(studentId) {
      const res = await api.get(`/professor/students/${studentId}/lectures`);
      return res?.data || [];
    },

    async addLecture(studentId, payload) {
      const res = await api.post(`/professor/students/${studentId}/lectures`, payload);
      return res?.data;
    },

    async updateLecture(studentId, lectureId, payload) {
      const res = await api.put(
        `/professor/students/${studentId}/lectures/${lectureId}`,
        payload
      );
      return res?.data;
    },

    async getDrivingSessions(studentId) {
      const res = await api.get(`/professor/students/${studentId}/driving-sessions`);
      return res?.data || [];
    },

    async addDrivingSession(studentId, payload) {
      const res = await api.post(`/professor/students/${studentId}/driving-sessions`, payload);
      return res?.data;
    },

    async updateDrivingSession(studentId, sessionId, payload) {
      const res = await api.put(
        `/professor/students/${studentId}/driving-sessions/${sessionId}`,
        payload
      );
      return res?.data;
    },

    async updateWrittenTest(studentId, payload) {
      const res = await api.put(`/professor/students/${studentId}/tests/written`, payload);
      return res?.data;
    },

    async scheduleDrivingTest(studentId, payload) {
      const res = await api.put(`/professor/students/${studentId}/tests/practical`, payload);
      return res?.data;
    },
  };
}

