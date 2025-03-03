// components/dashboard/AdminDocuments.jsx
import React, { useState } from 'react';

const AdminDocuments = () => {
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [attachFile, setAttachFile] = useState(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ documentTitle, documentDescription, attachFile });
    // Add your form submission logic here
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 border border-blue-200">
        <div className="flex justify-center mb-6">
          <button className="px-4 py-2 text-white bg-[#008EAC] rounded-md">
            Add Document
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Document Title"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#008EAC] focus:border-[#008EAC]"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <textarea
              placeholder="Document Description"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#008EAC] focus:border-[#008EAC] min-h-[100px]"
              value={documentDescription}
              onChange={(e) => setDocumentDescription(e.target.value)}
            ></textarea>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center border border-gray-300 rounded-md">
              <input
                type="text"
                placeholder="Attach File"
                className="block w-full px-4 py-2 rounded-l-md focus:outline-none"
                readOnly
                value={attachFile ? attachFile.name : ''}
              />
              <label className="flex items-center justify-center px-4 py-2 bg-gray-100 rounded-r-md cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </label>
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
      </div>
    </div>
  );
};

export default AdminDocuments;