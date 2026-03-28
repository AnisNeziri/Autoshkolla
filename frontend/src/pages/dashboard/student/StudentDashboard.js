import React, { useEffect, useState } from 'react';
import ProgressBar from '../../../components/common/ProgressBar';
import InlineAlert from '../../../components/common/InlineAlert';
import { getApiErrorMessage } from '../../../services/api';
import { useStudentPortalService } from '../../../hooks/useStudentPortalService';

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
        <div className="text-secondary">Loading your dashboard…</div>
      </div>
    );
  }

  if (error) {
    return <InlineAlert title="Could not load dashboard" message={error} />;
  }

  return (
    <div className="d-flex flex-column gap-3">
      <div className="dash-card p-4">
        <div className="fw-semibold fs-5">
          {data?.profile?.name} {data?.profile?.surname}
        </div>
        <div className="text-secondary small">{data?.profile?.email}</div>
        <div className="mt-2 small">
          Group: <span className="fw-semibold">{data?.profile?.theoretical_group || '—'}</span>
        </div>
        <div className="mt-3" style={{ maxWidth: 360 }}>
          <div className="small text-secondary mb-1">Overall progress (read-only)</div>
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
            <div className="fw-semibold mb-2">Lectures & attendance</div>
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr className="text-secondary small">
                    <th>Date</th>
                    <th>Time</th>
                    <th>Present</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.lectures || []).length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-secondary">
                        No lectures recorded
                      </td>
                    </tr>
                  ) : (
                    data.lectures.map((l, idx) => (
                      <tr key={`${l.date}-${idx}`}>
                        <td>{l.date}</td>
                        <td>{l.time}</td>
                        <td>{l.present ? 'Yes' : 'No'}</td>
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
            <div className="fw-semibold mb-2">Driving sessions</div>
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr className="text-secondary small">
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.driving_sessions || []).length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-secondary">
                        No sessions scheduled
                      </td>
                    </tr>
                  ) : (
                    data.driving_sessions.map((d, idx) => (
                      <tr key={`${d.date}-${idx}`}>
                        <td>{d.date}</td>
                        <td>{d.time}</td>
                        <td>{d.completed ? 'Completed' : 'Scheduled'}</td>
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
        <div className="fw-semibold mb-2">Exams</div>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="small text-secondary">Written test</div>
            <div>
              {data?.written_exam
                ? `${data.written_exam.passed ? 'Passed' : 'Not passed'} · ${data.written_exam.exam_date || ''}`
                : 'Not scheduled'}
            </div>
          </div>
          <div className="col-md-6">
            <div className="small text-secondary">Driving test</div>
            <div>{data?.practical_exam?.exam_date || '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
