import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/Layout/MainLayout';

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
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes — bọc trong MainLayout (Sidebar + Header) */}
          <Route element={<MainLayout />}>
            {/* ANALYST — Dashboard, Reviews, Reports */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/reviews/top" element={<ReviewsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/custom" element={<ReportsPage />} />

            {/* MANAGER — Data Sources, Review Mgmt, Tracking, Alerts */}
            <Route path="/data-sources" element={<DataSourcesPage />} />
            <Route path="/data-sources/import" element={<ImportPage />} />
            <Route path="/review-management" element={<ReviewManagementPage />} />
            <Route path="/review-tracking" element={<ReviewTrackingPage />} />
            <Route path="/alerts" element={<AlertsPage />} />

            {/* ADMIN — Users, Settings, System Reports */}
            <Route path="/users" element={<UserManagementPage />} />
            <Route path="/users/create" element={<UserManagementPage />} />
            <Route path="/settings" element={<SystemConfigPage />} />
            <Route path="/settings/ai" element={<SystemConfigPage />} />
            <Route path="/settings/keywords" element={<SystemConfigPage />} />
            <Route path="/system-reports" element={<SystemReportsPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
