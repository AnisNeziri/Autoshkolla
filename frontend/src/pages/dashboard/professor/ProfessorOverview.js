import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import InlineAlert from '../../../components/common/InlineAlert';
import { getApiErrorMessage } from '../../../services/api';
import { useProfessorService } from '../../../hooks/useProfessorService';

export default function ProfessorOverview() {
  const professorApi = useProfessorService();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await professorApi.getStudents();
        if (!alive) return;
        setStudents(Array.isArray(data) ? data : []);
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
  }, [professorApi]);

  const metrics = useMemo(() => {
    const list = students;
    const total = list.length;
    const avg =
      total === 0
        ? 0
        : Math.round(
            list.reduce((sum, s) => sum + (Number(s.progress_percent) || 0), 0) / total
          );
    return { totalStudents: total, averageProgress: avg };
  }, [students]);

  return (
    <div className="d-flex flex-column gap-3">
      <div className="dash-card p-4">
        <div className="fw-semibold fs-5">Professor overview</div>
        <div className="text-secondary mt-1">
          Manage your students, lectures, driving sessions, and exams from the Students section.
        </div>
        <Link to="/dashboard/professor/students" className="btn btn-primary mt-3">
          Go to students
        </Link>
      </div>

      {error ? <InlineAlert title="API error" message={error} /> : null}

      <div className="row g-3">
        <div className="col-md-4">
          <div className="dash-card p-4">
            <div className="text-secondary small">Your students</div>
            <div className="fs-2 fw-bold">{loading ? '—' : metrics.totalStudents}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="dash-card p-4">
            <div className="text-secondary small">Avg. progress</div>
            <div className="fs-2 fw-bold">{loading ? '—' : `${metrics.averageProgress}%`}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="dash-card p-4">
            <div className="text-secondary small">Quick link</div>
            <div className="mt-2">
              <Link to="/dashboard/professor/students" className="btn btn-outline-primary btn-sm">
                Open list
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
