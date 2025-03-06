import React, { useState, useEffect } from 'react';
import { BarChart2, Clock, MapPin, Users, ThumbsUp, ThumbsDown, Filter } from 'lucide-react';

const OfficialPolls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationFilter, setLocationFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('http://localhost:80/polls/all');
        const data = await response.json();

        if (response.ok) {
          setPolls(data.filter(poll => !poll.is_deleted));
        } else {
          throw new Error('Failed to fetch polls');
        }
      } catch (error) {
        console.error('Error fetching polls:', error);
        setError('Failed to load polls');
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  // Get unique locations for filter
  const locations = ['All', ...new Set(polls.map(poll => poll.Location))];

  // Apply filters and sorting
  const filteredPolls = polls
    .filter(poll => locationFilter === 'All' || poll.Location === locationFilter)
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === 'mostVotes') return (b.Yes + b.No) - (a.Yes + a.No);
      if (sortBy === 'mostSupport') return (b.Yes / (b.Yes + b.No || 1)) - (a.Yes / (a.Yes + a.No || 1));
      return 0;
    });

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days remaining
  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-center mb-2">
            <BarChart2 className="text-blue-600" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Public Poll Results</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            View and analyze community opinions through our public polling system. 
            These polls help shape local and national policies.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <Filter className="text-gray-500 mr-2" size={18} />
              <span className="text-gray-700 mr-2">Filters:</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="flex items-center">
                <MapPin className="text-gray-500 mr-2" size={16} />
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <Clock className="text-gray-500 mr-2" size={16} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="mostVotes">Most Votes</option>
                  <option value="mostSupport">Highest Support</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading polls...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        ) : filteredPolls.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <div className="text-gray-400 mb-3">
              <BarChart2 size={48} className="mx-auto" />
            </div>
            <p className="text-gray-600">No polls found with the current filter.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPolls.map((poll) => {
              const supportPercentage = poll.Yes + poll.No > 0 ? (poll.Yes / (poll.Yes + poll.No)) * 100 : 0;
              const rejectPercentage = poll.Yes + poll.No > 0 ? (poll.No / (poll.Yes + poll.No)) * 100 : 0;
              const daysRemaining = getDaysRemaining(poll.Deadline);
              
              return (
                <div key={poll.Id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-5">
                    {/* Location Badge */}
                    <div className="mb-3 flex justify-between items-center">
                      <div className="flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-sm">
                        <MapPin size={14} className="mr-1" />
                        {poll.Location}
                      </div>
                      
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        daysRemaining > 30 ? 'bg-green-50 text-green-700' : 
                        daysRemaining > 7 ? 'bg-yellow-50 text-yellow-700' : 
                        'bg-red-50 text-red-700'
                      }`}>
                        {daysRemaining > 0 ? `${daysRemaining} days left` : 'Closed'}
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">{poll.Title}</h2>
                    
                    {/* Description if available */}
                    {poll.Description && (
                      <p className="text-gray-600 mb-3 text-sm">{poll.Description}</p>
                    )}
                    
                    {/* Participants */}
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Users size={16} className="mr-1" />
                      <span>{poll.Participants} participants</span>
                      <span className="mx-2">•</span>
                      <span>Created {formatDate(poll.created_at)}</span>
                    </div>
                    
                    {/* Results */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <div className="flex items-center text-green-700">
                            <ThumbsUp size={14} className="mr-1" />
                            <span>Support</span>
                          </div>
                          <span className="font-medium">{supportPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${supportPercentage}%` }}
                          ></div>
                        </div>
                        <div className="text-right text-xs text-gray-500 mt-1">{poll.Yes} votes</div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <div className="flex items-center text-red-700">
                            <ThumbsDown size={14} className="mr-1" />
                            <span>Oppose</span>
                          </div>
                          <span className="font-medium">{rejectPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-red-400 to-red-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${rejectPercentage}%` }}
                          ></div>
                        </div>
                        <div className="text-right text-xs text-gray-500 mt-1">{poll.No} votes</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficialPolls;