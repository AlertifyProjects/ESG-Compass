import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  const spinnerSize = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };
  
  return (
    <div className="loading-spinner-container">
      <div 
        className="loading-spinner" 
        style={{ 
          width: spinnerSize[size], 
          height: spinnerSize[size] 
        }}
      ></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;