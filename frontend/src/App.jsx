import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Sprint 2: Dashboard
import DashboardPage from './pages/analyst/DashboardPage';

// Sprint 3: Reviews + Users
import ReviewsPage from './pages/analyst/ReviewsPage';
import UserManagementPage from './pages/admin/UserManagementPage';

// Sprint 4: Data Sources + Import
import DataSourcesPage from './pages/manager/DataSourcesPage';
import ImportPage from './pages/manager/ImportPage';

// Sprint 5: Reports + System Config
import ReportsPage from './pages/analyst/ReportsPage';
import SystemConfigPage from './pages/admin/SystemConfigPage';
import SystemReportsPage from './pages/admin/SystemReportsPage';

// Sprint 6: Review Mgmt + Tracking + Alerts (Manager)
import ReviewManagementPage from './pages/manager/ReviewManagementPage';
import ReviewTrackingPage from './pages/manager/ReviewTrackingPage';
import AlertsPage from './pages/manager/AlertsPage';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes — không cần đăng nhập */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes — bọc ProtectedRoute + MainLayout */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            {/* ANALYST — Dashboard, Reviews, Reports */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['ANALYST', 'MANAGER', 'ADMIN']}><DashboardPage /></ProtectedRoute>} />
            <Route path="/reviews" element={<ProtectedRoute allowedRoles={['ANALYST', 'MANAGER', 'ADMIN']}><ReviewsPage /></ProtectedRoute>} />
            <Route path="/reviews/top" element={<ProtectedRoute allowedRoles={['ANALYST', 'MANAGER', 'ADMIN']}><ReviewsPage /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute allowedRoles={['ANALYST', 'ADMIN']}><ReportsPage /></ProtectedRoute>} />
            <Route path="/reports/custom" element={<ProtectedRoute allowedRoles={['ANALYST', 'ADMIN']}><ReportsPage /></ProtectedRoute>} />

            {/* MANAGER — Data Sources, Review Mgmt, Tracking, Alerts */}
            <Route path="/data-sources" element={<ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}><DataSourcesPage /></ProtectedRoute>} />
            <Route path="/data-sources/import" element={<ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}><ImportPage /></ProtectedRoute>} />
            <Route path="/review-management" element={<ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}><ReviewManagementPage /></ProtectedRoute>} />
            <Route path="/review-tracking" element={<ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}><ReviewTrackingPage /></ProtectedRoute>} />
            <Route path="/alerts" element={<ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}><AlertsPage /></ProtectedRoute>} />

            {/* ADMIN — Users, Settings, System Reports */}
            <Route path="/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><UserManagementPage /></ProtectedRoute>} />
            <Route path="/users/create" element={<ProtectedRoute allowedRoles={['ADMIN']}><UserManagementPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute allowedRoles={['ADMIN']}><SystemConfigPage /></ProtectedRoute>} />
            <Route path="/settings/ai" element={<ProtectedRoute allowedRoles={['ADMIN']}><SystemConfigPage /></ProtectedRoute>} />
            <Route path="/settings/keywords" element={<ProtectedRoute allowedRoles={['ADMIN']}><SystemConfigPage /></ProtectedRoute>} />
            <Route path="/system-reports" element={<ProtectedRoute allowedRoles={['ADMIN']}><SystemReportsPage /></ProtectedRoute>} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;

