import React, { useState, useEffect } from 'react';
import { BarChart, RefreshCw, FileText } from 'lucide-react';

const OfficialDashboardHome = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [user, setUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [summary, setSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await fetch('http://localhost:80/users/session', { credentials: 'include' });
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
          fetchIssuesByLocation(data.user.Location);
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
      }
    };

    const fetchIssuesByLocation = async (location) => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:80/issues/location/${location}`, { 
          credentials: 'include' 
        });
        const data = await response.json();
        if (response.ok) {
          setIssues(data);
        } else {
          throw new Error('Failed to load issues');
        }
      } catch (error) {
        console.error('Error fetching issues:', error);
        setMessage('Failed to load issues');
        setMessageType('error');
        setTimeout(() => setMessage(null), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSession();
  }, []);

  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      const response = await fetch('http://localhost:80/issues/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ issueId, newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setIssues(prevIssues =>
        prevIssues.map(issue =>
          issue.Id === issueId ? { ...issue, Status: newStatus } : issue
        )
      );

      setMessage('Issue status updated successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage('Failed to update issue status');
      setMessageType('error');
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredIssues = filterStatus === 'All' 
    ? issues 
    : issues.filter(issue => issue.Status === filterStatus);

    const generateSummary = async () => {
      try {
        setMessage('Generating summary...');
        setMessageType('success');
    
        const response = await fetch('http://localhost:80/ai/summarize/issues', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ issues: filteredIssues }) // Send only displayed issues
        });
    
        const data = await response.json();
        
        if (response.ok) {
          setSummary(data.summary);
          setShowSummary(true);
        } else {
          throw new Error(data.message || 'Failed to generate summary');
        }
      } catch (error) {
        console.error('Error generating summary:', error);
        setMessage('Failed to generate summary');
        setMessageType('error');
      } finally {
        setTimeout(() => setMessage(null), 3000);
      }
    };
    

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <BarChart className="text-blue-500 mr-2" size={24} />
                Issues Dashboard: {user?.Location}
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and review community issues in your location
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center">
                <span className="mr-2 text-gray-700">Filter by status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Issues</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {message && (
            <div 
              className={`p-3 mb-4 rounded-md text-center ${
                messageType === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
              }`}
            >
              {message}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-3 text-gray-600">Loading issues...</p>
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <RefreshCw className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-600">No issues found with the selected filter.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Image</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Category</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Title</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Date Created</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Status</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredIssues.map((issue) => (
                      <tr key={issue.Id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <img 
                            src={issue.Image} 
                            alt={issue.Title} 
                            className="h-16 w-16 object-cover rounded"
                          />
                        </td>
                        <td className="py-4 px-4">{issue.Category}</td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">{issue.Title}</div>
                          <div className="text-sm text-gray-500 mt-1 line-clamp-2">{issue.Content}</div>
                        </td>
                        <td className="py-4 px-4 text-gray-500">
                          {new Date(issue.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(issue.Status)}`}>
                            {issue.Status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={issue.Status}
                            onChange={(e) => updateIssueStatus(issue.Id, e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summarize Button - similar to your design */}
              <div className="flex justify-start mb-6">
                <button
                  onClick={generateSummary}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <FileText className="mr-2" size={18} />
                  Summarize
                </button>
              </div>

              {/* Summary Display Area */}
              {showSummary && (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">Issues Summary</h3>
                    <button
                      onClick={() => setShowSummary(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="prose max-w-none">
                    {summary.split('\n').map((line, index) => (
                      <p key={index} className={line.startsWith('##') ? 'text-xl font-bold mb-4' : 
                        line.startsWith('**') ? 'font-semibold my-2' : 'my-1'}>
                        {line.replace(/^##\s/, '').replace(/\*\*/g, '')}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficialDashboardHome;