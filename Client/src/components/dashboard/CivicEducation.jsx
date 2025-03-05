import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CivicEducation = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('http://16.171.28.194/documents/all');
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading documents...</p>
        ) : (
          documents.map((doc) => (
            <div key={doc.Id} className="mb-4 last:mb-0">
              <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-800">{doc.Title}</h3>
                  {/* <p className="text-gray-600 text-sm">{doc.Description || 'No description available'}</p> */}
                  <button
                    onClick={() => navigate(`/citizen-dashboard/chat-docs/${doc.Id}`, { state: { title: doc.Title, description: doc.Description } })}
                    className="bg-[#89D6E7] text-gray-700 px-4 py-2 rounded text-sm font-medium shadow-sm hover:bg-[#7AC6D7] transition-colors"
                  >
                    Chat Docs...
                  </button>
                </div>
                <a 
                href={doc.DocumentFile} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
                aria-label="Read document"
              >
                <span className="mr-1 font-medium">Read</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
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
