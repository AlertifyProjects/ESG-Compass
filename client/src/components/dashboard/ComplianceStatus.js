import React from 'react';

const ComplianceStatus = () => {
  // This would typically use data from Redux
  const complianceData = {
    GRI: {
      required: 24,
      complete: 18,
      percentage: 75
    },
    TCFD: {
      required: 16,
      complete: 10,
      percentage: 62.5
    },
    SASB: {
      required: 20,
      complete: 12,
      percentage: 60
    }
  };
  
  return (
    <div className="compliance-status">
      <h3 className="component-title">Compliance Status</h3>
      
      <div className="compliance-grid">
        {Object.entries(complianceData).map(([framework, data]) => (
          <div key={framework} className="framework-compliance">
            <div className="framework-header">
              <h4>{framework}</h4>
              <span className="compliance-percentage">{data.percentage}%</span>
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${data.percentage}%` }}
              />
            </div>
            
            <div className="compliance-details">
              <span>{data.complete} of {data.required} metrics completed</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceStatus;