import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import InlineAlert from '../../../components/common/InlineAlert';
import ProgressBar from '../../../components/common/ProgressBar';
import { getApiErrorMessage } from '../../../services/api';
import { useProfessorService } from '../../../hooks/useProfessorService';
import { calculateStudentProgress } from '../../../utils/progress';

function normalizeBool(v) {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v === 1;
  if (typeof v === 'string') return ['1', 'true', 'yes', 'present', 'passed', 'completed'].includes(v.toLowerCase());
  return false;
}

export default function ProfessorStudentDetailsPage() {
  const { studentId } = useParams();
  const professorApi = useProfessorService();

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [lectureForm, setLectureForm] = useState({ date: '', time: '', present: true });
  const [sessionForm, setSessionForm] = useState({ date: '', time: '', completed: false });
  const [writtenTestPassed, setWrittenTestPassed] = useState(false);
  const [drivingTestDate, setDrivingTestDate] = useState('');

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const [s, l, ds] = await Promise.all([
        professorApi.getStudent(studentId),
        professorApi.getLectures(studentId),
        professorApi.getDrivingSessions(studentId),
      ]);
      setStudent(s || null);
      setLectures(Array.isArray(l) ? l : l?.data || []);
      setSessions(Array.isArray(ds) ? ds : ds?.data || []);

      const wt = s?.writtenTestPassed ?? s?.written_test_passed ?? s?.writtenTest ?? s?.written_test ?? false;
      setWrittenTestPassed(normalizeBool(wt));
      const dtd = s?.drivingTestDate ?? s?.driving_test_date ?? '';
      setDrivingTestDate(dtd ? String(dtd) : '');
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  const lectureStats = useMemo(() => {
    const list = Array.isArray(lectures) ? lectures : [];
    const presentCount = list.filter((x) => normalizeBool(x?.present ?? x?.attendance ?? x?.is_present)).length;
    return { total: list.length, presentCount };
  }, [lectures]);

  const drivingStats = useMemo(() => {
    const list = Array.isArray(sessions) ? sessions : [];
    const completedCount = list.filter((x) => normalizeBool(x?.completed ?? x?.is_completed)).length;
    return { total: list.length, completedCount };
  }, [sessions]);

  const progress = useMemo(() => {
    return calculateStudentProgress({
      lecturesCompleted: lectureStats.total,
      drivingCompleted: drivingStats.completedCount,
      drivingTotal: student?.drivingTotal ?? student?.driving_total ?? null,
      writtenTestPassed,
      drivingTestScheduled: Boolean(drivingTestDate),
    });
  }, [lectureStats.total, drivingStats.completedCount, student, writtenTestPassed, drivingTestDate]);

  const studentName = useMemo(() => {
    if (!student) return `Student #${studentId}`;
    const name = student?.name ?? student?.firstName ?? student?.first_name ?? '';
    const surname = student?.surname ?? student?.lastName ?? student?.last_name ?? '';
    return `${name} ${surname}`.trim() || student?.fullName || student?.full_name || `Student #${studentId}`;
  }, [student, studentId]);

  const addLecture = async (e) => {
    e.preventDefault();
    if (!lectureForm.date || !lectureForm.time) {
      setError('Please select lecture date and time.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await professorApi.addLecture(studentId, {
        date: lectureForm.date,
        time: lectureForm.time,
        present: lectureForm.present,
      });
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
      setError('Please select driving session date and time.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await professorApi.addDrivingSession(studentId, {
        date: sessionForm.date,
        time: sessionForm.time,
        completed: sessionForm.completed,
      });
      setSessionForm({ date: '', time: '', completed: false });
      await refresh();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const saveTests = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await professorApi.updateWrittenTest(studentId, { passed: writtenTestPassed });
      if (writtenTestPassed && drivingTestDate) {
        await professorApi.scheduleDrivingTest(studentId, { examDate: drivingTestDate });
      }
      await refresh();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      <div className="dash-card p-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <div className="text-secondary small">
              <Link to="/dashboard/professor/students" className="text-decoration-none">
                ← Back to students
              </Link>
            </div>
            <div className="fw-semibold fs-5 mt-1">{studentName}</div>
          </div>
          <div style={{ minWidth: 260 }}>
            <div className="d-flex align-items-center gap-2">
              <div className="flex-grow-1">
                <ProgressBar value={progress} />
              </div>
              <div className="small text-secondary" style={{ width: 52, textAlign: 'right' }}>
                {Math.round(progress * 100)}%
              </div>
            </div>
            <div className="small text-secondary mt-1">
              Lectures 40% • Driving 40% • Written 10% • Practical 10%
            </div>
          </div>
        </div>
      </div>

      {error ? <InlineAlert title="Action failed" message={error} /> : null}

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="dash-card p-4">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="fw-semibold">Lectures</div>
                <div className="text-secondary small">Total required: 12</div>
              </div>
              <div className="text-secondary small">
                {loading ? '—' : `${lectureStats.total}/12 recorded`}
              </div>
            </div>

            <hr />

            <form className="row g-2" onSubmit={addLecture}>
              <div className="col-12 col-md-4">
                <label className="form-label small">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={lectureForm.date}
                  onChange={(e) => setLectureForm((s) => ({ ...s, date: e.target.value }))}
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label small">Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={lectureForm.time}
                  onChange={(e) => setLectureForm((s) => ({ ...s, time: e.target.value }))}
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label small">Attendance</label>
                <select
                  className="form-select"
                  value={lectureForm.present ? 'present' : 'absent'}
                  onChange={(e) =>
                    setLectureForm((s) => ({ ...s, present: e.target.value === 'present' }))
                  }
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
              <div className="col-12 d-flex justify-content-end">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  Add lecture
                </button>
              </div>
            </form>

            <div className="mt-3 table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr className="text-secondary small">
                    <th>Date</th>
                    <th>Time</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="py-3 text-center text-secondary">
                        Loading…
                      </td>
                    </tr>
                  ) : lectures.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-3 text-center text-secondary">
                        No lectures recorded yet.
                      </td>
                    </tr>
                  ) : (
                    lectures.map((l) => (
                      <tr key={l?.id ?? `${l?.date}-${l?.time}`}>
                        <td>{String(l?.date ?? l?.lecture_date ?? '—')}</td>
                        <td>{String(l?.time ?? l?.lecture_time ?? '—')}</td>
                        <td>
                          <span
                            className={`badge ${
                              normalizeBool(l?.present ?? l?.attendance ?? l?.is_present)
                                ? 'text-bg-success'
                                : 'text-bg-secondary'
                            }`}
                          >
                            {normalizeBool(l?.present ?? l?.attendance ?? l?.is_present)
                              ? 'Present'
                              : 'Absent'}
                          </span>
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
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="fw-semibold">Driving sessions</div>
                <div className="text-secondary small">Min 5 days, max 20 days</div>
              </div>
              <div className="text-secondary small">
                {loading ? '—' : `${drivingStats.completedCount}/${drivingStats.total} completed`}
              </div>
            </div>

            <hr />

            <form className="row g-2" onSubmit={addSession}>
              <div className="col-12 col-md-4">
                <label className="form-label small">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={sessionForm.date}
                  onChange={(e) => setSessionForm((s) => ({ ...s, date: e.target.value }))}
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label small">Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={sessionForm.time}
                  onChange={(e) => setSessionForm((s) => ({ ...s, time: e.target.value }))}
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label small">Status</label>
                <select
                  className="form-select"
                  value={sessionForm.completed ? 'completed' : 'scheduled'}
                  onChange={(e) =>
                    setSessionForm((s) => ({ ...s, completed: e.target.value === 'completed' }))
                  }
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="col-12 d-flex justify-content-end">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  Add session
                </button>
              </div>
            </form>

            <div className="mt-3 table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr className="text-secondary small">
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="py-3 text-center text-secondary">
                        Loading…
                      </td>
                    </tr>
                  ) : sessions.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-3 text-center text-secondary">
                        No driving sessions scheduled yet.
                      </td>
                    </tr>
                  ) : (
                    sessions.map((s) => (
                      <tr key={s?.id ?? `${s?.date}-${s?.time}`}>
                        <td>{String(s?.date ?? s?.session_date ?? '—')}</td>
                        <td>{String(s?.time ?? s?.session_time ?? '—')}</td>
                        <td>
                          <span
                            className={`badge ${
                              normalizeBool(s?.completed ?? s?.is_completed)
                                ? 'text-bg-success'
                                : 'text-bg-secondary'
                            }`}
                          >
                            {normalizeBool(s?.completed ?? s?.is_completed) ? 'Completed' : 'Scheduled'}
                          </span>
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
        <div className="fw-semibold">Tests</div>
        <div className="text-secondary small mt-1">
          Driving test scheduling becomes available after written test is completed.
        </div>

        <hr />

        <form className="row g-3 align-items-end" onSubmit={saveTests}>
          <div className="col-12 col-md-4">
            <label className="form-label small">Written test</label>
            <select
              className="form-select"
              value={writtenTestPassed ? 'passed' : 'not_passed'}
              onChange={(e) => setWrittenTestPassed(e.target.value === 'passed')}
            >
              <option value="not_passed">Not Completed / Not Passed</option>
              <option value="passed">Completed / Passed</option>
            </select>
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label small">Driving test date</label>
            <input
              type="date"
              className="form-control"
              value={drivingTestDate}
              onChange={(e) => setDrivingTestDate(e.target.value)}
              disabled={!writtenTestPassed}
            />
            {!writtenTestPassed ? (
              <div className="small text-secondary mt-1">Enable by marking written test as passed.</div>
            ) : null}
          </div>

          <div className="col-12 col-md-4 d-flex justify-content-md-end">
            <button type="submit" className="btn btn-success" disabled={saving}>
              Save tests
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

