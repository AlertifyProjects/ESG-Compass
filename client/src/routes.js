import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout components
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Auth pages
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Dashboard page (this is a key component we need)
import DashboardPage from './pages/DashboardPage';

// Create placeholder components for pages we haven't fully implemented yet
const PlaceholderComponent = ({ title }) => (
  <div className="placeholder-page">
    <h1>{title}</h1>
    <p>This page is under construction.</p>
  </div>
);

// Create placeholder pages
const RegisterPage = () => <PlaceholderComponent title="Register" />;
const ForgotPasswordPage = () => <PlaceholderComponent title="Forgot Password" />;
const MetricsListPage = () => <PlaceholderComponent title="Metrics List" />;
const MetricEntryPage = () => <PlaceholderComponent title="Metric Entry" />;
const MetricDetailPage = () => <PlaceholderComponent title="Metric Detail" />;
const ReportsListPage = () => <PlaceholderComponent title="Reports List" />;
const ReportBuilderPage = () => <PlaceholderComponent title="Report Builder" />;
const ReportViewPage = () => <PlaceholderComponent title="Report View" />;
const OrganizationProfilePage = () => <PlaceholderComponent title="Organization Profile" />;
const UsersManagementPage = () => <PlaceholderComponent title="Users Management" />;
const OrganizationsListPage = () => <PlaceholderComponent title="Organizations List" />;

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
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;