// components/dashboard/AdminIssues.jsx
import React from 'react';

const AdminIssues = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Issues Submitted Box */}
        <div className="bg-white rounded-md shadow-sm p-6 flex items-center space-x-4">
          <div className="text-6xl font-bold">123</div>
          <div>
            <h2 className="text-[#008EAC] text-xl font-semibold">Issues</h2>
            <p>Submitted</p>
          </div>
        </div>
        
        {/* Issues In Progress Box */}
        <div className="bg-[#008EAC] text-white rounded-md shadow-sm p-6 flex items-center space-x-4">
          <div className="text-6xl font-bold">23</div>
          <div>
            <h2 className="text-xl font-semibold">Issues</h2>
            <p>In Progress</p>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="bg-white rounded-md shadow-sm p-4">
        <div className="relative w-full" style={{ height: '400px' }}>
          <p className="absolute top-4 left-4 text-lg font-semibold">Kenya</p>
          
          {/* This is a placeholder for the map. In a real application, you would use a mapping library like Google Maps, Leaflet, etc. */}
          <div className="w-full h-full bg-gray-200 rounded-md overflow-hidden relative">
            <img 
              src="/api/placeholder/800/400" 
              alt="Kenya Map" 
              className="w-full h-full object-cover"
            />
            
            {/* Map Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
              <button className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminIssues;