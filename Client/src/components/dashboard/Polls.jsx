import { useState } from 'react';

const Polls = () => {
  const [polls, setPolls] = useState([
    {
      id: 1,
      title: 'Impeach Ruto',
      votes: 1524,
      participants: 2301,
      days: 5,
      description: 'Vote on whether to impeach the current leadership.'
    },
    {
      id: 2,
      title: 'Reject Finance Bill',
      votes: 978,
      participants: 1540,
      days: 3,
      description: 'Should the proposed Finance Bill be rejected?'
    }
  ]);

  // Calculate percentage for progress bars
  const calculateProgress = (votes, participants) => {
    return (votes / participants) * 100;
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-sm">
      <h1 className="text-xl font-bold mb-6">Active Polls</h1>
      <div className="space-y-6">
        {polls.map((poll) => (
          <div key={poll.id} className="border border-gray-200 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">{poll.title}</h3>
              <span className="text-sm text-gray-500">{poll.days} days left</span>
            </div>
            <p className="text-gray-600 my-2">{poll.description}</p>
            <p className="text-sm text-gray-500">{poll.votes} participants</p>
            <div className="mt-3 bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-red-500 h-2.5 rounded-full" 
                style={{ width: `${calculateProgress(poll.votes, poll.participants)}%` }}
              ></div>
            </div>
            <div className="mt-4 flex space-x-4">
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                Vote Yes
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                Vote No
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Polls;