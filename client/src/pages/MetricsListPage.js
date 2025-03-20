import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllMetrics } from '../store/slices/metricsSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MetricsListPage = () => {
  const dispatch = useDispatch();
  const { metrics, loading, error } = useSelector((state) => state.metrics);
  
  const [filters, setFilters] = useState({
    category: '',
    framework: '',
    search: ''
  });
  
  useEffect(() => {
    // Fetch metrics from API
    dispatch(getAllMetrics(filters));
  }, [dispatch, filters]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const getCategoryClass = (category) => {
    switch (category) {
      case 'environmental':
        return 'category-environmental';
      case 'social':
        return 'category-social';
      case 'governance':
        return 'category-governance';
      default:
        return '';
    }
  };
  
  if (loading && metrics.length === 0) {
    return <LoadingSpinner message="Loading metrics..." />;
  }
  
  return (
    <div className="metrics-list-page">
      <div className="page-header">
        <h1>Metrics Library</h1>
        <Link to="/metrics/entry" className="button primary-button">
          Enter Data
        </Link>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            <option value="environmental">Environmental</option>
            <option value="social">Social</option>
            <option value="governance">Governance</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="framework">Framework</label>
          <select
            id="framework"
            name="framework"
            value={filters.framework}
            onChange={handleFilterChange}
          >
            <option value="">All Frameworks</option>
            <option value="GRI">GRI</option>
            <option value="SASB">SASB</option>
            <option value="TCFD">TCFD</option>
          </select>
        </div>
        
        <div className="filter-group search-group">
          <input
            type="text"
            name="search"
            placeholder="Search metrics..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      
      <div className="metrics-grid">
        {metrics.length > 0 ? (
          metrics.map((metric) => (
            <div key={metric._id} className="metric-card">
              <div className={`metric-category-badge ${getCategoryClass(metric.category)}`}>
                {metric.category}
              </div>
              
              <h3 className="metric-name">
                <Link to={`/metrics/${metric._id}`}>{metric.name}</Link>
              </h3>
              
              <div className="metric-subcategory">{metric.subcategory}</div>
              
              <div className="metric-frameworks">
                {metric.frameworks.map((framework, index) => (
                  <span key={index} className="framework-badge">
                    {framework.identifier || framework.name}
                  </span>
                ))}
              </div>
              
              <div className="metric-updated">
                Last updated: {new Date(metric.updatedAt).toLocaleDateString()}
              </div>
              
              <div className="metric-actions">
                <Link to={`/metrics/${metric._id}`} className="button small-button">
                  View Details
                </Link>
                <Link to={`/metrics/entry?metric=${metric._id}`} className="button small-button primary-button">
                  Enter Data
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-metrics-message">
            No metrics found. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsListPage;