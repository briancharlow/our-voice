import { useState, useEffect } from 'react';

const DashboardHome = () => {
  const [polls, setPolls] = useState([]);
  const [issues, setIssues] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await fetch('http://localhost:80/users/session', { credentials: 'include' });
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
      }
    };

    const fetchPolls = async () => {
      try {
        const response = await fetch('http://localhost:80/polls/all');
        const data = await response.json();
        setPolls(data.filter(poll => !poll.is_deleted).map(poll => ({
          id: poll.Id,
          title: poll.Title,
          votes: poll.Yes + poll.No,
          participants: poll.Participants,
          days: Math.max(0, Math.ceil((new Date(poll.Deadline) - new Date()) / (1000 * 60 * 60 * 24)))
        })));
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    };

    const fetchIssues = async () => {
      try {
        const response = await fetch('http://localhost:80/issues/all');
        const data = await response.json();
        setIssues(data.map(issue => ({
          id: issue.Id,
          title: issue.Title,
          location: issue.Location,
          status: issue.Status
        })));
      } catch (error) {
        console.error('Error fetching issues:', error);
      }
    };

    fetchUserSession();
    fetchPolls();
    fetchIssues();
  }, []);

  const calculateProgress = (votes, participants) => {
    return participants > 0 ? (votes / participants) * 100 : 0;
  };

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

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          {/* Enhanced Welcome Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="p-6 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
              
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h2 className="text-2xl font-bold mb-1">{getTimeOfDay()}, {user ? user.Email.split('@')[0] : 'Guest'}</h2>
                  <p className="text-blue-100 text-sm mb-4">Welcome to Our Voice - Your community platform</p>
                  
                  <div className="flex items-center space-x-4 mt-6">
                    <div className="bg-white bg-opacity-20 p-3 rounded-lg text-center w-32">
                      <p className="text-white text-xl font-bold">{polls.length}</p>
                      <p className="text-xs text-blue-100">Active Polls</p>
                    </div>
                    <div className="bg-white bg-opacity-20 p-3 rounded-lg text-center w-32">
                      <p className="text-white text-xl font-bold">{issues.length}</p>
                      <p className="text-xs text-blue-100">Reported Issues</p>
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:block">
                  <div className="flex items-center justify-center w-24 h-24 bg-white bg-opacity-10 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-4">Polls</h2>
          <div className="space-y-4">
            {polls.map((poll) => (
              <div key={poll.id} className="bg-white p-4 rounded-md shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{poll.title}</h3>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{poll.days} days left</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{poll.votes} participants</p>
                <div className="mt-2 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${calculateProgress(poll.votes, poll.participants)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-1/3">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <span>Recent Issues</span>
              <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">{issues.length}</span>
            </h2>
            <div className="space-y-4">
              {issues.map((issue) => (
                <div key={issue.id} className="border border-gray-100 rounded-md p-4 hover:border-blue-200 transition-colors">
                  <h3 className="text-blue-600 font-medium">{issue.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {issue.location}
                  </p>
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