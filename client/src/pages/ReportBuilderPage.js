import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// Import actions when ready
// import { createReport } from '../store/slices/reportsSlice';

const ReportBuilderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { loading, error } = useSelector((state) => state.reports);
  // const { organization } = useSelector((state) => state.organization);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    framework: '',
    reportingPeriod: {
      startDate: '',
      endDate: ''
    }
  });
  
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  
  // Temporary mock data until we connect to Redux
  const availableMetrics = [
    {
      id: '1',
      name: 'Greenhouse Gas Emissions - Scope 1',
      category: 'environmental',
      framework: 'GRI'
    },
    {
      id: '2',
      name: 'Gender Diversity - Board',
      category: 'social',
      framework: 'GRI'
    },
    {
      id: '3',
      name: 'Board Independence',
      category: 'governance',
      framework: 'SASB'
    },
    {
      id: '4',
      name: 'Energy Consumption',
      category: 'environmental',
      framework: 'GRI'
    }
  ];
  
  useEffect(() => {
    // Set default period to current year
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear(), 11, 31);
    
    setFormData({
      ...formData,
      reportingPeriod: {
        startDate: yearStart.toISOString().split('T')[0],
        endDate: yearEnd.toISOString().split('T')[0]
      }
    });
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('reportingPeriod.')) {
      const periodField = name.split('.')[1];
      setFormData({
        ...formData,
        reportingPeriod: {
          ...formData.reportingPeriod,
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
  
  const handleMetricToggle = (metricId) => {
    if (selectedMetrics.includes(metricId)) {
      setSelectedMetrics(selectedMetrics.filter(id => id !== metricId));
    } else {
      setSelectedMetrics([...selectedMetrics, metricId]);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const reportData = {
      title: formData.title,
      description: formData.description,
      // organization: organization.id,
      organization: '1', // Temporary mock value
      framework: formData.framework,
      reportingPeriod: formData.reportingPeriod,
      metrics: selectedMetrics.map(metricId => ({
        metric: metricId,
        included: true
      }))
    };
    
    // dispatch(createReport(reportData))
    //   .then((result) => {
    //     if (!result.error) {
    //       navigate(`/reports/${result.payload.id}`);
    //     }
    //   });
    
    console.log('Creating report:', reportData);
    // For now, just navigate to reports list
    navigate('/reports');
  };
  
  const filteredMetrics = formData.framework
    ? availableMetrics.filter(metric => 
        metric.framework === formData.framework || 
        metric.framework === 'custom'
      )
    : availableMetrics;
  
  return (
    <div className="report-builder-page">
      <div className="page-header">
        <h1>Build a Report</h1>
      </div>
      
      <div className="report-builder-form">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Report Details</h2>
            
            <div className="form-group">
              <label htmlFor="title">Report Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Annual Sustainability Report 2025"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Brief description of this report"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="framework">Reporting Framework</label>
              <select
                id="framework"
                name="framework"
                value={formData.framework}
                onChange={handleChange}
                required
              >
                <option value="">Select a Framework</option>
                <option value="GRI">GRI</option>
                <option value="SASB">SASB</option>
                <option value="TCFD">TCFD</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reportingPeriod.startDate">Reporting Period Start</label>
                <input
                  type="date"
                  id="reportingPeriod.startDate"
                  name="reportingPeriod.startDate"
                  value={formData.reportingPeriod.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="reportingPeriod.endDate">Reporting Period End</label>
                <input
                  type="date"
                  id="reportingPeriod.endDate"
                  name="reportingPeriod.endDate"
                  value={formData.reportingPeriod.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Select Metrics</h2>
            
            {formData.framework ? (
              <div className="metrics-selection">
                {filteredMetrics.map(metric => (
                  <div key={metric.id} className="metric-selection-item">
                    <input
                      type="checkbox"
                      id={`metric-${metric.id}`}
                      checked={selectedMetrics.includes(metric.id)}
                      onChange={() => handleMetricToggle(metric.id)}
                    />
                    <label htmlFor={`metric-${metric.id}`}>
                      <span className="metric-name">{metric.name}</span>
                      <span className="metric-category">{metric.category}</span>
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-framework-message">
                Please select a reporting framework first
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button type="submit" className="button primary-button">
              Create Report
            </button>
            <button 
              type="button" 
              className="button" 
              onClick={() => navigate('/reports')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportBuilderPage;