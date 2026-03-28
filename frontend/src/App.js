import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './Layout';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ProtectedRoute from './auth/ProtectedRoute';
import RequirePasswordChange from './auth/RequirePasswordChange';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardEntry from './pages/dashboard/DashboardEntry';
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import StudentDashboard from './pages/dashboard/student/StudentDashboard';
import ProfessorOverview from './pages/dashboard/professor/ProfessorOverview';
import ProfessorStudentsPage from './pages/dashboard/professor/ProfessorStudentsPage';
import ProfessorStudentDetailsPage from './pages/dashboard/professor/ProfessorStudentDetailsPage';
import ProfessorGroupsPage from './pages/dashboard/professor/ProfessorGroupsPage';
import { ROLES } from './auth/roles';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/change-password" element={<ChangePasswordPage />} />

          <Route element={<RequirePasswordChange />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardEntry />} />

              <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
                <Route path="admin" element={<AdminDashboard />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} />}>
                <Route path="student" element={<StudentDashboard />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={[ROLES.PROFESSOR]} />}>
                <Route path="professor" element={<ProfessorOverview />} />
                <Route path="professor/groups" element={<ProfessorGroupsPage />} />
                <Route path="professor/students" element={<ProfessorStudentsPage />} />
                <Route path="professor/students/:studentId" element={<ProfessorStudentDetailsPage />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
