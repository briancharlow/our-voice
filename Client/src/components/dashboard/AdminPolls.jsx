// components/dashboard/AdminPolls.jsx
import React, { useState } from 'react';

const AdminPolls = () => {
  const [county, setCounty] = useState('');
  const [pollTitle, setPollTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ county, pollTitle, deadline });
    // Add your form submission logic here
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Active Polls</h1>
      
      {/* Active Polls Table */}
      <div className="bg-white rounded-md shadow-sm mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left">Poll Title</th>
                <th className="py-3 px-4 text-left">Participants</th>
                <th className="py-3 px-4 text-left">Time remaining</th>
                <th className="py-3 px-4 text-left">Date Created</th>
              </tr>
            </thead>
            <tbody>
              {/* Generate empty rows for the table layout */}
              {[...Array(4)].map((_, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Create Poll Form */}
      <div className="mx-auto max-w-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="relative">
              <select
                className="block w-full px-4 py-2 pr-8 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-[#008EAC] focus:border-[#008EAC]"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
              >
                <option value="" disabled>County</option>
                <option value="nairobi">Nairobi</option>
                <option value="mombasa">Mombasa</option>
                <option value="kisumu">Kisumu</option>
                {/* Add more counties as needed */}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Poll Title"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#008EAC] focus:border-[#008EAC]"
              value={pollTitle}
              onChange={(e) => setPollTitle(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Deadline"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#008EAC] focus:border-[#008EAC]"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
              />
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#008EAC] text-white px-6 py-2 rounded-md flex items-center"
            >
              Submit
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </form>

        <div className="flex justify-between mt-4">
          <button className="px-4 py-2 text-white bg-[#008EAC] rounded-md">
            Create Poll
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPolls;