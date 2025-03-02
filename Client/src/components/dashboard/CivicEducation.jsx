import React, { useState, useEffect } from 'react';

const CivicEducation = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('http://localhost:4000/documents/all');
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setMessage('Failed to load documents');
        setMessageType('error');
        setTimeout(() => setMessage(null), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {message && (
          <div className={`p-2 text-center text-white rounded mb-4 ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{message}</div>
        )}

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p>Loading documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <p className="text-center text-gray-600">No documents available.</p>
        ) : (
          documents.map((doc) => (
            <div key={doc.Id} className="mb-4 last:mb-0">
              <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-800">{doc.Title}</h3>
                  <p className="text-gray-600 text-sm">{doc.Description || 'No description available.'}</p>
                  <button 
                    className="bg-[#89D6E7] text-gray-700 px-4 py-2 rounded text-sm font-medium shadow-sm hover:bg-[#7AC6D7] transition-colors"
                  >
                    Chat Docs...
                  </button>
                </div>
                <a 
                  href={doc.DocumentFile} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                  aria-label="Download document"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CivicEducation;
