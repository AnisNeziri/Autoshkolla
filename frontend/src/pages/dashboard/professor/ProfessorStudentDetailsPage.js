import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import InlineAlert from '../../../components/common/InlineAlert';
import ProgressBar from '../../../components/common/ProgressBar';
import { getApiErrorMessage } from '../../../services/api';
import { useProfessorService } from '../../../hooks/useProfessorService';
import sq from '../../../i18n/sq';

export default function ProfessorStudentDetailsPage() {
  const { studentId } = useParams();
  const professorApi = useProfessorService();

  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [lectureForm, setLectureForm] = useState({ date: '', time: '', present: true });
  const [sessionForm, setSessionForm] = useState({ date: '', time: '', completed: false });
  const [writtenPassed, setWrittenPassed] = useState(false);
  const [drivingTestDate, setDrivingTestDate] = useState('');
  const [theoreticalGroup, setTheoreticalGroup] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const s = await professorApi.getStudent(studentId);
      setDetail(s);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [professorApi, studentId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!detail) return;
    setWrittenPassed(Boolean(detail.written_exam?.passed));
    setDrivingTestDate(detail.practical_exam?.exam_date || '');
    setTheoreticalGroup(detail.theoretical_group || '');
  }, [detail]);

  const progressFraction = useMemo(() => {
    const p = detail?.progress?.progress_percent;
    if (typeof p === 'number') return p / 100;
    return 0;
  }, [detail]);

  const studentName = useMemo(() => {
    if (!detail) return `Studenti #${studentId}`;
    return `${detail.name || ''} ${detail.surname || ''}`.trim() || `Studenti #${studentId}`;
  }, [detail, studentId]);

  const addLecture = async (e) => {
    e.preventDefault();
    if (!lectureForm.date || !lectureForm.time) {
      setError(sq.professor.details.needDateTimeLecture);
      return;
    }
    if ((detail?.lectures?.length || 0) >= 12) {
      setError(sq.professor.details.maxLectures);
      return;
    }
    setSaving(true);
    setError('');
    try {
      await professorApi.addLecture(studentId, lectureForm);
      setLectureForm({ date: '', time: '', present: true });
      await refresh();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const addSession = async (e) => {
    e.preventDefault();
    if (!sessionForm.date || !sessionForm.time) {
      setError(sq.professor.details.needDateTimeSession);
      return;
    }
    if ((detail?.driving_sessions?.length || 0) >= 20) {
      setError(sq.professor.details.maxSessions);
      return;
    }
    setSaving(true);
    setError('');
    try {
      await professorApi.addDrivingSession(studentId, sessionForm);
      setSessionForm({ date: '', time: '', completed: false });
      await refresh();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const saveGroup = async () => {
    setSaving(true);
    setError('');
    try {
      await professorApi.updateStudent(studentId, { theoretical_group: theoreticalGroup || null });
      await refresh();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const toggleLecturePresent = async (lectureId, nextPresent) => {
    try {
      await professorApi.updateLecture(studentId, lectureId, { present: nextPresent });
      await refresh();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const toggleSessionDone = async (sessionId, next) => {
    try {
      await professorApi.updateDrivingSession(studentId, sessionId, { completed: next });
      await refresh();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const saveTests = async (e) => {
    e.preventDefault();
    if (!writtenPassed && drivingTestDate) {
      setError(sq.professor.details.writtenFirst);
      return;
    }
    setSaving(true);
    setError('');
    try {
      await professorApi.updateWrittenExam(studentId, {
        passed: writtenPassed,
        exam_date: detail?.written_exam?.exam_date || new Date().toISOString().slice(0, 10),
      });
      if (writtenPassed && drivingTestDate) {
        await professorApi.updatePracticalExam(studentId, { exam_date: drivingTestDate });
      }
      await refresh();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const lectures = detail?.lectures || [];
  const sessions = detail?.driving_sessions || [];

  return (
    <div className="d-flex flex-column gap-3">
      <div className="dash-card p-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <div className="text-secondary small">
              <Link to="/dashboard/professor/students" className="text-decoration-none">
                ← {sq.professor.backStudents}
              </Link>
            </div>
            <div className="fw-semibold fs-5 mt-1">{studentName}</div>
            <div className="small text-secondary">{detail?.email}</div>
          </div>
          <div style={{ minWidth: 260 }}>
            <div className="d-flex align-items-center gap-2">
              <div className="flex-grow-1">
                <ProgressBar value={progressFraction} />
              </div>
              <div className="small text-secondary" style={{ width: 52, textAlign: 'right' }}>
                {detail?.progress?.progress_percent ?? 0}%
              </div>
            </div>
          </div>
        </div>

        <div className="row g-2 mt-3 align-items-end">
          <div className="col-md-6">
            <label className="form-label small">{sq.professor.details.theoreticalGroup}</label>
            <input
              className="form-control"
              value={theoreticalGroup}
              onChange={(e) => setTheoreticalGroup(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <button type="button" className="btn btn-outline-primary" disabled={saving} onClick={saveGroup}>
              {sq.professor.details.saveGroupBtn}
            </button>
          </div>
        </div>
      </div>

      {error ? <InlineAlert title={sq.errors.actionFailed} message={error} /> : null}

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="dash-card p-4">
            <div className="d-flex justify-content-between">
              <div className="fw-semibold">{sq.professor.details.lectures}</div>
              <span className="badge text-bg-light">
                {lectures.length}
                {sq.professor.details.lectureCap}
              </span>
            </div>
            <hr />
            <form className="row g-2" onSubmit={addLecture}>
              <div className="col-6">
                <label className="form-label small">{sq.professor.details.date}</label>
                <input
                  type="date"
                  className="form-control"
                  value={lectureForm.date}
                  onChange={(e) => setLectureForm((s) => ({ ...s, date: e.target.value }))}
                />
              </div>
              <div className="col-6">
                <label className="form-label small">{sq.professor.details.time}</label>
                <input
                  type="time"
                  className="form-control"
                  value={lectureForm.time}
                  onChange={(e) => setLectureForm((s) => ({ ...s, time: e.target.value }))}
                />
              </div>
              <div className="col-12">
                <select
                  className="form-select"
                  value={lectureForm.present ? 'present' : 'absent'}
                  onChange={(e) =>
                    setLectureForm((s) => ({ ...s, present: e.target.value === 'present' }))
                  }
                >
                  <option value="present">{sq.professor.details.present}</option>
                  <option value="absent">{sq.professor.details.absent}</option>
                </select>
              </div>
              <div className="col-12 text-end">
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {sq.professor.details.addLecture}
                </button>
              </div>
            </form>
            <div className="table-responsive mt-3">
              <table className="table table-sm">
                <thead>
                  <tr className="text-secondary small">
                    <th>{sq.professor.details.date}</th>
                    <th>{sq.professor.details.time}</th>
                    <th>{sq.professor.details.attendance}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3}>{sq.dashboard.loading}</td>
                    </tr>
                  ) : (
                    lectures.map((l) => (
                      <tr key={l.id}>
                        <td>{l.date}</td>
                        <td>{l.time}</td>
                        <td>
                          <button
                            type="button"
                            className={`btn btn-sm ${l.present ? 'btn-success' : 'btn-outline-secondary'}`}
                            onClick={() => toggleLecturePresent(l.id, !l.present)}
                          >
                            {l.present ? sq.professor.details.present : sq.professor.details.absent}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="dash-card p-4">
            <div className="d-flex justify-content-between">
              <div className="fw-semibold">{sq.professor.details.driving}</div>
              <span className="badge text-bg-light">
                {sessions.length}
                {sq.professor.details.drivingCap}
              </span>
            </div>
            <hr />
            <form className="row g-2" onSubmit={addSession}>
              <div className="col-6">
                <label className="form-label small">{sq.professor.details.date}</label>
                <input
                  type="date"
                  className="form-control"
                  value={sessionForm.date}
                  onChange={(e) => setSessionForm((s) => ({ ...s, date: e.target.value }))}
                />
              </div>
              <div className="col-6">
                <label className="form-label small">{sq.professor.details.time}</label>
                <input
                  type="time"
                  className="form-control"
                  value={sessionForm.time}
                  onChange={(e) => setSessionForm((s) => ({ ...s, time: e.target.value }))}
                />
              </div>
              <div className="col-12 text-end">
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {sq.professor.details.addSession}
                </button>
              </div>
            </form>
            <div className="table-responsive mt-3">
              <table className="table table-sm">
                <thead>
                  <tr className="text-secondary small">
                    <th>{sq.professor.details.date}</th>
                    <th>{sq.professor.details.time}</th>
                    <th>{sq.professor.details.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3}>{sq.dashboard.loading}</td>
                    </tr>
                  ) : (
                    sessions.map((d) => (
                      <tr key={d.id}>
                        <td>{d.date}</td>
                        <td>{d.time}</td>
                        <td>
                          <button
                            type="button"
                            className={`btn btn-sm ${d.completed ? 'btn-success' : 'btn-outline-secondary'}`}
                            onClick={() => toggleSessionDone(d.id, !d.completed)}
                          >
                            {d.completed ? sq.professor.details.completed : sq.professor.details.scheduled}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-card p-4">
        <div className="fw-semibold">{sq.professor.details.exams}</div>
        <form className="row g-3 mt-1 align-items-end" onSubmit={saveTests}>
          <div className="col-md-4">
            <label className="form-label small">{sq.professor.details.writtenPassed}</label>
            <select
              className="form-select"
              value={writtenPassed ? 'yes' : 'no'}
              onChange={(e) => setWrittenPassed(e.target.value === 'yes')}
            >
              <option value="no">{sq.professor.details.no}</option>
              <option value="yes">{sq.professor.details.yes}</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label small">{sq.professor.details.drivingTestDate}</label>
            <input
              type="date"
              className="form-control"
              value={drivingTestDate}
              onChange={(e) => setDrivingTestDate(e.target.value)}
              disabled={!writtenPassed}
            />
          </div>
          <div className="col-md-4 text-md-end">
            <button type="submit" className="btn btn-success" disabled={saving}>
              {sq.professor.details.saveExams}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
