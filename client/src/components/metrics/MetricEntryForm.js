import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMetricById, createMetricData, resetMetricsSuccess } from '../../store/slices/metricsSlice';
import LoadingSpinner from '../common/LoadingSpinner';

const MetricEntryForm = ({ metricId }) => {
  const dispatch = useDispatch();
  const { metric, loading, error, success } = useSelector((state) => state.metrics);
  const { organization } = useSelector((state) => state.organization);
  
  const [formData, setFormData] = useState({
    value: '',
    period: {
      startDate: '',
      endDate: ''
    },
    location: 'global',
    notes: ''
  });
  
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  useEffect(() => {
    // Fetch metric details
    if (metricId) {
      dispatch(getMetricById(metricId));
    }
    
    // Set default period to current quarter
    const now = new Date();
    const currentQuarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    const currentQuarterEnd = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0);
    
    setFormData({
      ...formData,
      period: {
        startDate: currentQuarterStart.toISOString().split('T')[0],
        endDate: currentQuarterEnd.toISOString().split('T')[0]
      }
    });
    
    // Clean up function
    return () => {
      dispatch(resetMetricsSuccess());
    };
  }, [dispatch, metricId]);
  
  // Track success state
  useEffect(() => {
    if (success) {
      setSubmitSuccess(true);
      // Reset form
      setFormData({
        ...formData,
        value: '',
        notes: ''
      });
      
      // Reset success flag after 3 seconds
      const timer = setTimeout(() => {
        setSubmitSuccess(false);
        dispatch(resetMetricsSuccess());
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('period.')) {
      const periodField = name.split('.')[1];
      setFormData({
        ...formData,
        period: {
          ...formData.period,
          [periodField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const metricData = {
      metric: metricId,
      organization: organization?._id || '1', // Use actual org ID when available
      value: formData.value,
      unit: metric?.unit,
      period: formData.period,
      location: formData.location,
      notes: formData.notes,
      dataSource: 'manual'
    };
    
    dispatch(createMetricData(metricData));
  };
  
  if (loading && !metric) {
    return <LoadingSpinner message="Loading metric details..." />;
  }
  
  if (!metric && !loading) {
    return <div>Metric not found. Please select a different metric.</div>;
  }
  
  return (
    <div className="metric-entry-form">
      {submitSuccess && (
        <div className="success-message">
          Data saved successfully!
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="metric-details">
        <h3>{metric?.name}</h3>
        <p className="metric-description">{metric?.description}</p>
        <div className="metric-meta">
          <span className="metric-category">{metric?.category}</span>
          <span className="metric-subcategory">{metric?.subcategory}</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="value">
            Value {metric?.unit && `(${metric.unit})`}
          </label>
          <input
            type={metric?.dataType === 'number' ? 'number' : 'text'}
            id="value"
            name="value"
            value={formData.value}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="period.startDate">Start Date</label>
            <input
              type="date"
              id="period.startDate"
              name="period.startDate"
              value={formData.period.startDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="period.endDate">End Date</label>
            <input
              type="date"
              id="period.endDate"
              name="period.endDate"
              value={formData.period.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Global"
          />
          <small>Leave as "Global" for company-wide data</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Add any context or methodology notes..."
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="button primary-button" disabled={loading}>
            {loading ? 'Saving...' : 'Save Data'}
          </button>
          <button type="button" className="button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MetricEntryForm;