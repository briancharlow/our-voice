// Chat.jsx - Displays chat interface for a selected document
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const Chat = () => {
  const { id } = useParams();
  const location = useLocation();
  const [document, setDocument] = useState({ title: '', description: '' });
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`http://localhost:80/documents/id/${id}`);
        if (!response.ok) throw new Error('Failed to fetch document');
        const data = await response.json();
        setDocument({ title: data[0]?.Title || 'Unknown', description: data[0]?.Description || 'No description available.' });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setMessages([...messages, { sender: 'user', text: prompt }]);
    
    try {
      const response = await fetch(`http://localhost:80/ai/document/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: prompt })
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { sender: 'system', text: data.response }]);
      } else {
        setMessages(prev => [...prev, { sender: 'system', text: 'Error processing request.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'system', text: 'Failed to fetch response.' }]);
    }
    
    setPrompt('');
  };

  if (loading) return <p>Loading document...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="p-6 bg-white shadow-sm rounded-lg mb-4">
        <h2 className="text-xl font-bold">{document.title}</h2>
        <p className="text-gray-600">{document.description}</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm h-3/4 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {messages.length === 0 && <div className="h-full flex items-center justify-center text-gray-400">Ask a question...</div>}
        </div>
        <div className="border-t p-3">
          <form onSubmit={handleSubmit} className="flex items-center">
            <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask anything..." className="flex-1 p-2 bg-gray-100 rounded-l-md focus:outline-none" />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 flex items-center">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
