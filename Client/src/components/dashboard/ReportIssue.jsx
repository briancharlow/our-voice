// components/dashboard/ReportIssue.jsx
import React, { useState } from 'react';
import { MapPin, Image, AlertTriangle, X } from 'lucide-react';

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    location: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('location', formData.location);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }
  
    try {
      const response = await fetch('http://localhost:80/issues/create', {
        method: 'POST',
        body: formDataToSend,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage('Issue reported successfully!');
        setMessageType('success');
        setFormData({ title: '', content: '', category: '', location: '', image: null });
        setImagePreview(null);
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage(data.error || 'Error reporting issue');
        setMessageType('error');
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error reporting issue:', error);
      setMessage('Failed to report issue');
      setMessageType('error');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const categories = [
    "Infrastructure",
    "Environment",
    "Security",
    "Public Safety",
    "Healthcare",
    "Education",
    "Transportation",
    "Water & Sanitation",
    "Other"
  ];

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <div className="mb-8 text-center bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
        <h2 className="text-2xl font-bold flex items-center justify-center">
          <AlertTriangle className="text-amber-500 mr-2" size={24} />
          <span>Raise Alarm!</span> 
          <span className="text-green-600 mx-2">Speak Out!</span> 
          <span className="text-red-500">Usikimye!!!</span>
        </h2>
      </div>

      {message && (
        <div className={`p-2 text-center text-white rounded mb-4 ${
          messageType === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {message}
        </div>
      )}

      <div className="border border-blue-400 rounded-lg p-6 bg-blue-50 bg-opacity-30">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Brief title of your concern"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <div className="relative">
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-colors"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="relative">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="In which County is this happening?"
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              rows="4"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Provide detailed information about your concern..."
              required
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <div className="mt-1 flex items-center">
              <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                <Image className="h-5 w-5 mr-2 text-gray-500" />
                <span>Upload Image</span>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
              <span className="ml-4 text-sm text-gray-500">
                {formData.image ? formData.image.name : "No file selected"}
              </span>
            </div>
            
            {imagePreview && (
              <div className="mt-2 relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="h-32 w-auto object-cover rounded-md border border-gray-300" 
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
          
          <div className="pt-3">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center justify-center"
            >
              <span className="font-medium">Submit Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;