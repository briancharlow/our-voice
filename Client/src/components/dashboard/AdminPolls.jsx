// components/dashboard/AdminPolls.jsx
import React, { useState, useEffect } from 'react';

const AdminPolls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    deadline: '',
    location: ''
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Get tomorrow's date for min date attribute
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('http://localhost:80/polls/all', {
          credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) {
          setPolls(data);
        } else {
          throw new Error(data.message || 'Failed to fetch polls');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    
    if (!newPoll.title || !newPoll.description || !newPoll.deadline || !newPoll.location) {
      setMessage('All fields are required.');
      setMessageType('error');
      return;
    }
  
    // Convert deadline to "dd-mm-yy"
    const deadlineDate = new Date(newPoll.deadline);
    const formattedDeadline = `${String(deadlineDate.getDate()).padStart(2, '0')}-${String(deadlineDate.getMonth() + 1).padStart(2, '0')}-${String(deadlineDate.getFullYear()).slice(-2)}`;
  
    const pollData = {
      title: newPoll.title,
      description: newPoll.description,
      deadline: formattedDeadline,
      location: newPoll.location
    };
  
    try {
      const response = await fetch('http://16.171.28.194/polls/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(pollData)
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create poll');
      }
  
      setPolls([...polls, { ...pollData, Id: data.Id, Participants: 0, Yes: 0, No: 0 }]);
      setMessage('Poll created successfully!');
      setMessageType('success');
      setNewPoll({ title: '', description: '', deadline: '', location: '' });
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error creating poll:', error);
      setMessage(error.message);
      setMessageType('error');
    }
    
    setTimeout(() => setMessage(null), 3000);
  };
  
  const handleDeletePoll = async (pollId) => {
    try {
      const response = await fetch(`http://localhost:80/polls/delete/${pollId}`, {
        method: 'PUT',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete poll');
      }

      setPolls(prevPolls => prevPolls.map(poll => 
        poll.Id === pollId ? { ...poll, is_deleted: true } : poll
      ));
      setMessage('Poll deleted successfully!');
      setMessageType('success');
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    }
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Active Polls</h1>
        <button 
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="px-4 py-2 text-white rounded-lg hover:bg-opacity-90 transition flex items-center"
          style={{ backgroundColor: '#008EAC' }}
        >
          {isFormVisible ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Hide Form
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create Poll
            </>
          )}
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg mb-4 flex items-center shadow ${messageType === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 'bg-red-100 text-red-800 border-l-4 border-red-500'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            {messageType === 'success' ? (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            )}
          </svg>
          {message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4" style={{ borderColor: '#008EAC' }}></div>
          <p className="text-gray-600">Loading polls...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-6">
          {polls.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No polls available. Create your first poll!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="py-3 px-4 font-semibold text-gray-700 border-b">Title</th>
                    <th className="py-3 px-4 font-semibold text-gray-700 border-b">Location</th>
                    <th className="py-3 px-4 font-semibold text-gray-700 border-b">Deadline</th>
                    <th className="py-3 px-4 font-semibold text-gray-700 border-b text-center">Participants</th>
                    <th className="py-3 px-4 font-semibold text-gray-700 border-b text-center">Votes (Yes/No)</th>
                    <th className="py-3 px-4 font-semibold text-gray-700 border-b text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {polls.filter(poll => !poll.is_deleted).map(poll => (
                    <tr key={poll.Id} className="border-b hover:bg-gray-50 transition">
                      <td className="py-3 px-4 text-gray-800 font-medium">{poll.Title || poll.title}</td>
                      <td className="py-3 px-4 text-gray-600">{poll.Location || poll.location}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(poll.Deadline || poll.deadline).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded-full text-sm text-white" style={{ backgroundColor: '#008EAC' }}>
                          {poll.Participants || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-green-600 font-medium">{poll.Yes || 0}</span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-red-600 font-medium">{poll.No || 0}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button 
                          onClick={() => handleDeletePoll(poll.Id)}
                          className="text-red-600 hover:text-red-800 transition focus:outline-none"
                          title="Delete Poll"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Create Poll Form - Now below the table */}
      {isFormVisible && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Create New Poll</h2>
          <form onSubmit={handleCreatePoll}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  placeholder="Poll title" 
                  value={newPoll.title} 
                  onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })} 
                  className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:border-transparent" 
                  style={{ "--tw-ring-color": "#008EAC" }}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  type="text" 
                  placeholder="Poll location" 
                  value={newPoll.location} 
                  onChange={(e) => setNewPoll({ ...newPoll, location: e.target.value })} 
                  className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:border-transparent" 
                  style={{ "--tw-ring-color": "#008EAC" }}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                <input 
                  type="date" 
                  value={newPoll.deadline} 
                  onChange={(e) => setNewPoll({ ...newPoll, deadline: e.target.value })} 
                  className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:border-transparent" 
                  style={{ "--tw-ring-color": "#008EAC" }}
                  min={getTomorrowDate()}
                  required 
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                placeholder="Describe the poll" 
                value={newPoll.description} 
                onChange={(e) => setNewPoll({ ...newPoll, description: e.target.value })} 
                className="border border-gray-300 px-3 py-2 rounded-lg w-full h-24 focus:outline-none focus:ring-2 focus:border-transparent" 
                style={{ "--tw-ring-color": "#008EAC" }}
                required
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                type="button" 
                onClick={() => setIsFormVisible(false)} 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 text-white rounded-lg hover:bg-opacity-90 transition"
                style={{ backgroundColor: '#008EAC' }}
              >
                Create Poll
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPolls;