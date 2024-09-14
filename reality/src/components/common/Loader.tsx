import React from 'react';

const LoadingIndicator: React.FC = () => (
  <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
    <p>Loading model...</p>
    <div className="spinner"></div>
    <style>
      {`
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left: 4px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: srotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

export default LoadingIndicator;
