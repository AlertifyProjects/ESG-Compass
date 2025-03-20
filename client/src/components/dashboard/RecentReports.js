import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReports } from '../../store/slices/reportsSlice';
import LoadingSpinner from '../common/LoadingSpinner';

const RecentReports = () => {
  const dispatch = useDispatch();
  const { reports, loading } = useSelector((state) => state.reports);
  
  useEffect(() => {
    dispatch(getAllReports());
  }, [dispatch]);
  
  const recentReports = reports.slice(0, 3); // Get only the 3 most recent reports
  
  if (loading && reports.length === 0) {
    return <LoadingSpinner size="small" />;
  }
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'published':
        return 'status-published';
      case 'in_progress':
        return 'status-progress';
      case 'draft':
        return 'status-draft';
      default:
        return '';
    }
  };
  
  return (
    <div className="recent-reports">
      <h3 className="component-title">Recent Reports</h3>
      
      <div className="reports-list">
        {recentReports.length > 0 ? (
          recentReports.map((report) => (
            <div key={report._id} className="report-item">
              <div className="report-info">
                <h4>
                  <Link to={`/reports/${report._id}`}>{report.title}</Link>
                </h4>
                <div className="report-meta">
                  <span className="report-framework">{report.framework}</span>
                  <span className="report-date">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="report-status">
                <span className={`status-badge ${getStatusClass(report.status)}`}>
                  {report.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-reports-message">
            No reports yet. <Link to="/reports/build">Create your first report</Link>
          </div>
        )}
      </div>
      
      <div className="component-footer">
        <Link to="/reports" className="view-all-link">
          View All Reports
        </Link>
      </div>
    </div>
  );
};

export default RecentReports;