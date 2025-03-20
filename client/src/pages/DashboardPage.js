import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrganization } from "../store/slices/organizationSlice";
import MetricsSummary from "../components/dashboard/MetricsSummary";
import RecentReports from "../components/dashboard/RecentReports";
import ComplianceStatus from "../components/dashboard/ComplianceStatus";
import UpcomingDeadlines from "../components/dashboard/UpcomingDeadlines";
import LoadingSpinner from "../components/common/LoadingSpinner";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { organization, loading } = useSelector((state) => state.organization);

  useEffect(() => {
    // In a real app, we'd get the organization ID from the user object
    if (user && user.organization) {
      dispatch(getOrganization(user.organization));
    }
  }, [dispatch, user]);

  if (loading && !organization) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name || "User"}</p>
      </div>

      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Organization</h3>
          <p>{organization?.name || "Not available"}</p>
        </div>
        <div className="summary-card">
          <h3>Subscription</h3>
          <p>{organization?.subscriptionTier || "Free"}</p>
        </div>
        <div className="summary-card">
          <h3>Active Frameworks</h3>
          <p>{organization?.activeFrameworks?.join(", ") || "None"}</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="grid-item">
          <MetricsSummary />
        </div>
        <div className="grid-item">
          <ComplianceStatus />
        </div>
        <div className="grid-item">
          <RecentReports />
        </div>
        <div className="grid-item">
          <UpcomingDeadlines />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
