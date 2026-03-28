import React, { useEffect, useState } from 'react';
import ProgressBar from '../../../components/common/ProgressBar';
import InlineAlert from '../../../components/common/InlineAlert';
import { getApiErrorMessage } from '../../../services/api';
import { useStudentPortalService } from '../../../hooks/useStudentPortalService';
import sq from '../../../i18n/sq';

export default function StudentDashboard() {
  const api = useStudentPortalService();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const d = await api.getDashboard();
        if (!alive) return;
        setData(d);
      } catch (e) {
        if (!alive) return;
        setError(getApiErrorMessage(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [api]);

  const progressFraction = (Number(data?.progress?.progress_percent) || 0) / 100;

  if (loading) {
    return (
      <div className="dash-card p-4">
        <div className="text-secondary">{sq.dashboard.loadingDashboard}</div>
      </div>
    );
  }

  if (error) {
    return <InlineAlert title={sq.studentPortal.loadError} message={error} />;
  }

  const scheduleGroup = data?.profile?.professor_group;

  return (
    <div className="d-flex flex-column gap-3">
      <div className="dash-card p-4">
        <div className="fw-semibold fs-5">
          {sq.studentPortal.greeting}, {data?.profile?.name} {data?.profile?.surname}
        </div>
        <div className="text-secondary small">{data?.profile?.email}</div>
        <div className="mt-2 small">
          {sq.studentPortal.groupLabel}:{' '}
          <span className="fw-semibold">
            {scheduleGroup?.name || data?.profile?.theoretical_group || '—'}
          </span>
        </div>
        {scheduleGroup ? (
          <div className="mt-2 small text-secondary">
            {sq.professor.lectureDays}: {scheduleGroup.lecture_days || '—'} · {sq.professor.scheduleTime}:{' '}
            {scheduleGroup.schedule_time || '—'}
          </div>
        ) : null}
        <div className="mt-3" style={{ maxWidth: 360 }}>
          <div className="small text-secondary mb-1">{sq.studentPortal.progressReadonly}</div>
          <div className="d-flex align-items-center gap-2">
            <div className="flex-grow-1">
              <ProgressBar value={progressFraction} />
            </div>
            <span className="small">{data?.progress?.progress_percent ?? 0}%</span>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="dash-card p-4">
            <div className="fw-semibold mb-2">{sq.studentPortal.lecturesAttendance}</div>
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr className="text-secondary small">
                    <th>{sq.professor.details.date}</th>
                    <th>{sq.professor.details.time}</th>
                    <th>{sq.professor.details.present}</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.lectures || []).length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-secondary">
                        {sq.studentPortal.noLectures}
                      </td>
                    </tr>
                  ) : (
                    data.lectures.map((l, idx) => (
                      <tr key={`${l.date}-${idx}`}>
                        <td>{l.date}</td>
                        <td>{l.time}</td>
                        <td>{l.present ? sq.professor.details.yes : sq.professor.details.no}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="dash-card p-4">
            <div className="fw-semibold mb-2">{sq.studentPortal.drivingSessions}</div>
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr className="text-secondary small">
                    <th>{sq.professor.details.date}</th>
                    <th>{sq.professor.details.time}</th>
                    <th>{sq.professor.details.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.driving_sessions || []).length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-secondary">
                        {sq.studentPortal.noSessions}
                      </td>
                    </tr>
                  ) : (
                    data.driving_sessions.map((d, idx) => (
                      <tr key={`${d.date}-${idx}`}>
                        <td>{d.date}</td>
                        <td>{d.time}</td>
                        <td>
                          {d.completed ? sq.professor.details.completed : sq.professor.details.scheduled}
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
        <div className="fw-semibold mb-2">{sq.studentPortal.exams}</div>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="small text-secondary">{sq.studentPortal.written}</div>
            <div>
              {data?.written_exam
                ? `${data.written_exam.passed ? sq.professor.passed : sq.professor.notPassed} · ${data.written_exam.exam_date || ''}`
                : sq.studentPortal.notScheduled}
            </div>
          </div>
          <div className="col-md-6">
            <div className="small text-secondary">{sq.studentPortal.practical}</div>
            <div>{data?.practical_exam?.exam_date || '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
