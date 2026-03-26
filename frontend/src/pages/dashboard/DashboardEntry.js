import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../auth/roles';

export default function DashboardEntry() {
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === ROLES.PROFESSOR) navigate('/dashboard/professor', { replace: true });
    else if (role === ROLES.ADMIN) navigate('/dashboard/admin', { replace: true });
    else if (role === ROLES.CANDIDATE) navigate('/dashboard/candidate', { replace: true });
    else navigate('/dashboard/professor', { replace: true });
  }, [role, navigate]);

  return (
    <div className="dash-card p-4">
      <div className="fw-semibold">Loading dashboard…</div>
      <div className="text-secondary small">Redirecting based on your role.</div>
    </div>
  );
}

