// SkeletonLoader.js
import React from 'react';

const SkeletonLoader = () => (
  <div className="skeleton-card d-flex flex-wrap bg-white py-3 mb-3 rounded justify-content-between align-items-center">
    <div className="d-flex col-xl-4 col-xxl-3 col-lg-4 col-sm-6 align-items-center">
      
      <div className="skeleton-text">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-company"></div>
      </div>
    </div>
    
    <div className="d-flex col-xl-3 col-lg-4 col-sm-6 align-items-center">
      <div className="skeleton-location"></div>
      <div className="skeleton-text">
        <div className="skeleton-line skeleton-type"></div>
        <div className="skeleton-line skeleton-remote"></div>
      </div>
    </div>
  </div>
);

export default SkeletonLoader;