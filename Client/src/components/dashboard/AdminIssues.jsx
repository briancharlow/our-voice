// components/dashboard/AdminIssues.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, AlertCircle, CheckCircle, Clock } from 'lucide-react';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

// Custom status icons using simple spans for compatibility
const getStatusIcon = (status) => {
  switch (status) {
    case 'New':
      return <span className="text-blue-500">●</span>;
    case 'In Progress':
      return <span className="text-amber-500">●</span>;
    case 'Resolved':
      return <span className="text-green-500">●</span>;
    default:
      return <span className="text-gray-500">●</span>;
  }
};

// Component to set map view based on markers
const MapBounds = ({ locations }) => {
  const map = useMap();
  
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lon]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);
  
  return null;
};

const AdminIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [mapCenter, setMapCenter] = useState([-1.286389, 36.817223]);

  // Statistics for dashboard
  const stats = useMemo(() => {
    if (!issues.length) return {};
    
    return {
      total: issues.length,
      new: issues.filter(issue => issue.Status === 'New').length,
      inProgress: issues.filter(issue => issue.Status === 'In Progress').length,
      resolved: issues.filter(issue => issue.Status === 'Resolved').length
    };
  }, [issues]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch('http://localhost:80/issues/all', {
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          setIssues(data);
          geocodeLocations(data);
        } else {
          throw new Error(data.message || 'Failed to fetch issues');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const geocodeLocations = async (issues) => {
    // Create a promise for each issue - preserving ALL issues even at same location
    const locationPromises = issues.map(async (issue) => {
      // Skip if no location provided
      if (!issue.Location || issue.Location.trim() === '') {
        console.warn(`Issue ${issue.Id} has no location`);
        return null;
      }

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(issue.Location)}&limit=1`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.length > 0) {
          // Add a small random offset for issues at the same location to make them visible
          // This ensures we see multiple pins even for exact same coordinates
          const randomOffset = () => (Math.random() - 0.5) * 0.005;
          
          return { 
            id: issue.Id, 
            title: issue.Title, 
            content: issue.Content, 
            status: issue.Status,
            location: issue.Location,
            lat: parseFloat(data[0].lat) + randomOffset(), 
            lon: parseFloat(data[0].lon) + randomOffset(),
            createdAt: issue.CreatedAt || new Date().toISOString(),
            updatedAt: issue.UpdatedAt
          };
        }
      } catch (error) {
        console.error('Error fetching coordinates for location:', issue.Location, error);
      }
      return null;
    });

    const resolvedLocations = (await Promise.all(locationPromises)).filter(Boolean);
    setLocations(resolvedLocations);
    
    // If we have locations, center the map on the first one
    if (resolvedLocations.length > 0) {
      setMapCenter([resolvedLocations[0].lat, resolvedLocations[0].lon]);
    }
  };

  const filteredLocations = useMemo(() => {
    if (activeTab === 'all') return locations;
    return locations.filter(loc => loc.status.toLowerCase() === activeTab);
  }, [locations, activeTab]);

  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-amber-100 text-amber-800',
      'Resolved': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#008EAC]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-md text-red-700">
        <h2 className="text-xl font-semibold">Error Loading Issues</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Issues Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Issues Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Issues</p>
              <p className="text-3xl font-bold">{stats.total || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-blue-600 text-xl">📍</span>
            </div>
          </div>
        </div>
        
        {/* New Issues Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">New Issues</p>
              <p className="text-3xl font-bold">{stats.new || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-blue-600 text-xl">🔵</span>
            </div>
          </div>
        </div>
        
        {/* In Progress Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-3xl font-bold">{stats.inProgress || 0}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <span className="text-amber-600 text-xl">⏱️</span>
            </div>
          </div>
        </div>
        
        {/* Resolved Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <p className="text-3xl font-bold">{stats.resolved || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-green-600 text-xl">✅</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map and Issues Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-8 bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center mb-4">
            <span className="text-xl mr-2">📍</span>
            <h2 className="text-lg font-semibold">Issue Locations</h2>
          </div>
          
          {/* Custom Tabs */}
          <div className="mb-4 border-b">
            <div className="flex space-x-4">
              <button 
                onClick={() => setActiveTab('all')}
                className={`pb-2 px-1 ${activeTab === 'all' ? 'border-b-2 border-[#008EAC] text-[#008EAC]' : 'text-gray-500'}`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveTab('new')}
                className={`pb-2 px-1 ${activeTab === 'new' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              >
                New
              </button>
              <button 
                onClick={() => setActiveTab('in progress')}
                className={`pb-2 px-1 ${activeTab === 'in progress' ? 'border-b-2 border-amber-500 text-amber-500' : 'text-gray-500'}`}
              >
                In Progress
              </button>
              <button 
                onClick={() => setActiveTab('resolved')}
                className={`pb-2 px-1 ${activeTab === 'resolved' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-500'}`}
              >
                Resolved
              </button>
            </div>
          </div>
          
          <div className="h-96 rounded-md overflow-hidden border">
            {locations.length > 0 ? (
              <MapContainer center={mapCenter} zoom={6} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapBounds locations={filteredLocations} />
                
                {filteredLocations.map((location) => (
                  <Marker 
                    key={location.id}
                    position={[location.lat, location.lon]}
                  >
                    <Popup>
                      <div className="max-w-xs">
                        <h3 className="font-semibold text-lg">{location.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{location.location}</p>
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(location.status)}`}>
                          <span className="flex items-center">
                            {getStatusIcon(location.status)}
                            <span className="ml-1">{location.status}</span>
                          </span>
                        </div>
                        <p className="mt-2 text-sm">{location.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Reported: {new Date(location.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">No location data available</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Issues List */}
        <div className="lg:col-span-4 bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Issues</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {issues.slice(0, 10).map((issue) => (
              <div key={issue.Id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900 truncate">{issue.Title}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.Status)}`}>
                    <span className="flex items-center">
                      {getStatusIcon(issue.Status)}
                      <span className="ml-1">{issue.Status}</span>
                    </span>
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1 truncate">{issue.Location}</p>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{issue.Content}</p>
              </div>
            ))}
            {issues.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No issues available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminIssues;