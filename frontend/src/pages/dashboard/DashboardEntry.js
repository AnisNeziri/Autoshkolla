import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../auth/roles';
import sq from '../../i18n/sq';

export default function DashboardEntry() {
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === ROLES.PROFESSOR) navigate('/dashboard/professor', { replace: true });
    else if (role === ROLES.ADMIN) navigate('/dashboard/admin', { replace: true });
    else if (role === ROLES.STUDENT) navigate('/dashboard/student', { replace: true });
    else navigate('/login', { replace: true });
  }, [role, navigate]);

  return (
    <div className="dash-card p-4">
      <div className="fw-semibold">{sq.dashboard.loadingDashboard}</div>
      <div className="text-secondary small">{sq.dashboard.redirectRole}</div>
    </div>
  );
}
