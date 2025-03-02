// components/dashboard/DashboardHome.jsx
import { useState } from 'react';

const DashboardHome = () => {
  const [polls, setPolls] = useState([
    {
      id: 1,
      title: 'Impeach Ruto',
      votes: 1524,
      participants: 2301,
      days: 5
    },
    {
      id: 2,
      title: 'Reject Finance Bill',
      votes: 978,
      participants: 1540,
      days: 3
    }
  ]);

  const [issues, setIssues] = useState([
    {
      id: 1,
      title: 'Water shortage',
      location: 'central district',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Broken bridge',
      location: 'Kiamako',
      status: 'in progress'
    }
  ]);

  // Calculate percentage for progress bars
  const calculateProgress = (votes, participants) => {
    return (votes / participants) * 100;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-red-200 text-red-800';
      case 'in progress':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="px-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left section - Welcome banner */}
        <div className="md:w-2/3">
          <div className="relative bg-white rounded-md shadow-sm overflow-hidden mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-transparent"></div>
            <div className="relative p-6 text-white flex items-center h-48">
              <div className="w-1/2">
                <h2 className="text-xl font-bold">Welcome Back John,</h2>
                <p className="text-sm mt-2">Be part of the solution,</p>
                <p className="text-sm">Take back your power!</p>
              </div>
              <div className="w-1/2">
                {/* This would be the image from your design */}
                <div className="bg-red-500 h-24 w-24 rounded-full ml-auto opacity-70"></div>
              </div>
            </div>
          </div>

          {/* Polls section */}
          <h2 className="text-lg font-semibold mb-4">Polls</h2>
          <div className="space-y-4">
            {polls.map((poll) => (
              <div key={poll.id} className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{poll.title}</h3>
                  <span className="text-xs text-gray-500">{poll.days} days left</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{poll.votes} participants</p>
                <div className="mt-2 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-red-500 h-2.5 rounded-full" 
                    style={{ width: `${calculateProgress(poll.votes, poll.participants)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right section - Recent Issues */}
        <div className="md:w-1/3">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Recent Issues</h2>
            <div className="space-y-4">
              {issues.map((issue) => (
                <div key={issue.id} className="border border-gray-100 rounded-md p-4">
                  <h3 className="text-red-500 font-medium">{issue.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{issue.location}</p>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;