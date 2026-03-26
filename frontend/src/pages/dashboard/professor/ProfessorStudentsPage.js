import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import InlineAlert from '../../../components/common/InlineAlert';
import ProgressBar from '../../../components/common/ProgressBar';
import { getApiErrorMessage } from '../../../services/api';
import { useProfessorService } from '../../../hooks/useProfessorService';
import { calculateStudentProgress } from '../../../utils/progress';

function getStudentName(s) {
  const name = s?.name ?? s?.firstName ?? s?.first_name ?? '';
  const surname = s?.surname ?? s?.lastName ?? s?.last_name ?? '';
  const full = `${name} ${surname}`.trim();
  return full || s?.fullName || s?.full_name || 'Student';
}

export default function ProfessorStudentsPage() {
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

  const rows = useMemo(() => {
    const list = Array.isArray(students) ? students : [];
    return list.map((s) => {
      const lecturesCompleted = s?.lecturesCompleted ?? s?.lectures_completed ?? 0;
      const drivingCompleted = s?.drivingCompleted ?? s?.driving_completed ?? 0;
      const writtenTestPassed = Boolean(s?.writtenTestPassed ?? s?.written_test_passed ?? false);
      const drivingTestDate = s?.drivingTestDate ?? s?.driving_test_date ?? null;
      const progress = calculateStudentProgress({
        lecturesCompleted,
        drivingCompleted,
        drivingTotal: s?.drivingTotal ?? s?.driving_total ?? null,
        writtenTestPassed,
        drivingTestScheduled: Boolean(drivingTestDate),
      });

      return {
        id: s?.id ?? s?.studentId ?? s?.student_id,
        name: getStudentName(s),
        lecturesCompleted,
        drivingCompleted,
        writtenTestPassed,
        drivingTestDate,
        progress,
      };
    });
  }, [students]);

  return (
    <div className="d-flex flex-column gap-3">
      <div className="dash-card p-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <div className="fw-semibold fs-5">Students</div>
          <div className="text-secondary small">
            Only students assigned to the logged-in professor are visible here.
          </div>
        </div>
        <div className="text-secondary small">
          {loading ? 'Loading…' : `${rows.length} student(s)`}
        </div>
      </div>

      {error ? <InlineAlert title="API error" message={error} /> : null}

      <div className="dash-card p-3">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="text-secondary small">
                <th>Student</th>
                <th>Lectures (attendance)</th>
                <th>Driving sessions</th>
                <th>Written test</th>
                <th>Driving test date</th>
                <th style={{ width: 220 }}>Progress</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-secondary">
                    Loading students…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-secondary">
                    No assigned students found.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id ?? r.name}>
                    <td className="fw-semibold">
                      {r.id ? (
                        <Link to={`/dashboard/professor/students/${r.id}`} className="text-decoration-none">
                          {r.name}
                        </Link>
                      ) : (
                        r.name
                      )}
                      {!r.id ? (
                        <div className="text-danger small mt-1">
                          Missing `id` from API response.
                        </div>
                      ) : null}
                    </td>
                    <td>
                      <span className="badge text-bg-light">
                        {Number(r.lecturesCompleted)}/12
                      </span>
                    </td>
                    <td>
                      <span className="badge text-bg-light">{Number(r.drivingCompleted)}</span>
                    </td>
                    <td>
                      <span className={`badge ${r.writtenTestPassed ? 'text-bg-success' : 'text-bg-secondary'}`}>
                        {r.writtenTestPassed ? 'Passed' : 'Not Passed'}
                      </span>
                    </td>
                    <td className="text-secondary">
                      {r.drivingTestDate ? String(r.drivingTestDate) : '—'}
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="flex-grow-1">
                          <ProgressBar value={r.progress} />
                        </div>
                        <div className="small text-secondary" style={{ width: 44, textAlign: 'right' }}>
                          {Math.round(r.progress * 100)}%
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

