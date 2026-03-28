import React, { useCallback, useEffect, useState } from 'react';
import InlineAlert from '../../../components/common/InlineAlert';
import SimpleBarChart from '../../../components/charts/SimpleBarChart';
import { getApiErrorMessage } from '../../../services/api';
import { useAdminService } from '../../../hooks/useAdminService';

export default function AdminDashboard() {
  const adminApi = useAdminService();
  const [schools, setSchools] = useState([]);
  const [granularity, setGranularity] = useState('day');
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [sList, a] = await Promise.all([
        adminApi.getSchools(),
        adminApi.getSchoolAnalytics(granularity),
      ]);
      setSchools(Array.isArray(sList) ? sList : []);
      setAnalytics(a);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [adminApi, granularity]);

  useEffect(() => {
    load();
  }, [load]);

  const chartData = (analytics?.series || []).map((row) => ({
    label: row.period?.slice?.(-5) || row.period,
    value: row.count,
  }));

  const trendLabel =
    analytics?.trend === 'increasing'
      ? 'Trend: increasing'
      : analytics?.trend === 'decreasing'
        ? 'Trend: decreasing'
        : 'Trend: flat';

  const TrendBadge = () => {
    const c =
      analytics?.trend === 'increasing'
        ? 'success'
        : analytics?.trend === 'decreasing'
          ? 'danger'
          : 'secondary';
    return <span className={`badge text-bg-${c}`}>{trendLabel}</span>;
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this driving school and its owner account? This cannot be undone.')) {
      return;
    }
    setError('');
    try {
      await adminApi.deleteSchool(id);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      <div className="dash-card p-4">
        <div className="fw-semibold fs-5">Admin</div>
        <div className="text-secondary small">
          Driving schools registry and registration analytics.
        </div>
      </div>

      {error ? <InlineAlert title="Request failed" message={error} /> : null}

      <div className="dash-card p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="fw-semibold">School registrations</div>
          <div className="d-flex align-items-center gap-2">
            <select
              className="form-select form-select-sm"
              style={{ width: 140 }}
              value={granularity}
              onChange={(e) => setGranularity(e.target.value)}
            >
              <option value="day">Per day</option>
              <option value="week">Per week</option>
              <option value="month">Per month</option>
            </select>
            <TrendBadge />
          </div>
        </div>
        <div className="text-secondary small mt-1">
          Total schools: {analytics?.total_schools ?? '—'} · {loading ? 'Loading chart…' : null}
        </div>
        <div className="mt-3">
          <SimpleBarChart data={chartData} title="" height={200} />
        </div>
      </div>

      <div className="dash-card p-3">
        <div className="fw-semibold mb-3">Registered driving schools</div>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr className="text-secondary small">
                <th>School</th>
                <th>Owner</th>
                <th>Business #</th>
                <th style={{ width: 100 }} />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center text-secondary py-4">
                    Loading…
                  </td>
                </tr>
              ) : schools.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-secondary py-4">
                    No schools yet.
                  </td>
                </tr>
              ) : (
                schools.map((s) => (
                  <tr key={s.id}>
                    <td className="fw-semibold">{s.name}</td>
                    <td>
                      {s.owners_name} {s.owners_surname}
                    </td>
                    <td className="text-secondary small">{s.numri_biz}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(s.id)}
                      >
                        Delete
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
  );
}
