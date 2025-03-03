import React, { useState, useEffect } from 'react';
import { BarChart, AlertCircle } from 'lucide-react';

const Polls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await fetch('http://localhost:4000/users/session', { credentials: 'include' });
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
        setLoading(true);
        const response = await fetch('http://localhost:4000/polls/all');
        const data = await response.json();

        const formattedPolls = data.filter(poll => !poll.is_deleted).map(poll => ({
          id: poll.Id,
          title: poll.Title,
          description: poll.Description || 'No description available.',
          location: poll.Location,
          endDate: new Date(poll.Deadline).toLocaleDateString(),
          participants: poll.Participants,
          hasVoted: poll.hasVoted,
          options: [
            { text: 'Support', value: 'Yes', percentage: poll.Yes + poll.No > 0 ? (poll.Yes / (poll.Yes + poll.No)) * 100 : 0, count: poll.Yes },
            { text: 'Reject', value: 'No', percentage: poll.Yes + poll.No > 0 ? (poll.No / (poll.Yes + poll.No)) * 100 : 0, count: poll.No }
          ],
        }));

        setPolls(formattedPolls);
      } catch (error) {
        console.error('Error fetching polls:', error);
        setMessage('Failed to load polls');
        setMessageType('error');
        setTimeout(() => setMessage(null), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSession();
    fetchPolls();
  }, []);

  const handleVote = async (pollId, voteValue) => {
    if (!user) {
      setMessage('You must be logged in to vote');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/polls/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pollId, userId: user.Id, vote: voteValue })
      });

      if (response.status === 409) {
        setMessage('You have already voted in this poll');
        setMessageType('error');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to record vote');
      }

      setPolls(prevPolls =>
        prevPolls.map(poll => {
          if (poll.id === pollId) {
            return {
              ...poll,
              hasVoted: true,
              participants: poll.participants + 1,
              options: poll.options.map(option =>
                option.value === voteValue ? { ...option, count: option.count + 1, percentage: ((option.count + 1) / (poll.Participants + 1)) * 100 } : option
              )
            };
          }
          return poll;
        })
      );

      setMessage('Your vote has been recorded!');
      setMessageType('success');
    } catch (error) {
      console.error('Error voting:', error);
      setMessage('Failed to record your vote');
      setMessageType('error');
    }
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="mb-8 text-center bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
        <h2 className="text-2xl font-bold flex items-center justify-center">
          <BarChart className="text-blue-500 mr-2" size={24} />
          <span>Current Public Polls</span>
        </h2>
      </div>

      {message && (
        <div className={`p-2 text-center text-white rounded mb-4 ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{message}</div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p>Loading polls...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {polls.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <AlertCircle className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-600">No active polls available.</p>
            </div>
          ) : (
            polls.map(poll => (
              <div key={poll.id} className="border border-blue-200 rounded-lg bg-white shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800">{poll.title}</h3>
                <p className="text-gray-600 mt-1">{poll.description}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <span>📍 {poll.location}</span>
                  <span className="ml-4">📅 Ends: {poll.endDate}</span>
                  <span className="ml-4">👥 Participants: {poll.participants}</span>
                </div>
                <div className="mt-4 space-y-2">
                  {poll.options.map(option => (
                    <div key={option.text} className={`flex items-center cursor-pointer ${poll.hasVoted ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => !poll.hasVoted && handleVote(poll.id, option.value)}>
                      <span className="w-1/4 font-medium">{option.text}</span>
                      <div className="w-3/4 h-6 bg-gray-200 rounded-md relative">
                        <div className={`h-full rounded-md ${option.text === 'Support' ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${option.percentage}%` }}></div>
                      </div>
                      <span className="ml-2 text-gray-600">({option.count} votes)</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Polls;
