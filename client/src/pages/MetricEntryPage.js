import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MetricEntryForm from '../components/metrics/MetricEntryForm';

const MetricEntryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [metricId, setMetricId] = useState(null);
  
  useEffect(() => {
    // Check if metric ID is in query params
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('metric');
    if (id) {
      setMetricId(id);
    }
  }, [location]);
  
  return (
    <div className="metric-entry-page">
      <div className="page-header">
        <h1>Enter Metric Data</h1>
        <button className="button" onClick={() => navigate('/metrics')}>
          Back to Metrics
        </button>
      </div>
      
      {metricId ? (
        <MetricEntryForm metricId={metricId} />
      ) : (
        <div className="metric-selection">
          <p>Please select a metric from the metrics library to enter data.</p>
          <button 
            className="button primary-button" 
            onClick={() => navigate('/metrics')}
          >
            Go to Metrics Library
          </button>
        </div>
      )}
    </div>
  );
};

export default MetricEntryPage;