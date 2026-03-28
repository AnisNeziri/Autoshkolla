import React, { useCallback, useEffect, useState } from 'react';
import InlineAlert from '../../../components/common/InlineAlert';
import SimpleBarChart from '../../../components/charts/SimpleBarChart';
import { getApiErrorMessage } from '../../../services/api';
import { useAdminService } from '../../../hooks/useAdminService';
import sq from '../../../i18n/sq';

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
      ? sq.admin.trendUp
      : analytics?.trend === 'decreasing'
        ? sq.admin.trendDown
        : sq.admin.trendFlat;

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
    if (!window.confirm(sq.admin.deleteConfirm)) {
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
        <div className="fw-semibold fs-5">{sq.admin.title}</div>
        <div className="text-secondary small">{sq.admin.subtitle}</div>
      </div>

      {error ? <InlineAlert title={sq.admin.requestFailed} message={error} /> : null}

      <div className="dash-card p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="fw-semibold">{sq.admin.schoolsRegistered}</div>
          <div className="d-flex align-items-center gap-2">
            <select
              className="form-select form-select-sm"
              style={{ width: 140 }}
              value={granularity}
              onChange={(e) => setGranularity(e.target.value)}
            >
              <option value="day">{sq.admin.perDay}</option>
              <option value="week">{sq.admin.perWeek}</option>
              <option value="month">{sq.admin.perMonth}</option>
            </select>
            <TrendBadge />
          </div>
        </div>
        <div className="text-secondary small mt-1">
          {sq.admin.totalSchools}: {analytics?.total_schools ?? '—'} ·{' '}
          {loading ? sq.admin.loadingChart : null}
        </div>
        <div className="mt-3">
          <SimpleBarChart data={chartData} title="" height={200} />
        </div>
      </div>

      <div className="dash-card p-3">
        <div className="fw-semibold mb-3">{sq.admin.schoolsList}</div>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr className="text-secondary small">
                <th>{sq.admin.colSchool}</th>
                <th>{sq.admin.colOwner}</th>
                <th>{sq.admin.colBusiness}</th>
                <th style={{ width: 100 }} />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center text-secondary py-4">
                    {sq.admin.loading}
                  </td>
                </tr>
              ) : schools.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-secondary py-4">
                    {sq.admin.empty}
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
                        {sq.admin.delete}
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
