import React, { useMemo, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../auth/roles';
import sq from '../../i18n/sq';

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

function roleLabel(role) {
  if (role === ROLES.ADMIN) return sq.roles.admin;
  if (role === ROLES.PROFESSOR) return sq.roles.professor;
  if (role === ROLES.STUDENT) return sq.roles.student;
  return role || sq.dashboard.unknownRole;
}

export default function DashboardLayout() {
  const { displayName, role, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = useMemo(() => {
    if (role === ROLES.PROFESSOR) {
      return [
        { to: '/dashboard/professor', label: sq.professor.sidebarOverview, end: true },
        { to: '/dashboard/professor/groups', label: sq.professor.groupsTitle },
        { to: '/dashboard/professor/students', label: sq.professor.studentsTitle },
      ];
    }
    if (role === ROLES.ADMIN) {
      return [{ to: '/dashboard/admin', label: sq.admin.title, end: true }];
    }
    if (role === ROLES.STUDENT) {
      return [{ to: '/dashboard/student', label: sq.studentPortal.navTitle, end: true }];
    }
    return [{ to: '/dashboard', label: sq.dashboard.title, end: true }];
  }, [role]);

  return (
    <div className="dash-shell d-flex">
      <aside
        className="dash-sidebar p-3 d-none d-lg-flex flex-column"
        aria-label="Sidebar navigation"
      >
        <div className="mb-3">
          <div className="fw-bold fs-5">{sq.brand}</div>
          <div className="small opacity-75">{sq.brandTagline}</div>
        </div>
        <nav className="nav nav-pills flex-column gap-1">
          {navItems.map((it) => (
            <SidebarLink key={it.to} to={it.to} label={it.label} end={it.end} />
          ))}
        </nav>

        <div className="mt-auto pt-3 small opacity-75">
          {sq.dashboard.role}: <span className="fw-semibold">{roleLabel(role)}</span>
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
                {sq.dashboard.menu}
              </button>
              <div className="fw-semibold">{sq.dashboard.title}</div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="text-end">
                <div className="fw-semibold">{displayName || sq.dashboard.userFallback}</div>
                <div className="small text-secondary">{roleLabel(role)}</div>
              </div>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={async () => {
                  await logout();
                  navigate('/login');
                }}
              >
                {sq.dashboard.logout}
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
