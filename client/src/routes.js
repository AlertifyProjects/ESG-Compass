import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout components
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Auth pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Dashboard pages
import DashboardPage from './pages/DashboardPage';

// Metrics pages
import MetricsListPage from './pages/MetricsListPage';
import MetricEntryPage from './pages/MetricEntryPage';
import MetricDetailPage from './pages/MetricDetailPage';

// Reports pages
import ReportsListPage from './pages/ReportsListPage';
import ReportBuilderPage from './pages/ReportBuilderPage';
import ReportViewPage from './pages/ReportViewPage';

// Organization pages
import OrganizationProfilePage from './pages/OrganizationProfilePage';

// Admin pages
import UsersManagementPage from './pages/UsersManagementPage';
import OrganizationsListPage from './pages/OrganizationsListPage';

// Auth guard for protected routes
import ProtectedRoute from './components/auth/ProtectedRoute';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Metrics */}
            <Route path="/metrics" element={<MetricsListPage />} />
            <Route path="/metrics/entry" element={<MetricEntryPage />} />
            <Route path="/metrics/:id" element={<MetricDetailPage />} />
            
            {/* Reports */}
            <Route path="/reports" element={<ReportsListPage />} />
            <Route path="/reports/build" element={<ReportBuilderPage />} />
            <Route path="/reports/:id" element={<ReportViewPage />} />
            
            {/* Organization */}
            <Route path="/organization/profile" element={<OrganizationProfilePage />} />
            
            {/* Admin routes */}
            <Route path="/admin/users" element={<UsersManagementPage />} />
            <Route path="/admin/organizations" element={<OrganizationsListPage />} />
          </Route>
        </Route>
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;