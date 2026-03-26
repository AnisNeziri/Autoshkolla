import React, { useEffect, useMemo, useState } from 'react';
import InlineAlert from '../../../components/common/InlineAlert';
import { getApiErrorMessage } from '../../../services/api';
import { useProfessorService } from '../../../hooks/useProfessorService';
import { calculateStudentProgress } from '../../../utils/progress';

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
        setStudents(Array.isArray(data) ? data : data?.data || []);
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
    const list = Array.isArray(students) ? students : [];
    const total = list.length;
    const avgProgress =
      total === 0
        ? 0
        : list.reduce((sum, s) => {
            const p = calculateStudentProgress({
              lecturesCompleted: s?.lecturesCompleted ?? s?.lectures_completed ?? 0,
              drivingCompleted: s?.drivingCompleted ?? s?.driving_completed ?? 0,
              drivingTotal: s?.drivingTotal ?? s?.driving_total ?? null,
              writtenTestPassed: Boolean(s?.writtenTestPassed ?? s?.written_test_passed ?? false),
              drivingTestScheduled: Boolean(s?.drivingTestDate ?? s?.driving_test_date ?? null),
            });
            return sum + p;
          }, 0) / total;

    return {
      totalStudents: total,
      averageProgressPct: Math.round(avgProgress * 100),
    };
  }, [students]);

  return (
    <div className="d-flex flex-column gap-3">
      <div className="dash-card p-4">
        <div className="fw-semibold fs-5">Professor Overview</div>
        <div className="text-secondary mt-1">
          Quick snapshot of your assigned candidates and their progress.
        </div>
      </div>

      {error ? <InlineAlert title="API error" message={error} /> : null}

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="dash-card p-4">
            <div className="text-secondary small">Assigned students</div>
            <div className="fs-2 fw-bold">{loading ? '—' : metrics.totalStudents}</div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="dash-card p-4">
            <div className="text-secondary small">Average progress</div>
            <div className="fs-2 fw-bold">{loading ? '—' : `${metrics.averageProgressPct}%`}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

