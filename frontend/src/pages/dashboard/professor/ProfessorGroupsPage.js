import React, { useCallback, useEffect, useState } from 'react';
import InlineAlert from '../../../components/common/InlineAlert';
import { getApiErrorMessage } from '../../../services/api';
import { useProfessorService } from '../../../hooks/useProfessorService';
import sq from '../../../i18n/sq';

export default function ProfessorGroupsPage() {
  const professorApi = useProfessorService();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    lecture_days: '',
    schedule_time: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await professorApi.getGroups();
      setGroups(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [professorApi]);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm({ name: '', lecture_days: '', schedule_time: '' });
    setEditingId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      setError(`${sq.professor.groupName}: fushë e domosdoshme.`);
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: form.name.trim(),
        lecture_days: form.lecture_days.trim() || null,
        schedule_time: form.schedule_time.trim() || null,
      };
      if (editingId) {
        await professorApi.updateGroup(editingId, payload);
      } else {
        await professorApi.createGroup(payload);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (g) => {
    setEditingId(g.id);
    setForm({
      name: g.name || '',
      lecture_days: g.lecture_days || '',
      schedule_time: g.schedule_time || '',
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm(sq.professor.deleteGroupConfirm)) return;
    setError('');
    try {
      await professorApi.deleteGroup(id);
      if (editingId === id) resetForm();
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      <div className="dash-card p-4">
        <div className="fw-semibold fs-5">{sq.professor.groupsTitle}</div>
        <div className="text-secondary small mt-1">{sq.professor.groupsSubtitle}</div>
      </div>

      {error ? <InlineAlert title={sq.errors.actionFailed} message={error} /> : null}

      <div className="row g-3">
        <div className="col-12 col-lg-5">
          <div className="dash-card p-4">
            <div className="fw-semibold mb-3">{editingId ? sq.professor.edit : sq.professor.addGroup}</div>
            <form className="d-flex flex-column gap-2" onSubmit={onSubmit}>
              <div>
                <label className="form-label small mb-1">{sq.professor.groupName}</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="form-label small mb-1">{sq.professor.lectureDays}</label>
                <input
                  className="form-control"
                  placeholder={sq.professor.lectureDaysPh}
                  value={form.lecture_days}
                  onChange={(e) => setForm((f) => ({ ...f, lecture_days: e.target.value }))}
                />
              </div>
              <div>
                <label className="form-label small mb-1">{sq.professor.scheduleTime}</label>
                <input
                  className="form-control"
                  placeholder={sq.professor.scheduleTimePh}
                  value={form.schedule_time}
                  onChange={(e) => setForm((f) => ({ ...f, schedule_time: e.target.value }))}
                />
              </div>
              <div className="d-flex gap-2 pt-2">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving
                    ? sq.professor.saving
                    : editingId
                      ? sq.professor.saveGroup
                      : sq.professor.addGroup}
                </button>
                {editingId ? (
                  <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                    {sq.professor.close}
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        </div>
        <div className="col-12 col-lg-7">
          <div className="dash-card p-3">
            <div className="fw-semibold mb-3">{sq.professor.myGroups}</div>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr className="text-secondary small">
                    <th>{sq.professor.groupName}</th>
                    <th>{sq.professor.lectureDays}</th>
                    <th>{sq.professor.colSchedule}</th>
                    <th style={{ width: 160 }} />
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="text-center text-secondary py-4">
                        {sq.dashboard.loading}
                      </td>
                    </tr>
                  ) : groups.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-secondary py-4">
                        {sq.professor.noGroups}
                      </td>
                    </tr>
                  ) : (
                    groups.map((g) => (
                      <tr key={g.id}>
                        <td className="fw-semibold">{g.name}</td>
                        <td className="small">{g.lecture_days || '—'}</td>
                        <td className="small">{g.schedule_time || '—'}</td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() => startEdit(g)}
                          >
                            {sq.professor.edit}
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onDelete(g.id)}
                          >
                            {sq.professor.remove}
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
    </div>
  );
}
