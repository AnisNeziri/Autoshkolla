import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import InlineAlert from '../../../components/common/InlineAlert';
import ProgressBar from '../../../components/common/ProgressBar';
import { getApiErrorMessage } from '../../../services/api';
import { useProfessorService } from '../../../hooks/useProfessorService';
import sq from '../../../i18n/sq';

export default function ProfessorStudentsPage() {
  const professorApi = useProfessorService();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    theoretical_group: '',
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await professorApi.getStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const rows = useMemo(
    () =>
      students.map((r) => ({
        ...r,
        progressFraction: (Number(r.progress_percent) || 0) / 100,
      })),
    [students]
  );

  const createStudent = async (e) => {
    e.preventDefault();
    if (!form.name?.trim() || !form.surname?.trim() || !form.email?.trim()) {
      setError(sq.professor.requiredNameSurnameEmail);
      return;
    }
    setCreateLoading(true);
    setError('');
    setGeneratedPassword('');
    try {
      const res = await professorApi.createStudent({
        name: form.name.trim(),
        surname: form.surname.trim(),
        email: form.email.trim(),
        theoretical_group: form.theoretical_group.trim() || undefined,
      });
      setGeneratedPassword(res?.generated_password || '');
      setForm({ name: '', surname: '', email: '', theoretical_group: '' });
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      <div className="dash-card p-4 d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <div className="fw-semibold fs-5">{sq.professor.studentsTitle}</div>
          <div className="text-secondary small">{sq.professor.studentsSubtitle}</div>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
          {sq.professor.createStudentHint}
        </button>
      </div>

      {error ? <InlineAlert title={sq.professor.error} message={error} /> : null}

      {modalOpen && (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,.45)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{sq.professor.newStudent}</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label={sq.professor.close}
                  onClick={() => {
                    setModalOpen(false);
                    setGeneratedPassword('');
                  }}
                />
              </div>
              <form onSubmit={createStudent}>
                <div className="modal-body">
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label small">{sq.professor.name}</label>
                      <input
                        className="form-control"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small">{sq.professor.surname}</label>
                      <input
                        className="form-control"
                        value={form.surname}
                        onChange={(e) => setForm((f) => ({ ...f, surname: e.target.value }))}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small">{sq.auth.email}</label>
                      <input
                        type="email"
                        className="form-control"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small">{sq.professor.groupOptional}</label>
                      <input
                        className="form-control"
                        value={form.theoretical_group}
                        onChange={(e) => setForm((f) => ({ ...f, theoretical_group: e.target.value }))}
                      />
                    </div>
                  </div>
                  {generatedPassword ? (
                    <div className="alert alert-success mt-3 small mb-0">
                      {sq.professor.tempPassword}: <strong>{generatedPassword}</strong>
                      <div className="mt-1">{sq.professor.tempPasswordHint}</div>
                    </div>
                  ) : null}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setModalOpen(false);
                      setGeneratedPassword('');
                    }}
                  >
                    {sq.professor.close}
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={createLoading}>
                    {createLoading ? sq.professor.creating : sq.professor.create}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="dash-card p-3">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="text-secondary small">
                <th>{sq.professor.colStudent}</th>
                <th>{sq.professor.colGroup}</th>
                <th>{sq.professor.colLectures}</th>
                <th>{sq.professor.colDriving}</th>
                <th>{sq.professor.colWritten}</th>
                <th>{sq.professor.colDrivingTest}</th>
                <th style={{ width: 200 }}>{sq.professor.colProgress}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center text-secondary py-4">
                    {sq.dashboard.loading}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-secondary py-4">
                    {sq.professor.noStudents}
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id}>
                    <td className="fw-semibold">
                      <Link
                        to={`/dashboard/professor/students/${r.id}`}
                        className="text-decoration-none"
                      >
                        {r.name} {r.surname}
                      </Link>
                      <div className="small text-secondary">{r.email}</div>
                    </td>
                    <td>
                      <span className="badge text-bg-light">{r.theoretical_group || '—'}</span>
                    </td>
                    <td>
                      {r.lectures_present ?? 0}/{r.lectures_count ?? 0}
                    </td>
                    <td>
                      {r.driving_sessions_completed ?? 0}/{r.driving_sessions_count ?? 0}
                    </td>
                    <td>
                      <span
                        className={`badge ${r.written_test_passed ? 'text-bg-success' : 'text-bg-secondary'}`}
                      >
                        {r.written_test_passed ? sq.professor.passed : sq.professor.notPassed}
                      </span>
                    </td>
                    <td className="text-secondary small">{r.driving_test_date || '—'}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="flex-grow-1">
                          <ProgressBar value={r.progressFraction} />
                        </div>
                        <span className="small text-secondary">{r.progress_percent ?? 0}%</span>
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
