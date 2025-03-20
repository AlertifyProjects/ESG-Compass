import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMetrics } from '../../store/slices/metricsSlice';
import LoadingSpinner from '../common/LoadingSpinner';

const MetricsSummary = () => {
  const dispatch = useDispatch();
  const { metrics, loading } = useSelector((state) => state.metrics);
  
  useEffect(() => {
    dispatch(getAllMetrics());
  }, [dispatch]);
  
  if (loading && metrics.length === 0) {
    return <LoadingSpinner size="small" />;
  }
  
  // Calculate metrics summary
  const metricsSummary = {
    environmental: {
      count: metrics.filter(m => m.category === 'environmental').length,
      complete: 0, // This would come from metric data in a real implementation
      trend: '+5%'
    },
    social: {
      count: metrics.filter(m => m.category === 'social').length,
      complete: 0,
      trend: '+2%'
    },
    governance: {
      count: metrics.filter(m => m.category === 'governance').length,
      complete: 0,
      trend: '0%'
    }
  };
  
  return (
    <div className="metrics-summary">
      <h3 className="component-title">Metrics Summary</h3>
      
      <div className="metrics-grid">
        <div className="metric-category">
          <h4>Environmental</h4>
          <div className="metric-stats">
            <div className="stat">
              <span className="stat-value">{metricsSummary.environmental.count}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat">
              <span className="stat-value">{metricsSummary.environmental.complete}</span>
              <span className="stat-label">Complete</span>
            </div>
            <div className="stat">
              <span className="stat-value">{metricsSummary.environmental.trend}</span>
              <span className="stat-label">Trend</span>
            </div>
          </div>
        </div>
        
        <div className="metric-category">
          <h4>Social</h4>
          <div className="metric-stats">
            <div className="stat">
              <span className="stat-value">{metricsSummary.social.count}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat">
            <span className="stat-value">{metricsSummary.social.count}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat">
              <span className="stat-value">{metricsSummary.social.complete}</span>
              <span className="stat-label">Complete</span>
            </div>
            <div className="stat">
              <span className="stat-value">{metricsSummary.social.trend}</span>
              <span className="stat-label">Trend</span>
            </div>
          </div>
        </div>
        
        <div className="metric-category">
          <h4>Governance</h4>
          <div className="metric-stats">
            <div className="stat">
              <span className="stat-value">{metricsSummary.governance.count}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat">
              <span className="stat-value">{metricsSummary.governance.complete}</span>
              <span className="stat-label">Complete</span>
            </div>
            <div className="stat">
              <span className="stat-value">{metricsSummary.governance.trend}</span>
              <span className="stat-label">Trend</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsSummary;