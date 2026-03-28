import React, { useMemo, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../auth/roles';

function SidebarLink({ to, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `nav-link px-3 py-2 rounded-3 ${isActive ? 'active' : ''}`
      }
    >
      {label}
    </NavLink>
  );
}

export default function DashboardLayout() {
  const { displayName, role, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = useMemo(() => {
    if (role === ROLES.PROFESSOR) {
      return [
        { to: '/dashboard/professor', label: 'Overview', end: true },
        { to: '/dashboard/professor/students', label: 'Students' },
      ];
    }
    if (role === ROLES.ADMIN) {
      return [{ to: '/dashboard/admin', label: 'Schools & analytics', end: true }];
    }
    if (role === ROLES.STUDENT) {
      return [{ to: '/dashboard/student', label: 'My progress', end: true }];
    }
    return [{ to: '/dashboard', label: 'Dashboard', end: true }];
  }, [role]);

  return (
    <div className="dash-shell d-flex">
      <aside
        className="dash-sidebar p-3 d-none d-lg-flex flex-column"
        aria-label="Sidebar navigation"
      >
        <div className="mb-3">
          <div className="fw-bold fs-5">Autoshkolla</div>
          <div className="small opacity-75">Management System</div>
        </div>
        <nav className="nav nav-pills flex-column gap-1">
          {navItems.map((it) => (
            <SidebarLink key={it.to} to={it.to} label={it.label} end={it.end} />
          ))}
        </nav>

        <div className="mt-auto pt-3 small opacity-75">
          Role: <span className="fw-semibold">{role || 'UNKNOWN'}</span>
        </div>
      </aside>

      <div className="flex-grow-1 d-flex flex-column">
        <header className="dash-topbar">
          <div className="container-fluid py-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary d-lg-none"
                onClick={() => setSidebarOpen((v) => !v)}
              >
                Menu
              </button>
              <div className="fw-semibold">Dashboard</div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="text-end">
                <div className="fw-semibold">{displayName || 'User'}</div>
                <div className="small text-secondary">{role || ''}</div>
              </div>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={async () => {
                  await logout();
                  navigate('/login');
                }}
              >
                Logout
              </button>
            </div>
          </div>

          {sidebarOpen && (
            <div className="d-lg-none border-top">
              <div className="p-2">
                <nav className="nav nav-pills flex-column gap-1">
                  {navItems.map((it) => (
                    <SidebarLink key={it.to} to={it.to} label={it.label} end={it.end} />
                  ))}
                </nav>
              </div>
            </div>
          )}
        </header>

        <main className="container-fluid py-4 flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
