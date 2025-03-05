// components/dashboard/AdminDocuments.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Upload, File, Trash2, Eye, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const AdminDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [attachFile, setAttachFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Clear notification messages after 5 seconds
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://16.171.28.194/documents/all', {
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setDocuments(data);
      } else {
        throw new Error('Failed to fetch documents');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documentTitle || !documentDescription || !attachFile) {
      setError('All fields are required');
      return;
    }
  
    setUploading(true);
    const formData = new FormData();
    formData.append('title', documentTitle);
    formData.append('description', documentDescription);
    formData.append('document', attachFile);
  
    try {
      const response = await fetch('http://16.171.28.194/documents/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await response.json();
  
      if (response.ok) {
        setMessage('Document uploaded successfully');
        fetchDocuments();
        resetForm();
      } else {
        throw new Error(data.error || 'Failed to upload document');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };
  
  const resetForm = () => {
    setDocumentTitle('');
    setDocumentDescription('');
    setAttachFile(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://16.171.28.194/documents/delete/${documentId}`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }
      setMessage('Document deleted successfully');
      fetchDocuments();
    } catch (error) {
      setError(error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Notification Messages */}
      {message && (
        <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md flex items-center max-w-sm animate-fade-in-down z-50">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span>{message}</span>
        </div>
      )}
      
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md flex items-center max-w-sm animate-fade-in-down z-50">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Document Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 sticky top-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-blue-600" />
                Upload Document
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="documentTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Document Title
                  </label>
                  <input
                    id="documentTitle"
                    type="text"
                    placeholder="Enter document title"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="documentDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Document Description
                  </label>
                  <textarea
                    id="documentDescription"
                    placeholder="Enter document description"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                    value={documentDescription}
                    onChange={(e) => setDocumentDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attachment
                  </label>
                  <div className="relative">
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors cursor-pointer" onClick={() => fileInputRef.current.click()}>
                      <div className="space-y-1 text-center">
                        <File className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input 
                              id="file-upload" 
                              ref={fileInputRef}
                              type="file" 
                              className="sr-only" 
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOCX, XLSX up to 10MB
                        </p>
                      </div>
                    </div>
                    {fileName && (
                      <div className="mt-2 text-sm text-gray-700 flex items-center">
                        <File className="w-4 h-4 mr-1 text-blue-600" />
                        {fileName}
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={uploading}
                  className="w-full bg-[#008EAC] text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-300 flex justify-center items-center"
                >
                  {uploading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Document
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Documents List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                <File className="w-5 h-5 mr-2 text-blue-600" />
                Documents Library
              </h2>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <File className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-lg font-medium">No documents found</p>
                  <p className="text-sm mt-1">Upload your first document to get started</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Document
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Date Added
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {documents.map((doc) => (
                        <tr key={doc.Id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-start">
                              <File className="flex-shrink-0 h-10 w-10 rounded-md p-2 bg-blue-100 text-blue-600 mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{doc.Title}</div>
                                <div className="text-sm text-gray-500 line-clamp-2">{doc.Description}</div>
                                <div className="md:hidden text-xs text-gray-400 mt-1">{formatDate(doc.CreatedAt)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                            {formatDate(doc.CreatedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <a
                                href={doc.DocumentFile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 p-2 rounded transition-colors"
                                title="View Document"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => handleDelete(doc.Id)}
                                className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 p-2 rounded transition-colors"
                                title="Delete Document"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDocuments;