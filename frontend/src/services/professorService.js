import { createApiClient } from './api';

export function createProfessorService({ getToken }) {
  const api = createApiClient({ getToken });

  return {
    getStudents() {
      return api.get('/professor/students').then((r) => r?.data || []);
    },

    createStudent(payload) {
      return api.post('/professor/students', payload).then((r) => r?.data);
    },

    getStudent(studentId) {
      return api.get(`/professor/students/${studentId}`).then((r) => r?.data);
    },

    updateStudent(studentId, payload) {
      return api.put(`/professor/students/${studentId}`, payload).then((r) => r?.data);
    },

    deleteStudent(studentId) {
      return api.delete(`/professor/students/${studentId}`).then((r) => r?.data);
    },

    addLecture(studentId, payload) {
      return api
        .post(`/professor/students/${studentId}/lectures`, {
          date: payload.date,
          time: payload.time,
          present: payload.present ?? true,
        })
        .then((r) => r?.data);
    },

    updateLecture(studentId, lectureId, payload) {
      return api
        .put(`/professor/students/${studentId}/lectures/${lectureId}`, payload)
        .then((r) => r?.data);
    },

    addDrivingSession(studentId, payload) {
      return api
        .post(`/professor/students/${studentId}/driving-sessions`, {
          date: payload.date,
          time: payload.time,
          completed: payload.completed ?? false,
        })
        .then((r) => r?.data);
    },

    updateDrivingSession(studentId, sessionId, payload) {
      return api
        .put(`/professor/students/${studentId}/driving-sessions/${sessionId}`, payload)
        .then((r) => r?.data);
    },

    updateWrittenExam(studentId, payload) {
      return api
        .put(`/professor/students/${studentId}/exams/written`, {
          passed: payload.passed,
          exam_date: payload.exam_date,
        })
        .then((r) => r?.data);
    },

    updatePracticalExam(studentId, payload) {
      return api
        .put(`/professor/students/${studentId}/exams/practical`, {
          exam_date: payload.exam_date,
          passed: payload.passed ?? false,
        })
        .then((r) => r?.data);
    },
  };
}
